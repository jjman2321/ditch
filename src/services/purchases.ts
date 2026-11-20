// Purchases through RevenueCat (react-native-purchases; owner, Nov 20, DECISIONS #79, replaces #59).
// Apple takes the payment; RevenueCat checks the receipt and keeps track of renewals, the billing grace
// period, Ask to Buy and restores, and tells us whether the "pro" entitlement is on. Our own paywall,
// not RevenueCat's paywall UI. IDs: src/config/products.ts. Setup: docs/plans/revenuecat-setup.md.
//
// The SDK is native code that older TestFlight builds don't have. A top-level import crashed TestFlight
// on Nov 19 (src/services/bank.ts), so it's loaded only when this build has its native module (RNPurchases)
// and the public SDK key is set. Without them (Expo Go, the web preview, Jest, older builds) everything
// here behaves like before: the static prices below, PURCHASES_LIVE false, nothing is ever charged.
//
// Display code must use priceString (the store's own text) and the minor-unit amounts, never a typed "$".

import { useEffect, useSyncExternalStore } from 'react';
import { NativeModules, Platform } from 'react-native';
// `import type` is erased from the bundle, so it never loads the native module.
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import { ENTITLEMENT_ID, OFFERING_ID, PRODUCT_IDS } from '@/config/products';
import type { DateOnly } from '@/domain/dates';
import { getAppUserId } from '@/services/bank';

import { STATIC_PLANS, isIntroEligible, packageFor, planFromEntitlement, plansFromStore, purchaseErrorKind, trialEndFromEntitlement, type Plan, type PlanId } from './storeLogic';

export type { Plan, PlanId } from './storeLogic';

/** The static plans (planned US prices). Use planById / usePlans for what to show. */
export const PLANS: Plan[] = STATIC_PLANS;

/** RevenueCat's public iOS SDK key ("appl_..."). Public by design; set in EAS, never typed here. */
const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';

/**
 * Whether this build has RevenueCat's native module. The SDK itself reads `NativeModules.RNPurchases`
 * (a classic React Native module, also reachable that way on the New Architecture), so that's the check
 * that matters: TurboModuleRegistry could find it where the SDK still couldn't.
 */
function hasNativeModule(): boolean {
  try {
    return !!NativeModules.RNPurchases;
  } catch {
    return false;
  }
}

/** True when this build can really buy (an iPhone build with RevenueCat's native module and its key). */
export const PURCHASES_LIVE = Platform.OS === 'ios' && API_KEY !== '' && hasNativeModule();

type Sdk = typeof import('react-native-purchases').default;
let sdk: Sdk | null | undefined;
function loadSdk(): Sdk | null {
  if (sdk !== undefined) return sdk;
  if (!PURCHASES_LIVE) return (sdk = null);
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sdk = (require('react-native-purchases') as typeof import('react-native-purchases')).default;
  } catch {
    sdk = null;
  }
  return sdk;
}

// ---------- prices and trial (static until the store answers) ----------

let live: Plan[] | null = null;
let packages: PurchasesPackage[] = [];
const planListeners = new Set<() => void>();
const currentPlans = () => live ?? STATIC_PLANS;

export function planById(id: PlanId): Plan {
  return currentPlans().find((p) => p.id === id)!;
}

/** "$59.99/yr", "$6.99/wk", "$119.99". */
export function billedLabel(plan: Plan): string {
  return plan.priceString + (plan.period === 'year' ? '/yr' : plan.period === 'week' ? '/wk' : '');
}

function subscribePlans(fn: () => void): () => void {
  planListeners.add(fn);
  return () => planListeners.delete(fn);
}

/**
 * The plans to show, re-rendering when the store's prices or the trial eligibility arrive.
 * `refresh` asks again on mount (the paywall: eligibility can change, e.g. a trial used on another device).
 */
export function usePlans({ refresh = false }: { refresh?: boolean } = {}): Plan[] {
  useEffect(() => {
    if (refresh) void refreshPlans();
  }, [refresh]);
  return useSyncExternalStore(subscribePlans, currentPlans, currentPlans);
}

/** While a purchase is open, prices and eligibility stay as they were shown (the trial line must match what was bought). */
let buying = 0;
let loadingPlans: Promise<void> | null = null;

/** Reads the offering's localized prices and whether this Apple Account can still get the free trial. Never throws. */
export function refreshPlans(): Promise<void> {
  const P = loadSdk();
  if (!P) return Promise.resolve();
  loadingPlans ??= (async () => {
    try {
      await ready(P);
      const offerings = await P.getOfferings();
      const offering = offerings.all[OFFERING_ID] ?? offerings.current;
      const pkgs = offering?.availablePackages ?? [];
      const yearlyId = packageFor(pkgs, 'yearly')?.product.identifier;
      // Only ELIGIBLE counts: better a surprise free week than a "$0 due today" that isn't true.
      const eligible = yearlyId
        ? await P.checkTrialOrIntroductoryPriceEligibility([yearlyId]).then(
            (r) => isIntroEligible(r[yearlyId]?.status),
            () => null,
          )
        : null;
      const next = plansFromStore(pkgs, eligible);
      if (next && !buying) {
        live = next;
        packages = pkgs;
        planListeners.forEach((l) => l());
      }
    } catch {
      // Store unreachable: keep what's shown.
    } finally {
      loadingPlans = null;
    }
  })();
  return loadingPlans;
}

