// Onboarding is saved as you go, so closing the app (or iOS closing it
// while you check your bank app for a date) never loses your picks. A small
// JSON file on the phone; cleared when onboarding finishes or on Delete all.
// The web preview doesn't save (it uses example data).

import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const NAME = 'onboarding-draft.json';

export type Draft<S> = { state: S; path: string; savedAt: number };

function draftFile(): File | null {
  if (Platform.OS === 'web') return null;
  try {
    return new File(Paths.document, NAME);
  } catch {
    return null;
  }
}

export async function loadDraft<S>(): Promise<Draft<S> | null> {
  try {
    const f = draftFile();
    if (!f?.exists) return null;
    const d = JSON.parse(await f.text()) as Partial<Draft<S>>;
    if (!d || typeof d !== 'object' || !d.state || typeof d.path !== 'string') return null;
    // Only ever resume inside onboarding.
    const path = /^\/onboarding(\/[a-z-]+)?$/.test(d.path) ? d.path : '/onboarding';
    return { state: d.state, path, savedAt: typeof d.savedAt === 'number' ? d.savedAt : 0 };
  } catch {
    return null;
  }
}

let timer: ReturnType<typeof setTimeout> | null = null;

/** Saved a moment after the last change, so typing doesn't write on every key. */
export function saveDraft<S>(state: S, path: string) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    try {
      const f = draftFile();
      if (!f) return;
      if (!f.exists) f.create();
      f.write(JSON.stringify({ state, path, savedAt: Date.now() } satisfies Draft<S>));
    } catch {
      // Worst case they redo a step; never worth an error.
    }
  }, 400);
}

export function clearDraft() {
  if (timer) clearTimeout(timer);
  timer = null;
  try {
    const f = draftFile();
    if (f?.exists) f.delete();
  } catch {
    // Nothing to do.
  }
}
