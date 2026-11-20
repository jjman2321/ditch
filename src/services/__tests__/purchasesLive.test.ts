// A build with RevenueCat (mocked): prices, trial eligibility, buy, Ask to Buy, cancel, restore and Pro checks.

import type * as PurchasesModule from '../purchases';

const NOW = Date.now();
const offering = {
  identifier: 'default',
  availablePackages: [
    { identifier: '$rc_weekly', packageType: 'WEEKLY', product: { identifier: 'app.ditchsubs.ditch.pro.weekly', priceString: '€6.99', price: 6.99, currencyCode: 'EUR', introPrice: null } },
    {
      identifier: '$rc_annual',
      packageType: 'ANNUAL',
      product: {
        identifier: 'app.ditchsubs.ditch.pro.yearly',
        priceString: '€59.99',
        price: 59.99,
        currencyCode: 'EUR',
        introPrice: { price: 0, periodUnit: 'WEEK', periodNumberOfUnits: 1, cycles: 1 },
      },
    },
    { identifier: '$rc_lifetime', packageType: 'LIFETIME', product: { identifier: 'app.ditchsubs.ditch.pro.lifetime', priceString: '€119.99', price: 119.99, currencyCode: 'EUR', introPrice: null } },
  ],
};
const info = (pro?: Record<string, unknown>) => ({ entitlements: { active: pro ? { pro: { isActive: true, periodType: 'NORMAL', expirationDateMillis: NOW + 86_400_000, ...pro } } : {} } });

const mockSdk = {
  configure: jest.fn(),
  addCustomerInfoUpdateListener: jest.fn(),
  getOfferings: jest.fn(async () => ({ all: { default: offering }, current: offering })),
  checkTrialOrIntroductoryPriceEligibility: jest.fn(async (): Promise<Record<string, { status: number }>> => ({ 'app.ditchsubs.ditch.pro.yearly': { status: 2 } })),
  getCustomerInfo: jest.fn(async () => info()),
  purchasePackage: jest.fn(async (): Promise<unknown> => ({ customerInfo: info({ productIdentifier: 'app.ditchsubs.ditch.pro.yearly' }) })),
  restorePurchases: jest.fn(async (): Promise<unknown> => info()),
};
jest.mock('react-native-purchases', () => ({ __esModule: true, default: mockSdk }));
jest.mock('@/services/bank', () => ({ getAppUserId: async () => 'abc-random-id' }));

function load(): typeof PurchasesModule {
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY = 'appl_test_public_key';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native').NativeModules.RNPurchases = {};
  let mod!: typeof PurchasesModule;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('../purchases');
  });
  return mod;
}

afterEach(() => {
  delete process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  delete require('react-native').NativeModules.RNPurchases;
});

