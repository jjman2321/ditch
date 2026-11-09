import {
  addMonthsClamped,
  anchorForDayOfMonth,
  anchorForMonthDay,
  nextChargeDate,
  nextForWeekday,
  occurrence,
  relativeDay,
  weekdayDate,
} from '../dates';

describe('dates: month-end clamping keeps the anchor (SPEC §5.2)', () => {
  it('Jan 31 → Feb 28 → Mar 31 → Apr 30 → May 31 (non-leap)', () => {
    const a = '2025-01-31';
    expect([1, 2, 3, 4].map((k) => occurrence(a, 'monthly', k))).toEqual([
      '2025-02-28',
      '2025-03-31',
      '2025-04-30',
      '2025-05-31',
    ]);
  });

  it('Jan 31 → Feb 29 in a leap year', () => {
    expect(addMonthsClamped('2028-01-31', 1)).toBe('2028-02-29');
  });

  it('yearly Feb 29 → Feb 28 in normal years, Feb 29 in leap years', () => {
    const a = '2024-02-29';
    expect([1, 2, 3, 4].map((k) => occurrence(a, 'yearly', k))).toEqual([
      '2025-02-28',
      '2026-02-28',
      '2027-02-28',
      '2028-02-29',
    ]);
  });

  it('quarterly Nov 30 → Feb 28/29 → May 30 → Aug 30 → Nov 30', () => {
    const a = '2027-11-30';
    expect([1, 2, 3, 4].map((k) => occurrence(a, 'quarterly', k))).toEqual([
      '2028-02-29',
      '2028-05-30',
      '2028-08-30',
      '2028-11-30',
    ]);
  });
});

describe('dates: next charge', () => {
  it('a charge due today stays today', () => {
    expect(nextChargeDate('2026-11-09', 'monthly', '2026-11-09')).toBe('2026-11-09');
  });

  it('future anchors are returned as-is', () => {
    expect(nextChargeDate('2026-12-01', 'monthly', '2026-11-09')).toBe('2026-12-01');
  });

  it('rolls through many missed months', () => {
    expect(nextChargeDate('2026-06-15', 'monthly', '2026-11-20')).toBe('2026-12-15');
  });

  it('a 31st anchor charges Nov 30, not Dec 31', () => {
    expect(nextChargeDate('2026-10-31', 'monthly', '2026-11-09')).toBe('2026-11-30');
  });

  it('weekly: anchor 21 days ago → today; 22 days ago → +28', () => {
    expect(nextChargeDate('2026-10-19', 'weekly', '2026-11-09')).toBe('2026-11-09');
    expect(nextChargeDate('2026-10-18', 'weekly', '2026-11-09')).toBe('2026-11-15');
  });

  it('yearly rolls forward a year when this year has passed', () => {
    expect(nextChargeDate('2025-03-01', 'yearly', '2026-11-09')).toBe('2027-03-01');
  });
});

describe('dates: onboarding pickers', () => {
  it('day 31 picked in November keeps the 31st and charges Nov 30', () => {
    const anchor = anchorForDayOfMonth(31, '2026-11-09');
    expect(anchor).toBe('2026-10-31');
    expect(nextChargeDate(anchor, 'monthly', '2026-11-09')).toBe('2026-11-30');
    expect(occurrence(anchor, 'monthly', 2)).toBe('2026-12-31');
  });

  it('a day earlier this month rolls to next month', () => {
    const anchor = anchorForDayOfMonth(5, '2026-11-09');
    expect(nextChargeDate(anchor, 'monthly', '2026-11-09')).toBe('2026-12-05');
  });

  it('yearly Feb 29 picks the last leap year as anchor', () => {
    const anchor = anchorForMonthDay(2, 29, '2026-11-09');
    expect(anchor).toBe('2024-02-29');
    expect(nextChargeDate(anchor, 'yearly', '2026-11-09')).toBe('2027-02-28');
  });

  it('next weekday (Nov 9 2026 is a Monday)', () => {
    expect(nextForWeekday(1, '2026-11-09')).toBe('2026-11-09');
    expect(nextForWeekday(0, '2026-11-09')).toBe('2026-11-15');
  });

  it('labels', () => {
    expect(weekdayDate('2026-11-16')).toBe('Mon, Nov 16');
    expect(relativeDay('2026-11-10', '2026-11-09')).toBe('tomorrow');
    expect(relativeDay('2026-11-12', '2026-11-09')).toBe('in 3 days');
  });
});
