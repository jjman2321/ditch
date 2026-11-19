// Who may keep a bank connection (DECISIONS #67, #69). Pure functions, tested in Jest.
//
// Bank sync is allowed for:
//   - Yearly / Weekly while the trial runs (auto-renew on) or the paid period runs, incl. Apple's
//     billing grace period.
//   - Lifetime for the first 12 months after purchase.
//   - The $19.99/yr bank add-on (Lifetime owners after year one), same rules as a subscription.
//   - A cancelled trial or a subscription with auto-renew off: kept until the period ends
//     (DECISIONS #67, updated Nov 19), then the hourly cleanup removes it (+1 hour grace).
// Never for: expired, refunded/revoked (removed at once), billing retry, Family Sharing copies.

import type { AppleNotification, AppleRenewalInfo, AppleTransaction } from './appleJws.ts';
import type { Entitlement, EntitlementKind, EntitlementStatus } from './types.ts';

const iso = (ms: number | undefined | null) => (typeof ms === 'number' ? new Date(ms).toISOString() : null);

/** Calendar months, clamped to month end (Jan 31 + 1 → Feb 28/29; Feb 29 + 12 → Feb 28). */
export function addMonthsUtc(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const target = new Date(Date.UTC(y, m, 1, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), lastDay));
  return target;
}

/** Lifetime includes bank sync for this many months (DECISIONS #67, option B). */
export const LIFETIME_BANK_MONTHS = 12;

export function isFreeTrial(tx: AppleTransaction): boolean {
  return tx.offerDiscountType === 'FREE_TRIAL' || (tx.offerType === 1 && tx.price === 0);
}

export type DeriveInput = {
  appUserId: string;
  tx: AppleTransaction;
  renewal?: AppleRenewalInfo | null;
  /** When the data came from a server notification: its type, subtype and data.status. */
  notification?: Pick<AppleNotification, 'notificationType' | 'subtype'> & { status?: number };
  products: Record<string, EntitlementKind>;
  now: Date;
};

/** One Apple transaction (+ renewal info, + notification) -> an entitlements row. null = not our product. */
export function deriveEntitlement({ appUserId, tx, renewal, notification, products, now }: DeriveInput): Entitlement | null {
  const kind = tx.productId ? products[tx.productId] : undefined;
  if (!kind || !tx.originalTransactionId) return null;
  const type = notification?.notificationType;
  const sub = notification?.subtype;
  const dataStatus = notification?.status;
  const nowMs = now.getTime();

  let autoRenew: boolean | null = typeof renewal?.autoRenewStatus === 'number' ? renewal.autoRenewStatus === 1 : null;
  if (type === 'DID_CHANGE_RENEWAL_STATUS' && sub === 'AUTO_RENEW_DISABLED') autoRenew = false;
  if (type === 'DID_CHANGE_RENEWAL_STATUS' && sub === 'AUTO_RENEW_ENABLED') autoRenew = true;
  const inTrial = kind !== 'lifetime' && isFreeTrial(tx);
  const grace = renewal?.gracePeriodExpiresDate ?? null;
  const expires = tx.expiresDate ?? null;

  let status: EntitlementStatus;
  if (tx.revocationDate != null || type === 'REFUND' || type === 'REVOKE' || dataStatus === 5) status = 'revoked';
  else if (kind === 'lifetime') status = 'active';
  else if (type === 'EXPIRED' || type === 'GRACE_PERIOD_EXPIRED' || dataStatus === 2) status = 'expired';
  else if (dataStatus === 4 || (type === 'DID_FAIL_TO_RENEW' && sub === 'GRACE_PERIOD') || (grace != null && grace > nowMs && (expires ?? 0) <= nowMs)) status = 'grace';
  else if (dataStatus === 3 || type === 'DID_FAIL_TO_RENEW' || (renewal?.isInBillingRetryPeriod && (expires ?? 0) <= nowMs)) status = 'billing_retry';
  else if (expires == null || expires <= nowMs) status = 'expired';
  else if (inTrial) status = autoRenew === false ? 'trial_cancelled' : 'trial';
  else status = 'active';

  return {
    app_user_id: appUserId,
    kind,
    original_transaction_id: tx.originalTransactionId,
    product_id: tx.productId!,
    status,
    expires_at: kind === 'lifetime' ? null : iso(expires),
    purchased_at: iso(tx.originalPurchaseDate ?? tx.purchaseDate),
    in_trial: inTrial,
    auto_renew: kind === 'lifetime' ? null : autoRenew,
    grace_until: iso(grace),
    family_shared: tx.inAppOwnershipType === 'FAMILY_SHARED',
    environment: tx.environment ?? 'Production',
    signed_at: iso(tx.signedDate) ?? now.toISOString(),
    updated_at: now.toISOString(),
  };
}

