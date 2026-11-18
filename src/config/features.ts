// Switches for features that aren't ready yet.
//
// IMPORT (DECISIONS #33/#34): screenshot and bank-statement import needs
// the EAS development build (on-phone text reading). Until it works, its
// buttons stay hidden: Apple rejects apps that show features that don't
// exist yet. The web preview can show them with ?import=1 for screenshots.

import { webParam } from '@/dev/webParams';

// On in test builds (TestFlight has the on-phone text reader since build 5); off in the App Store
// build until it's been checked on a real iPhone.
export const IMPORT_READY = process.env.EXPO_PUBLIC_APP_ENV !== 'production';

/** The Home and Lock Screen widget (WidgetKit, v1.1, DECISIONS #27). Its paywall row shows once it exists. */
export const WIDGET_READY = false;

export function showImport(): boolean {
  // The hosted web preview (preview.ditchsubs.app) shows it too, with sample data.
  return IMPORT_READY || webParam('import') === '1' || process.env.EXPO_PUBLIC_APP_ENV === 'web-preview';
}
