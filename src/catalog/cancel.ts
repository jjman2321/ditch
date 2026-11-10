// How to cancel. Ditch never cancels anything itself (CLAUDE.md rule 5);
// it opens the service's own page or explains the steps.
// Only official cancel/manage pages we're sure of are listed. Everything
// else gets the short how-to. Opening a link never marks anything cancelled.

import { SERVICE_BY_ID } from './services';

/** Apple's own subscriptions page (opens the App Store's sheet on iPhone). */
export const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

/** Official pages, checked Nov 2026. Add one only when it's the service's own URL. */
export const CANCEL_URLS: Record<string, string> = {
  netflix: 'https://www.netflix.com/cancelplan',
  hulu: 'https://secure.hulu.com/account/cancel',
  spotify: 'https://www.spotify.com/account/subscription/',
  'youtube-premium': 'https://www.youtube.com/paid_memberships',
  'youtube-music': 'https://www.youtube.com/paid_memberships',
};

export type CancelHelp =
  | { kind: 'url'; url: string; label: string }
  | { kind: 'apple'; url: string; label: string }
  | { kind: 'steps'; label: string; steps: string[] };

export function cancelSteps(name: string): string[] {
  return [
    `Open the ${name} app or website and sign in.`,
    'Go to Account or Settings, then Membership, Plan or Subscription.',
    'Tap Cancel and follow it to the end. Keep the confirmation email.',
  ];
}

/** The main button on the Ditched screen. */
export function cancelHelp({ name, catalogId, proTrial }: { name: string; catalogId: string | null; proTrial?: boolean }): CancelHelp {
  if (proTrial) return { kind: 'apple', url: APPLE_SUBSCRIPTIONS_URL, label: 'Cancel in iPhone Settings' };
  const svc = catalogId ? SERVICE_BY_ID[catalogId] : undefined;
  if (svc?.billedVia === 'apple') return { kind: 'apple', url: APPLE_SUBSCRIPTIONS_URL, label: 'Cancel in iPhone Settings' };
  const url = catalogId ? CANCEL_URLS[catalogId] : undefined;
  if (url) return { kind: 'url', url, label: `Cancel in ${name}` };
  return { kind: 'steps', label: `How to cancel ${name}`, steps: cancelSteps(name) };
}
