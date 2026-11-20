// Pro upsell for free users who've used all 3 reminders (owner, Nov 20, option C; DECISIONS #82).
//
// 1. On open, at most once a week: the paywall, only when it's about something real (3 of 3 reminders in
//    use and at least one dated sub left without one). Research: a weekly on-open paywall for free users
//    drove 15% of new revenue with no backlash (RevenueCat 2026); every open is the nagging our users hate.
// 2. On Home, the "no reminder" card turns timely when one of those subs charges within a week:
//    "Hulu charges Wed, Nov 25. No reminder on it." It comes back for each new charge even if hidden before.

import { daysBetween, type DateOnly } from './dates';
import { chargeOfSub, type Sub } from './subs';

/** Never in the first days after install: let them get value first. */
export const UPSELL_MIN_AGE_DAYS = 3;
/** At most once this many days. */
export const UPSELL_GAP_DAYS = 7;
/** "Charges soon" for the Home card: 2 to 7 days out, so a reminder turned on now still fires (1 day before at the latest). */
export const UPSELL_SOON_MIN_DAYS = 2;
export const UPSELL_SOON_DAYS = 7;

export type OpenUpsellInput = {
  pro: boolean;
  onboardingDone: boolean;
  /** Notifications off: reminders can't fire, so selling more of them is pointless (Home shows the fix instead). */
  blocked: boolean;
  installedOn: DateOnly | null;
  lastShownOn: DateOnly | null;
  /** The rating prompt was offered today: never two asks in one day. */
  reviewAskedOn: DateOnly | null;
  remindedCount: number;
  unremindedCount: number;
  freeReminders: number;
  today: DateOnly;
};

export function shouldShowOpenUpsell(i: OpenUpsellInput): boolean {
  if (i.pro || !i.onboardingDone || i.blocked || !i.installedOn) return false;
  if (i.remindedCount < i.freeReminders || i.unremindedCount < 1) return false;
  if (daysBetween(i.installedOn, i.today) < UPSELL_MIN_AGE_DAYS) return false;
  if (i.lastShownOn && daysBetween(i.lastShownOn, i.today) < UPSELL_GAP_DAYS) return false;
  if (i.reviewAskedOn === i.today) return false;
  return true;
}

/** The soonest charge 2–7 days out among subs without a reminder. Null if none. */
export function soonUnreminded(unreminded: Sub[], today: DateOnly): { sub: Sub; charge: DateOnly } | null {
  let best: { sub: Sub; charge: DateOnly } | null = null;
  for (const sub of unreminded) {
    const charge = chargeOfSub(sub, today);
    if (!charge) continue;
    const d = daysBetween(today, charge);
    if (d < UPSELL_SOON_MIN_DAYS || d > UPSELL_SOON_DAYS) continue;
    if (!best || charge < best.charge) best = { sub, charge };
  }
  return best;
}
