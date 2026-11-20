// Purchases through Apple's StoreKit 2, straight from the phone (DECISIONS #59: no RevenueCat, no
// third-party payment SDK). Library: expo-iap. Product IDs: src/config/products.ts.
//
// The StoreKit module is native code that older TestFlight builds don't have. A top-level import
// crashed TestFlight on Nov 19 (src/services/bank.ts), so expo-iap is loaded only when this build has
// its native module ('ExpoIap'). Without it (Expo Go, the web preview, Jest, older builds) everything
// here behaves like before: the static prices below, PURCHASES_LIVE false, nothing is ever charged.
//
// Display code must use priceString (the store's own text) and the minor-unit amounts, never a typed "$".

// `import type` is erased from the bundle, so it never loads the native module.
import type { Purchase } from 'expo-iap';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import { ALL_PRODUCT_IDS, PRODUCT_IDS } from '@/config/products';
import { BANK_LIVE, getAppUserId, syncEntitlements } from '@/services/bank';

import { STATIC_PLANS, activePlan, entitlementJws, plansFromStore, purchaseErrorKind, type Plan, type PlanId } from './storeLogic';

export type { Plan, PlanId } from './storeLogic';

/** The static plans (planned US prices). Use planById / usePlans for what to show. */
export const PLANS: Plan[] = STATIC_PLANS;

/** True when this build can really buy (iPhone build with the StoreKit module). */
export const PURCHASES_LIVE = Platform.OS === 'ios' && requireOptionalNativeModule('ExpoIap') !== null;

type Iap = typeof import('expo-iap');
let iap: Iap | null | undefined;
function loadIap(): Iap | null {
  if (iap !== undefined) return iap;
  if (!PURCHASES_LIVE) return (iap = null);
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    iap = require('expo-iap') as Iap;
  } catch {
    iap = null;
  }
  return iap;
}

// ---------- prices and trial (static until the store answers) ----------

let live: Plan[] | null = null;
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
 * `refresh` asks the store again on mount (the paywall: eligibility can change, e.g. a trial used on another device).
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

