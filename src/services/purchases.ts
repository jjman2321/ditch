// Purchases adapter. Milestone 2 swaps this for RevenueCat, which reads
// real localized prices from the App Store. Until then these are the
// planned US prices, used only to lay out the paywall. Display code must
// use priceString (the store's own text) and the minor-unit amounts, never
// a typed "$".

export type PlanId = 'yearly' | 'monthly' | 'lifetime';

export type Plan = {
  id: PlanId;
  title: string;
  priceString: string; // what the store says, e.g. "$29.99"
  priceMinor: number;
  currency: string;
  period: 'year' | 'month' | 'once';
  trialDays: number; // 0 = no trial (or not eligible)
};

export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Yearly', priceString: '$29.99', priceMinor: 2999, currency: 'USD', period: 'year', trialDays: 7 },
  { id: 'monthly', title: 'Monthly', priceString: '$4.99', priceMinor: 499, currency: 'USD', period: 'month', trialDays: 0 },
  { id: 'lifetime', title: 'Lifetime', priceString: '$49.99', priceMinor: 4999, currency: 'USD', period: 'once', trialDays: 0 },
];

export const PURCHASES_LIVE = false;

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!;
}

/** "$29.99/yr", "$4.99/mo", "$49.99". */
export function billedLabel(plan: Plan): string {
  return plan.priceString + (plan.period === 'year' ? '/yr' : plan.period === 'month' ? '/mo' : '');
}

export type PurchaseResult = { status: 'purchased' | 'cancelled' | 'unavailable' };

/** Stub until RevenueCat: nothing is ever charged. */
export async function purchase(_plan: PlanId): Promise<PurchaseResult> {
  return { status: PURCHASES_LIVE ? 'cancelled' : 'unavailable' };
}

export async function restorePurchases(): Promise<{ restored: boolean }> {
  return { restored: false };
}
