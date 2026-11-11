// Switches for features that aren't ready yet.
//
// IMPORT (DECISIONS #33/#34): screenshot and bank-statement import needs
// the EAS development build (on-phone text reading). Until it works, its
// buttons stay hidden: Apple rejects apps that show features that don't
// exist yet. The web preview can show them with ?import=1 for screenshots.

import { webParam } from '@/dev/webParams';

export const IMPORT_READY = false;

/** The Home and Lock Screen widget (WidgetKit, v1.1, DECISIONS #27). Its paywall row shows once it exists. */
export const WIDGET_READY = false;

export function showImport(): boolean {
  return IMPORT_READY || webParam('import') === '1';
}
