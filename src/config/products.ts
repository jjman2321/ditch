// In-app purchase IDs (DECISIONS #66, #69). The one place they live: the paywall, purchases and
// restore all read them from here. Purchases go through RevenueCat (owner, Nov 20), which reads
// these from App Store Connect. They must match App Store Connect and the RevenueCat dashboard
// exactly (docs/plans/revenuecat-setup.md).
//
// App Store subscription group "Ditch Pro": Yearly (1 year, 7-day free trial intro offer) and Weekly
// (1 week, no trial). Lifetime is a non-consumable (pay once).

import type { PlanId } from '@/services/storeLogic';

export const SUBSCRIPTION_GROUP = 'Ditch Pro';

/** App Store product IDs. */
export const PRODUCT_IDS: Record<PlanId, string> = {
  yearly: 'app.ditchsubs.ditch.pro.yearly',
  weekly: 'app.ditchsubs.ditch.pro.weekly',
  lifetime: 'app.ditchsubs.ditch.pro.lifetime',
};

export const ALL_PRODUCT_IDS: string[] = Object.values(PRODUCT_IDS);

/** RevenueCat: the entitlement all three products unlock. */
export const ENTITLEMENT_ID = 'pro';
/** RevenueCat: the offering the paywall shows. */
export const OFFERING_ID = 'default';
/** RevenueCat: package identifiers in that offering (its standard ones), and their package types as a fallback. */
export const PACKAGE_IDS: Record<PlanId, string> = { yearly: '$rc_annual', weekly: '$rc_weekly', lifetime: '$rc_lifetime' };
export const PACKAGE_TYPES: Record<PlanId, string> = { yearly: 'ANNUAL', weekly: 'WEEKLY', lifetime: 'LIFETIME' };

/** Which plan an App Store product ID is, or null for anything that isn't Ditch Pro. */
export function planIdForProduct(productId: string | null | undefined): PlanId | null {
  if (!productId) return null;
  for (const id of Object.keys(PRODUCT_IDS) as PlanId[]) if (PRODUCT_IDS[id] === productId) return id;
  return null;
}
