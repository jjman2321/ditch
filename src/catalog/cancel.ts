// How to cancel. Ditch never cancels anything itself (CLAUDE.md rule 5);
// it opens the service's own page or explains the steps.
// The top 50 have official pages and steps (cancel.data.ts, built from
// docs/research/cancel-guides-2026-11.json). Everything else gets the short
// generic how-to. Opening a link never marks anything cancelled.

import { CANCEL_CHECKED, CANCEL_GUIDES } from './cancel.data';
import { SERVICE_BY_ID } from './services';

/** Apple's own subscriptions page (opens the App Store's sheet on iPhone). */
export const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

export type CancelHelp = {
  /**
   * apple: cancel in Apple's subscriptions page. url: the service's own
   * cancel page. steps: no direct page, so the steps first.
   */
  kind: 'apple' | 'url' | 'steps';
  /** The main button. */
  label: string;
  /** The page the main button opens (apple, url), or a help article (steps). */
  url?: string;
  steps: string[];
  /** Might be billed through Apple instead: show where that lives. */
  appleNote: boolean;
  /** When the official steps were last checked (YYYY-MM-DD). Not set for the generic steps. */
  checked?: string;
};

export function cancelSteps(name: string): string[] {
  return [`Open the ${name} app or website and sign in`, 'Go to Account or Settings, then Membership, Plan or Subscription', 'Tap Cancel and follow it to the end. Keep the confirmation email'];
}

/**
 * The how-to sheet has the "Open X to cancel" button right under the steps, so
 * step 1 points at it instead of repeating the web address.
 * "Open netflix.com/cancelplan in Safari and sign in" → "Tap Open Netflix below and sign in".
 */
export function pointAtButton(steps: string[], name: string): string[] {
  const [first, ...rest] = steps;
  const m = first?.match(/^Open [\w.-]+\.[a-z]{2,}(?:\/\S*)?(?: in Safari)?(?: and sign in)?(.*)$/);
  if (!m) return steps;
  return [`Tap Open ${name} below${m[1] ? m[1] : ' and sign in'}`, ...rest];
}

const APPLE_STEPS = ['Open iPhone Settings and tap your name', 'Tap Subscriptions', 'Pick it, then tap Cancel Subscription'];

/** The main button on the Ditched screen, and the how-to sheet. */
export function cancelHelp({ name, catalogId, proTrial }: { name: string; catalogId: string | null; proTrial?: boolean }): CancelHelp {
  const apple: CancelHelp = { kind: 'apple', url: APPLE_SUBSCRIPTIONS_URL, label: 'Open Apple subscriptions to cancel', steps: APPLE_STEPS, appleNote: false };
  if (proTrial) return apple;
  const svc = catalogId ? SERVICE_BY_ID[catalogId] : undefined;
  const guide = catalogId ? CANCEL_GUIDES[catalogId] : undefined;
  if (guide?.apple) return { ...apple, steps: guide.steps, checked: CANCEL_CHECKED };
  if (svc?.billedVia === 'apple') return apple;
  if (guide?.url) return { kind: 'url', url: guide.url, label: `Open ${name} to cancel`, steps: pointAtButton(guide.steps, name), appleNote: !!guide.appleNote, checked: CANCEL_CHECKED };
  if (guide) return { kind: 'steps', url: guide.helpUrl, label: `How to cancel ${name}`, steps: guide.steps, appleNote: !!guide.appleNote, checked: CANCEL_CHECKED };
  return { kind: 'steps', label: `How to cancel ${name}`, steps: cancelSteps(name), appleNote: true };
}
