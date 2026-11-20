// The pure half of purchases (no native code, so Jest and the web preview can load it):
// the static plans, turning App Store products into plans, trial eligibility, and which plan
// the store says is active. src/services/purchases.ts does the StoreKit calls.

import { ALL_PRODUCT_IDS, PRODUCT_IDS, planIdForProduct } from '@/config/products';
import { currencyDigits, roundMinor } from '@/domain/money';
import type { ProPlan } from '@/domain/settings';

export type PlanId = 'yearly' | 'weekly' | 'lifetime';

export type Plan = {
  id: PlanId;
  title: string;
  priceString: string; // what the store says, e.g. "$59.99"
  priceMinor: number;
  currency: string;
  period: 'year' | 'week' | 'once';
  trialDays: number; // 0 = no trial (or not eligible)
};

// The planned US prices (DECISIONS #69: Weekly $6.99, Yearly $59.99 with a 7-day trial, Lifetime
// $119.99). Shown only when the App Store can't be reached (Expo Go, web preview, older builds,
// offline); otherwise the store's own localized prices replace them.
export const STATIC_PLANS: Plan[] = [
  // DECISIONS #66 (owner, Nov 18): Yearly with a 7-day trial, Lifetime on the main paywall, Weekly. No monthly.
  { id: 'yearly', title: 'Yearly', priceString: '$59.99', priceMinor: 5999, currency: 'USD', period: 'year', trialDays: 7 },
  { id: 'lifetime', title: 'Lifetime', priceString: '$119.99', priceMinor: 11999, currency: 'USD', period: 'once', trialDays: 0 },
  { id: 'weekly', title: 'Weekly', priceString: '$6.99', priceMinor: 699, currency: 'USD', period: 'week', trialDays: 0 },
];

/** The parts of an expo-iap product we read (iOS). */
export type StoreProduct = {
  id: string;
  displayPrice: string;
  price?: number | null;
  currency: string;
  subscriptionOffers?: { type: string; paymentMode?: string | null; period?: { unit: string; value: number } | null; periodCount?: number | null }[] | null;
  introductoryPricePaymentModeIOS?: string | null;
  introductoryPriceNumberOfPeriodsIOS?: string | null;
  introductoryPriceSubscriptionPeriodIOS?: string | null;
  subscriptionGroupIdIOS?: string | null;
};

/** The parts of an expo-iap purchase (a StoreKit 2 transaction) we read. */
export type StorePurchase = {
  productId: string;
  purchaseState?: string;
  /** iOS: the transaction's signed JWS. */
  purchaseToken?: string | null;
  expirationDateIOS?: number | null;
  revocationDateIOS?: number | null;
};

const UNIT_DAYS: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };

/** Length of the product's introductory free trial in days (0 when it has none). Doesn't check eligibility. */
export function freeTrialDays(p: StoreProduct): number {
  const intro = p.subscriptionOffers?.find((o) => o.type === 'introductory');
  if (intro) {
    if (intro.paymentMode !== 'free-trial' || !intro.period) return 0;
    const unit = UNIT_DAYS[intro.period.unit];
    if (!unit || !(intro.period.value > 0)) return 0;
    return unit * intro.period.value * Math.max(1, intro.periodCount ?? 1);
  }
  // Older shape: the period is already normalized (7 days -> 1 week) and multiplied by the count.
  if (p.introductoryPricePaymentModeIOS === 'free-trial') {
    const unit = UNIT_DAYS[p.introductoryPriceSubscriptionPeriodIOS ?? ''];
    const n = Number(p.introductoryPriceNumberOfPeriodsIOS);
    if (unit && n > 0) return unit * n;
  }
  return 0;
}

/** The store's price in whole minor units, respecting the currency's decimals (JPY 0, USD 2). */
export function storePriceMinor(price: number, currency: string): number {
  return roundMinor(price * 10 ** currencyDigits(currency));
}

/**
 * One plan with the store's localized price. The trial only counts when Apple says this Apple Account
 * can still get the intro offer (`introEligible === true`); someone who already had it sees the real
 * charge today instead of "$0 due today". Null when the product is missing a price.
 */
export function planFromProduct(base: Plan, p: StoreProduct, introEligible: boolean | null): Plan | null {
  if (typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price < 0 || !p.currency || !p.displayPrice) return null;
  return {
    ...base,
    priceString: p.displayPrice,
    priceMinor: storePriceMinor(p.price, p.currency),
    currency: p.currency,
    trialDays: base.period !== 'once' && introEligible === true ? freeTrialDays(p) : 0,
  };
}

/**
 * All three plans from the store, or null to keep the static ones. All or nothing, so the paywall
 * never mixes the store's currency with the static US prices.
 */
export function plansFromStore(products: StoreProduct[], introEligible: boolean | null): Plan[] | null {
  const out: Plan[] = [];
  for (const base of STATIC_PLANS) {
    const p = products.find((x) => x.id === PRODUCT_IDS[base.id]);
    const plan = p ? planFromProduct(base, p, introEligible) : null;
    if (!plan) return null;
    out.push(plan);
  }
  return new Set(out.map((p) => p.currency)).size === 1 ? out : null;
}

function isActive(p: StorePurchase, nowMs: number): boolean {
  if (p.purchaseState === 'pending') return false;
  if (p.revocationDateIOS != null) return false;
  if (p.expirationDateIOS != null && p.expirationDateIOS <= nowMs) return false;
  return true;
}

const PRIORITY: PlanId[] = ['lifetime', 'yearly', 'weekly'];

/** Which Pro plan the store's current entitlements give (Lifetime wins over a subscription), or null. */
export function activePlan(purchases: StorePurchase[], nowMs: number): PlanId | null {
  const ids = new Set(purchases.filter((p) => isActive(p, nowMs)).map((p) => planIdForProduct(p.productId)));
  return PRIORITY.find((id) => ids.has(id)) ?? null;
}

/** The signed transactions (JWS) of our products, for the server's entitlement sync. */
export function entitlementJws(purchases: StorePurchase[]): string[] {
  return purchases.filter((p) => ALL_PRODUCT_IDS.includes(p.productId) && p.purchaseToken).map((p) => p.purchaseToken as string);
}

/**
 * What the app should change after asking the store, or null for nothing. Active → that plan.
 * Nothing active → Pro lapses (the app keeps every sub; reminders drop back to the free 3), except
 * a test build's "Preview Pro", which the store never knew about.
 */
export function reconcilePro(current: ProPlan | null, active: PlanId | null, opts: { preview?: boolean } = {}): { plan: PlanId | null } | null {
  if (active) return current === active ? null : { plan: active };
  if (current === null || opts.preview) return null;
  return { plan: null };
}

export type PurchaseErrorKind = 'cancelled' | 'pending' | 'error';

/** How a thrown StoreKit error should be treated: the person closed the sheet, Ask to Buy, or a real failure. */
export function purchaseErrorKind(code: unknown): PurchaseErrorKind {
  if (typeof code !== 'string') return 'error';
  const c = code
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/^e-/, '');
  if (c === 'user-cancelled' || c === 'user-canceled' || c === 'cancelled' || c === 'canceled') return 'cancelled';
  if (c === 'deferred-payment' || c === 'pending') return 'pending';
  return 'error';
}
