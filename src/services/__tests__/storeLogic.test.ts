import { PACKAGE_IDS, PRODUCT_IDS, planIdForProduct } from '@/config/products';
import { planReminders } from '@/domain/reminders';
import { DEFAULT_SETTINGS } from '@/domain/settings';
import { lapsedFreePicks, makeSub, remindedIds, type Sub } from '@/domain/subs';

import {
  STATIC_PLANS,
  freeTrialDays,
  isIntroEligible,
  planFromEntitlement,
  planFromProduct,
  plansFromStore,
  purchaseErrorKind,
  reconcilePro,
  storePriceMinor,
  trialEndFromEntitlement,
  type StorePackage,
  type StoreProduct,
} from '../storeLogic';

const weekTrial = { price: 0, periodUnit: 'WEEK', periodNumberOfUnits: 1, cycles: 1 };
const product = (identifier: string, priceString: string, price: number, currencyCode = 'USD', extra: Partial<StoreProduct> = {}): StoreProduct => ({
  identifier,
  priceString,
  price,
  currencyCode,
  introPrice: null,
  ...extra,
});
const pkg = (identifier: string, p: StoreProduct, packageType?: string): StorePackage => ({ identifier, packageType, product: p });
const usOffering = (yearlyExtra: Partial<StoreProduct> = { introPrice: weekTrial }) => [
  pkg('$rc_weekly', product(PRODUCT_IDS.weekly, '$6.99', 6.99), 'WEEKLY'),
  pkg('$rc_annual', product(PRODUCT_IDS.yearly, '$59.99', 59.99, 'USD', yearlyExtra), 'ANNUAL'),
  pkg('$rc_lifetime', product(PRODUCT_IDS.lifetime, '$119.99', 119.99), 'LIFETIME'),
];
const base = (id: 'yearly' | 'weekly' | 'lifetime') => STATIC_PLANS.find((p) => p.id === id)!;

describe('IDs', () => {
  it('maps each App Store id to its plan, and nothing else', () => {
    expect(PRODUCT_IDS).toEqual({ yearly: 'app.ditchsubs.ditch.pro.yearly', weekly: 'app.ditchsubs.ditch.pro.weekly', lifetime: 'app.ditchsubs.ditch.pro.lifetime' });
    expect(PACKAGE_IDS).toEqual({ yearly: '$rc_annual', weekly: '$rc_weekly', lifetime: '$rc_lifetime' });
    expect(planIdForProduct('app.ditchsubs.ditch.pro.lifetime')).toBe('lifetime');
    expect(planIdForProduct('com.other.app.pro')).toBeNull();
    expect(planIdForProduct(undefined)).toBeNull();
  });
});

describe('offering → plans', () => {
  it('uses the store text and exact minor units, in the paywall order', () => {
    const plans = plansFromStore(usOffering(), true)!;
    expect(plans.map((p) => [p.id, p.priceString, p.priceMinor, p.currency])).toEqual([
      ['yearly', '$59.99', 5999, 'USD'],
      ['lifetime', '$119.99', 11999, 'USD'],
      ['weekly', '$6.99', 699, 'USD'],
    ]);
  });

  it('finds packages by type when the identifiers are custom', () => {
    const custom = usOffering().map((p) => ({ ...p, identifier: `custom_${p.packageType}` }));
    expect(plansFromStore(custom, true)!.map((p) => p.priceString)).toEqual(['$59.99', '$119.99', '$6.99']);
  });

  it('respects the currency decimals (JPY has none, float noise rounds away)', () => {
    expect(storePriceMinor(9800, 'JPY')).toBe(9800);
    expect(storePriceMinor(59.99, 'EUR')).toBe(5999);
    expect(storePriceMinor(0.29 * 3, 'USD')).toBe(87);
    const p = planFromProduct(base('yearly'), product(PRODUCT_IDS.yearly, '¥9,800', 9800, 'JPY'), true)!;
    expect([p.priceString, p.priceMinor, p.currency]).toEqual(['¥9,800', 9800, 'JPY']);
  });

  it('keeps the static plans unless all three packages came back in one currency', () => {
    expect(plansFromStore(usOffering().slice(0, 2), true)).toBeNull();
    expect(plansFromStore([...usOffering().slice(0, 2), pkg('$rc_lifetime', product(PRODUCT_IDS.lifetime, '£119.99', 119.99, 'GBP'))], true)).toBeNull();
    expect(plansFromStore([...usOffering().slice(0, 2), pkg('$rc_lifetime', product(PRODUCT_IDS.lifetime, '$119.99', NaN))], true)).toBeNull();
    expect(plansFromStore([], true)).toBeNull();
  });

  it('keeps title and period from the static plan', () => {
    const lifetime = plansFromStore(usOffering(), true)!.find((p) => p.id === 'lifetime')!;
    expect([lifetime.title, lifetime.period, lifetime.trialDays]).toEqual(['Lifetime', 'once', 0]);
  });
});

