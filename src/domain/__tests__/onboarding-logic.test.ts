import {
  chargeFrom,
  firstHeadsUp,
  headsUpDates,
  nextFromLastCharge,
  ordinal,
  previousCharge,
} from '../charges';
import { balanceLines, joinNames, namesLine, possessive, shortPlanName, stillUsingIt } from '../copy';
import { anchorForDayOfMonth, longDate, nextChargeDate, monthGrid, monthTitle, shiftMonth, weekdayDate, weekdayName } from '../dates';
import { formatMoney, formatWholeMoney, spendTotals, type Cycle } from '../money';
import { perMonthFromYearly, yearlyBadge, yearlySavingsPercent } from '../pricing';

const TODAY = '2026-11-09'; // a Monday

// The v10 example: six popular picks.
const SIX: { amountMinor: number; currency: string; cycle: Cycle }[] = [
  { amountMinor: 2000, currency: 'USD', cycle: 'monthly' }, // ChatGPT Plus
  { amountMinor: 1799, currency: 'USD', cycle: 'monthly' }, // Netflix
  { amountMinor: 1499, currency: 'USD', cycle: 'monthly' }, // Amazon Prime
  { amountMinor: 1399, currency: 'USD', cycle: 'monthly' }, // YouTube Premium
  { amountMinor: 1199, currency: 'USD', cycle: 'monthly' }, // Spotify
  { amountMinor: 1199, currency: 'USD', cycle: 'monthly' }, // Disney+
];

describe('onboarding: the yearly total from picks', () => {
  it('six picks cost $1,091 a year, $90.95 a month, $2.99 a day', () => {
    const [t] = spendTotals(SIX);
    expect(t.yearlyMinor).toBe(109140);
    expect(formatWholeMoney(t.yearlyMinor, 'USD')).toBe('$1,091');
    expect(formatMoney(t.monthlyMinor, 'USD')).toBe('$90.95');
    expect(formatMoney(t.dailyMinor, 'USD')).toBe('$2.99');
  });

  it('mixes monthly and yearly without rounding twice', () => {
    const [t] = spendTotals([
      { amountMinor: 1549, currency: 'USD', cycle: 'monthly' },
      { amountMinor: 9900, currency: 'USD', cycle: 'yearly' },
    ]);
    expect(t.yearlyMinor).toBe(18588 + 9900);
    expect(formatMoney(t.monthlyMinor, 'USD')).toBe('$23.74');
  });

  it('keeps one total per currency', () => {
    const totals = spendTotals([
      { amountMinor: 1000, currency: 'USD', cycle: 'monthly' },
      { amountMinor: 500, currency: 'EUR', cycle: 'monthly' },
    ]);
    expect(totals.map((t) => t.currency)).toEqual(['USD', 'EUR']);
  });

  it('whole-dollar headline rounds half up', () => {
    expect(formatWholeMoney(109150, 'USD')).toBe('$1,092');
    expect(formatWholeMoney(109149, 'USD')).toBe('$1,091');
    expect(formatWholeMoney(1500, 'JPY')).toBe('¥1,500');
  });
});

