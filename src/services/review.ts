// Apple's rating prompt. We only offer it; iOS decides whether it shows
// (at most 3 times a year). Never tied to a button (DECISIONS #38).

import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';

export async function offerReview(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    if (!(await StoreReview.isAvailableAsync())) return false;
    await StoreReview.requestReview();
    return true;
  } catch {
    return false;
  }
}
