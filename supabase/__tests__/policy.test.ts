import { canAddLink, duplicateOf, linkTokenAllowed, planCleanup } from '../functions/_shared/policy.ts';
import type { BankLink, Entitlement } from '../functions/_shared/types.ts';

const NOW = new Date('2026-11-19T12:00:00Z');
const DAY = 86_400_000;
let n = 0;
const link = (o: Partial<BankLink> = {}): BankLink => ({
  id: `l${++n}`,
  app_user_id: 'u1',
  provider: 'plaid',
  item_id: `item${n}`,
  access_token_enc: 'v1:x:y',
  cursor: null,
  pending_cursor: null,
  status: 'active',
  institution_id: `ins${n}`,
  institution_name: 'Bank',
  needs_relogin_since: null,
  updates_available: false,
  new_accounts: false,
  last_error: null,
  remove_attempts: 0,
  created_at: new Date(NOW.getTime() - n * 1000).toISOString(),
  removed_at: null,
  ...o,
});
const paid = (user = 'u1', o: Partial<Entitlement> = {}): Entitlement => ({
  app_user_id: user,
  kind: 'yearly',
  original_transaction_id: `o-${user}`,
  product_id: 'y',
  status: 'active',
  expires_at: new Date(NOW.getTime() + 100 * DAY).toISOString(),
  purchased_at: null,
  in_trial: false,
  auto_renew: true,
  grace_until: null,
  family_shared: false,
  environment: 'Production',
  signed_at: NOW.toISOString(),
  updated_at: NOW.toISOString(),
  ...o,
});

describe('3-bank cap', () => {
  it('allows up to 3 live connections; removed ones do not count', () => {
    expect(canAddLink([link(), link()])).toBe(true);
    expect(canAddLink([link(), link(), link()])).toBe(false);
    expect(canAddLink([link(), link(), link({ status: 'removed' })])).toBe(true);
  });
  it('finds the same bank connected again', () => {
    const a = link({ institution_id: 'ins_chase' });
    expect(duplicateOf([link(), a], 'ins_chase')).toBe(a);
    expect(duplicateOf([a], null)).toBeNull();
    expect(duplicateOf([link({ institution_id: 'ins_chase', status: 'removed' })], 'ins_chase')).toBeNull();
  });
  it('rate limits link tokens', () => {
    expect(linkTokenAllowed(9, 20)).toBe(true);
    expect(linkTokenAllowed(10, 20)).toBe(false);
    expect(linkTokenAllowed(0, 30)).toBe(false);
  });
});

describe('planCleanup (reconciliation)', () => {
  const ents = (m: Record<string, Entitlement[]>) => new Map(Object.entries(m));

  it('keeps connections of paying users', () => {
    expect(planCleanup([link(), link()], ents({ u1: [paid()] }), new Set(['u1']), NOW)).toEqual([]);
  });

  it('removes connections of users who are not entitled (expired, cancelled trial, no purchase)', () => {
    const a = link({ app_user_id: 'u1' });
    const b = link({ app_user_id: 'u2' });
    const c = link({ app_user_id: 'u3' });
    const plan = planCleanup(
      [a, b, c],
      ents({ u1: [paid('u1', { expires_at: new Date(NOW.getTime() - 2 * 3600_000).toISOString() })], u2: [paid('u2', { status: 'trial_cancelled', in_trial: true, expires_at: new Date(NOW.getTime() - 2 * 3600_000).toISOString() })] }),
      new Set(['u1', 'u2', 'u3']),
      NOW,
    );
    expect(plan.map((p) => [p.linkId, p.reason])).toEqual([
      [a.id, 'not_entitled'],
      [b.id, 'not_entitled'],
      [c.id, 'not_entitled'],
    ]);
  });

  it('keeps a cancelled trial until its end date', () => {
    const ending = paid('u1', { status: 'trial_cancelled', in_trial: true, expires_at: new Date(NOW.getTime() + 3 * DAY).toISOString() });
    expect(planCleanup([link()], ents({ u1: [ending] }), new Set(['u1']), NOW)).toEqual([]);
  });

  it('waits one hour past the period end before calling it lapsed', () => {
    const a = link();
    const justEnded = paid('u1', { expires_at: new Date(NOW.getTime() - 30 * 60_000).toISOString() });
    expect(planCleanup([a], ents({ u1: [justEnded] }), new Set(['u1']), NOW)).toEqual([]);
  });

  it('removes a connection stuck on "reconnect" for 30 days, not 29', () => {
    const old = link({ status: 'needs_relogin', needs_relogin_since: new Date(NOW.getTime() - 30 * DAY).toISOString() });
    const recent = link({ status: 'needs_relogin', needs_relogin_since: new Date(NOW.getTime() - 29 * DAY).toISOString() });
    expect(planCleanup([old, recent], ents({ u1: [paid()] }), new Set(['u1']), NOW)).toEqual([{ linkId: old.id, appUserId: 'u1', reason: 'relogin_30d' }]);
  });

  it('retries failed removals, removes orphans, and trims anything over 3 (newest kept)', () => {
    const stuck = link({ status: 'removing' });
    const orphan = link({ app_user_id: 'ghost' });
    const four = [link(), link(), link(), link()]; // created_at: earlier n = newer
    const plan = planCleanup([stuck, orphan, ...four], ents({ u1: [paid()] }), new Set(['u1']), NOW);
    expect(plan).toEqual([
      { linkId: stuck.id, appUserId: 'u1', reason: 'retry_remove' },
      { linkId: orphan.id, appUserId: 'ghost', reason: 'no_user' },
      { linkId: four[3].id, appUserId: 'u1', reason: 'over_cap' },
    ]);
  });

  it('ignores already-removed rows', () => {
    expect(planCleanup([link({ status: 'removed', app_user_id: 'ghost' })], ents({}), new Set(), NOW)).toEqual([]);
  });
});
