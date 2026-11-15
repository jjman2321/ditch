// Every 2 weeks and every 6 months (owner, Nov 15; DECISIONS #57). CLAUDE.md rules 1 and 2.
import { nextChargeDate, occurrence } from '../dates';
import { formatMoney, monthlyMinorExact, roundMinor, yearlyMinor } from '../money';

describe('money: every 2 weeks and every 6 months', () => {
  it('every 2 weeks is 26 charges a year', () => {
    expect(yearlyMinor(1000, 'biweekly')).toBe(26000); // $10 every 2 weeks → $260/yr
    expect(formatMoney(roundMinor(monthlyMinorExact(1000, 'biweekly')), 'USD')).toBe('$21.67'); // 260/12
  });
  it('every 6 months is 2 charges a year and ÷ 6 a month', () => {
    expect(yearlyMinor(59900, 'semiannual')).toBe(119800); // $599 every 6 months → $1,198/yr
    expect(formatMoney(roundMinor(monthlyMinorExact(59900, 'semiannual')), 'USD')).toBe('$99.83');
  });
  it('yearly totals come from unrounded values', () => {
    expect(yearlyMinor(999, 'biweekly')).toBe(25974); // $259.74, not 26 × a rounded monthly
  });
  it('zero-decimal currencies stay whole', () => {
    expect(yearlyMinor(1500, 'biweekly')).toBe(39000); // ¥1,500 every 2 weeks
    expect(formatMoney(yearlyMinor(1500, 'biweekly'), 'JPY')).toBe('¥39,000');
  });
});

describe('dates: every 2 weeks', () => {
  it('steps 14 days from the anchor', () => {
    expect(occurrence('2026-11-06', 'biweekly', 1)).toBe('2026-11-20');
    expect(occurrence('2026-12-25', 'biweekly', 1)).toBe('2027-01-08');
  });
  it('rolls a past anchor forward through every missed cycle', () => {
    expect(nextChargeDate('2026-10-02', 'biweekly', '2026-11-15')).toBe('2026-11-27'); // Oct 2, 16, 30, Nov 13, 27
  });
  it('a charge due today stays today', () => {
    expect(nextChargeDate('2026-11-01', 'biweekly', '2026-11-15')).toBe('2026-11-15');
  });
  it('crosses a leap day correctly', () => {
    expect(occurrence('2028-02-20', 'biweekly', 1)).toBe('2028-03-05');
  });
});

describe('dates: every 6 months', () => {
  it('keeps the anchor day and clamps to month end without losing it', () => {
    expect(occurrence('2026-08-31', 'semiannual', 1)).toBe('2027-02-28');
    expect(occurrence('2026-08-31', 'semiannual', 2)).toBe('2027-08-31');
    expect(occurrence('2027-08-31', 'semiannual', 1)).toBe('2028-02-29'); // leap year
  });
  it('rolls a past anchor forward', () => {
    expect(nextChargeDate('2025-03-15', 'semiannual', '2026-11-15')).toBe('2027-03-15'); // Sep 15 2025, Mar 15 2026, Sep 15 2026, Mar 15 2027
  });
  it('a charge due today stays today', () => {
    expect(nextChargeDate('2026-05-15', 'semiannual', '2026-11-15')).toBe('2026-11-15');
  });
});
