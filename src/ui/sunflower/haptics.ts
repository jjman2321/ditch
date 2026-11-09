// Haptics only mark meaningful actions (design/v10/MOTION.md, haptic map).
// Rule: never two strong haptics within 600 ms of each other.

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const on = Platform.OS === 'ios' || Platform.OS === 'android';
let lastStrong = 0;

function strong(run: () => Promise<void>) {
  const now = Date.now();
  if (now - lastStrong < 600) return;
  lastStrong = now;
  run().catch(() => {});
}

export const haptic = {
  /** Toggle a bell, pick a plan, pick a day. */
  select: () => {
    if (on) Haptics.selectionAsync().catch(() => {});
  },
  /** The total lands; undo. */
  light: () => {
    if (on) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  /** Starting the trial. */
  medium: () => {
    if (on) strong(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  },
  /** The stamp hits. */
  heavy: () => {
    if (on) strong(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
  },
  success: () => {
    if (on) strong(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },
  /** Hit the free 3 limit. */
  warning: () => {
    if (on) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