describe('onboarding: from my last receipt', () => {
  it('Oct 14 receipt → next is Sat, Nov 14 (the v10 example)', () => {
    const next = nextFromLastCharge('2026-10-14', 'monthly', TODAY);
    expect(next).toBe('2026-11-14');
    expect(weekdayDate(next)).toBe('Sat, Nov 14');
  });

  it('rolls through every missed month', () => {
    expect(nextFromLastCharge('2026-06-14', 'monthly', TODAY)).toBe('2026-11-14');
  });

  it('a receipt from today means next month, not today', () => {
    expect(nextFromLastCharge(TODAY, 'monthly', TODAY)).toBe('2026-12-09');
  });

  it('a receipt on the 9th of last month charges today', () => {
    expect(nextFromLastCharge('2026-10-09', 'monthly', TODAY)).toBe(TODAY);
  });

  it('keeps a 31st anchor: Oct 31 receipt → Nov 30 → Dec 31', () => {
    expect(nextFromLastCharge('2026-10-31', 'monthly', TODAY)).toBe('2026-11-30');
    expect(nextFromLastCharge('2026-10-31', 'monthly', '2026-12-01')).toBe('2026-12-31');
  });

  it('yearly receipt rolls a year', () => {
    expect(nextFromLastCharge('2026-03-02', 'yearly', TODAY)).toBe('2027-03-02');
  });

  it('weekly receipt', () => {
    expect(nextFromLastCharge('2026-11-04', 'weekly', TODAY)).toBe('2026-11-11');
  });

  it('previousCharge pre-fills the receipt one cycle back', () => {
    expect(previousCharge('2026-11-14', 'monthly')).toBe('2026-10-14');
    expect(previousCharge('2026-03-31', 'monthly')).toBe('2026-02-28');
    expect(previousCharge('2026-11-14', 'weekly')).toBe('2026-11-07');
  });

  it('chargeFrom handles each kind of date', () => {
    expect(chargeFrom('2026-10-14', 'receipt', 'monthly', TODAY)).toBe('2026-11-14');
    expect(chargeFrom('2026-11-21', 'next', 'monthly', TODAY)).toBe('2026-11-21');
    // No date yet (DECISIONS #33): there's no charge to work out.
    expect(chargeFrom('2026-11-03', 'none', 'monthly', TODAY)).toBeNull();
  });
});

describe('onboarding: heads-ups', () => {
  it('3 days and 1 day before: Sat, Nov 14 → Wed, Nov 11 and Fri, Nov 13', () => {
    expect(headsUpDates('2026-11-14', TODAY)).toEqual(['2026-11-11', '2026-11-13']);
  });

  it('the Pro trial: Mon, Nov 16 → Fri, Nov 13 and Sun, Nov 15', () => {
    expect(headsUpDates('2026-11-16', TODAY).map(weekdayDate)).toEqual(['Fri, Nov 13', 'Sun, Nov 15']);
  });

  it('never in the past', () => {
    expect(headsUpDates('2026-11-11', TODAY)).toEqual(['2026-11-10']);
    expect(headsUpDates(TODAY, TODAY)).toEqual([]);
  });

  it('a heads-up today counts only before 9 AM', () => {
    expect(headsUpDates('2026-11-10', TODAY, { nowHour: 8 })).toEqual(['2026-11-09']);
    expect(headsUpDates('2026-11-10', TODAY, { nowHour: 9 })).toEqual([]);
  });

  it('first heads-up', () => {
    expect(firstHeadsUp('2026-11-21', TODAY)).toBe('2026-11-18');
    expect(firstHeadsUp('2026-11-09', TODAY)).toBeNull();
  });
});

describe('paywall prices (pricing research)', () => {
  const monthly = { amountMinor: 499, currency: 'USD' };
  const yearly = { amountMinor: 2999, currency: 'USD' };

  it('saving rounds DOWN: 49.9% → 49, never 50', () => {
    expect(yearlySavingsPercent(monthly, yearly)).toBe(49);
    expect(yearlyBadge(monthly, yearly)).toBe('Save 49%');
  });

  it('shows "Best value" across currencies or under 10%', () => {
    expect(yearlyBadge(monthly, { amountMinor: 2999, currency: 'EUR' })).toBe('Best value');
    expect(yearlyBadge(monthly, { amountMinor: 5500, currency: 'USD' })).toBe('Best value');
    expect(yearlyBadge(monthly, { amountMinor: 6000, currency: 'USD' })).toBe('Best value');
  });

  it('per-month rounds UP: $29.99 → $2.50 a month, never $2.49', () => {
    expect(perMonthFromYearly(yearly)).toBe('$2.50');
    expect(perMonthFromYearly({ amountMinor: 2400, currency: 'USD' })).toBe('$2.00');
    expect(perMonthFromYearly({ amountMinor: 3001, currency: 'USD' })).toBe('$2.51');
    expect(perMonthFromYearly({ amountMinor: 4900, currency: 'JPY' })).toBe('¥409');
  });
});

