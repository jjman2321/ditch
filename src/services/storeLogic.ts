// The pure half of purchases (no native code, so Jest and the web preview can load it):
// the static plans, turning RevenueCat's offering into plans, trial eligibility, and which plan
// the "pro" entitlement gives. src/services/purchases.ts does the RevenueCat calls.

import { PACKAGE_IDS, PACKAGE_TYPES, planIdForProduct } from '@/config/products';
import { toDateOnly, type DateOnly } from '@/domain/dates';
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

/** The parts of a RevenueCat store product we read (PurchasesStoreProduct). */
export type StoreProduct = {
  identifier: string;
  priceString: string;
  price: number;
  currencyCode: string;
  introPrice?: { price: number; periodUnit: string; periodNumberOfUnits: number; cycles: number } | null;
};

/** The parts of a RevenueCat package we read (PurchasesPackage). */
export type StorePackage = { identifier: string; packageType?: string; product: StoreProduct };

/** The parts of RevenueCat's "pro" entitlement we read (PurchasesEntitlementInfo). */
export type StoreEntitlement = {
  isActive: boolean;
  productIdentifier: string;
  periodType?: string;
  expirationDateMillis?: number | null;
};

const UNIT_DAYS: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };

/** Length of the product's introductory free trial in days (0 when it has none, or it's a paid intro price). Doesn't check eligibility. */
export function freeTrialDays(p: StoreProduct): number {
  const intro = p.introPrice;
  if (!intro || intro.price !== 0) return 0;
  const unit = UNIT_DAYS[intro.periodUnit?.toUpperCase()];
  if (!unit || !(intro.periodNumberOfUnits > 0)) return 0;
  return unit * intro.periodNumberOfUnits * Math.max(1, intro.cycles || 1);
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
  if (typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price < 0 || !p.currencyCode || !p.priceString) return null;
  return {
    ...base,
    priceString: p.priceString,
    priceMinor: storePriceMinor(p.price, p.currencyCode),
    currency: p.currencyCode,
    trialDays: base.period !== 'once' && introEligible === true ? freeTrialDays(p) : 0,
  };
}

/** The offering's package for a plan: RevenueCat's standard identifier ($rc_annual...), else its package type. */
export function packageFor(packages: StorePackage[], id: PlanId): StorePackage | null {
  return packages.find((p) => p.identifier === PACKAGE_IDS[id]) ?? packages.find((p) => p.packageType === PACKAGE_TYPES[id]) ?? null;
}

/**
 * All three plans from the offering, or null to keep the static ones. All or nothing, so the paywall
 * never mixes the store's currency with the static US prices.
 */
export function plansFromStore(packages: StorePackage[], introEligible: boolean | null): Plan[] | null {
  const out: Plan[] = [];
  for (const base of STATIC_PLANS) {
    const pkg = packageFor(packages, base.id);
    const plan = pkg ? planFromProduct(base, pkg.product, introEligible) : null;
    if (!plan) return null;
    out.push(plan);
  }
  return new Set(out.map((p) => p.currency)).size === 1 ? out : null;
}

/** RevenueCat's intro eligibility status: only ELIGIBLE (2) counts. UNKNOWN (0) and INELIGIBLE (1) don't. */
export function isIntroEligible(status: unknown): boolean {
  return status === 2;
}

/**
 * Which Pro plan the "pro" entitlement gives, or null when it isn't active. RevenueCat keeps it
 * active through Apple's billing grace period. A product we don't know (e.g. Pro granted in the
 * RevenueCat dashboard) counts as Lifetime when it never expires, else as Yearly.
 */
export function planFromEntitlement(e: StoreEntitlement | null | undefined): PlanId | null {
  if (!e || !e.isActive) return null;
  return planIdForProduct(e.productIdentifier) ?? (e.expirationDateMillis == null ? 'lifetime' : 'yearly');
}

/** The day a running free trial ends (date-only, local), so a restore can bring back the "Ditch Pro trial" entry. */
export function trialEndFromEntitlement(e: StoreEntitlement | null | undefined): DateOnly | null {
  if (!e || !e.isActive || e.periodType !== 'TRIAL' || e.expirationDateMillis == null) return null;
  return toDateOnly(new Date(e.expirationDateMillis));
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

/**
 * How a RevenueCat error should be treated: the person closed Apple's sheet (PURCHASE_CANCELLED_ERROR, "1"),
 * Ask to Buy is waiting for a parent (PAYMENT_PENDING_ERROR, "20"), or a real failure.
 */
export function purchaseErrorKind(e: unknown): PurchaseErrorKind {
  if (typeof e !== 'object' || e === null) return 'error';
  const { code, userCancelled } = e as { code?: unknown; userCancelled?: unknown };
  if (userCancelled === true || code === '1' || code === 1) return 'cancelled';
  if (code === '20' || code === 20) return 'pending';
  return 'error';
}
