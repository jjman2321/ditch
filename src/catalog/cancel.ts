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
  /** The main button on the Ditched screen. */
  label: string;
  /** The page button inside the how-to sheet. Step 1 says "Tap <this> below", so the two always match. */
  pageLabel: string;
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

/** Longer names make "Open YouTube Premium to cancel" wrap onto two lines on an SE, so those buttons say "the cancel page". */
const LONG_NAME = 14;

/** The main button on the Ditched screen, and the how-to sheet. */
export function cancelHelp({ name, catalogId, proTrial }: { name: string; catalogId: string | null; proTrial?: boolean }): CancelHelp {
  const apple: CancelHelp = { kind: 'apple', url: APPLE_SUBSCRIPTIONS_URL, label: 'Open Apple subscriptions', pageLabel: 'Open Apple subscriptions', steps: APPLE_STEPS, appleNote: false };
  if (proTrial) return apple;
  const svc = catalogId ? SERVICE_BY_ID[catalogId] : undefined;
  const guide = catalogId ? CANCEL_GUIDES[catalogId] : undefined;
  if (guide?.apple) return { ...apple, steps: guide.steps, checked: CANCEL_CHECKED };
  if (svc?.billedVia === 'apple') return apple;
  const long = name.length > LONG_NAME;
  if (guide?.url) {
    const target = long ? 'the cancel page' : name;
    return {
      kind: 'url',
      url: guide.url,
      label: long ? 'Open the cancel page' : `Open ${name} to cancel`,
      pageLabel: `Open ${target}`,
      steps: pointAtButton(guide.steps, target),
      appleNote: !!guide.appleNote,
      checked: CANCEL_CHECKED,
    };
  }
  const how = long ? 'How to cancel it' : `How to cancel ${name}`;
  if (guide)
    return { kind: 'steps', url: guide.helpUrl, label: how, pageLabel: long ? 'Open the help page' : `Open ${name} help`, steps: guide.steps, appleNote: !!guide.appleNote, checked: CANCEL_CHECKED };
  return { kind: 'steps', label: how, pageLabel: '', steps: cancelSteps(name), appleNote: true };
}
