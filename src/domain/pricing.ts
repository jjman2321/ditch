// Paywall price lines (docs/research/pricing-regional-and-plans.md).
// Works on store prices in minor units plus a currency code, so it keeps
// working when RevenueCat hands us live, local prices. Never a typed "$".

import { formatMoney } from './money';

export type StorePrice = { amountMinor: number; currency: string };

/**
 * How much cheaper yearly is than 12 months of monthly, in whole percent,
 * rounded DOWN (49.9% → 49). Null when the currencies differ or yearly
 * isn't cheaper. Never use RevenueCat's relative_discount: it rounds to
 * nearest, which would claim 50%.
 */
export function yearlySavingsPercent(monthly: StorePrice, yearly: StorePrice): number | null {
  if (monthly.currency !== yearly.currency) return null;
  const twelve = monthly.amountMinor * 12;
  if (twelve <= 0 || yearly.amountMinor >= twelve) return null;
  return Math.floor(((twelve - yearly.amountMinor) * 100) / twelve);
}

/** The tab on the yearly card: "Save 49%", or "Best value" under 10% or across currencies. */
export function yearlyBadge(monthly: StorePrice, yearly: StorePrice): string {
  const pct = yearlySavingsPercent(monthly, yearly);
  return pct === null || pct < 10 ? 'Best value' : `Save ${pct}%`;
}

/** Yearly price per month, rounded UP to the currency's smallest unit: $29.99 → "$2.50". */
export function perMonthFromYearly(yearly: StorePrice, locale = 'en-US'): string {
  return formatMoney(Math.ceil(yearly.amountMinor / 12), yearly.currency, { locale });
}