describe('purchases with RevenueCat', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is live, and sets RevenueCat up with our random id and no ad identifiers', async () => {
    const p = load();
    expect(p.PURCHASES_LIVE).toBe(true);
    await p.refreshPlans();
    expect(mockSdk.configure).toHaveBeenCalledWith({ apiKey: 'appl_test_public_key', appUserID: 'abc-random-id', automaticDeviceIdentifierCollectionEnabled: false, diagnosticsEnabled: false });
    expect(mockSdk.configure).toHaveBeenCalledTimes(1);
  });

  it('shows the store’s prices, with the free week only when eligible', async () => {
    const p = load();
    await p.refreshPlans();
    expect([p.billedLabel(p.planById('weekly')), p.billedLabel(p.planById('yearly')), p.planById('lifetime').priceString]).toEqual(['€6.99/wk', '€59.99/yr', '€119.99']);
    expect(p.planById('yearly').trialDays).toBe(7);

    mockSdk.checkTrialOrIntroductoryPriceEligibility.mockResolvedValueOnce({ 'app.ditchsubs.ditch.pro.yearly': { status: 1 } });
    await p.refreshPlans();
    expect(p.planById('yearly').trialDays).toBe(0);

    mockSdk.checkTrialOrIntroductoryPriceEligibility.mockRejectedValueOnce(new Error('offline'));
    await p.refreshPlans();
    expect(p.planById('yearly').trialDays).toBe(0);
  });

  it('keeps the static plans when the store can’t be reached', async () => {
    mockSdk.getOfferings.mockRejectedValueOnce(new Error('offline'));
    const p = load();
    await p.refreshPlans();
    expect([p.planById('yearly').priceString, p.planById('yearly').trialDays]).toEqual(['$59.99', 7]);
  });

  it('buys the right package and tells the app to check Pro', async () => {
    const p = load();
    const changed = jest.fn();
    p.onEntitlementChange(changed);
    await expect(p.purchase('yearly')).resolves.toEqual({ status: 'purchased' });
    expect((mockSdk.purchasePackage.mock.calls[0] as unknown[])[0]).toMatchObject({ identifier: '$rc_annual' });
    expect(changed).toHaveBeenCalled();
  });

  it('cancel and Ask to Buy are not errors; anything else throws', async () => {
    const p = load();
    mockSdk.purchasePackage.mockRejectedValueOnce({ code: '1', userCancelled: true });
    await expect(p.purchase('weekly')).resolves.toEqual({ status: 'cancelled' });
    mockSdk.purchasePackage.mockRejectedValueOnce({ code: '20', userCancelled: false });
    await expect(p.purchase('weekly')).resolves.toEqual({ status: 'pending' });
    mockSdk.purchasePackage.mockRejectedValueOnce({ code: '10', userCancelled: false });
    await expect(p.purchase('weekly')).rejects.toMatchObject({ code: '10' });
  });

  it('restores: Pro found, nothing found, sign-in closed, store down', async () => {
    const p = load();
    mockSdk.restorePurchases.mockResolvedValueOnce(info({ productIdentifier: 'app.ditchsubs.ditch.pro.lifetime', expirationDateMillis: null }));
    await expect(p.restorePurchases()).resolves.toEqual({ restored: true, plan: 'lifetime' });
    await expect(p.restorePurchases()).resolves.toEqual({ restored: false });
    mockSdk.restorePurchases.mockRejectedValueOnce({ code: '1', userCancelled: true });
    await expect(p.restorePurchases()).resolves.toEqual({ restored: false });
    mockSdk.restorePurchases.mockRejectedValueOnce({ code: '10' });
    await expect(p.restorePurchases()).rejects.toMatchObject({ code: '10' });
  });

  it('reads Pro (and a running trial) from the "pro" entitlement', async () => {
    const p = load();
    await expect(p.currentEntitlement()).resolves.toEqual({ plan: null, trialEndsOn: null });
    const ends = new Date(2026, 10, 27, 10).getTime();
    mockSdk.getCustomerInfo.mockResolvedValueOnce(info({ productIdentifier: 'app.ditchsubs.ditch.pro.yearly', periodType: 'TRIAL', expirationDateMillis: ends }));
    await expect(p.currentEntitlement()).resolves.toEqual({ plan: 'yearly', trialEndsOn: '2026-11-27' });
    mockSdk.getCustomerInfo.mockRejectedValueOnce(new Error('offline'));
    await expect(p.currentEntitlement()).resolves.toBeNull();
  });

  it('a store update (renewal, grace period ended, Ask to Buy approved) tells the app to check Pro', async () => {
    const p = load();
    const changed = jest.fn();
    p.onEntitlementChange(changed);
    await p.refreshPlans();
    const listener = (mockSdk.addCustomerInfoUpdateListener.mock.calls[0] as unknown[])[0] as () => void;
    listener();
    expect(changed).toHaveBeenCalledTimes(1);
  });
});

describe('no key', () => {
  it('stays off without the public SDK key, even with the native module', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native').NativeModules.RNPurchases = {};
    let mod!: typeof PurchasesModule;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('../purchases');
    });
    expect(mod.PURCHASES_LIVE).toBe(false);
  });
});
