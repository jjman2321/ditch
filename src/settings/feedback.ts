// Feedback & help in Settings: report a problem, suggest a feature, rate Ditch.
// A problem report carries one line of counts so support can see why a
// reminder didn't come. Never names, prices or dates (your list stays on your phone).

import { Linking, Platform } from 'react-native';

import { leadsLabel, shortTimeLabel, type Settings } from '@/domain/settings';
import { hasDate, listedUserSubs, remindedIds, type Sub } from '@/domain/subs';
import { pendingCount, type NotifStatus } from '@/services/notifications';
import { tell } from '@/ui/alert';

import { APP_VERSION } from './version';

export const SUPPORT_EMAIL = 'support@ditchsubs.app';
/** Filled in once the app has an App Store listing (App Store Connect → the app → App Information → Apple ID). */
export const APP_STORE_ID: string | null = null;

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
    `${shortTimeLabel(d.settings.reminderTime).replace(' ', ' ')}, ${leadsLabel(d.leads).toLowerCase()}`,
    d.pending === null ? null : `${d.pending} waiting`,
    `Ditch ${APP_VERSION}`,
    `${Platform.OS === 'ios' ? 'iOS' : Platform.OS} ${Platform.Version}`,
  ];
  return parts.filter(Boolean).join(' · ');
}

function mail(subject: string, body: string) {
  const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  Linking.openURL(url).catch(() => tell('Email us', `${SUPPORT_EMAIL}\n\nNo Mail app is set up on this iPhone, so write to us from any email app.`));
}

export async function reportProblem(d: Omit<Parameters<typeof diagnosticsLine>[0], 'pending'>) {
  const pending = await pendingCount().catch(() => null);
  const line = diagnosticsLine({ ...d, pending });
  mail('Problem with Ditch', `What happened?\n\n\n—\n${line}\n(Counts only: no names or prices. It helps us find the problem.)`);
}

export function suggestFeature() {
  mail('Idea for Ditch', 'What would make Ditch better for you?\n\n');
}

export function rateDitch() {
  if (APP_STORE_ID) Linking.openURL(`https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`).catch(() => {});
  else tell('Not yet', 'Rating opens once Ditch is in the App Store. Thanks for wanting to!');
}