export type BankAccess = {
  allowed: boolean;
  /** Why (for the app's copy and the audit log). */
  reason: 'subscription' | 'trial' | 'trial_ending' | 'grace' | 'lifetime_first_year' | 'bank_addon' | 'lifetime_year_over' | 'expired' | 'revoked' | 'billing_retry' | 'family_shared' | 'none';
  /** Until when, if allowed. */
  until: string | null;
};

const DENY_ORDER: BankAccess['reason'][] = ['lifetime_year_over', 'billing_retry', 'expired', 'revoked', 'family_shared', 'none'];

/**
 * May this user hold a bank connection right now?
 * `graceMs` lets the hourly cleanup wait a little past a period end in case Apple's renewal
 * notification is late (an explicit EXPIRED/REFUND/trial-cancel notification still acts at once).
 */
export function bankAccess(ents: Entitlement[], now: Date, graceMs = 0): BankAccess {
  const nowMs = now.getTime();
  let best: BankAccess | null = null;
  const denies: BankAccess['reason'][] = [];
  const allow = (reason: BankAccess['reason'], until: string | null) => {
    if (!best || (until ?? '') > (best.until ?? '')) best = { allowed: true, reason, until };
  };
  for (const e of ents) {
    if (e.family_shared) {
      denies.push('family_shared');
      continue;
    }
    if (e.status === 'revoked') {
      denies.push('revoked');
      continue;
    }
    if (e.kind === 'lifetime') {
      const start = e.purchased_at ? new Date(e.purchased_at) : null;
      const until = start ? addMonthsUtc(start, LIFETIME_BANK_MONTHS) : null;
      if (until && nowMs < until.getTime()) allow('lifetime_first_year', until.toISOString());
      else denies.push('lifetime_year_over');
      continue;
    }
    if (e.status === 'grace') {
      if (e.grace_until && Date.parse(e.grace_until) > nowMs) allow('grace', e.grace_until);
      else denies.push('expired');
      continue;
    }
    if (e.status === 'trial' || e.status === 'active' || e.status === 'trial_cancelled') {
      // A cancelled trial keeps the bank until the trial's end date; then it's simply expired.
      if (e.expires_at && Date.parse(e.expires_at) + graceMs > nowMs) {
        allow(e.kind === 'bank_addon' ? 'bank_addon' : e.status === 'trial' ? 'trial' : e.status === 'trial_cancelled' ? 'trial_ending' : 'subscription', e.expires_at);
      } else denies.push('expired');
      continue;
    }
    denies.push(e.status === 'billing_retry' ? 'billing_retry' : 'expired');
  }
  if (best) return best;
  const reason = DENY_ORDER.find((r) => denies.includes(r)) ?? 'none';
  return { allowed: false, reason, until: null };
}

/** Only newer Apple data may replace a stored row (notifications can arrive out of order). */
export function isNewer(incoming: Entitlement, stored: Entitlement | null): boolean {
  return !stored || incoming.signed_at >= stored.signed_at;
}
