// Typed access to the app's data (copied in by scripts/sync-data.mjs) plus the publishing gates
// from docs/website/PLAN.md: only verified prices, only high-confidence cancel guides, visible dates,
// a stale banner after 90 days and noindex after 180.

import cancelJson from '@/data/cancel.json';
import logosJson from '@/data/logos.json';
import pricesJson from '@/data/prices.json';
import buildJson from '@/data/build.json';
import servicesJson from '@/data/services.json';

import type { Cycle } from './money';

export type Service = {
  id: string;
  name: string;
  category: string;
  color?: string;
  mono?: string;
  rank?: number;
  popular?: boolean;
  aliases?: string[];
};

export type Plan = { id: string; name: string; amountMinor: number; cycle: Cycle; default?: boolean };
export type PriceRow = {
  serviceId: string;
  country: string;
  currency: string;
  status: 'verified' | 'partial' | 'unverified';
  plans: Plan[];
  source: string;
  checked: string;
  note?: string;
};
export type CancelGuide = {
  id: string;
  name: string;
  url: string | null;
  helpUrl: string | null;
  steps: string[];
  appleNote: boolean;
  source: string;
  checkedOn: string;
  confidence: 'high' | 'medium' | 'none';
  note?: string;
  /** Hand-written copy for the website (scripts/catalog/guide-copy.py). */
  answer?: string;
  tips?: string[];
  partner?: string;
  app?: string;
  company?: string;
  appleBilling?: boolean;
  related?: string[];
  /** Button text when the link isn't a cancel page (e.g. Costco's auto-renew page). */
  urlLabel?: string;
  /** Officially sourced extra sections (docs/research/guide-depth-*.json). Every fact has its source. */
  depth?: GuideDepth;
};

export type Sourced = { text: string; source: string; quote?: string };
export type GuideDepth = {
  checkedOn?: string;
  /** Name for the source when its address would mislead (Disney+ facts live on hulu.com). */
  sourceLabel?: string;
  after?: { access?: Sourced | null; data?: Sourced | null; refunds?: Sourced | null } | null;
  verify?: Sourced | null;
  pause?: Sourced | null;
  googlePlay?: { steps: string[]; source: string } | null;
  faq?: { q: string; a: string; source: string }[];
};

export const SERVICES = servicesJson as Service[];
const LOGOS = new Set(logosJson as string[]);
const PRICE_ROWS = (pricesJson as { prices: PriceRow[] }).prices;
const GUIDES = (cancelJson as { services: CancelGuide[] }).services;

export type Country = { code: string; slug: string; name: string; short: string; tax: string; region: 'main' | 'mena' };

/** The countries in the price data, in the order the site shows them (12 + 5 in the Middle East). */
export const COUNTRIES: Country[] = ([
  { code: 'US', slug: 'us', name: 'United States', short: 'US', tax: 'before sales tax' },
  { code: 'GB', slug: 'uk', name: 'United Kingdom', short: 'UK', tax: 'incl. VAT' },
  { code: 'CA', slug: 'ca', name: 'Canada', short: 'Canada', tax: 'before sales tax' },
  { code: 'AU', slug: 'au', name: 'Australia', short: 'Australia', tax: 'incl. GST' },
  { code: 'IE', slug: 'ie', name: 'Ireland', short: 'Ireland', tax: 'incl. VAT' },
  { code: 'NZ', slug: 'nz', name: 'New Zealand', short: 'NZ', tax: 'incl. GST' },
  { code: 'DE', slug: 'de', name: 'Germany', short: 'Germany', tax: 'incl. VAT' },
  { code: 'FR', slug: 'fr', name: 'France', short: 'France', tax: 'incl. VAT' },
  { code: 'IT', slug: 'it', name: 'Italy', short: 'Italy', tax: 'incl. VAT' },
  { code: 'ES', slug: 'es', name: 'Spain', short: 'Spain', tax: 'incl. VAT' },
  { code: 'NL', slug: 'nl', name: 'Netherlands', short: 'Netherlands', tax: 'incl. VAT' },
  { code: 'IN', slug: 'in', name: 'India', short: 'India', tax: 'incl. GST' },
  // Middle East (owner, Nov 12): English pages. Kuwait (and some Qatar/UAE services) bill in US dollars.
  { code: 'AE', slug: 'uae', name: 'United Arab Emirates', short: 'UAE', tax: 'VAT 5%' },
  { code: 'SA', slug: 'saudi-arabia', name: 'Saudi Arabia', short: 'Saudi', tax: 'VAT 15%' },
  { code: 'QA', slug: 'qatar', name: 'Qatar', short: 'Qatar', tax: 'no VAT' },
  { code: 'KW', slug: 'kuwait', name: 'Kuwait', short: 'Kuwait', tax: 'no VAT' },
  { code: 'EG', slug: 'egypt', name: 'Egypt', short: 'Egypt', tax: 'VAT 14%' },
] as Omit<Country, 'region'>[]).map((c) => ({ ...c, region: ['AE', 'SA', 'EG', 'QA', 'KW'].includes(c.code) ? 'mena' : 'main' }));
export const COUNTRY = Object.fromEntries(COUNTRIES.map((c) => [c.code, c])) as Record<string, Country>;

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);
export const hasLogo = (id: string) => LOGOS.has(id);

