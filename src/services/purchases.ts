// Purchases adapter. Milestone 2 swaps this for RevenueCat, which reads
// real localized prices from the App Store. Until then these are the
// planned US prices, used only to lay out the paywall. Display code must
// use priceString (the store's own text) and the minor-unit amounts, never
// a typed "$".

export type PlanId = 'yearly' | 'weekly' | 'lifetime';

export type Plan = {
  id: PlanId;
  title: string;
  priceString: string; // what the store says, e.g. "$29.99"
  priceMinor: number;
  currency: string;
  period: 'year' | 'week' | 'once';
  trialDays: number; // 0 = no trial (or not eligible)
};

export const PLANS: Plan[] = [
// DECISIONS #66 (owner, Nov 18): Yearly with a 7-day trial, Lifetime on the main paywall, Weekly. No monthly.
  { id: 'yearly', title: 'Yearly', priceString: '$49.99', priceMinor: 4999, currency: 'USD', period: 'year', trialDays: 7 },
  { id: 'lifetime', title: 'Lifetime', priceString: '$99.99', priceMinor: 9999, currency: 'USD', period: 'once', trialDays: 0 },
  { id: 'weekly', title: 'Weekly', priceString: '$6.99', priceMinor: 699, currency: 'USD', period: 'week', trialDays: 0 },
];

export const PURCHASES_LIVE = false;

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!;
}

/** "$49.99/yr", "$6.99/wk", "$99.99". */
export function billedLabel(plan: Plan): string {
  return plan.priceString + (plan.period === 'year' ? '/yr' : plan.period === 'week' ? '/wk' : '');
}

export type PurchaseResult = { status: 'purchased' | 'cancelled' | 'unavailable' };

/** Stub until RevenueCat: nothing is ever charged. */
export async function purchase(_plan: PlanId): Promise<PurchaseResult> {
  return { status: PURCHASES_LIVE ? 'cancelled' : 'unavailable' };
}

export async function restorePurchases(): Promise<{ restored: boolean }> {
  return { restored: false };
}
