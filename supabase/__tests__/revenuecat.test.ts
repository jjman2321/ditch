import { handleCleanup, handleEntitlementSync, handleExchange, handleLinkToken, handleSync } from '../functions/_shared/handlers.ts';
import { hashSecret } from '../functions/_shared/crypto.ts';
import { RevenueCatError, rcToEntitlements, revenueCatClient, type RcConfig, type RcPurchase, type RcSubscription } from '../functions/_shared/revenuecat.ts';
import type { Entitlement } from '../functions/_shared/types.ts';
import { makeCtx, req, SECRET, USER } from '../testing/fakes.ts';

const DAY = 86_400_000;
const NOW = new Date('2026-11-20T12:00:00Z');
const T = NOW.getTime();
const CFG: RcConfig = { products: { prodY: 'yearly', prodW: 'weekly', prodL: 'lifetime' }, entitlement: 'pro', environments: ['Production', 'Sandbox'] };
const PRO = { items: [{ lookup_key: 'pro' }] };

const sub = (o: Partial<RcSubscription> = {}): RcSubscription => ({
  id: 'sub1',
  product_id: 'prodY',
  starts_at: T - DAY,
  current_period_ends_at: T + 6 * DAY,
  ends_at: T + 6 * DAY,
  gives_access: true,
  auto_renewal_status: 'will_renew',
  status: 'trialing',
  environment: 'sandbox',
  ownership: 'purchased',
  entitlements: PRO,
  ...o,
});
const buy = (o: Partial<RcPurchase> = {}): RcPurchase => ({
  id: 'pur1',
  product_id: 'prodL',
  purchased_at: T - 30 * DAY,
  status: 'owned',
  environment: 'production',
  ownership: 'purchased',
  entitlements: PRO,
  ...o,
});
const one = (s: Partial<RcSubscription>) => rcToEntitlements(USER, [sub(s)], [], CFG, NOW)[0];

describe('RevenueCat answer → entitlement rows', () => {
  it('a running free trial', () => {
    expect(one({})).toMatchObject({ kind: 'yearly', status: 'trial', in_trial: true, auto_renew: true, environment: 'Sandbox', original_transaction_id: 'rc:sub1', family_shared: false });
    expect(one({}).expires_at).toBe(new Date(T + 6 * DAY).toISOString());
  });

  it('a cancelled trial keeps going until its end date', () => {
    expect(one({ auto_renewal_status: 'will_not_renew' })).toMatchObject({ status: 'trial_cancelled', auto_renew: false });
  });

  it('paid, grace period, billing retry, expired', () => {
    expect(one({ status: 'active', product_id: 'prodW' })).toMatchObject({ kind: 'weekly', status: 'active', in_trial: false });
    const g = one({ status: 'in_grace_period', current_period_ends_at: T - 1000, ends_at: T - 1000 });
    expect(g.status).toBe('grace');
    expect(Date.parse(g.grace_until!)).toBeGreaterThan(T);
    expect(one({ status: 'in_billing_retry', gives_access: false }).status).toBe('billing_retry');
    expect(one({ status: 'expired', gives_access: false }).status).toBe('expired');
    expect(one({ status: 'active', gives_access: false }).status).toBe('expired');
  });

  it('Lifetime: owned, refunded; Family Sharing is marked', () => {
    const [l] = rcToEntitlements(USER, [], [buy()], CFG, NOW);
    expect(l).toMatchObject({ kind: 'lifetime', status: 'active', expires_at: null, purchased_at: new Date(T - 30 * DAY).toISOString(), environment: 'Production' });
    expect(rcToEntitlements(USER, [], [buy({ status: 'refunded' })], CFG, NOW)[0].status).toBe('revoked');
    expect(rcToEntitlements(USER, [], [buy({ ownership: 'family_shared' })], CFG, NOW)[0].family_shared).toBe(true);
  });

  it('skips anything that is not Pro, or from an environment we do not accept', () => {
    expect(rcToEntitlements(USER, [sub({ entitlements: { items: [{ lookup_key: 'other' }] } })], [], CFG, NOW)).toEqual([]);
    expect(rcToEntitlements(USER, [sub({ product_id: 'prodX', entitlements: undefined })], [], CFG, NOW)).toEqual([]);
    expect(rcToEntitlements(USER, [sub()], [], { ...CFG, environments: ['Production'] }, NOW)).toEqual([]);
    // An unknown product that carries "pro" still counts.
    expect(rcToEntitlements(USER, [sub({ product_id: 'prodNew' })], [], CFG, NOW)[0].kind).toBe('yearly');
  });
});

describe('the RevenueCat client', () => {
  const client = (status: number, bodies: Record<string, unknown>) =>
    revenueCatClient({
      key: 'sk_test',
      projectId: 'proj1',
      config: CFG,
      now: () => NOW,
      fetch: (async (url: string, init: RequestInit) => {
        expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk_test');
        const key = url.includes('/subscriptions') ? 'subs' : 'purchases';
        return new Response(JSON.stringify(bodies[key] ?? {}), { status });
      }) as unknown as typeof fetch,
    });

  it('reads subscriptions and purchases for the app user id', async () => {
    const ents = await client(200, { subs: { items: [sub()] }, purchases: { items: [buy()] } }).entitlements(USER);
    expect(ents.map((e) => e.kind)).toEqual(['yearly', 'lifetime']);
  });

  it('an id RevenueCat has never seen has nothing', async () => {
    expect(await client(404, {}).entitlements(USER)).toEqual([]);
  });

  it('throws when RevenueCat cannot be asked', async () => {
    await expect(client(500, {}).entitlements(USER)).rejects.toBeInstanceOf(RevenueCatError);
  });
});