/** Gate 1: only verified rows are ever shown. */
export function verifiedPrices(serviceId: string): PriceRow[] {
  const order = COUNTRIES.map((c) => c.code);
  return PRICE_ROWS.filter((r) => r.serviceId === serviceId && r.status === 'verified' && order.includes(r.country)).sort(
    (a, b) => order.indexOf(a.country) - order.indexOf(b.country),
  );
}

export function priceFor(serviceId: string, country: string): PriceRow | undefined {
  return verifiedPrices(serviceId).find((r) => r.country === country);
}

export function defaultPlan(row: PriceRow): Plan {
  return row.plans.find((p) => p.default) ?? row.plans.find((p) => p.cycle === 'monthly') ?? row.plans[0];
}

/** Price hubs: services with verified prices in at least 6 countries, most popular first. */
/** Price pages: services with verified prices in 6+ countries, or a verified US price (owner, Nov 13: US-only pages too). */
export function priceHubServices(): Service[] {
  return SERVICES.filter((s) => { const v = verifiedPrices(s.id); return v.length >= 6 || v.some((r) => r.country === 'US'); }).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
}

/** Gate 3: high-confidence guides only, until the owner has checked the medium ones on a phone. */
export function publishedGuides(): CancelGuide[] {
  const rank = (id: string) => serviceById(id)?.rank ?? 999;
  return GUIDES.filter((g) => g.confidence === 'high').sort((a, b) => rank(a.id) - rank(b.id));
}
export const guideById = (id: string) => publishedGuides().find((g) => g.id === id);

/** All published price rows, for site-wide counts. */
export function siteCounts() {
  const hubs = priceHubServices();
  const rows = hubs.flatMap((s) => verifiedPrices(s.id));
  const plans = rows.reduce((n, r) => n + r.plans.length, 0);
  const checked = rows.map((r) => r.checked).sort().pop() ?? '';
  return { services: hubs.length, countries: COUNTRIES.length, rows: rows.length, plans, guides: publishedGuides().length, checked };
}

// Dates are date-only (YYYY-MM-DD) and shown like "Nov 9, 2026".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return `${MONTHS[m - 1]} ${day}, ${y}`;
}
export const BUILD_DAY = (buildJson as { today: string }).today;
export function daysSince(d: string, today = BUILD_DAY): number {
  return Math.round((Date.parse(today) - Date.parse(d)) / 86_400_000);
}
/** Gate 5: 90+ days → visible "may have changed"; 180+ → noindex until re-checked. */
export function freshness(d: string, today?: string): 'fresh' | 'stale' | 'expired' {
  const n = daysSince(d, today);
  return n >= 180 ? 'expired' : n >= 90 ? 'stale' : 'fresh';
}

/** Short, readable host for a source link: "help.netflix.com". */
/** A short source name for tight lines: "en-americas-support.nintendo.com" → "nintendo.com". Short hosts stay as they are. */
export function shortHost(url: string): string {
  const h = host(url);
  if (h.length <= 22) return h;
  const parts = h.split('.');
  const two = parts.slice(-2).join('.');
  return /^(co|com|org|net)\.[a-z]{2}$/.test(two) ? parts.slice(-3).join('.') : two;
}