/** Reads the store's localized prices and whether this Apple Account can still get the free trial. Never throws. */
export function refreshPlans(): Promise<void> {
  const m = loadIap();
  if (!m) return Promise.resolve();
  loadingPlans ??= (async () => {
    try {
      await connect(m);
      const products = (await m.fetchProducts({ skus: ALL_PRODUCT_IDS, type: 'all' })) ?? [];
      const yearly = products.find((p) => p.id === PRODUCT_IDS.yearly);
      const group = yearly && 'subscriptionGroupIdIOS' in yearly ? yearly.subscriptionGroupIdIOS : null;
      // Unknown eligibility counts as "not eligible": better a surprise free week than a "$0 due today" that isn't.
      const eligible = group ? await m.isEligibleForIntroOfferIOS(group).catch(() => null) : null;
      const next = plansFromStore(products, eligible);
      if (next && !buying) {
        live = next;
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

// ---------- connection, updates and entitlements ----------

let connected: Promise<void> | null = null;
function connect(m: Iap): Promise<void> {
  connected ??= m.initConnection().then(
    () => {
      // Renewals, Ask to Buy approvals, purchases from another device and unfinished transactions all
      // arrive here: finish them and tell the app to check Pro again.
      m.purchaseUpdatedListener((p) => void onStoreUpdate(m, p));
    },
    (e) => {
      connected = null;
      throw e;
    },
  );
  return connected;
}

async function onStoreUpdate(m: Iap, p: Purchase) {
  if (!ALL_PRODUCT_IDS.includes(p.productId) || p.purchaseState === 'pending') return;
  await m.finishTransaction({ purchase: p, isConsumable: false }).catch(() => {});
  changed();
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
  void syncWithServer();
}

/** Bank sync's server keeps its own copy of who has Pro (DECISIONS #67). Fire and forget, never blocks the UI. */
async function syncWithServer() {
  const m = loadIap();
  if (!m || !BANK_LIVE) return;
  try {
    const purchases = await m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
    // StoreKit's renewal info isn't handed over as signed JWS by expo-iap; the server reads renewals from Apple's notifications.
    await syncEntitlements(entitlementJws(purchases), []);
  } catch {
    // Next launch tries again.
  }
}

/** On app start: connect, load prices and eligibility, and pick up anything bought while the app was closed. */
export function startPurchases(): void {
  const m = loadIap();
  if (!m) return;
  connect(m)
    .then(() => refreshPlans())
    .then(() => syncWithServer())
    .catch(() => {});
}

export type Entitlement = { plan: PlanId | null };

/**
 * Which plan the store says is active right now (StoreKit's current entitlements), for launch and
 * foreground checks. Null when it can't tell (no StoreKit in this build, store unreachable, or a
 * purchase happened meanwhile), and then nothing should change.
 */
export async function currentEntitlement(): Promise<Entitlement | null> {
  const m = loadIap();
  if (!m || buying) return null;
  const before = changes;
  try {
    await connect(m);
    const purchases = await m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
    // A purchase or restore finished while we asked: this answer may be from before it.
    if (buying || changes !== before) return null;
    return { plan: activePlan(purchases, Date.now()) };
  } catch {
    return null;
  }
}

// ---------- buy and restore ----------

export type PurchaseResult = { status: 'purchased' | 'cancelled' | 'pending' | 'unavailable' };

const errorCode = (e: unknown) => (typeof e === 'object' && e !== null ? (e as { code?: unknown }).code : undefined);

/**
 * Opens Apple's purchase sheet. `purchased` once Apple confirms (the transaction is finished here),
 * `cancelled` if they closed it, `pending` for Ask to Buy (Pro switches on when it's approved, via
 * onEntitlementChange). Anything else throws, so the paywall says it couldn't reach the App Store.
 */
export async function purchase(planId: PlanId): Promise<PurchaseResult> {
  const m = loadIap();
  if (!m) return { status: 'unavailable' };
  buying++;
  try {
    await connect(m);
    const sku = PRODUCT_IDS[planId];
    // The random app user id (no accounts) lets Apple's server notifications find this phone. Optional.
    const appAccountToken = await getAppUserId().catch(() => null);
    const apple = appAccountToken ? { sku, appAccountToken } : { sku };
    let result: Awaited<ReturnType<Iap['requestPurchase']>>;
    try {
      result = planId === 'lifetime' ? await m.requestPurchase({ type: 'in-app', request: { apple } }) : await m.requestPurchase({ type: 'subs', request: { apple } });
    } catch (e) {
      const kind = purchaseErrorKind(errorCode(e));
      if (kind === 'error') throw e;
      return { status: kind };
    }
    const list: Purchase[] = Array.isArray(result) ? result : result ? [result] : [];
    const bought = list.find((p) => p.productId === sku);
    if (!bought) {
      // Nothing came back: believe only what the store now says we own.
      const owned = await m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
      if (activePlan(owned.filter((p) => p.productId === sku), Date.now()) !== planId) return { status: 'cancelled' };
    } else {
      if (bought.purchaseState === 'pending') return { status: 'pending' };
      await m.finishTransaction({ purchase: bought, isConsumable: false }).catch(() => {});
    }
    changed();
    return { status: 'purchased' };
  } finally {
    buying--;
  }
}

/**
 * Restore: asks Apple to sync this Apple Account's purchases (it may ask them to sign in), then reads
 * the current entitlements. `restored` is true when Ditch Pro is active, and `plan` says which.
 * Throws only when the store couldn't be reached and nothing was found.
 */
export async function restorePurchases(): Promise<{ restored: boolean; plan?: PlanId }> {
  const m = loadIap();
  if (!m) return { restored: false };
  await connect(m);
  let syncError: unknown = null;
  try {
    await m.syncIOS();
  } catch (e) {
    // Closing Apple's sign-in also lands here. What's already on the phone may still be enough.
    syncError = e;
  }
  const purchases = await m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
  const plan = activePlan(purchases, Date.now());
  if (!plan) {
    if (syncError && purchaseErrorKind(errorCode(syncError)) === 'error') throw syncError;
    return { restored: false };
  }
  changed();
  return { restored: true, plan };
}
