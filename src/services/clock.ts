// "Now" for the app. On the phone it's the real clock. The web preview can
// pin the day with ?today=YYYY-MM-DD so screenshots match the renders.

import { toDateOnly, type DateOnly } from '@/domain/dates';
import { webParam } from '@/dev/webParams';

const pinned = /^\d{4}-\d{2}-\d{2}$/.test(webParam('today') ?? '') ? webParam('today')! : null;

export function now(): Date {
  if (!pinned) return new Date();
  const [y, m, d] = pinned.split('-').map(Number);
  return new Date(y, m - 1, d, 9, 41);
}

export function today(): DateOnly {
  return toDateOnly(now());
}
