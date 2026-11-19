// Payday (DECISIONS #60; owner, Nov 19, plan item 21). The rule, written down:
//
// - Payday is a day of the month, 1–31, never an amount. It's a calendar date in the phone's own
//   time zone (date-only, no timestamps, no UTC).
// - Months without that day use their last day: 31 → Apr 30, Feb 28 (Feb 29 in leap years);
//   29 and 30 → Feb 28 in normal years, Feb 29 in leap years. It never sticks: Mar is the 31st again.
// - The next payday is the first payday strictly after today. On payday itself the money has
//   landed, so the next payday is next month's.
// - "Before payday" = charges dated from today (inclusive) up to the day before the next payday.
//   A charge on payday counts after payday (the money's in by then).
// - The day changes at local midnight: the app compares clockToday() (local calendar date) every
//   minute and on returning to the front (src/state/app.tsx), and everything here is recomputed
//   from that date alone.
//
// Each case below is checked against a plain day-by-day walk (the oracle), for every day of
// every month of 2026–2028 and paydays 1, 15, 28, 29, 30 and 31.

import { addDays, daysInMonth, formatDate, parseDate, toDateOnly, type DateOnly } from '../dates';
import { beforePayday, makeSub, nextPayday, type Sub } from '../subs';

const PAYDAYS = [1, 15, 28, 29, 30, 31];
const MONTHS: { y: number; m: number }[] = [];
for (let y = 2026; y <= 2028; y++) for (let m = 1; m <= 12; m++) MONTHS.push({ y, m });

/** Is `d` a payday? Exactly one per month: the payday, or the month's last day if it's shorter. */
const isPayday = (payday: number, d: DateOnly) => {
  const { y, m, d: day } = parseDate(d);
  return day === Math.min(payday, daysInMonth(y, m));
};
/** The oracle: walk forward a day at a time from tomorrow. */
function walkNextPayday(payday: number, today: DateOnly): DateOnly {
  for (let d = addDays(today, 1); ; d = addDays(d, 1)) if (isPayday(payday, d)) return d;
}
const daysOf = (y: number, m: number) => Array.from({ length: daysInMonth(y, m) }, (_, i) => formatDate({ y, m, d: i + 1 }));

const sub = (name: string, amountMinor: number, cycle: Sub['cycle'], anchor: string, extra: Partial<Sub> = {}) =>
  makeSub({ name, amountMinor, currency: 'USD', cycle, anchor, dateSource: 'next', ...extra });

describe('next payday: every day of every month, 2026–2028', () => {
  for (const payday of PAYDAYS) {
    it.each(MONTHS.map(({ y, m }) => [`${y}-${String(m).padStart(2, '0')}`, y, m] as const))(`payday ${payday}, %s`, (_label, y, m) => {
      for (const today of daysOf(y, m)) {
        const next = nextPayday(payday, today);
        expect([today, next]).toEqual([today, walkNextPayday(payday, today)]);
        // Always after today, never more than one month and a bit away.
        expect(next > today).toBe(true);
        expect(isPayday(payday, next)).toBe(true);
      }
    });
  }
});

describe('month ends and leap years', () => {
  it('31 uses the last day of shorter months and comes back', () => {
    expect(nextPayday(31, '2026-04-01')).toBe('2026-04-30');
    expect(nextPayday(31, '2026-04-30')).toBe('2026-05-31');
    expect(nextPayday(31, '2027-02-01')).toBe('2027-02-28');
    expect(nextPayday(31, '2027-02-28')).toBe('2027-03-31');
    expect(nextPayday(31, '2028-02-01')).toBe('2028-02-29'); // leap year
    expect(nextPayday(31, '2028-02-28')).toBe('2028-02-29');
    expect(nextPayday(31, '2028-02-29')).toBe('2028-03-31');
  });
  it('29 and 30 use Feb 28 in normal years and Feb 29 in leap years', () => {
    expect(nextPayday(29, '2027-02-10')).toBe('2027-02-28');
    expect(nextPayday(30, '2027-02-10')).toBe('2027-02-28');
    expect(nextPayday(29, '2028-02-10')).toBe('2028-02-29');
    expect(nextPayday(30, '2028-02-10')).toBe('2028-02-29');
    expect(nextPayday(29, '2028-02-29')).toBe('2028-03-29');
    expect(nextPayday(28, '2028-02-28')).toBe('2028-03-28'); // the 28th is a real day: no clamp
  });
  it('the 1st rolls into the next year in December', () => {
    expect(nextPayday(1, '2026-12-01')).toBe('2027-01-01');
    expect(nextPayday(1, '2026-12-31')).toBe('2027-01-01');
    expect(nextPayday(15, '2027-12-15')).toBe('2028-01-15');
  });
});

