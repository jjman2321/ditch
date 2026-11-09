// Purchases adapter. Milestone 2 swaps this for RevenueCat, which reads
// real localized prices from the App Store. Until then these are the
// planned US prices, used only to lay out the paywall.

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