describe('onboarding copy', () => {
  it('joins names', () => {
    expect(joinNames(['YouTube Premium', 'Spotify', 'Disney+'])).toBe('YouTube Premium, Spotify and Disney+');
    expect(joinNames(['A', 'B'])).toBe('A and B');
    expect(joinNames(['A'])).toBe('A');
    expect(possessive('Disney+')).toBe('Disney+’s');
  });

  it('plan names without the service name', () => {
    expect(shortPlanName('Disney+ (With Ads)', 'Disney+')).toBe('With Ads');
    expect(shortPlanName('Prime (monthly)', 'Amazon Prime')).toBe('Monthly');
    expect(shortPlanName('Standard', 'Netflix')).toBe('Standard');
    expect(shortPlanName('Disney+ Premium (No Ads)', 'Disney+')).toBe('Premium (No Ads)');
    expect(shortPlanName('Premium Individual', 'Spotify')).toBe('Premium Individual');
    const spotify = ['Premium Individual', 'Premium Duo', 'Premium Family'];
    expect(shortPlanName('Premium Individual', 'Spotify', spotify)).toBe('Individual');
    expect(shortPlanName('Premium', 'Netflix', ['Standard with ads', 'Standard', 'Premium'])).toBe('Premium');
  });

  it('balanced two-line labels (paywall table)', () => {
    expect(balanceLines('Subscriptions with reminders')).toBe('Subscriptions\nwith reminders');
    expect(balanceLines('Choose your reminder times')).toBe('Choose your\nreminder times');
    expect(balanceLines('Second nudge if you miss one')).toBe('Second nudge\nif you miss one');
    expect(balanceLines('Home & Lock\u00A0Screen widget')).toBe('Home & Lock\u00A0Screen\nwidget');
    expect(balanceLines('Import screenshots anytime')).toBe('Import screenshots\nanytime');
  });

  it('names line for "dates to check"', () => {
    expect(namesLine(['Amazon Prime', 'Disney+'])).toBe('Amazon Prime and Disney+');
    expect(namesLine(['A', 'B', 'C'])).toBe('A, B and C');
    expect(namesLine(['A', 'B', 'C', 'D', 'E'])).toBe('A, B and 3 more');
  });

  it('nudges', () => {
    expect(stillUsingIt('Streaming')).toBe('Still watching?');
    expect(stillUsingIt(undefined)).toBe('Still using it?');
  });

  it('long dates and the calendar grid', () => {
    expect(longDate('2026-11-13')).toBe('Friday, November 13');
    expect(weekdayName('2026-11-14')).toBe('Saturday');
    expect(monthTitle(2026, 10)).toBe('October 2026');
    const oct = monthGrid(2026, 10); // Oct 1, 2026 is a Thursday
    expect(oct.slice(0, 5)).toEqual([null, null, null, null, '2026-10-01']);
    expect(oct.length).toBe(4 + 31);
    expect(shiftMonth(2026, 1, -1)).toEqual({ y: 2025, m: 12 });
    expect(shiftMonth(2026, 12, 1)).toEqual({ y: 2027, m: 1 });
  });
});

describe('charge dates: pick the day (DECISIONS #33)', () => {
  const TUE = '2026-11-10'; // the v12 example day

  it('the 19th → Thu, Nov 19; the 31st clamps to Nov 30, keeps the 31st', () => {
    expect(nextChargeDate(anchorForDayOfMonth(19, TUE), 'monthly', TUE)).toBe('2026-11-19');
    expect(nextChargeDate(anchorForDayOfMonth(5, TUE), 'monthly', TUE)).toBe('2026-12-05');
    const a31 = anchorForDayOfMonth(31, TUE);
    expect(nextChargeDate(a31, 'monthly', TUE)).toBe('2026-11-30');
    expect(nextChargeDate(a31, 'monthly', '2026-12-01')).toBe('2026-12-31');
    // Today's day stays today.
    expect(nextChargeDate(anchorForDayOfMonth(10, TUE), 'monthly', TUE)).toBe(TUE);
  });

  it('ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 19, 21, 22, 23, 31].map(ordinal)).toEqual([
      '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '19th', '21st', '22nd', '23rd', '31st',
    ]);
  });
});
