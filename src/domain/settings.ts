// App settings, stored as key/value text in SQLite (SPEC §4).
// Parsing is forgiving: anything missing or broken falls back to the default.

import { HEADS_UP_HOUR, HEADS_UP_LEADS } from './charges';
import { EMPTY_REVIEW, parseReview, type ReviewState } from './review';

export type ProPlan = 'yearly' | 'monthly' | 'lifetime';

export type Settings = {
  /** Wall-clock time for every reminder, "HH:MM" (24h). */
  reminderTime: string;
  /** Days before a charge. Free is always [3, 1]; Pro can change it. */
  leadDays: number[];
  /** Currency for new subscriptions. Never relabels existing ones. */
  currency: string;
  /** Whose catalog prices to use (ISO country), or null. */
  country: string | null;
  onboardingDone: boolean;
  /** Stubbed until RevenueCat: the Pro plan, if any. */
  proPlan: ProPlan | null;
  /** The "Hold a sub to ditch it" hint goes away after the first ditch. */
  holdHintDone: boolean;
  /** When we last offered Apple's rating prompt (src/domain/review.ts). */
  review: ReviewState;
};

export const DEFAULT_SETTINGS: Settings = {
  reminderTime: `${String(HEADS_UP_HOUR).padStart(2, '0')}:00`,
  leadDays: [...HEADS_UP_LEADS],
  currency: 'USD',
  country: null,
  onboardingDone: false,
  proPlan: null,
  holdHintDone: false,
  review: EMPTY_REVIEW,
};

/** Lead days people can choose (Remind me page). */
export const LEAD_CHOICES = [14, 7, 3, 2, 1, 0] as const;

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseTime(t: string): { h: number; m: number } {
  const match = TIME.exec(t);
  return match ? { h: Number(match[1]), m: Number(match[2]) } : { h: HEADS_UP_HOUR, m: 0 };
}

export function formatTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** "9:00 AM", "6:30 PM". */
export function timeLabel(t: string): string {
  const { h, m } = parseTime(t);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  // Non-breaking space, so "9 AM" never splits across two lines.
  return `${h12}:${String(m).padStart(2, '0')}\u00A0${h < 12 ? 'AM' : 'PM'}`;
}

/** "9 AM" when on the hour, else "9:30 AM". */
export function shortTimeLabel(t: string): string {
  const { m } = parseTime(t);
  return m === 0 ? timeLabel(t).replace(':00', '') : timeLabel(t);
}

/** Unique, whole, 0–30, biggest first. Empty falls back to the default. */
export function cleanLeads(leads: unknown): number[] {
  if (!Array.isArray(leads)) return [...HEADS_UP_LEADS];
  const ok = [...new Set(leads.filter((x): x is number => Number.isInteger(x) && x >= 0 && x <= 30))].sort((a, b) => b - a);
  return ok.length ? ok : [...HEADS_UP_LEADS];
}

/** "3 days and 1 day before", "1 week and 3 days before", "On the day". */
export function leadsLabel(leads: number[]): string {
  const l = cleanLeads(leads);
  const before = l.filter((d) => d > 0).map(leadWord);
  const joined = before.length <= 1 ? (before[0] ?? '') : `${before.slice(0, -1).join(', ')} and ${before[before.length - 1]}`;
  let text = joined ? `${joined} before` : '';
  if (l.includes(0)) text = text ? `${text} and on the day` : 'on the day';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "2 weeks", "1 week", "3 days", "1 day", "On the day". */
export function leadWord(d: number): string {
  return d === 0 ? 'On the day' : d === 14 ? '2 weeks' : d === 7 ? '1 week' : d === 1 ? '1 day' : `${d} days`;
}

const PLANS: ProPlan[] = ['yearly', 'monthly', 'lifetime'];

export function parseSettings(kv: Record<string, string>): Settings {
  let leads: unknown = null;
  try {
    leads = kv.lead_days ? JSON.parse(kv.lead_days) : null;
  } catch {
    leads = null;
  }
  return {
    reminderTime: kv.reminder_time && TIME.test(kv.reminder_time) ? kv.reminder_time : DEFAULT_SETTINGS.reminderTime,
    leadDays: cleanLeads(leads),
    currency: kv.currency && /^[A-Z]{3}$/.test(kv.currency) ? kv.currency : DEFAULT_SETTINGS.currency,
    country: kv.country && /^[A-Z]{2}$/.test(kv.country) ? kv.country : null,
    onboardingDone: kv.onboarding_done === '1',
    proPlan: PLANS.includes(kv.pro_plan as ProPlan) ? (kv.pro_plan as ProPlan) : null,
    holdHintDone: kv.hold_hint_done === '1',
    review: parseReview(kv.review),
  };
}

/** Only the keys that were passed. Null means "remove the key". */
export function settingsToKv(patch: Partial<Settings>): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  if (patch.reminderTime !== undefined) out.reminder_time = patch.reminderTime;
  if (patch.leadDays !== undefined) out.lead_days = JSON.stringify(cleanLeads(patch.leadDays));
  if (patch.currency !== undefined) out.currency = patch.currency;
  if (patch.country !== undefined) out.country = patch.country;
  if (patch.onboardingDone !== undefined) out.onboarding_done = patch.onboardingDone ? '1' : '0';
  if (patch.proPlan !== undefined) out.pro_plan = patch.proPlan;
  if (patch.holdHintDone !== undefined) out.hold_hint_done = patch.holdHintDone ? '1' : '0';
  if (patch.review !== undefined) out.review = JSON.stringify(patch.review);
  return out;
}

/** Free always uses 3 days and 1 day; custom timing comes with Pro. */
export function effectiveLeads(settings: Pick<Settings, 'leadDays'>, pro: boolean): number[] {
  return pro ? cleanLeads(settings.leadDays) : [...HEADS_UP_LEADS];
}