// ---------- setup and Pro updates ----------

let configured: Promise<void> | null = null;
/**
 * Sets RevenueCat up once. The app user id is our own random id (no accounts, nothing about the person),
 * or RevenueCat's anonymous one when this build can't make it. No ad ids, no attribution, no diagnostics.
 */
function ready(P: Sdk): Promise<void> {
  configured ??= (async () => {
    const appUserID = await getAppUserId().catch(() => null);
    P.configure({ apiKey: API_KEY, appUserID, automaticDeviceIdentifierCollectionEnabled: false, diagnosticsEnabled: false });
    // Renewals, the end of a trial or grace period, Ask to Buy approvals and purchases from another
    // device all arrive here: tell the app to check Pro again.
    P.addCustomerInfoUpdateListener(() => changed());
  })().catch((e) => {
    configured = null;
    throw e;
  });
  return configured;
}

const changeListeners = new Set<() => void>();
/** A purchase, restore or store update may have changed Pro. The app checks currentEntitlement() again. */
export function onEntitlementChange(fn: () => void): () => void {
  changeListeners.add(fn);
  return () => changeListeners.delete(fn);
}
let changes = 0;
function changed() {
  changes++;
  changeListeners.forEach((l) => l());
  // Bank sync's server asks RevenueCat itself (same app user id), on every bank call and hourly.
}

/** On app start: set up RevenueCat and load prices and eligibility. */
let started = false;
export function startPurchases(): void {
  const P = loadSdk();
  if (!P || started) return;
  started = true;
  ready(P)
    .then(() => refreshPlans())
    .catch(() => {
      started = false;
    });
}

export type Entitlement = {
  plan: PlanId | null;
  /** A free trial is running and ends on this day (to bring back the "Ditch Pro trial" entry after a restore). */
  trialEndsOn: DateOnly | null;
};

function entitlementOf(info: CustomerInfo): Entitlement {
  const e = info.entitlements.active[ENTITLEMENT_ID];
  return { plan: planFromEntitlement(e), trialEndsOn: trialEndFromEntitlement(e) };
}

/**
 * Which plan RevenueCat says is active right now, for launch and foreground checks. Null when it can't
 * tell (no RevenueCat in this build, store unreachable, or a purchase happened meanwhile), and then
 * nothing should change.
 */
export async function currentEntitlement(): Promise<Entitlement | null> {
  const P = loadSdk();
  if (!P || buying) return null;
  const before = changes;
  try {
    await ready(P);
    const info = await P.getCustomerInfo();
    // A purchase or restore finished while we asked: this answer may be from before it.
    if (buying || changes !== before) return null;
    return entitlementOf(info);
  } catch {
    return null;
  }
}

// ---------- buy and restore ----------

export type PurchaseResult = { status: 'purchased' | 'cancelled' | 'pending' | 'unavailable' };

async function packageForPlan(P: Sdk, planId: PlanId): Promise<PurchasesPackage> {
  let pkg = packageFor(packages, planId) as PurchasesPackage | null;
  if (!pkg) {
    const offerings = await P.getOfferings();
    pkg = packageFor((offerings.all[OFFERING_ID] ?? offerings.current)?.availablePackages ?? [], planId) as PurchasesPackage | null;
  }
  if (!pkg) throw new Error(`No ${planId} package in the "${OFFERING_ID}" offering (${PRODUCT_IDS[planId]})`);
  return pkg;
}

/**
 * Opens Apple's purchase sheet. `purchased` once Apple and RevenueCat confirm, `cancelled` if they closed
 * it, `pending` for Ask to Buy (Pro switches on when it's approved, via onEntitlementChange). Anything
 * else throws, so the paywall says it couldn't reach the App Store.
 */
export async function purchase(planId: PlanId): Promise<PurchaseResult> {
  const P = loadSdk();
  if (!P) return { status: 'unavailable' };
  buying++;
  let done = false;
  try {
    await ready(P);
    const pkg = await packageForPlan(P, planId);
    try {
      await P.purchasePackage(pkg);
    } catch (e) {
      const kind = purchaseErrorKind(e);
      if (kind === 'error') throw e;
      return { status: kind };
    }
    done = true;
    return { status: 'purchased' };
  } finally {
    buying--;
    // After `buying` drops, so the app's check of Pro right after sees the new purchase.
    if (done) changed();
  }
}

/**
 * Restore: RevenueCat asks Apple for this Apple Account's purchases (it may ask them to sign in).
 * `restored` is true when Ditch Pro is active, and `plan` says which. Throws when the store couldn't be reached.
 */
export async function restorePurchases(): Promise<{ restored: boolean; plan?: PlanId }> {
  const P = loadSdk();
  if (!P) return { restored: false };
  await ready(P);
  let info: CustomerInfo;
  try {
    info = await P.restorePurchases();
  } catch (e) {
    // Closing Apple's sign-in isn't a failure: there's just nothing restored.
    if (purchaseErrorKind(e) === 'cancelled') return { restored: false };
    throw e;
  }
  const { plan } = entitlementOf(info);
  if (!plan) return { restored: false };
  changed();
  return { restored: true, plan };
}
