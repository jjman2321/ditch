// Date rules (see docs/SPEC.md §5.2).
// Charge dates are calendar dates ("YYYY-MM-DD"), never timestamps.
// Monthly/quarterly/yearly keep the anchor day and clamp to month end
// without losing it: Jan 31 → Feb 28/29 → Mar 31.

import type { Cycle } from './money';

export type DateOnly = string; // "YYYY-MM-DD"

type YMD = { y: number; m: number; d: number }; // m is 1-12

export function parseDate(s: DateOnly): YMD {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) throw new Error(`Bad date: ${s}`);
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

export function formatDate({ y, m, d }: YMD): DateOnly {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

/** Local calendar date for a JS Date (today by default). */
export function toDateOnly(date: Date = new Date()): DateOnly {
  return formatDate({ y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() });
}

/** Days since a fixed epoch, using pure calendar math (no timezones). */
function dayNumber(s: DateOnly): number {
  const { y, m, d } = parseDate(s);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

function fromDayNumber(n: number): DateOnly {
  const dt = new Date(n * 86_400_000);
  return formatDate({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() });
}

export function addDays(s: DateOnly, days: number): DateOnly {
  return fromDayNumber(dayNumber(s) + days);
}

export function daysBetween(from: DateOnly, to: DateOnly): number {
  return dayNumber(to) - dayNumber(from);
}

/** Anchor + n months, clamped to month end. The anchor day is never lost. */
export function addMonthsClamped(anchor: DateOnly, months: number): DateOnly {
  const { y, m, d } = parseDate(anchor);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return formatDate({ y: ny, m: nm, d: Math.min(d, daysInMonth(ny, nm)) });
}

const MONTHS_PER_CYCLE: Record<Exclude<Cycle, 'weekly'>, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/** The k-th charge counted from the anchor (k = 0 is the anchor itself). */
export function occurrence(anchor: DateOnly, cycle: Cycle, k: number): DateOnly {
  if (cycle === 'weekly') return addDays(anchor, 7 * k);
  return addMonthsClamped(anchor, MONTHS_PER_CYCLE[cycle] * k);
}

/**
 * Next charge on or after `today`. A charge due today stays today.
 * Anchors in the past roll forward through every missed cycle.
 * Anchors in the future are returned as-is.
 */
export function nextChargeDate(anchor: DateOnly, cycle: Cycle, today: DateOnly): DateOnly {
  if (anchor >= today) return anchor;
  // Jump close to today, then step. Never compute from the previous
  // (clamped) occurrence, always from the anchor, so clamps don't stick.
  let k: number;
  if (cycle === 'weekly') {
    k = Math.ceil(daysBetween(anchor, today) / 7);
  } else {
    const a = parseDate(anchor);
    const t = parseDate(today);
    const monthsApart = (t.y - a.y) * 12 + (t.m - a.m);
    k = Math.max(0, Math.floor(monthsApart / MONTHS_PER_CYCLE[cycle]));
  }
  let next = occurrence(anchor, cycle, k);
  while (next < today) {
    k += 1;
    next = occurrence(anchor, cycle, k);
  }
  return next;
}

/**
 * Anchor for "it charges on the Nth of each month".
 * Picks the latest month (this one or earlier) that really has day N,
 * so the 31st stays the 31st and short months clamp (Nov 30).
 * Feed the result to nextChargeDate.
 */
export function anchorForDayOfMonth(dayOfMonth: number, today: DateOnly): DateOnly {
  const t = parseDate(today);
  let y = t.y;
  let m = t.m;
  while (daysInMonth(y, m) < dayOfMonth) {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
  }
  return formatDate({ y, m, d: dayOfMonth });
}

/**
 * Anchor for a yearly charge on a month + day.
 * Feb 29 anchors to the latest leap year, so it clamps to Feb 28 in
 * normal years and comes back to Feb 29 in leap years.
 */
export function anchorForMonthDay(month: number, day: number, today: DateOnly): DateOnly {
  let y = parseDate(today).y;
  while (daysInMonth(y, month) < day) y -= 1;
  return formatDate({ y, m: month, d: day });
}

/** Next date for a weekday (0 = Sunday … 6 = Saturday), on or after today. */
export function nextForWeekday(weekday: number, today: DateOnly): DateOnly {
  const { y, m, d } = parseDate(today);
  const todayDow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDays(today, (weekday - todayDow + 7) % 7);
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "Nov 16" */
export function shortDate(s: DateOnly): string {
  const { m, d } = parseDate(s);
  return `${MONTH_SHORT[m - 1]} ${d}`;
}

/** "Mon, Nov 16" */
export function weekdayDate(s: DateOnly): string {
  const { y, m, d } = parseDate(s);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAY_SHORT[dow]}, ${MONTH_SHORT[m - 1]} ${d}`;
}

/** "today", "tomorrow", "in 3 days", "Thu", "Nov 16" */
export function relativeDay(target: DateOnly, today: DateOnly): string {
  const diff = daysBetween(today, target);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff > 1 && diff < 7) return `in ${diff} days`;
  return shortDate(target);
}

export { MONTH_SHORT, WEEKDAY_SHORT };
