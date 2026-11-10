// Charge-date helpers for onboarding: guessed dates, "from my last receipt",
// and the 9 AM heads-ups (3 days and 1 day before a charge).
// All dates are calendar dates ("YYYY-MM-DD"), never timestamps.

import { addDays, daysBetween, nextChargeDate, occurrence, weekdayOf, type DateOnly } from './dates';
import type { Cycle } from './money';

/** How the user gave us a date. A guess stays labelled until they fix it. */
export type DateSource = 'guess' | 'next' | 'receipt';

const CYCLE_DAYS: Record<Cycle, number> = { weekly: 7, monthly: 28, quarterly: 89, yearly: 364 };

/** Small, stable string hash (FNV-1a), so a service always gets the same guess. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/**
 * A placeholder next-charge date when we don't know the real one.
 * Spread over one billing cycle (so guesses don't all land on one day),
 * never today, and the same for the same service on the same day.
 * Weekly: 1–7 days out. Monthly: 2–29. Quarterly: 2–90. Yearly: 2–365.
 */
export function guessNextCharge(serviceId: string, cycle: Cycle, today: DateOnly): DateOnly {
  const span = CYCLE_DAYS[cycle];
  const min = cycle === 'weekly' ? 1 : 2;
  return addDays(today, min + (hash(serviceId) % span));
}

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

/** The next charge for a saved date, whatever kind it is. */
export function chargeFrom(anchor: DateOnly, source: DateSource, cycle: Cycle, today: DateOnly): DateOnly {
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

/**
 * Quick picks on the charge-dates screen (DECISIONS #29): "This week",
 * "Next week", "Later". Weeks run Monday to Sunday.
 * - This week: tomorrow to Sunday (on a Sunday: the whole coming week).
 * - Next week: the Monday to Sunday after that.
 * - Later: from the Monday after next week up to one billing cycle away.
 */
export type RoughWhen = 'this' | 'next' | 'later';

/** The Sunday that ends this week, always after today (1–7 days away). */
function endOfWeek(today: DateOnly): DateOnly {
  const dow = weekdayOf(today); // 0 = Sunday
  return addDays(today, (7 - dow) % 7 || 7);
}

/** First and last day a quick pick covers, both inclusive. */
export function roughRange(when: RoughWhen, cycle: Cycle, today: DateOnly): [DateOnly, DateOnly] {
  const sunday = endOfWeek(today);
  if (when === 'this') return [addDays(today, 1), sunday];
  if (when === 'next') return [addDays(sunday, 1), addDays(sunday, 7)];
  const start = addDays(sunday, 8);
  const end = addDays(occurrence(today, cycle, 1), -1);
  return [start, end > start ? end : start];
}

/**
 * The date a quick pick is stored as: the middle of its range (rounded
 * down). It stays a guess ("around …") until the user picks a real day.
 * Tue, Nov 10: This week → Fri, Nov 13 · Next week → Thu, Nov 19 · Later → Tue, Dec 1.
 */
export function roughDate(when: RoughWhen, cycle: Cycle, today: DateOnly): DateOnly {
  const [a, b] = roughRange(when, cycle, today);
  return addDays(a, Math.floor(daysBetween(a, b) / 2));
}

/** "1st", "2nd", "3rd", "19th", "22nd". */
export function ordinal(n: number): string {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}
