// "Is this person Pro?" asked of RevenueCat (DECISIONS #79), for bank sync's server.
//
// The app uses one random id for both RevenueCat (its app user id) and this server (x-ditch-user),
// so the server looks that id up with RevenueCat's REST API v2 and turns the answer into the same
// entitlement rows the Apple path used. bankAccess() then decides exactly as before (DECISIONS #67):
// trial, paid period, billing grace period, Lifetime's first 12 months; never Family Sharing copies.
//
// Needs REVENUECAT_SECRET_KEY: a V2 secret key with "Customer information: Read only".

import type { Entitlement, EntitlementKind } from './types.ts';

/** RevenueCat v2 subscription (only the fields we read). */
export type RcSubscription = {
  id: string;
  product_id: string | null;
  starts_at: number;
  current_period_ends_at: number | null;
  ends_at: number | null;
  gives_access: boolean;
  auto_renewal_status: string;
  status: string;
  environment: string;
  ownership?: string;
  entitlements?: { items?: { lookup_key?: string }[] };
};

/** RevenueCat v2 one-time purchase (Lifetime). */
export type RcPurchase = {
  id: string;
  product_id: string;
  purchased_at: number;
  status: string;
  environment: string;
  ownership?: string;
  entitlements?: { items?: { lookup_key?: string }[] };
};

export type RcConfig = {
  /** RevenueCat product id (prod…) → kind. Unknown products still count if they carry the entitlement. */
  products: Record<string, EntitlementKind>;
  /** The entitlement that means Pro (lookup key). */
  entitlement: string;
  /** 'Production', 'Sandbox' (TestFlight and App Review buy in the sandbox). */
  environments: string[];
};

const DAY = 86_400_000;
const iso = (ms: number | null | undefined) => (typeof ms === 'number' ? new Date(ms).toISOString() : null);
const env = (e: string) => (e === 'sandbox' ? 'Sandbox' : 'Production');
const carries = (x: { entitlements?: { items?: { lookup_key?: string }[] } }, key: string) =>
  x.entitlements?.items ? x.entitlements.items.some((e) => e.lookup_key === key) : null;

/** RevenueCat's answer → entitlement rows (pure; tested in Jest). Ids are prefixed "rc:". */
export function rcToEntitlements(appUserId: string, subs: RcSubscription[], purchases: RcPurchase[], cfg: RcConfig, now: Date): Entitlement[] {
  const out: Entitlement[] = [];
  const stamp = now.toISOString();
  const base = (id: string, productId: string, environment: string, ownership: string | undefined) => ({
    app_user_id: appUserId,
    original_transaction_id: `rc:${id}`,
    product_id: productId,
    family_shared: ownership === 'family_shared',
    environment: env(environment),
    signed_at: stamp,
    updated_at: stamp,
  });

  for (const s of subs) {
    const kind = s.product_id ? cfg.products[s.product_id] : undefined;
    const pro = carries(s, cfg.entitlement);
    if (pro === false || (pro === null && !kind) || kind === 'lifetime') continue;
    if (!cfg.environments.includes(env(s.environment))) continue;
    const ends = Math.max(s.current_period_ends_at ?? 0, s.ends_at ?? 0) || null;
    const autoRenew = s.auto_renewal_status === 'will_not_renew' ? false : s.auto_renewal_status === 'will_renew' || s.auto_renewal_status === 'will_change_product' ? true : null;
    const inTrial = s.status === 'trialing';
    let status: Entitlement['status'];
    if (s.status === 'in_grace_period' && s.gives_access) status = 'grace';
    else if (s.status === 'in_billing_retry') status = 'billing_retry';
    else if (!s.gives_access || (s.status !== 'trialing' && s.status !== 'active')) status = 'expired';
    else if (inTrial) status = autoRenew === false ? 'trial_cancelled' : 'trial';
    else status = 'active';
    out.push({
      ...base(s.id, s.product_id ?? 'unknown', s.environment, s.ownership),
      kind: kind ?? 'yearly',
      status,
      expires_at: iso(ends),
      purchased_at: iso(s.starts_at),
      in_trial: inTrial,
      auto_renew: autoRenew,
      // RevenueCat doesn't say when Apple's grace period ends; the hourly cleanup asks again, so a day is enough.
      grace_until: status === 'grace' ? iso(Math.max(ends ?? 0, now.getTime()) + DAY) : null,
    });
  }

  for (const p of purchases) {
    const kind = cfg.products[p.product_id];
    const pro = carries(p, cfg.entitlement);
    if (pro === false || (pro === null && !kind)) continue;
    if (!cfg.environments.includes(env(p.environment))) continue;
    out.push({
      ...base(p.id, p.product_id, p.environment, p.ownership),
      kind: kind ?? 'lifetime',
      status: p.status === 'owned' ? 'active' : 'revoked',
      expires_at: null,
      purchased_at: iso(p.purchased_at),
      in_trial: false,
      auto_renew: null,
      grace_until: null,
    });
  }
  return out;
}

export class RevenueCatError extends Error {
  constructor(readonly status: number) {
    super(`revenuecat_${status}`);
  }
}

/** The live client. `entitlements` throws RevenueCatError when RevenueCat can't be asked. */
export function revenueCatClient(opts: { key: string; projectId: string; config: RcConfig; now(): Date; fetch?: typeof fetch }) {
  const f = opts.fetch ?? fetch;
  const get = async <T>(path: string): Promise<T | null> => {
    const res = await f(`https://api.revenuecat.com/v2/projects/${opts.projectId}${path}`, {
      headers: { Authorization: `Bearer ${opts.key}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new RevenueCatError(res.status);
    return (await res.json()) as T;
  };
  return {
    async entitlements(appUserId: string): Promise<Entitlement[]> {
      const id = encodeURIComponent(appUserId);
      const [subs, purchases] = await Promise.all([
        get<{ items: RcSubscription[] }>(`/customers/${id}/subscriptions?limit=100`),
        get<{ items: RcPurchase[] }>(`/customers/${id}/purchases?limit=100`),
      ]);
      // 404 = RevenueCat has never seen this id: nothing bought.
      return rcToEntitlements(appUserId, subs?.items ?? [], purchases?.items ?? [], opts.config, opts.now());
    },
  };
}
