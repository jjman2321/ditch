import type { AppleTransaction } from '../functions/_shared/appleJws.ts';
import { addMonthsUtc, bankAccess, deriveEntitlement, isNewer, type DeriveInput } from '../functions/_shared/entitlements.ts';
import type { EntitlementKind } from '../functions/_shared/types.ts';

const NOW = new Date('2026-11-19T12:00:00Z');
const DAY = 86_400_000;
const products: Record<string, EntitlementKind> = { yearly: 'yearly', weekly: 'weekly', lifetime: 'lifetime', addon: 'bank_addon' };
const tx = (o: Partial<AppleTransaction> = {}): AppleTransaction => ({
  originalTransactionId: 'otx-1',
  productId: 'yearly',
  purchaseDate: NOW.getTime() - 2 * DAY,
  expiresDate: NOW.getTime() + 5 * DAY,
  signedDate: NOW.getTime() - 1000,
  environment: 'Production',
  inAppOwnershipType: 'PURCHASED',
  ...o,
});
const trial = (o: Partial<AppleTransaction> = {}) => tx({ offerType: 1, offerDiscountType: 'FREE_TRIAL', price: 0, ...o });
const derive = (o: Partial<DeriveInput>) => deriveEntitlement({ appUserId: 'u', tx: tx(), products, now: NOW, ...o });
const access = (...ents: (ReturnType<typeof derive> | null)[]) => bankAccess(ents.filter((e) => e !== null), NOW);

