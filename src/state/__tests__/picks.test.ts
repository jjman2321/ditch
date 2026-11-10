import { SERVICE_BY_ID } from '@/catalog/services';
import { formatMoney, formatWholeMoney, parseAmountInput, spendTotals } from '@/domain/money';

import { chooseCycle, choosePlan, cycleChoices, isPriced, newPick, repriceForCountry, setOwnPrice } from '../picks';

const TODAY = '2026-11-09';
const svc = (id: string) => SERVICE_BY_ID[id];

describe('picking a service', () => {
  it('takes the local default plan and price', () => {
    const p = newPick(svc('netflix'), 'GB', TODAY);
    expect([p.planId, p.planName, p.amountMinor, p.currency, p.priceSource, p.amountIsEstimate]).toEqual([
      'standard',
      'Standard',
      1399,
      'GBP',
      'catalog',
      true,
    ]);
    expect(p.dateSource).toBe('guess');
  });

  it('has no price (Add your price) when we have none for the country', () => {
    const p = newPick(svc('duolingo'), 'US', TODAY);
    expect(isPriced(p)).toBe(false);
    expect(p.priceSource).toBe('none');
  });
});

describe('plan switching', () => {
  it('one tap moves to another local plan', () => {
    const p = choosePlan(newPick(svc('netflix'), 'US', TODAY), 'standard-ads');
    expect([p.planId, p.amountMinor, p.currency]).toEqual(['standard-ads', 899, 'USD']);
  });

  it('ignores a plan that does not exist', () => {
    const p = newPick(svc('netflix'), 'US', TODAY);
    expect(choosePlan(p, 'nope').planId).toBe('standard');
  });

  it('switching to yearly picks the yearly version of the same plan', () => {
    const p = newPick(svc('max'), 'US', TODAY);
    expect(cycleChoices(p)).toEqual(['monthly', 'yearly']);
    const y = chooseCycle(p, 'yearly');
    expect([y.planId, y.amountMinor, y.cycle]).toEqual(['standard-yearly', 18499, 'yearly']);
    expect(cycleChoices(newPick(svc('netflix'), 'US', TODAY))).toEqual(['monthly']);
  });
});

describe('changing country', () => {
  it('catalog prices follow the country, keeping the plan', () => {
    const us = choosePlan(newPick(svc('netflix'), 'US', TODAY), 'premium');
    const gb = repriceForCountry(us, 'GB');
    expect([gb.planId, gb.amountMinor, gb.currency]).toEqual(['premium', 2099, 'GBP']);
  });

  it('falls back to "Add your price" where the country has no price', () => {
    const p = repriceForCountry(newPick(svc('max'), 'US', TODAY), 'GB');
    expect(isPriced(p)).toBe(false);
  });

  it("never touches a price the user typed", () => {
    const own = setOwnPrice(newPick(svc('amazon-prime'), 'US', TODAY), 1499, 'USD', 'monthly');
    expect(repriceForCountry(own, 'GB')).toEqual(own);
    expect(own.amountIsEstimate).toBe(false);
  });
});

describe('totals across currencies', () => {
  it('one total per currency, never added together', () => {
    const picks = [
      newPick(svc('netflix'), 'GB', TODAY), // £13.99
      newPick(svc('spotify'), 'GB', TODAY), // £12.99
      setOwnPrice(newPick(svc('amazon-prime'), 'GB', TODAY), 2000, 'USD', 'monthly'),
      newPick(svc('duolingo'), 'GB', TODAY), // no price: left out
    ].filter(isPriced);
    const totals = spendTotals(picks);
    expect(totals.map((t) => [t.currency, t.yearlyMinor])).toEqual([
      ['GBP', (1399 + 1299) * 12],
      ['USD', 24000],
    ]);
  });

  it('US$ and A$ are told apart; the home currency keeps its plain symbol', () => {
    expect(formatMoney(1599, 'AUD', { home: 'AUD' })).toBe('$15.99');
    expect(formatMoney(1000, 'USD', { home: 'AUD' })).toBe('US$10.00');
    expect(formatMoney(1599, 'AUD', { home: 'USD' })).toBe('A$15.99');
    expect(formatMoney(1599, 'CAD', { home: 'USD' })).toBe('CA$15.99');
    expect(formatMoney(1599, 'NZD', { home: 'GBP' })).toBe('NZ$15.99');
    expect(formatMoney(1000, 'USD', { home: 'USD' })).toBe('$10.00');
    expect(formatMoney(1399, 'GBP', { home: 'USD' })).toBe('£13.99');
    expect(formatWholeMoney(24000, 'USD', { home: 'GBP' })).toBe('US$240');
  });
});

describe('"Add your price" input', () => {
  it('reads what people type', () => {
    expect(parseAmountInput('12.99', 'USD')).toBe(1299);
    expect(parseAmountInput('12,99', 'EUR')).toBe(1299);
    expect(parseAmountInput('£1,299.00', 'GBP')).toBe(129900);
    expect(parseAmountInput('1,299', 'USD')).toBe(129900);
    expect(parseAmountInput('12.5', 'USD')).toBe(1250);
    // Typed onto a pre-filled price: refuse, don't save $129,911.99.
    expect(parseAmountInput('12.9911.99', 'USD')).toBeNull();
    expect(parseAmountInput('12.99.5', 'USD')).toBeNull();
    expect(parseAmountInput('1,2345', 'USD')).toBeNull();
    expect(parseAmountInput('1.299,50', 'EUR')).toBe(129950);
    expect(parseAmountInput('1,490', 'JPY')).toBe(1490);
    expect(parseAmountInput('649', 'INR')).toBe(64900);
    expect(parseAmountInput('1,500', 'JPY')).toBe(1500);
  });

  it('rejects nothing, zero and junk', () => {
    expect(parseAmountInput('', 'USD')).toBeNull();
    expect(parseAmountInput('0', 'USD')).toBeNull();
    expect(parseAmountInput('abc', 'USD')).toBeNull();
  });
});
