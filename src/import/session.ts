// Holds what was found between the reading screen and the check-and-add list.
// In memory only: closing the app forgets it (nothing about the screenshot or
// statement is ever saved).

import { useSyncExternalStore } from 'react';
import type { Found } from './types';

export type FindResult = { found: Found[]; source: 'apple' | 'statement'; appleCharges: number; note: string | null };

let current: FindResult | null = null;
const listeners = new Set<() => void>();

export function setFindResult(r: FindResult | null) {
  current = r;
  listeners.forEach((l) => l());
}

export function useFindResult(): FindResult | null {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => current,
    () => current,
  );
}

/** Where "Add" puts what was found: the saved list, or the onboarding picks (then on to the total). */
let target: 'app' | 'onboarding' = 'app';
export function setFindTarget(t: 'app' | 'onboarding') {
  target = t;
}
export function findTarget(): 'app' | 'onboarding' {
  return target;
}
