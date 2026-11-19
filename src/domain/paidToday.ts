// The no-date pipeline (owner, Nov 19, plan item 20). A subscription is in one of three states:
//
// 1. A date the user picked ("next"): the anchor is a charge day; the next charge is the anchor
//    rolled forward to today or later (a charge due today stays today).
// 2. "Paid today" / "It charged today" ("receipt", anchor = today): today's charge already happened,
//    so the NEXT charge is one cycle after today (nextFromLastCharge). Today keeps the billing day,
//    so a monthly paid on Jan 31 goes Feb 28 → Mar 31, and a yearly paid on Feb 29 goes to Feb 28 next
//    year and back to Feb 29 in leap years. No reminder is ever made for today's charge: it's paid.
// 3. "I'm not sure" ("none"): no date, no reminders, listed under "No date yet" until a date is added.
//    We never guess one (DECISIONS #33).
//
// All dates are calendar dates (YYYY-MM-DD) in the phone's own time zone, never timestamps.

import { nextFromLastCharge } from './charges';
import type { DateOnly } from './dates';
import type { Cycle } from './money';

export type PaidToday = { anchor: DateOnly; dateSource: 'receipt'; next: DateOnly };

/** What "It charged today" saves: today as the last charge, and the next charge one cycle later. */
export function paidToday(cycle: Cycle, today: DateOnly): PaidToday {
  return { anchor: today, dateSource: 'receipt', next: nextFromLastCharge(today, cycle, today) };
}