/** Handlers with a fake RevenueCat whose answer the test controls. */
async function rcCtx() {
  const ctx = await makeCtx();
  const rc = { subs: [] as RcSubscription[], purchases: [] as RcPurchase[], down: false };
  ctx.deps.revenuecat = {
    entitlements: async (id: string): Promise<Entitlement[]> => {
      if (rc.down) throw new RevenueCatError(503);
      return rcToEntitlements(id, rc.subs, rc.purchases, CFG, ctx.clock.now);
    },
  };
  const t = ctx.clock.now.getTime();
  rc.subs = [sub({ starts_at: t - DAY, current_period_ends_at: t + 6 * DAY, ends_at: t + 6 * DAY })];
  return { ctx, rc };
}
const body = async (r: Response) => JSON.parse(await r.text());

describe('bank server with RevenueCat', () => {
  it('registers a Pro user on first sync, and only a Pro user', async () => {
    const { ctx, rc } = await rcCtx();
    const subs = rc.subs;
    rc.subs = [];
    expect(await body(await handleEntitlementSync(req({}), ctx.deps))).toEqual({ error: 'not_entitled', reason: 'none' });
    expect(ctx.store.users.has(USER)).toBe(false);

    rc.subs = subs;
    const res = await handleEntitlementSync(req({}), ctx.deps);
    expect(res.status).toBe(200);
    expect((await body(res)).access).toMatchObject({ allowed: true, reason: 'trial' });
    expect(ctx.store.users.get(USER)!.secret_hash).toBe(await hashSecret(SECRET));
    // The install secret never changes once set.
    expect((await handleEntitlementSync(req({}, { 'x-ditch-secret': 'b'.repeat(43) }), ctx.deps)).status).toBe(401);
  });

  it('RevenueCat down on first contact: try again later, nothing created', async () => {
    const { ctx, rc } = await rcCtx();
    rc.down = true;
    expect((await handleEntitlementSync(req({}), ctx.deps)).status).toBe(503);
    expect(ctx.store.users.has(USER)).toBe(false);
  });

  it('connects a bank while Pro, and removes it when Pro ends', async () => {
    const { ctx, rc } = await rcCtx();
    await handleEntitlementSync(req({}), ctx.deps);
    expect((await handleLinkToken(req({}), ctx.deps)).status).toBe(200);
    expect((await handleExchange(req({ publicToken: 'public-sandbox-1' }), ctx.deps)).status).toBe(200);

    rc.subs = [{ ...rc.subs[0], status: 'expired', gives_access: false }];
    expect(await body(await handleEntitlementSync(req({}), ctx.deps))).toMatchObject({ access: { allowed: false, reason: 'expired' }, removed: 1 });
    expect(ctx.provider.calls.filter((c) => c.op === 'remove')).toHaveLength(1);
    expect((await handleLinkToken(req({}), ctx.deps)).status).toBe(402);
  });

  it('a short RevenueCat outage keeps the last answer (no surprise removals)', async () => {
    const { ctx, rc } = await rcCtx();
    await handleEntitlementSync(req({}), ctx.deps);
    await handleExchange(req({ publicToken: 'public-sandbox-1' }), ctx.deps);
    rc.down = true;
    expect((await handleSync(req({}), ctx.deps)).status).toBe(200);
    expect(await body(await handleCleanup(req({}, { 'x-cron-secret': 'cron-test-secret' }), ctx.deps))).toMatchObject({ planned: 0 });
  });

  it('the hourly cleanup asks RevenueCat and removes banks of people whose Pro ended', async () => {
    const { ctx, rc } = await rcCtx();
    await handleEntitlementSync(req({}), ctx.deps);
    await handleExchange(req({ publicToken: 'public-sandbox-1' }), ctx.deps);
    // A restore on a new phone moved the purchase to another app user id: this id has nothing now.
    rc.subs = [];
    expect(await body(await handleCleanup(req({}, { 'x-cron-secret': 'cron-test-secret' }), ctx.deps))).toMatchObject({ planned: 1, removed: 1 });
  });

  it('Lifetime gets bank sync for its first 12 months only', async () => {
    const { ctx, rc } = await rcCtx();
    const t = ctx.clock.now.getTime();
    rc.subs = [];
    rc.purchases = [buy({ purchased_at: t - 30 * DAY })];
    expect((await body(await handleEntitlementSync(req({}), ctx.deps))).access).toMatchObject({ allowed: true, reason: 'lifetime_first_year' });
    rc.purchases = [buy({ purchased_at: t - 400 * DAY })];
    expect((await body(await handleEntitlementSync(req({}), ctx.deps))).access).toMatchObject({ allowed: false, reason: 'lifetime_year_over' });
  });
});