describe('free trial and eligibility', () => {
  it('reads the intro offer length; a paid intro price is not a free trial', () => {
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { introPrice: weekTrial }))).toBe(7);
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { introPrice: { ...weekTrial, periodUnit: 'DAY', periodNumberOfUnits: 3 } }))).toBe(3);
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { introPrice: { ...weekTrial, price: 0.99 } }))).toBe(0);
    expect(freeTrialDays(product('x', '$1', 1))).toBe(0);
  });

  it('only ELIGIBLE (2) counts; UNKNOWN (0) and INELIGIBLE (1) do not', () => {
    expect([isIntroEligible(2), isIntroEligible(1), isIntroEligible(0), isIntroEligible(undefined)]).toEqual([true, false, false, false]);
  });

  it('eligible → 7 days free on Yearly, so the paywall can say "$0 due today"', () => {
    expect(plansFromStore(usOffering(), true)!.find((p) => p.id === 'yearly')!.trialDays).toBe(7);
  });

  it('already had the trial (or unknown) → trialDays 0, so the paywall shows the real charge today', () => {
    expect(plansFromStore(usOffering(), false)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
    expect(plansFromStore(usOffering(), null)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
  });

  it('no intro offer set up in App Store Connect → no trial is promised', () => {
    expect(plansFromStore(usOffering({}), true)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
  });

  it('the static fallback keeps today’s look: 7 days free on Yearly', () => {
    expect(base('yearly').trialDays).toBe(7);
  });
});

describe('"pro" entitlement → plan', () => {
  const NOW = Date.parse('2026-11-20T12:00:00Z');
  const ent = (productIdentifier: string, o: Record<string, unknown> = {}) => ({ isActive: true, productIdentifier, periodType: 'NORMAL', expirationDateMillis: NOW + 86_400_000, ...o });

  it('reads the plan from the product', () => {
    expect(planFromEntitlement(ent(PRODUCT_IDS.yearly))).toBe('yearly');
    expect(planFromEntitlement(ent(PRODUCT_IDS.weekly))).toBe('weekly');
    expect(planFromEntitlement(ent(PRODUCT_IDS.lifetime, { expirationDateMillis: null }))).toBe('lifetime');
  });

  it('a product we don’t know: never expires → Lifetime, else Yearly', () => {
    expect(planFromEntitlement(ent('rc_promo_pro_lifetime', { expirationDateMillis: null }))).toBe('lifetime');
    expect(planFromEntitlement(ent('rc_promo_pro_monthly'))).toBe('yearly');
  });

  it('no entitlement, or not active → no Pro', () => {
    expect(planFromEntitlement(undefined)).toBeNull();
    expect(planFromEntitlement(ent(PRODUCT_IDS.yearly, { isActive: false }))).toBeNull();
  });

  it('a running free trial gives its end day (for the "Ditch Pro trial" entry)', () => {
    const ends = new Date(2026, 10, 27, 15, 30).getTime();
    expect(trialEndFromEntitlement(ent(PRODUCT_IDS.yearly, { periodType: 'TRIAL', expirationDateMillis: ends }))).toBe('2026-11-27');
    expect(trialEndFromEntitlement(ent(PRODUCT_IDS.yearly))).toBeNull();
    expect(trialEndFromEntitlement(ent(PRODUCT_IDS.yearly, { periodType: 'TRIAL', expirationDateMillis: null }))).toBeNull();
  });
});

describe('reconcile with the store', () => {
  it('sets the plan the store says is active', () => {
    expect(reconcilePro(null, 'yearly')).toEqual({ plan: 'yearly' });
    expect(reconcilePro('weekly', 'lifetime')).toEqual({ plan: 'lifetime' });
    expect(reconcilePro('yearly', 'yearly')).toBeNull();
  });

  it('lapses Pro when nothing is active, but leaves Free and a test build’s Preview Pro alone', () => {
    expect(reconcilePro('yearly', null)).toEqual({ plan: null });
    expect(reconcilePro('monthly', null)).toEqual({ plan: null });
    expect(reconcilePro(null, null)).toBeNull();
    expect(reconcilePro('yearly', null, { preview: true })).toBeNull();
  });
});

describe('purchase errors', () => {
  it('tells a closed sheet and Ask to Buy apart from real failures', () => {
    expect(purchaseErrorKind({ code: '1', userCancelled: true })).toBe('cancelled');
    expect(purchaseErrorKind({ code: '1' })).toBe('cancelled');
    expect(purchaseErrorKind({ code: '20', userCancelled: false })).toBe('pending');
    expect(purchaseErrorKind({ code: '10', userCancelled: false })).toBe('error');
    expect(purchaseErrorKind(new Error('boom'))).toBe('error');
    expect(purchaseErrorKind(undefined)).toBe('error');
  });
});

describe('Pro lapses (CLAUDE.md rule 6)', () => {
  const TODAY = '2026-11-20';
  const sub = (name: string, amountMinor: number, o: Partial<Sub> = {}) =>
    makeSub({ name, cycle: 'monthly', anchor: '2026-12-05', amountMinor, currency: 'USD', priceSource: 'user', ...o }, '2026-11-01T00:00:00Z');

  it('keeps every sub and drops reminders back to 3, keeping the ones already picked', () => {
    const subs = [sub('A', 500, { freePick: true }), sub('B', 2000), sub('C', 1500), sub('D', 900), sub('E', 3000), sub('Undated', 4000, { dateSource: 'none' })];
    const changed = lapsedFreePicks(subs);
    const after = subs.map((s) => changed.find((c) => c.id === s.id) ?? s);
    expect(after).toHaveLength(subs.length);
    expect(after.every((s) => s.status === 'active')).toBe(true);
    // A keeps its pick; the two biggest dated ones fill the gap.
    expect([...remindedIds(after, false)].map((id) => after.find((s) => s.id === id)!.name).sort()).toEqual(['A', 'B', 'E']);
    const plan = planReminders(after, { ...DEFAULT_SETTINGS, pro: false }, new Date(`${TODAY}T08:00:00`));
    expect(new Set(plan.filter((r) => r.kind === 'heads-up').map((r) => r.subId)).size).toBeLessThanOrEqual(3);
  });

  it('changes nothing when 3 are already picked', () => {
    const subs = [sub('A', 500, { freePick: true }), sub('B', 600, { freePick: true }), sub('C', 700, { freePick: true }), sub('D', 9000)];
    expect(lapsedFreePicks(subs)).toEqual([]);
  });
});
