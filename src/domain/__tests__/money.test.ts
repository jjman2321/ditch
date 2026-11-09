import {
  formatMoney,
  monthlyMinorExact,
  roundMinor,
  totalsByCurrency,
  yearlyMinor,
} from '../money';

describe('money: acceptance checks (SPEC §5.1)', () => {
  it('Netflix $15.49/mo is $185.88/yr', () => {
    expect(yearlyMinor(1549, 'monthly')).toBe(18588);
    expect(formatMoney(yearlyMinor(1549, 'monthly'), 'USD')).toBe('$185.88');
    expect(formatMoney(monthlyMinorExact(1549, 'monthly'), 'USD')).toBe('$15.49');
  });

  it('$99/yr is $8.25/mo', () => {
    expect(monthlyMinorExact(9900, 'yearly')).toBe(825);
    expect(formatMoney(monthlyMinorExact(9900, 'yearly'), 'USD')).toBe('$8.25');
    expect(formatMoney(yearlyMinor(9900, 'yearly'), 'USD')).toBe('$99.00');
  });

  it('weekly uses × 52 / 12', () => {
    expect(monthlyMinorExact(1000, 'weekly')).toBeCloseTo(4333.333, 3);
    expect(formatMoney(monthlyMinorExact(1000, 'weekly'), 'USD')).toBe('$43.33');
    expect(yearlyMinor(1000, 'weekly')).toBe(52000);
  });

  it('quarterly uses ÷ 3', () => {
    expect(monthlyMinorExact(3000, 'quarterly')).toBe(1000);
    expect(yearlyMinor(3000, 'quarterly')).toBe(12000);
  });

  it('yearly comes from the unrounded value', () => {
    // $10/week: monthly shows $43.33, but yearly is exactly $520, not $519.96.
    expect(yearlyMinor(1000, 'weekly')).toBe(52000);
    expect(roundMinor(monthlyMinorExact(1000, 'weekly')) * 12).not.toBe(52000);
  });

  it('never adds different currencies together', () => {
    const totals = totalsByCurrency([
      { amountMinor: 1549, currency: 'USD' },
      { amountMinor: 2000, currency: 'CAD' },
      { amountMinor: 1199, currency: 'USD' },
    ]);
    expect(totals).toEqual([
      { currency: 'USD', amountMinor: 2748 },
      { currency: 'CAD', amountMinor: 2000 },
    ]);
  });

  it('respects currencies with no decimals (JPY)', () => {
    expect(formatMoney(yearlyMinor(980, 'monthly'), 'JPY')).toBe('¥11,760');
  });

  it('rounds half-up at display time only', () => {
    expect(roundMinor(824.5)).toBe(825);
    expect(roundMinor(824.4999)).toBe(824);
    expect(formatMoney(128400, 'USD', { trimWhole: true })).toBe('$1,284');
    expect(formatMoney(128450, 'USD', { trimWhole: true })).toBe('$1,284.50');
  });
});
