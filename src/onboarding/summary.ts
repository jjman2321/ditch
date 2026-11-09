// What "You're set" says: the first heads-ups, the note under them, and
// the three counts. Pure, so it's tested in Jest.

import { firstHeadsUp } from '@/domain/charges';
import { joinNames, possessive } from '@/domain/copy';
import { weekdayDate, type DateOnly } from '@/domain/dates';

export type SummarySub = { id: string; name: string; charge: DateOnly; guess: boolean };

export type HeadsUpRow = { id: string; name: string; date: DateOnly; guess: boolean; trial?: boolean };

export type SetSummary = {
  rows: HeadsUpRow[];
  note: string;
  tracked: number;
  withHeadsUps: string;
  datesToCheck: number;
};

export function buildSetSummary({
  subs,
  remindedIds,
  trialCharge,
  today,
  nowHour = 0,
  notificationsOn,
  pro = !!trialCharge,
}: {
  subs: SummarySub[];
  remindedIds: string[];
  /** Set when a Pro trial started: its charge day. */
  trialCharge?: DateOnly | null;
  today: DateOnly;
  nowHour?: number;
  notificationsOn: boolean;
  /** Pro without a trial (monthly or lifetime). */
  pro?: boolean;
}): SetSummary {
  const reminded = subs.filter((s) => remindedIds.includes(s.id));
  const rows: HeadsUpRow[] = [];
  for (const s of reminded) {
    const d = firstHeadsUp(s.charge, today, nowHour);
    if (d) rows.push({ id: s.id, name: s.name, date: d, guess: s.guess });
  }
  if (trialCharge) {
    const d = firstHeadsUp(trialCharge, today, nowHour);
    if (d) rows.push({ id: 'ditch-pro-trial', name: 'Ditch Pro trial', date: d, guess: false, trial: true });
  }
  // Soonest first; on the same day the trial goes first (it's the one we charge).
  rows.sort((a, b) => (a.date === b.date ? Number(!!b.trial) - Number(!!a.trial) : a.date < b.date ? -1 : 1));

  const shown = rows.slice(0, pro ? 4 : 3);
  const guesses = subs.filter((s) => s.guess);
  // Name the guesses the user can see in the card first.
  const named = [
    ...shown.filter((r) => r.guess).map((r) => subs.find((s) => s.id === r.id)!),
    ...guesses.filter((g) => !shown.some((r) => r.id === g.id)),
  ];
  let note: string;
  if (!notificationsOn) {
    note = 'Notifications are off, so these can’t reach you yet. You can turn them on in iPhone Settings anytime.';
  } else if (pro) {
    if (guesses.length === 0) note = 'All your dates are real, so every heads-up says the exact day.';
    else if (guesses.length === 1)
      note = `${possessive(named[0].name)} date is still a guess. Its heads-up says “renews around…” until you fix it.`;
    else
      note = `${guesses.length} dates are still guesses, like ${joinNames(named.slice(0, 2).map((g) => possessive(g.name)))}. Their heads-ups say “renews around…” until you fix them.`;
  } else {
    const parts: string[] = [];
    const left = subs.filter((s) => !remindedIds.includes(s.id)).map((s) => s.name);
    if (left.length) parts.push(`${joinNames(left)} ${left.length === 1 ? 'has' : 'have'} no heads-up.`);
    const g = reminded.find((s) => s.guess);
    if (g) parts.push(`${possessive(g.name)} date is a guess, so its heads-up says “renews around ${weekdayDate(g.charge)}.”`);
    note = parts.join(' ') || 'Every heads-up comes at 9:00 AM, 3 days and 1 day before.';
  }

  return {
    rows: shown,
    note,
    tracked: subs.length,
    withHeadsUps: trialCharge ? `${subs.length} + trial` : String(reminded.length),
    datesToCheck: guesses.length,
  };
}
