// Web preview only: browsers can't hold iOS local notifications. The status
// can be faked with ?notif=denied|undetermined|quiet for screenshots; the
// phone build uses notifications.ts.

import type { PlannedReminder } from '@/domain/reminders';
import { webParam } from '@/dev/webParams';

export type NotifStatus = 'granted' | 'quiet' | 'denied' | 'undetermined';

let status: NotifStatus = (['granted', 'quiet', 'denied', 'undetermined'] as const).find((s) => s === webParam('notif')) ?? 'granted';
let planned: PlannedReminder[] = [];

export function setupNotifications() {}
export async function getNotifStatus(): Promise<NotifStatus> {
  return status;
}
export async function requestNotifPermission(): Promise<NotifStatus> {
  if (status === 'undetermined') status = 'granted';
  return status;
}
export async function applyPlan(plan: PlannedReminder[]): Promise<void> {
  planned = status === 'granted' || status === 'quiet' ? plan : [];
}
export async function pendingCount(): Promise<number | null> {
  return planned.length;
}
export async function sendTestReminder(): Promise<boolean> {
  return true;
}
export async function cancelAllReminders(): Promise<void> {
  planned = [];
}
