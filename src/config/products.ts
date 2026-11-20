// App Store product IDs (DECISIONS #66, #69). The one place they live: the paywall, purchases and
// restore all read them from here. They must match App Store Connect exactly
// (docs/plans/storekit-setup.md) and the server's APPLE_PRODUCT_* secrets (docs/plans/bank-sync-build.md).
//
// Subscription group "Ditch Pro": Yearly (1 year, 7-day free trial intro offer) and Weekly (1 week, no trial).
// Lifetime is a non-consumable (pay once).

import type { PlanId } from '@/services/storeLogic';

export const SUBSCRIPTION_GROUP = 'Ditch Pro';

export const PRODUCT_IDS: Record<PlanId, string> = {
  yearly: 'app.ditchsubs.ditch.pro.yearly',
  weekly: 'app.ditchsubs.ditch.pro.weekly',
  lifetime: 'app.ditchsubs.ditch.pro.lifetime',
};

export const ALL_PRODUCT_IDS: string[] = Object.values(PRODUCT_IDS);

/** Which plan an App Store product ID is, or null for anything that isn't Ditch Pro. */
export function planIdForProduct(productId: string | null | undefined): PlanId | null {
  if (!productId) return null;
  for (const id of Object.keys(PRODUCT_IDS) as PlanId[]) if (PRODUCT_IDS[id] === productId) return id;
  return null;
}
