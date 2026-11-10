// expo-notifications glue: local notifications only (no push, no server).
// The plan comes from src/domain/reminders.ts; this file only talks to iOS.
// Reschedules are queued and coalesced, so two quick changes never race.

import * as Notifications from 'expo-notifications';

import { TEST_BODY, fingerprint, reconcile, type PlannedReminder } from '@/domain/reminders';

/** granted · quiet (allowed, but banners are off) · denied · undetermined (never asked). */
export type NotifStatus = 'granted' | 'quiet' | 'denied' | 'undetermined';

let handlerSet = false;

/** Show reminders even while Ditch is open (the test reminder needs this). */
export function setupNotifications() {
  if (handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

// iOS values (IosAuthorizationStatus / IosAlertStyle in expo-notifications).
const IOS_NOT_DETERMINED = 0;
const IOS_DENIED = 1;
const IOS_ALERT_NONE = 0;

function toStatus(p: Notifications.NotificationPermissionsStatus): NotifStatus {
  const ios = p.ios;
  if (ios) {
    if (ios.status === IOS_NOT_DETERMINED) return 'undetermined';
    if (ios.status === IOS_DENIED) return 'denied';
    return ios.alertStyle === IOS_ALERT_NONE ? 'quiet' : 'granted';
  }
  if (p.granted) return 'granted';
  return p.canAskAgain ? 'undetermined' : 'denied';
}

export async function getNotifStatus(): Promise<NotifStatus> {
  try {
    return toStatus(await Notifications.getPermissionsAsync());
  } catch {
    return 'undetermined';
  }
}

/** The real iOS prompt. Asked once; after a "Don't Allow", only iPhone Settings can change it. */
export async function requestNotifPermission(): Promise<NotifStatus> {
  try {
    return toStatus(await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } }));
  } catch {
    return 'denied';
  }
}

const canDeliver = (s: NotifStatus) => s === 'granted' || s === 'quiet';

async function pendingOurs() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.map((n) => ({ id: n.identifier, fingerprint: typeof n.content.data?.fp === 'string' ? (n.content.data.fp as string) : null }));
}

async function apply(plan: PlannedReminder[]): Promise<void> {
  const status = await getNotifStatus();
  // Without permission nothing can show; clear ours and wait for the next foreground.
  const target = canDeliver(status) ? plan : [];
  const { cancel, schedule } = reconcile(await pendingOurs(), target);
  for (const id of cancel) await Notifications.cancelScheduledNotificationAsync(id);
  for (const r of schedule) {
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: {
        ...(r.title ? { title: r.title } : null),
        body: r.body,
        sound: 'default',
        data: { fp: fingerprint(r), subId: r.subId, kind: r.kind },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.fireAt },
    });
  }
}

let latest: PlannedReminder[] | null = null;
let running: Promise<void> | null = null;

/**
 * Make the phone's pending reminders match the plan. Idempotent: running it
 * twice changes nothing the second time. Calls while one is running are
 * merged into one more pass with the newest plan.
 */
export function applyPlan(plan: PlannedReminder[]): Promise<void> {
  latest = plan;
  if (!running) {
    running = (async () => {
      while (latest) {
        const next = latest;
        latest = null;
        try {
          await apply(next);
        } catch {
          // A failed pass is retried on the next change or foreground.
        }
      }
    })().finally(() => {
      running = null;
    });
  }
  return running;
}

/** How many of our reminders are waiting on the phone (for the health check). */
export async function pendingCount(): Promise<number | null> {
  try {
    return (await pendingOurs()).filter((n) => /^(sub|pro|last):/.test(n.id)).length;
  } catch {
    return null;
  }
}

/** "Send me a test reminder": arrives in about 5 seconds, even with the app open. */
export async function sendTestReminder(): Promise<boolean> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `test:${Date.now()}`,
      content: { body: TEST_BODY, sound: 'default', data: { kind: 'test' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
    });
    return true;
  } catch {
    return false;
  }
}

/** Delete all data: nothing of ours stays scheduled. */
export async function cancelAllReminders(): Promise<void> {
  latest = null;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
}
