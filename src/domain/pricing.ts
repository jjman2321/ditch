// Paywall price lines (docs/research/pricing-regional-and-plans.md).
// Works on store prices in minor units plus a currency code, so it keeps
// working when StoreKit 2 (DECISIONS #59) hands us live, local prices.
// Current plans (DECISIONS #66): Weekly $6.99, Yearly $49.99 with a 7-day
// trial, Lifetime $99.99. Never a typed "$".

import { formatMoney } from './money';

export type StorePrice = { amountMinor: number; currency: string };

/**
 * How much cheaper yearly is than 12 months of monthly, in whole percent,
 * rounded DOWN (49.9% → 49). Null when the currencies differ or yearly
 * isn't cheaper. Never round to nearest: that would claim 50%. (No monthly
 * plan is sold now, DECISIONS #66; kept for the tests and regional pricing.)
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

/**
 * How much cheaper yearly is than 52 weeks of weekly, in whole percent, rounded DOWN.
 * $6.99/wk × 52 = $363.48 vs $49.99 → 86. Null when the currencies differ or yearly isn't cheaper.
 */
export function yearlySavingsVsWeekly(weekly: StorePrice, yearly: StorePrice): number | null {
  if (weekly.currency !== yearly.currency) return null;
  const year = weekly.amountMinor * 52;
  if (year <= 0 || yearly.amountMinor >= year) return null;
  return Math.floor(((year - yearly.amountMinor) * 100) / year);
}

/** The tab on the yearly card next to Weekly: "Save 86%", or "Best value" under 10% or across currencies. */
export function yearlyBadgeVsWeekly(weekly: StorePrice, yearly: StorePrice): string {
  const pct = yearlySavingsVsWeekly(weekly, yearly);
  return pct === null || pct < 10 ? 'Best value' : `Save ${pct}%`;
}

/** Yearly price per week, rounded to the nearest cent (owner, Nov 18): $49.99 ÷ 52 = $0.961 → "$0.96". */
export function perWeekFromYearly(yearly: StorePrice, locale = 'en-US'): string {
  return formatMoney(Math.round(yearly.amountMinor / 52), yearly.currency, { locale });
}

/** Yearly price per month, rounded UP to the currency's smallest unit: $49.99 → "$4.17". */
export function perMonthFromYearly(yearly: StorePrice, locale = 'en-US'): string {
  return formatMoney(Math.ceil(yearly.amountMinor / 12), yearly.currency, { locale });
}
