// Jest has no RevenueCat native module (and no key), like Expo Go, the web preview and TestFlight builds
// made before it: everything must behave exactly like before (static prices, nothing charged, no crash).

import { PLANS, PURCHASES_LIVE, billedLabel, currentEntitlement, planById, purchase, restorePurchases, startPurchases } from '../purchases';

// Loading the SDK here would be the Nov 19 TestFlight crash: fail loudly if anything requires it.
jest.mock('react-native-purchases', () => {
  throw new Error('react-native-purchases must not load without its native module');
});

describe('purchases without RevenueCat', () => {
  it('is not live and never loads react-native-purchases', () => {
    expect(PURCHASES_LIVE).toBe(false);
    expect(() => startPurchases()).not.toThrow();
  });

  it('shows the static plans (DECISIONS #69)', () => {
    expect(planById('yearly')).toBe(PLANS.find((p) => p.id === 'yearly'));
    expect([billedLabel(planById('weekly')), billedLabel(planById('yearly')), billedLabel(planById('lifetime'))]).toEqual(['$6.99/wk', '$59.99/yr', '$119.99']);
    expect(planById('yearly').trialDays).toBe(7);
  });

  it('never charges, restores nothing and never changes Pro', async () => {
    await expect(purchase('yearly')).resolves.toEqual({ status: 'unavailable' });
    await expect(restorePurchases()).resolves.toEqual({ restored: false });
    await expect(currentEntitlement()).resolves.toBeNull();
  });
});