describe('deriveEntitlement + bankAccess', () => {
  it('trial running with auto-renew on: bank allowed until the trial ends', () => {
    const e = derive({ tx: trial(), renewal: { autoRenewStatus: 1 } })!;
    expect(e).toMatchObject({ kind: 'yearly', status: 'trial', in_trial: true, auto_renew: true });
    expect(access(e)).toMatchObject({ allowed: true, reason: 'trial', until: e.expires_at });
  });

  it('trial cancelled (auto-renew off) keeps the bank until the trial ends, then not', () => {
    const e = derive({ tx: trial(), renewal: { autoRenewStatus: 0 } })!;
    expect(e.status).toBe('trial_cancelled');
    expect(access(e)).toEqual({ allowed: true, reason: 'trial_ending', until: e.expires_at });
    const after = new Date(Date.parse(e.expires_at!) + 1);
    expect(bankAccess([e], after)).toEqual({ allowed: false, reason: 'expired', until: null });
    // The cleanup's hour of grace still applies.
    expect(bankAccess([e], after, 60 * 60_000).allowed).toBe(true);
    // Same through the server notification, without renewal info.
    const n = derive({ tx: trial(), notification: { notificationType: 'DID_CHANGE_RENEWAL_STATUS', subtype: 'AUTO_RENEW_DISABLED' } });
    expect(n!.status).toBe('trial_cancelled');
    // Turned back on: a normal trial again.
    expect(derive({ tx: trial(), notification: { notificationType: 'DID_CHANGE_RENEWAL_STATUS', subtype: 'AUTO_RENEW_ENABLED' } })!.status).toBe('trial');
  });

  it('a paid year with auto-renew off keeps the bank until the year ends', () => {
    expect(access(derive({ renewal: { autoRenewStatus: 0 } }))).toMatchObject({ allowed: true, reason: 'subscription' });
  });

  it('expired by date or by EXPIRED / GRACE_PERIOD_EXPIRED notification', () => {
    expect(access(derive({ tx: tx({ expiresDate: NOW.getTime() - 1 }) }))).toMatchObject({ allowed: false, reason: 'expired' });
    expect(derive({ notification: { notificationType: 'EXPIRED', subtype: 'VOLUNTARY' } })!.status).toBe('expired');
    expect(derive({ notification: { notificationType: 'GRACE_PERIOD_EXPIRED' } })!.status).toBe('expired');
  });

  it('refund / revoke -> revoked, no bank', () => {
    expect(access(derive({ tx: tx({ revocationDate: NOW.getTime() - 1000 }) }))).toMatchObject({ allowed: false, reason: 'revoked' });
    expect(derive({ notification: { notificationType: 'REFUND' } })!.status).toBe('revoked');
    expect(derive({ notification: { notificationType: 'REVOKE' } })!.status).toBe('revoked');
    expect(derive({ tx: tx({ productId: 'lifetime', revocationDate: 1 }) })!.status).toBe('revoked');
  });

  it('billing grace period keeps the bank until grace ends; billing retry does not', () => {
    const g = derive({ tx: tx({ expiresDate: NOW.getTime() - DAY }), renewal: { gracePeriodExpiresDate: NOW.getTime() + 3 * DAY } })!;
    expect(g.status).toBe('grace');
    expect(access(g)).toMatchObject({ allowed: true, reason: 'grace' });
    expect(access(derive({ notification: { notificationType: 'DID_FAIL_TO_RENEW' } }))).toMatchObject({ allowed: false, reason: 'billing_retry' });
  });

  it('Lifetime: bank sync for the first 12 months only', () => {
    const bought = Date.parse('2026-02-10T09:00:00Z');
    const e = derive({ tx: tx({ productId: 'lifetime', expiresDate: undefined, purchaseDate: bought, originalPurchaseDate: bought }) })!;
    expect(e).toMatchObject({ kind: 'lifetime', status: 'active', expires_at: null });
    expect(bankAccess([e], NOW)).toMatchObject({ allowed: true, reason: 'lifetime_first_year', until: '2027-02-10T09:00:00.000Z' });
    expect(bankAccess([e], new Date('2027-02-10T09:00:00Z'))).toMatchObject({ allowed: false, reason: 'lifetime_year_over' });
  });

  it('Lifetime after year one + the $19.99 bank add-on -> allowed', () => {
    const bought = Date.parse('2025-01-01T00:00:00Z');
    const life = derive({ tx: tx({ productId: 'lifetime', originalTransactionId: 'l', expiresDate: undefined, originalPurchaseDate: bought }) })!;
    const addon = derive({ tx: tx({ productId: 'addon', originalTransactionId: 'a' }) })!;
    expect(bankAccess([life], NOW).allowed).toBe(false);
    expect(bankAccess([life, addon], NOW)).toMatchObject({ allowed: true, reason: 'bank_addon' });
  });

  it('Family Sharing copies get Pro on the phone but no bank sync', () => {
    expect(access(derive({ tx: tx({ inAppOwnershipType: 'FAMILY_SHARED' }) }))).toMatchObject({ allowed: false, reason: 'family_shared' });
  });

  it('weekly works like yearly; unknown products are ignored', () => {
    expect(access(derive({ tx: tx({ productId: 'weekly' }) }))).toMatchObject({ allowed: true, reason: 'subscription' });
    expect(derive({ tx: tx({ productId: 'something.else' }) })).toBeNull();
    expect(bankAccess([], NOW)).toEqual({ allowed: false, reason: 'none', until: null });
  });

  it('the cleanup waits an hour past period end for a late renewal notice', () => {
    const e = derive({ tx: tx({ expiresDate: NOW.getTime() + 1000 }) })!;
    const later = new Date(NOW.getTime() + 30 * 60_000);
    expect(bankAccess([e], later).allowed).toBe(false);
    expect(bankAccess([e], later, 60 * 60_000).allowed).toBe(true);
  });

  it('older Apple data never overwrites newer', () => {
    const newer = derive({ tx: tx({ signedDate: NOW.getTime() }) })!;
    const older = derive({ tx: tx({ signedDate: NOW.getTime() - DAY }) })!;
    expect(isNewer(older, newer)).toBe(false);
    expect(isNewer(newer, older)).toBe(true);
    expect(isNewer(older, null)).toBe(true);
  });

  it('addMonthsUtc clamps to month end', () => {
    expect(addMonthsUtc(new Date('2028-02-29T00:00:00Z'), 12).toISOString()).toBe('2029-02-28T00:00:00.000Z');
    expect(addMonthsUtc(new Date('2026-01-31T10:00:00Z'), 1).toISOString()).toBe('2026-02-28T10:00:00.000Z');
  });
});