export function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Guide notes mix tips for people with notes about how we checked. Only the tips go on the page. */
const INTERNAL = /automated fetch|cancel\.ts|returned empty|rendered empty|returned 503|no official page we could read|^Official link is|^URL is the one|search snippets|blocks? automated reads/i;
export function publicNotes(note?: string): string[] {
  if (!note) return [];
  return note
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s && !INTERNAL.test(s))
    .map((s) =>
      s
        .replace(/ = billed by/g, ' means you’re billed by')
        .replace(/ = third-party billing/g, ' means a third party bills you')
        .replace(/ = bought in the app/g, ' means you bought it in the app')
        .replace(/ = already set to expire/g, ' means it’s already set to expire')
        .replace(/ = /g, ': '),
    );
}

/** Apple's own steps for subscriptions billed through the App Store (support.apple.com/118428). */
export const APPLE_STEPS = ['Open Settings on your iPhone', 'Tap your name, then Subscriptions', 'Tap the subscription, then Cancel Subscription'];
export const APPLE_SOURCE = 'https://support.apple.com/en-us/118428';

/** The site went live with these pages on this day. dateModified is never earlier than this. */
export const FIRST_PUBLISHED = '2026-11-12';
export const pubDates = (checked: string) => ({ datePublished: checked < FIRST_PUBLISHED ? checked : FIRST_PUBLISHED, dateModified: checked });

/** "Nov 9, 2026" or "Nov 9–12, 2026" when rows were checked on different days. */
export function dateRange(dates: string[]): string {
  const d = [...new Set(dates)].sort();
  if (d.length <= 1) return formatDate(d[0]);
  const a = formatDate(d[0]);
  const b = formatDate(d[d.length - 1]);
  if (a.slice(0, 3) === b.slice(0, 3) && a.slice(-4) === b.slice(-4)) return `${a.replace(/, \d{4}$/, '')}–${b.split(' ')[1]} ${b.slice(-4)}`;
  return `${a} – ${b}`;
}

/** Neighbours in the same category (2 before, 2 after, wrapping), so every page gets links, not only the top ones. */
export function neighbours<T extends { id: string }>(list: T[], id: string, n = 4): T[] {
  const i = list.findIndex((x) => x.id === id);
  if (i < 0 || list.length <= 1) return [];
  const out: T[] = [];
  for (const off of [-2, -1, 1, 2, -3, 3, -4, 4]) {
    const x = list[(i + off + list.length * 4) % list.length];
    if (x.id !== id && !out.includes(x)) out.push(x);
    if (out.length >= Math.min(n, list.length - 1)) break;
  }
  return out;
}

/** True when a price row was read from Apple's in-app price list (what you pay if you subscribe in the iPhone app). */
export const isAppStorePrice = (r: PriceRow) => /apps\.apple\.com/.test(r.source);

/**
 * Web addresses that match how people search (owner, Nov 13). The data keeps the app's ids; only the site's
 * URLs change. Old addresses forward permanently (custom-worker.ts).
 */
export const SLUG: Record<string, string> = { max: 'hbo-max', 'ps-plus': 'playstation-plus', 'nintendo-online': 'nintendo-switch-online', doordash: 'dashpass', now: 'now-tv', nyt: 'new-york-times' };
const ID_BY_SLUG = Object.fromEntries(Object.entries(SLUG).map(([id, slug]) => [slug, id]));
export const slugOf = (id: string) => SLUG[id] ?? id;
/** The service id for a URL slug. Old ids that now have a new slug return null, so they never render twice. */
export const idOf = (slug: string): string | null => ID_BY_SLUG[slug] ?? (SLUG[slug] ? null : slug);

/** "in 17 countries" or "in the US" (one country). */
export function inWhere(rows: { country: string }[]): string {
  if (rows.length !== 1) return `in ${rows.length} countries`;
  const c = rows[0].country;
  return c === 'US' ? 'in the US' : c === 'GB' ? 'in the UK' : `in ${COUNTRY[c]?.name ?? c}`;
}