describe('before payday: today up to the day before payday', () => {
  it('today is payday: the money is in, so it runs to the day before next month’s payday', () => {
    const subs = [sub('Today', 100, 'monthly', '2026-11-25'), sub('Day before next', 200, 'monthly', '2026-12-24'), sub('Next payday', 400, 'monthly', '2026-12-25')];
    const b = beforePayday(subs, '2026-11-25', 25)!;
    expect(b.payday).toBe('2026-12-25');
    expect(b.count).toBe(2);
    expect(b.totals).toEqual([{ currency: 'USD', amountMinor: 300 }]);
  });
  it('today is the day before payday: only today’s charges count', () => {
    const subs = [sub('Yesterday', 100, 'monthly', '2026-11-23'), sub('Today', 200, 'monthly', '2026-11-24'), sub('On payday', 400, 'monthly', '2026-11-25')];
    const b = beforePayday(subs, '2026-11-24', 25)!;
    expect(b.payday).toBe('2026-11-25');
    expect([b.count, b.totals]).toEqual([1, [{ currency: 'USD', amountMinor: 200 }]]);
  });
  it('a charge on payday counts after payday; the day before and today count', () => {
    const subs = [sub('Before', 100, 'monthly', '2026-11-24'), sub('On', 200, 'monthly', '2026-11-25'), sub('After', 400, 'monthly', '2026-11-26'), sub('Today', 800, 'monthly', '2026-11-19')];
    const b = beforePayday(subs, '2026-11-19', 25)!;
    expect([b.count, b.totals]).toEqual([2, [{ currency: 'USD', amountMinor: 900 }]]);
  });
  it('month-end clamps: a 31st charge and a 31st payday in February', () => {
    // Payday 31 → Feb 28 2027. A charge anchored on Jan 31 lands Feb 28 too: that's payday, so after.
    const subs = [sub('Gym', 3000, 'monthly', '2027-01-31'), sub('Cloud', 299, 'monthly', '2027-01-27')];
    const b = beforePayday(subs, '2027-02-01', 31)!;
    expect(b.payday).toBe('2027-02-28');
    expect([b.count, b.totals]).toEqual([1, [{ currency: 'USD', amountMinor: 299 }]]); // Cloud, Feb 27
    // Leap year: payday Feb 29, so the Feb 28 charge is before it... and the 31st-anchored one lands on payday.
    const leap = beforePayday([sub('Gym', 3000, 'monthly', '2028-01-31'), sub('Cloud', 299, 'monthly', '2028-01-28')], '2028-02-01', 31)!;
    expect(leap.payday).toBe('2028-02-29');
    expect([leap.count, leap.totals]).toEqual([1, [{ currency: 'USD', amountMinor: 299 }]]);
  });
  it('a weekly charge counts once for every week before payday', () => {
    const b = beforePayday([sub('Paper', 500, 'weekly', '2026-11-02')], '2026-11-02', 30)!;
    expect(b.payday).toBe('2026-11-30');
    expect(b.count).toBe(4); // Nov 2, 9, 16, 23 (Nov 30 is payday)
  });
  it('subs with no date, no price, or ditched are left out', () => {
    const subs = [
      sub('No date', 100, 'monthly', '2026-11-20', { dateSource: 'none' }),
      makeSub({ name: 'No price', amountMinor: null, currency: null, cycle: 'monthly', anchor: '2026-11-20', dateSource: 'next' }),
      sub('Ditched', 100, 'monthly', '2026-11-20', { status: 'ditched-confirmed', ditchedOn: '2026-11-10', confirmedOn: '2026-11-10' }),
    ];
    expect(beforePayday(subs, '2026-11-19', 25)).toEqual({ payday: '2026-11-25', count: 0, totals: [] });
  });
  it('matches a day-by-day count for every day of 2026–2028 and every payday', () => {
    // A monthly on the 31st (clamps), one on the 15th, one on the 1st, a yearly on Feb 29, a weekly.
    const subs = [
      sub('A', 100, 'monthly', '2025-12-31'),
      sub('B', 200, 'monthly', '2025-12-15'),
      sub('C', 400, 'monthly', '2026-01-01'),
      sub('D', 800, 'yearly', '2024-02-29'),
      sub('E', 1600, 'weekly', '2025-12-29'),
    ];
    // The charge days of each sub over the three years, worked out by hand-rolled month walking.
    const charges = new Map<string, Set<DateOnly>>();
    const add = (name: string, d: DateOnly) => charges.set(name, (charges.get(name) ?? new Set()).add(d));
    for (const { y, m } of [{ y: 2025, m: 12 }, ...MONTHS, { y: 2029, m: 1 }, { y: 2029, m: 2 }]) {
      add('A', formatDate({ y, m, d: Math.min(31, daysInMonth(y, m)) }));
      add('B', formatDate({ y, m, d: 15 }));
      add('C', formatDate({ y, m, d: 1 }));
      if (m === 2) add('D', formatDate({ y, m, d: daysInMonth(y, 2) }));
    }
    for (let d = '2025-12-29'; d < '2029-03-01'; d = addDays(d, 7)) add('E', d);
    const price: Record<string, number> = { A: 100, B: 200, C: 400, D: 800, E: 1600 };
    for (const payday of PAYDAYS) {
      for (const { y, m } of MONTHS) {
        for (const today of daysOf(y, m)) {
          const b = beforePayday(subs, today, payday)!;
          let count = 0;
          let total = 0;
          for (let d = today; d < b.payday; d = addDays(d, 1))
            for (const [name, days] of charges)
              if (days.has(d)) {
                count++;
                total += price[name];
              }
          expect([payday, today, b.count, b.totals]).toEqual([payday, today, count, count ? [{ currency: 'USD', amountMinor: total }] : []]);
        }
      }
    }
  });
});

