// What the reminders pre-ask and "You're set" show: the first reminder
// for each subscription that gets them, soonest first. Pure, so it's
// tested in Jest.

import { firstHeadsUp } from '@/domain/charges';
import type { DateOnly } from '@/domain/dates';

export type SetSub = {
  id: string;
  name: string;
  /** The next charge, on or after today. Null: no date yet. */
  charge: DateOnly | null;
  /** The charge after that (used when the next one is too close for a reminder). */
  following: DateOnly | null;
};

export type ReminderRow = {
  id: string;
  name: string;
  /** The charge this reminder is about. */
  charge: DateOnly;
  /** The day of the first reminder (9:00 AM). */
  reminder: DateOnly;
  trial?: boolean;
};

export const PRO_TRIAL_ROW_ID = 'ditch-pro-trial';

/**
 * First reminder per reminded subscription (and Ditch's own trial), soonest
 * first. A charge too close for a reminder shows the next cycle's instead,
 * so every row has a real reminder day.
 */
export function firstReminderRows({
  subs,
  remindedIds,
  trialCharge = null,
  today,
  nowHour = 0,
  max = 3,
}: {
  subs: SetSub[];
  remindedIds: string[];
  trialCharge?: DateOnly | null;
  today: DateOnly;
  nowHour?: number;
  max?: number;
}): ReminderRow[] {
  const rows: ReminderRow[] = [];
  for (const s of subs) {
    if (!remindedIds.includes(s.id) || !s.charge) continue; // no date, no reminder
    let charge: DateOnly = s.charge;
    let reminder = firstHeadsUp(charge, today, nowHour);
    if (!reminder && s.following) {
      charge = s.following;
      reminder = firstHeadsUp(charge, today, nowHour);
    }
    if (reminder) rows.push({ id: s.id, name: s.name, charge, reminder });
  }
  if (trialCharge) {
    const reminder = firstHeadsUp(trialCharge, today, nowHour);
    if (reminder) rows.push({ id: PRO_TRIAL_ROW_ID, name: 'Ditch Pro trial', charge: trialCharge, reminder, trial: true });
  }
  // Soonest first; on the same day the trial goes first (it's the one we charge), then the earlier charge.
  rows.sort((a, b) =>
    a.reminder !== b.reminder
      ? a.reminder < b.reminder
        ? -1
        : 1
      : Number(!!b.trial) - Number(!!a.trial) || (a.charge < b.charge ? -1 : a.charge > b.charge ? 1 : 0),
  );
  return rows.slice(0, max);
}

/** Subscriptions with no date yet (no reminders until they get one), in list order. */
export function undatedNames(subs: SetSub[]): string[] {
  return subs.filter((s) => !s.charge).map((s) => s.name);
}
