// When to show Apple's "Enjoying Ditch?" rating prompt (DECISIONS #38).
// Only right after a win, never in onboarding, never from a button, never
// with a reward. Apple shows it at most 3 times a year and may skip it, so
// we only ever *offer* it. Our own limits sit inside Apple's:
// - not in the first 3 days
// - at least 60 days between asks, and once per app version
// - 3 asks in total, ever

import { addDays, daysBetween, type DateOnly } from './dates';
import { chargesBetween, hasDate, isActive, remindedIds, type Sub } from './subs';

export type ReviewState = {
  /** First day we saw this install (set on the first launch with this code). */
  installedOn: DateOnly | null;
  lastAskedOn: DateOnly | null;
  askedVersion: string | null;
  askCount: number;
};

export const EMPTY_REVIEW: ReviewState = { installedOn: null, lastAskedOn: null, askedVersion: null, askCount: 0 };

/** The two wins: you confirmed a cancel, or reminders have done their job twice. */
export type ReviewMoment = 'cancelled' | 'reminders-worked';

export const REVIEW_MIN_AGE_DAYS = 3;
export const REVIEW_GAP_DAYS = 60;
export const REVIEW_MAX_ASKS = 3;
/** Reminder days that have to pass before "reminders worked" counts. */
export const REVIEW_REMINDER_DAYS = 2;

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function parseReview(raw: string | undefined): ReviewState {
  if (!raw) return { ...EMPTY_REVIEW };
  try {
    const v = JSON.parse(raw) as Partial<Record<keyof ReviewState, unknown>>;
    const day = (x: unknown) => (typeof x === 'string' && DAY.test(x) ? x : null);
    return {
      installedOn: day(v.installedOn),
      lastAskedOn: day(v.lastAskedOn),
      askedVersion: typeof v.askedVersion === 'string' ? v.askedVersion : null,
      askCount: Number.isInteger(v.askCount) && (v.askCount as number) >= 0 ? (v.askCount as number) : 0,
    };
  } catch {
    return { ...EMPTY_REVIEW };
  }
}

export function shouldAskForReview(
  state: ReviewState,
  { today, version, onboardingDone }: { today: DateOnly; version: string; onboardingDone: boolean },
): boolean {
  if (!onboardingDone || !state.installedOn) return false;
  if (daysBetween(state.installedOn, today) < REVIEW_MIN_AGE_DAYS) return false;
  if (state.askCount >= REVIEW_MAX_ASKS) return false;
  if (state.askedVersion === version) return false;
  if (state.lastAskedOn && daysBetween(state.lastAskedOn, today) < REVIEW_GAP_DAYS) return false;
  return true;
}

/** The state after an ask. */
export function markAsked(state: ReviewState, today: DateOnly, version: string): ReviewState {
  return { ...state, lastAskedOn: today, askedVersion: version, askCount: state.askCount + 1 };
}

/**
 * Days since install, before today, on which a reminder was due for one of
 * the subs that get reminders. Worked out from the list, so it needs no
 * extra tracking. `leads` are the ones in use (effectiveLeads).
 */
export function pastReminderDays(subs: Sub[], { pro, leads, from, today }: { pro: boolean; leads: number[]; from: DateOnly; today: DateOnly }): number {
  if (from >= today) return 0;
  const reminded = remindedIds(subs, pro);
  const maxLead = Math.max(0, ...leads);
  const days = new Set<DateOnly>();
  for (const s of subs) {
    if (!isActive(s) || !hasDate(s) || !reminded.has(s.id)) continue;
    for (const charge of chargesBetween(s, from, addDays(today, maxLead))) {
      for (const lead of leads) {
        const day = addDays(charge, -lead);
        if (day >= from && day < today) days.add(day);
      }
    }
  }
  return days.size;
}
