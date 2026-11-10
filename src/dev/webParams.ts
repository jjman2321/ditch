// Web preview only: read the first URL's query once at start-up, before the
// router rewrites the address. Used for screenshots (?seed=demo&today=…).
// Always null on the phone.

import { Platform } from 'react-native';

export const WEB_PARAMS: URLSearchParams | null =
  Platform.OS === 'web' && typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search) : null;

export function webParam(name: string): string | null {
  return WEB_PARAMS?.get(name) ?? null;
}
