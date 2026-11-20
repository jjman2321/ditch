import { PRODUCT_IDS, planIdForProduct } from '@/config/products';
import { DEFAULT_SETTINGS } from '@/domain/settings';
import { lapsedFreePicks, makeSub, remindedIds, type Sub } from '@/domain/subs';
import { planReminders } from '@/domain/reminders';

import { STATIC_PLANS, activePlan, entitlementJws, freeTrialDays, planFromProduct, plansFromStore, purchaseErrorKind, reconcilePro, storePriceMinor, type StoreProduct } from '../storeLogic';

const weekTrial = { type: 'introductory', paymentMode: 'free-trial', period: { unit: 'week', value: 1 }, periodCount: 1 };
const product = (id: string, displayPrice: string, price: number, currency = 'USD', extra: Partial<StoreProduct> = {}): StoreProduct => ({ id, displayPrice, price, currency, ...extra });
const usStore = (yearlyExtra: Partial<StoreProduct> = { subscriptionOffers: [weekTrial] }) => [
  product(PRODUCT_IDS.yearly, '$59.99', 59.99, 'USD', { subscriptionGroupIdIOS: '21500000', ...yearlyExtra }),
  product(PRODUCT_IDS.weekly, '$6.99', 6.99),
  product(PRODUCT_IDS.lifetime, '$119.99', 119.99),
];
const base = (id: 'yearly' | 'weekly' | 'lifetime') => STATIC_PLANS.find((p) => p.id === id)!;

describe('product IDs', () => {
  it('maps each App Store id to its plan, and nothing else', () => {
    expect(PRODUCT_IDS).toEqual({ yearly: 'app.ditchsubs.ditch.pro.yearly', weekly: 'app.ditchsubs.ditch.pro.weekly', lifetime: 'app.ditchsubs.ditch.pro.lifetime' });
    expect(planIdForProduct('app.ditchsubs.ditch.pro.lifetime')).toBe('lifetime');
    expect(planIdForProduct('com.other.app.pro')).toBeNull();
    expect(planIdForProduct(undefined)).toBeNull();
  });
});

describe('store products → plans', () => {
  it('uses the store text and exact minor units', () => {
    const plans = plansFromStore(usStore(), true)!;
    expect(plans.map((p) => [p.id, p.priceString, p.priceMinor, p.currency])).toEqual([
      ['yearly', '$59.99', 5999, 'USD'],
      ['lifetime', '$119.99', 11999, 'USD'],
      ['weekly', '$6.99', 699, 'USD'],
    ]);
  });

  it('respects the currency decimals (JPY has none, float noise rounds away)', () => {
    expect(storePriceMinor(9800, 'JPY')).toBe(9800);
    expect(storePriceMinor(59.99, 'EUR')).toBe(5999);
    expect(storePriceMinor(0.29 * 3, 'USD')).toBe(87);
    const p = planFromProduct(base('yearly'), product(PRODUCT_IDS.yearly, '¥9,800', 9800, 'JPY'), true)!;
    expect([p.priceString, p.priceMinor, p.currency]).toEqual(['¥9,800', 9800, 'JPY']);
  });

  it('keeps the static plans unless all three products came back in one currency', () => {
    expect(plansFromStore(usStore().slice(0, 2), true)).toBeNull();
    expect(plansFromStore([...usStore().slice(0, 2), product(PRODUCT_IDS.lifetime, '£119.99', 119.99, 'GBP')], true)).toBeNull();
    expect(plansFromStore([...usStore().slice(0, 2), product(PRODUCT_IDS.lifetime, '$119.99', NaN)], true)).toBeNull();
  });

  it('keeps title and period from the static plan', () => {
    const lifetime = plansFromStore(usStore(), true)!.find((p) => p.id === 'lifetime')!;
    expect([lifetime.title, lifetime.period, lifetime.trialDays]).toEqual(['Lifetime', 'once', 0]);
  });
});