describe('midnight and the time zone: the local calendar date only', () => {
  it('11:59 PM is still today; 12:00 AM is the next day, and payday moves with it', () => {
    const late = toDateOnly(new Date(2026, 10, 24, 23, 59, 59));
    const midnight = toDateOnly(new Date(2026, 10, 25, 0, 0, 0));
    expect([late, midnight]).toEqual(['2026-11-24', '2026-11-25']);
    const subs = [sub('Netflix', 1799, 'monthly', '2026-11-24')];
    expect(beforePayday(subs, late, 25)).toMatchObject({ payday: '2026-11-25', count: 1 });
    // Payday has come: Netflix (yesterday) is gone, the next payday is Dec 25.
    expect(beforePayday(subs, midnight, 25)).toMatchObject({ payday: '2026-12-25', count: 1 }); // Netflix again Dec 24
  });
  it('uses the phone’s own wall clock, not UTC', () => {
    // A late-evening local time is the same local day whatever UTC says.
    const d = new Date(2026, 1, 28, 23, 30);
    expect(toDateOnly(d)).toBe('2026-02-28');
    expect(nextPayday(31, toDateOnly(d))).toBe('2026-03-31');
  });
  it('is off until a payday is set', () => {
    expect(beforePayday([sub('Netflix', 1799, 'monthly', '2026-11-20')], '2026-11-19', null)).toBeNull();
  });
});
