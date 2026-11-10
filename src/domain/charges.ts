// Charge-date helpers: "from my last receipt" and the 9 AM reminders
// (3 days and 1 day before a charge). All dates are calendar dates
// ("YYYY-MM-DD"), never timestamps.
//
// No guesses (DECISIONS #33): a date is either one the user gave us or
// missing. 'none' means "No date yet": no reminders until they add one.

import { addDays, daysBetween, nextChargeDate, occurrence, type DateOnly } from './dates';
import type { Cycle } from './money';

/** How the user gave us a date, or 'none' when they haven't yet. */
export type DateSource = 'none' | 'next' | 'receipt';

/**
 * Next charge after a past receipt. Rolls forward through every missed
 * cycle, counting from the receipt day so month-end anchors are kept.
 * A receipt from today means the next charge is one cycle later.
 */
export function nextFromLastCharge(lastCharge: DateOnly, cycle: Cycle, today: DateOnly): DateOnly {
  const after = nextChargeDate(lastCharge, cycle, today);
  return after === lastCharge ? occurrence(lastCharge, cycle, 1) : after;
}

/** The charge before `next` (used to pre-fill "From my last receipt"). */
export function previousCharge(next: DateOnly, cycle: Cycle): DateOnly {
  return occurrence(next, cycle, -1);
}

/** The next charge for a saved date, whatever kind it is. Null when there's no date yet. */
export function chargeFrom(anchor: DateOnly, source: DateSource, cycle: Cycle, today: DateOnly): DateOnly | null {
  if (source === 'none') return null;
  return source === 'receipt' ? nextFromLastCharge(anchor, cycle, today) : nextChargeDate(anchor, cycle, today);
}

/** Default heads-ups: 3 days and 1 day before, at 9:00 local time. */
export const HEADS_UP_LEADS = [3, 1] as const;
export const HEADS_UP_HOUR = 9;

/**
 * Heads-up days for one charge, soonest first. Never in the past:
 * a heads-up today only counts while it's still before 9:00 AM.
 */
export function headsUpDates(
  charge: DateOnly,
  today: DateOnly,
  { leads = HEADS_UP_LEADS, nowHour = 0 }: { leads?: readonly number[]; nowHour?: number } = {},
): DateOnly[] {
  return [...leads]
    .sort((a, b) => b - a)
    .map((d) => addDays(charge, -d))
    .filter((d) => d > today || (d === today && nowHour < HEADS_UP_HOUR));
}

/** The first heads-up for a charge, or null if it's too close for one. */
export function firstHeadsUp(charge: DateOnly, today: DateOnly, nowHour = 0): DateOnly | null {
  return headsUpDates(charge, today, { nowHour })[0] ?? null;
}

/** Days from today to a date (negative if past). */
export function daysUntil(date: DateOnly, today: DateOnly): number {
  return daysBetween(today, date);
}

/** "1st", "2nd", "3rd", "19th", "22nd". */
export function ordinal(n: number): string {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}
