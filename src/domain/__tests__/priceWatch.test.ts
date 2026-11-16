import type { CountryPrice } from '@/catalog/prices';

import { priceChanges, yearlySaving } from '../priceWatch';
import { makeSub, type Sub } from '../subs';

const ROWS: CountryPrice[] = [
  { serviceId: 'netflix', country: 'US', currency: 'USD', status: 'verified', plans: [{ id: 'standard', name: 'Standard', amountMinor: 1999, cycle: 'monthly', default: true }], source: 'https://help.netflix.com', checked: '2026-11-15' },
  { serviceId: 'claude-pro', country: 'US', currency: 'USD', status: 'verified', plans: [{ id: 'monthly', name: 'Pro (monthly)', amountMinor: 2000, cycle: 'monthly', default: true }, { id: 'yearly', name: 'Pro (yearly)', amountMinor: 20000, cycle: 'yearly' }], source: 'https://claude.com/pricing', checked: '2026-11-15' },
  { serviceId: 'amazon-prime', country: 'US', currency: 'USD', status: 'verified', plans: [{ id: 'prime', name: 'Prime', amountMinor: 1499, cycle: 'monthly', default: true }, { id: 'prime-yearly', name: 'Prime (yearly)', amountMinor: 13900, cycle: 'yearly' }], source: 'https://aboutamazon.com', checked: '2026-11-15' },
];
const lookup = (id: string, c: string | null) => ROWS.find((r) => r.serviceId === id && r.country === c) ?? null;
const sub = (f: Partial<Sub>) => makeSub({ name: 'X', cycle: 'monthly', anchor: '2026-11-20', dateSource: 'next', currency: 'USD', priceCountry: 'US', priceSource: 'catalog', ...f });

describe('price watch (Pro, DECISIONS #60)', () => {
  it('our checked price for their plan went up', () => {
    const [c] = priceChanges([sub({ name: 'Netflix', catalogId: 'netflix', planId: 'standard', amountMinor: 1799 })], lookup);
    expect([c.was, c.now, c.up, c.planName, c.checked]).toEqual([1799, 1999, true, 'Standard', '2026-11-15']);
  });
  it('never second-guesses a price the user typed, or a different cycle/currency/plan', () => {
    expect(priceChanges([sub({ catalogId: 'netflix', planId: 'standard', amountMinor: 1799, priceSource: 'user' })], lookup)).toEqual([]);
    expect(priceChanges([sub({ catalogId: 'netflix', planId: 'standard', amountMinor: 1799, currency: 'GBP' })], lookup)).toEqual([]);
    expect(priceChanges([sub({ catalogId: 'netflix', planId: 'premium', amountMinor: 1799 })], lookup)).toEqual([]);
    expect(priceChanges([sub({ catalogId: 'netflix', planId: 'standard', amountMinor: 1999 })], lookup)).toEqual([]);
  });
});

describe('cheaper plan check (Pro)', () => {
  it('Claude Pro monthly: yearly is $40 less', () => {
    expect(yearlySaving(sub({ catalogId: 'claude-pro', planId: 'monthly', amountMinor: 2000 }), lookup)).toEqual({ planName: 'Pro (yearly)', yearlyMinor: 20000, monthlyTimes12: 24000, lessBy: 4000, currency: 'USD' });
  });
  it('Prime monthly: uses what they pay now × 12', () => {
    expect(yearlySaving(sub({ catalogId: 'amazon-prime', planId: 'prime', amountMinor: 1499 }), lookup)?.lessBy).toBe(4088); // $179.88 − $139
  });
  it('nothing when there is no yearly plan, or it is not cheaper, or they already pay yearly', () => {
    expect(yearlySaving(sub({ catalogId: 'netflix', planId: 'standard', amountMinor: 1999 }), lookup)).toBeNull();
    expect(yearlySaving(sub({ catalogId: 'claude-pro', planId: 'monthly', amountMinor: 1500 }), lookup)).toBeNull();
    expect(yearlySaving(sub({ catalogId: 'claude-pro', planId: 'yearly', amountMinor: 20000, cycle: 'yearly' }), lookup)).toBeNull();
  });
});
