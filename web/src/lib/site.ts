export const SITE = 'https://ditchsubs.app';
export const BRAND = 'Ditch: Subscription Tracker';

/** Open Graph for a page: its own og:url plus the site defaults (a page's openGraph replaces the layout's, so this carries them). */
export const og = (path: string, image: 'home' | 'cancel' | 'prices' = 'home') => ({
  url: path,
  siteName: 'Ditch: Subscription Tracker',
  type: 'website' as const,
  locale: 'en_US',
  images: [{ url: `/og/${image}.png`, width: 1200, height: 630, alt: 'Ditch: Subscription Tracker. Ditch it before it renews.' }],
});

/** Meta descriptions: the first sentence always, then each extra sentence only while the whole stays within 160 characters. */
export const fitDesc = (first: string, ...more: string[]) => more.filter(Boolean).reduce((acc, p) => (acc.length + 1 + p.length <= 160 ? `${acc} ${p}` : acc), first);

/** Search titles stay within 60 characters: add " | Ditch" only when it fits, otherwise the title stands alone. */
export const pageTitle = (s: string): string | { absolute: string } => (s.length + 8 <= 60 ? s : { absolute: s });
export const SUPPORT_EMAIL = 'support@ditchsubs.app';
export const AUTHOR = { name: 'Aribo', url: '/about' };
export const COMPANY = 'Grasp Labs LLC';

/** Pro prices as on the paywall (US). Lifetime covers Pro only; never promise products that don't exist yet. */
/** The same prices in cents, for maths (a test checks they match PRO). */
export const PRO_MINOR = { yearly: 2999, monthly: 499, lifetime: 4999 };
export const PRO = { yearly: '$29.99', yearlyPerMonth: '$2.50', monthly: '$4.99', lifetime: '$49.99', trialDays: 7 };

/** App Store: null until the app is live. Then the hero CTA becomes the badge and the Smart App Banner turns on. */
export const APP_STORE_ID: string | null = null;

export const NAV = [
  { href: '/cancel', label: 'Cancel guides' },
  { href: '/prices', label: 'Prices' },
  { href: '/tools', label: 'Free tools' },
  { href: '/#pricing', label: 'Pricing' },
];

/** Sourced stats we're allowed to quote (CLAUDE.md rule 5: no unsourced claims). */
export const STATS = {
  wasted: { text: 'about $205 a year', on: 'subscriptions they don’t use', source: 'CNET/YouGov survey, 2025', url: 'https://thedesk.net/2025/05/cnet-subscription-survey-2025/' },
};