describe('free trial and eligibility', () => {
  it('reads the intro offer length', () => {
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { subscriptionOffers: [weekTrial] }))).toBe(7);
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { subscriptionOffers: [{ ...weekTrial, period: { unit: 'day', value: 3 } }] }))).toBe(3);
    // A paid intro offer isn't a free trial.
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { subscriptionOffers: [{ ...weekTrial, paymentMode: 'pay-as-you-go' }] }))).toBe(0);
    // Promotional offers don't count.
    expect(freeTrialDays(product('x', '$1', 1, 'USD', { subscriptionOffers: [{ ...weekTrial, type: 'promotional' }] }))).toBe(0);
    // The older fields, already normalized (7 days → 1 week).
    expect(
      freeTrialDays(product('x', '$1', 1, 'USD', { introductoryPricePaymentModeIOS: 'free-trial', introductoryPriceSubscriptionPeriodIOS: 'week', introductoryPriceNumberOfPeriodsIOS: '1' })),
    ).toBe(7);
    expect(freeTrialDays(product('x', '$1', 1))).toBe(0);
  });

  it('eligible → 7 days free on Yearly, so the paywall can say "$0 due today"', () => {
    expect(plansFromStore(usStore(), true)!.find((p) => p.id === 'yearly')!.trialDays).toBe(7);
  });

  it('already had the trial (or unknown) → trialDays 0, so the paywall shows the real charge today', () => {
    expect(plansFromStore(usStore(), false)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
    expect(plansFromStore(usStore(), null)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
  });

  it('no intro offer set up in App Store Connect → no trial is promised', () => {
    expect(plansFromStore(usStore({}), true)!.find((p) => p.id === 'yearly')!.trialDays).toBe(0);
  });

  it('the static fallback keeps today’s look: 7 days free on Yearly', () => {
    expect(base('yearly').trialDays).toBe(7);
  });
});

describe('entitlements → plan', () => {
  const NOW = Date.parse('2026-11-20T12:00:00Z');
  const tx = (productId: string, o: Record<string, unknown> = {}) => ({ productId, purchaseState: 'purchased', purchaseToken: `jws.${productId}`, ...o });

  it('finds the active plan; Lifetime wins over a subscription', () => {
    expect(activePlan([tx(PRODUCT_IDS.yearly, { expirationDateIOS: NOW + 86_400_000 })], NOW)).toBe('yearly');
    expect(activePlan([tx(PRODUCT_IDS.weekly, { expirationDateIOS: NOW + 1 }), tx(PRODUCT_IDS.lifetime)], NOW)).toBe('lifetime');
    expect(activePlan([tx(PRODUCT_IDS.weekly, { expirationDateIOS: NOW + 1 })], NOW)).toBe('weekly');
  });

  it('ignores expired, refunded, pending and other apps’ products', () => {
    expect(activePlan([tx(PRODUCT_IDS.yearly, { expirationDateIOS: NOW - 1 })], NOW)).toBeNull();
    expect(activePlan([tx(PRODUCT_IDS.lifetime, { revocationDateIOS: NOW - 1 })], NOW)).toBeNull();
    expect(activePlan([tx(PRODUCT_IDS.lifetime, { purchaseState: 'pending' })], NOW)).toBeNull();
    expect(activePlan([tx('com.someone.else')], NOW)).toBeNull();
    expect(activePlan([], NOW)).toBeNull();
  });

  it('collects the signed transactions of our products for the server', () => {
    expect(entitlementJws([tx(PRODUCT_IDS.yearly), tx('com.someone.else'), tx(PRODUCT_IDS.lifetime, { purchaseToken: null })])).toEqual([`jws.${PRODUCT_IDS.yearly}`]);
  });
});

describe('reconcile with the App Store', () => {
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
    expect(purchaseErrorKind('user-cancelled')).toBe('cancelled');
    expect(purchaseErrorKind('E_USER_CANCELLED')).toBe('cancelled');
    expect(purchaseErrorKind('UserCancelled')).toBe('cancelled');
    expect(purchaseErrorKind('deferred-payment')).toBe('pending');
    expect(purchaseErrorKind('pending')).toBe('pending');
    expect(purchaseErrorKind('network-error')).toBe('error');
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
