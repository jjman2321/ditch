// Feedback & help in Settings: one in-app form (FeedbackSheet) for a problem,
// an idea or a missing subscription, sent to ditchsubs.app. Mail stays as the
// fallback ("Email us instead") and for the editor's "Ask us to add it".
// A problem report can carry one line of counts so support can see why a
// reminder didn't come. Never names, prices or dates (your list stays on your phone).

import { Linking, Platform } from 'react-native';

import { leadsLabel, shortTimeLabel, type Settings } from '@/domain/settings';
import { hasDate, listedUserSubs, remindedIds, type Sub } from '@/domain/subs';
import { type NotifStatus } from '@/services/notifications';
import { tell } from '@/ui/alert';

import { APP_VERSION } from './version';

export const SUPPORT_EMAIL = 'support@ditchsubs.app';
/** Where the in-app form posts (web/src/app/api/feedback/route.ts). */
export const FEEDBACK_URL = 'https://ditchsubs.app/api/feedback';
/** Filled in once the app has an App Store listing (App Store Connect → the app → App Information → Apple ID). */
export const APP_STORE_ID: string | null = null;

/** Same limits as the server, so the app never sends something it will refuse. */
export const FEEDBACK_MIN = 3;
export const FEEDBACK_MAX = 4000;
export const APP_INFO_MAX = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FeedbackKind = 'problem' | 'idea' | 'service';

const NOTIF_WORD: Record<NotifStatus, string> = { granted: 'on', quiet: 'on, quiet', denied: 'off', undetermined: 'not asked' };

/** "Reminders on · Free · 6 subs, 3 with reminders, 2 with no date · 9 AM, 3 days and 1 day before · 48 waiting · Ditch 1.0.0 (12) · iOS 18.1" */
export function diagnosticsLine(d: { subs: Sub[]; settings: Settings; pro: boolean; notif: NotifStatus; pending: number | null; leads: number[] }): string {
  const listed = listedUserSubs(d.subs);
  const reminded = remindedIds(d.subs, d.pro).size;
  const undated = listed.filter((s) => !hasDate(s)).length;
  const plan = d.settings.proPlan ? `Pro ${d.settings.proPlan}` : 'Free';
  const parts = [
    `Reminders ${NOTIF_WORD[d.notif]}`,
    plan,
    `${listed.length} subs, ${reminded} with reminders, ${undated} with no date`,
    `${shortTimeLabel(d.settings.reminderTime).replace('\u00A0', ' ')}, ${leadsLabel(d.leads).toLowerCase()}`,
    d.pending === null ? null : `${d.pending} waiting`,
    `Ditch ${APP_VERSION}`,
    `${Platform.OS === 'ios' ? 'iOS' : Platform.OS} ${Platform.Version}`,
  ];
  return parts.filter(Boolean).join(' · ');
}

/** What goes to the server: only what they typed, plus the counts line if they left "Include app info" on. */
export type FeedbackPayload = { kind: FeedbackKind; message: string; email: string | null; app_info: string | null };

export type FeedbackCheck = { ok: true; payload: FeedbackPayload } | { ok: false; error: 'short' | 'long' | 'email' };

export function isEmail(s: string): boolean {
  return EMAIL.test(s) && s.length <= 254;
}

/** Checks the form and builds the body. Trims, drops an empty email, and leaves app info out unless it's switched on. */
export function buildFeedback(f: { kind: FeedbackKind; message: string; email: string; appInfo: string | null; includeAppInfo: boolean }): FeedbackCheck {
  const message = f.message.trim();
  if (message.length < FEEDBACK_MIN) return { ok: false, error: 'short' };
  if (message.length > FEEDBACK_MAX) return { ok: false, error: 'long' };
  const email = f.email.trim();
  if (email && !isEmail(email)) return { ok: false, error: 'email' };
  const info = f.includeAppInfo && f.appInfo ? f.appInfo.slice(0, APP_INFO_MAX) : null;
  return { ok: true, payload: { kind: f.kind, message, email: email || null, app_info: info } };
}

/** Posts the form. True only when the server says it saved it; offline, a timeout or a server error is false. */
export async function sendFeedback(payload: FeedbackPayload, opts: { fetch?: typeof fetch; timeoutMs?: number } = {}): Promise<boolean> {
  const doFetch = opts.fetch ?? fetch;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 15000);
  try {
    const res = await doFetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => null)) as { ok?: unknown } | null;
    return json?.ok === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

const SUBJECT: Record<FeedbackKind, string> = { problem: 'Problem with Ditch', idea: 'Idea for Ditch', service: 'Please add a subscription to Ditch' };

/** The mail version of the form, for "Email us instead": keeps what they typed. */
export function feedbackEmail(p: FeedbackPayload): { subject: string; body: string } {
  const info = p.app_info ? `\n\n—\n${p.app_info}\n(Counts only: no names or prices. It helps us find the problem.)` : '';
  return { subject: SUBJECT[p.kind], body: `${p.message}${info}\n` };
}

function mail(subject: string, body: string) {
  const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  Linking.openURL(url).catch(() => tell('Email us', `${SUPPORT_EMAIL}\n\nNo Mail app is set up on this iPhone, so write to us from any email app.`));
}

export function emailFeedback(p: FeedbackPayload) {
  const m = feedbackEmail(p);
  mail(m.subject, m.body);
}

/** "Not on our list?" in the editor (Nov 15: Bobby lets people submit services; we add them to the catalog for everyone). */
export function suggestService(name?: string) {
  const n = name?.trim();
  mail(
    n ? `Please add ${n} to Ditch` : 'Please add a subscription to Ditch',
    `${n ? `Name: ${n}` : 'Name:'}\nCountry:\nIts website (if you know it):\n\nThanks! We add the price from the service’s own page.\n`,
  );
}

/**
 * "Rate Ditch" only shows once there's an App Store listing to open. Apple's own rating prompt
 * (expo-store-review) is never tied to a button (DECISIONS #38): iOS may skip it, and a row that
 * sometimes does nothing reads as broken.
 */
export const CAN_RATE = APP_STORE_ID !== null;

export function rateDitch() {
  if (APP_STORE_ID) Linking.openURL(`https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`).catch(() => {});
}
