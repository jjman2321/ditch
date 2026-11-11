// The reminder plan: which local notifications should be pending right now.
// Pure, so every rule is tested in Jest (CLAUDE.md rule 3, SPEC §5.3).
//
// - Heads-ups 3 days and 1 day before each charge, at 9:00 local (Pro can
//   change the days; everyone can change the time).
// - Free: only the picked subs (at most 3). Pro: every active one not muted.
// - Ditch's own Pro trial: always 3 days and 1 day before its charge.
// - Ditched, not cancelled yet: exactly one "Did you cancel X?" the day before.
// - Never in the past, never twice, at most 64, soonest first.

import { HEADS_UP_LEADS } from './charges';
import { stillUsingIt } from './copy';
import { addDays, daysBetween, parseDate, toDateOnly, weekdayDate, weekdayName, type DateOnly } from './dates';
import { CYCLE_WORDS, formatMoney } from './money';
import { effectiveLeads, parseTime, shortTimeLabel, type Settings } from './settings';
import { chargeOfSub, chargesBetween, isActive, isPending, isPricedSub, isProTrial, remindedIds, type Sub } from './subs';

/** iOS keeps at most 64 pending local notifications per app. */
/** iOS keeps 64; we stop at 60 so the test reminder never pushes one off (SPEC §5.3). */
export const MAX_PENDING = 60;
/** How far ahead to plan. Reschedules run on every launch, so a year is plenty. */
export const HORIZON_DAYS = 366;

export type ReminderKind = 'heads-up' | 'trial' | 'pro-trial' | 'last-check' | 'keep-going';

export type PlannedReminder = {
  /** Deterministic, so the same reminder is never scheduled twice. */
  id: string;
  subId: string;
  kind: ReminderKind;
  /** Local wall-clock time it fires. */
  fireAt: Date;
  /** The charge it's about. */
  chargeDate: DateOnly;
  /** Days before the charge. */
  lead: number;
  /** Left empty: iOS shows "Ditch" above the message, like the designs. */
  title: string;
  body: string;
};

export type PlanSettings = Pick<Settings, 'reminderTime' | 'leadDays' | 'currency'> & { pro: boolean };

/** A local Date for a calendar day at "HH:MM". */
export function atTime(day: DateOnly, time: string): Date {
  const { y, m, d } = parseDate(day);
  const { h, m: min } = parseTime(time);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

/** "today", "tomorrow", "Saturday" (2–6 days), "on Sat, Nov 21" (a week or more). */
export function whenWords(charge: DateOnly, fireDay: DateOnly): string {
  const diff = daysBetween(fireDay, charge);
  if (diff <= 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff < 7) return weekdayName(charge);
  return `on ${weekdayDate(charge)}`;
}

type Money = (amountMinor: number, currency: string) => string;

function priceOf(s: Sub, money: Money): string | null {
  return isPricedSub(s) ? money(s.amountMinor, s.currency) : null;
}

/** The dry, kind voice. Never shames, never says "saved". */
export function headsUpBody(s: Sub, charge: DateOnly, fireDay: DateOnly, money: Money): string {
  const lead = daysBetween(fireDay, charge);
  const when = whenWords(charge, fireDay);
  const price = priceOf(s, money);
  const tail = lead <= 1 ? 'Last call if you’re done with it.' : stillUsingIt(s.category ?? undefined);
  return `${s.name} renews ${when}.${price ? ` ${price}.` : ''} ${tail}`;
}

/** A free trial the user is tracking (counts toward the free 3). */
export function trialBody(s: Sub, charge: DateOnly, fireDay: DateOnly, money: Money): string {
  const when = whenWords(charge, fireDay);
  const price = priceOf(s, money);
  if (daysBetween(fireDay, charge) <= 1) return `Your ${s.name} trial ends ${when}.${price ? ` It’ll charge ${price}.` : ''}`;
  return `Your ${s.name} trial ends ${when}.${price ? ` Then it’s ${price} ${CYCLE_WORDS[s.cycle]}.` : ''}`;
}

/** Ditch's own trial (DECISIONS #15): same timing, plain about the price. */
export function proTrialBody(s: Sub, charge: DateOnly, fireDay: DateOnly, money: Money): string {
  const when = whenWords(charge, fireDay);
  const price = priceOf(s, money);
  if (daysBetween(fireDay, charge) <= 1)
    return `Your Ditch Pro trial ends ${when}.${price ? ` ${price} ${CYCLE_WORDS[s.cycle]} after that.` : ''} Cancel in iPhone Settings if you’re done.`;
  return `Your Ditch Pro trial ends ${when}.${price ? ` Then it’s ${price} ${CYCLE_WORDS[s.cycle]}.` : ''} Keep it or ditch it.`;
}

/** The one reminder a ditched-but-not-cancelled sub gets. */
export function lastCheckBody(s: Sub): string {
  return isProTrial(s) ? 'Did you cancel your Ditch Pro trial? It charges tomorrow.' : `Did you cancel ${s.name}? It charges tomorrow.`;
}

export const TEST_BODY = 'Test from Ditch. If you can read this, you’re set.';

/**
 * The full plan, soonest first. `now` is the phone's local time.
 * Anything at or before `now` is left out: a 9:00 heads-up today is only
 * planned while it's still before 9:00.
 */
export function planReminders(
  subs: Sub[],
  settings: PlanSettings,
  now: Date,
  { cap = MAX_PENDING, horizonDays = HORIZON_DAYS }: { cap?: number; horizonDays?: number } = {},
): PlannedReminder[] {
  const today = toDateOnly(now);
  const until = addDays(today, horizonDays);
  const money: Money = (a, c) => formatMoney(a, c, { home: settings.currency });
  const time = settings.reminderTime;
  const leads = effectiveLeads(settings, settings.pro);
  const reminded = remindedIds(subs, settings.pro);
  const out = new Map<string, PlannedReminder>();
  const add = (r: Omit<PlannedReminder, 'fireAt' | 'title'> & { fireDay: DateOnly }) => {
    const fireAt = atTime(r.fireDay, time);
    if (fireAt.getTime() <= now.getTime()) return; // never in the past
    if (out.has(r.id)) return; // never twice
    const { fireDay: _f, ...rest } = r;
    out.set(r.id, { ...rest, fireAt, title: '' });
  };

  for (const s of subs) {
    if (isPending(s)) {
      // Exactly one: the day before the charge it has to be cancelled by.
      const charge = s.cancelBy && s.cancelBy >= today ? s.cancelBy : chargeOfSub(s, today);
      if (!charge) continue; // no date yet: nothing to check against
      add({ id: `last:${s.id}:${charge}`, subId: s.id, kind: 'last-check', chargeDate: charge, lead: 1, fireDay: addDays(charge, -1), body: lastCheckBody(s) });
      continue;
    }
    if (!isActive(s)) continue;

    if (isProTrial(s)) {
      // Only the trial's own charge, with the standard 3 and 1 days.
      const charge = chargeOfSub(s, today);
      if (!charge || charge !== s.anchor) continue; // the trial is over
      for (const lead of HEADS_UP_LEADS) {
        const fireDay = addDays(charge, -lead);
        add({ id: `pro:${s.id}:${charge}:${lead}`, subId: s.id, kind: 'pro-trial', chargeDate: charge, lead, fireDay, body: proTrialBody(s, charge, fireDay, money) });
      }
      continue;
    }

    if (!reminded.has(s.id)) continue;
    // Every charge in the next year, so reminders keep coming even if the app isn't opened.
    const first = chargeOfSub(s, today);
    if (!first) continue; // remindedIds already skips these; belt and braces
    const charges = chargesBetween(s, first, until);
    for (const charge of charges) {
      const trial = s.isTrial && charge === s.anchor;
      for (const lead of leads) {
        const fireDay = addDays(charge, -lead);
        add({
          id: `sub:${s.id}:${charge}:${lead}`,
          subId: s.id,
          kind: trial ? 'trial' : 'heads-up',
          chargeDate: charge,
          lead,
          fireDay,
          body: trial ? trialBody(s, charge, fireDay, money) : headsUpBody(s, charge, fireDay, money),
        });
      }
    }
  }

  const sorted = [...out.values()].sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime() || (a.id < b.id ? -1 : 1));
  if (sorted.length <= cap) return sorted;
  // More than fit: keep the soonest, and use the last slot to ask them to open Ditch,
  // so a long list never just goes quiet (reminders are only lined up when the app opens).
  const kept = sorted.slice(0, Math.max(0, cap - 1));
  const last = kept[kept.length - 1];
  if (!last) return kept;
  const day = toDateOnly(last.fireAt);
  return [...kept, { id: `keep:${day}`, subId: '', kind: 'keep-going', fireAt: atTime(addDays(day, 1), time), chargeDate: day, lead: 0, title: '', body: KEEP_GOING_BODY }];
}

export const KEEP_GOING_BODY = 'Open Ditch so your next reminders get lined up. Takes a second.';

/** What's pending on the phone, as far as reconciling cares. */
export type ScheduledInfo = { id: string; fingerprint: string | null };

/** Same id, same time, same words. */
export function fingerprint(r: Pick<PlannedReminder, 'fireAt' | 'body'>): string {
  return `${r.fireAt.getTime()}|${r.body}`;
}

/** Ids we own (the test reminder and anything else are left alone). */
export const isPlannedId = (id: string) => /^(sub|pro|last|keep):/.test(id);

/**
 * Turn what's pending into the plan with the fewest changes: cancel ours
 * that aren't in the plan (or changed), schedule what's missing.
 */
export function reconcile(existing: ScheduledInfo[], plan: PlannedReminder[]): { cancel: string[]; schedule: PlannedReminder[] } {
  const wanted = new Map(plan.map((r) => [r.id, fingerprint(r)]));
  const keep = new Set<string>();
  const cancel: string[] = [];
  for (const e of existing) {
    if (!isPlannedId(e.id)) continue;
    if (wanted.get(e.id) === e.fingerprint && !keep.has(e.id)) keep.add(e.id);
    else cancel.push(e.id);
  }
  return { cancel, schedule: plan.filter((r) => !keep.has(r.id)) };
}

/** The next reminder in the plan, for "Next one: Netflix, Fri, Nov 13 at 9 AM". */
export function nextReminder(plan: PlannedReminder[], subs: Sub[]): { name: string; fireAt: Date } | null {
  const r = plan[0];
  if (!r) return null;
  const s = subs.find((x) => x.id === r.subId);
  return { name: s ? (isProTrial(s) ? 'Ditch Pro trial' : s.name) : 'Ditch', fireAt: r.fireAt };
}

/** When the next reminder lands, for Home: "Today, 9 AM", "Tomorrow, 9 AM", "Sat, Nov 14, 9 AM". */
export function whenLabel(fireAt: Date, today: DateOnly, time: string): string {
  const day = toDateOnly(fireAt);
  const t = shortTimeLabel(time);
  const n = daysBetween(today, day);
  return n === 0 ? `Today, ${t}` : n === 1 ? `Tomorrow, ${t}` : `${weekdayDate(day)}, ${t}`;
}
