/**
 * Free tools (owner, Nov 13: launch with ~10). Every tool runs in the browser on our hand-checked price list.
 * Nothing anyone types is sent anywhere. Each page also writes its answer in the HTML, for search and AI answers.
 */
import { COUNTRIES, COUNTRY, isAppStorePrice, serviceById, slugOf, verifiedPrices, type PriceRow, SERVICES, defaultPlan, guideById, hasLogo, priceHubServices } from './data';
import type { Cycle } from './money';

export type Tool = { slug: string; name: string; short: string; desc: string };
export const TOOLS: Tool[] = [
  { slug: 'charges', name: 'What is this charge?', short: 'Charge finder', desc: 'Type the amount from your statement and see which subscriptions cost exactly that.' },
  { slug: 'tools/subscription-cost-calculator', name: 'Subscription cost calculator', short: 'Cost calculator', desc: 'Tap what you pay for and see what it all costs in a month and a year.' },
  { slug: 'tools/free-trial-calculator', name: 'Free trial end date calculator', short: 'Free trial deadline', desc: 'Find the day your trial turns into a charge, and the day to cancel by.' },
  { slug: 'tools/apple-one-calculator', name: 'Apple One calculator', short: 'Apple One: worth it?', desc: 'Compare Apple One with paying for each Apple service on its own, in your country.' },
  { slug: 'tools/monthly-vs-yearly', name: 'Monthly vs yearly calculator', short: 'Monthly or yearly?', desc: 'See how much a yearly plan costs compared with 12 months of the monthly one.' },
  { slug: 'tools/family-plan-split', name: 'Family plan split calculator', short: 'Family plan split', desc: 'Split a family or duo plan and see what each person pays.' },
  { slug: 'tools/compare-prices', name: 'Subscription price comparison', short: 'Compare prices', desc: 'Put two services side by side, plan by plan, in your country.' },
  { slug: 'tools/cost-per-hour', name: 'Cost per hour calculator', short: 'Cost per hour', desc: 'Work out what a subscription costs for each hour you actually use it.' },
  { slug: 'tools/refund-helper', name: 'Subscription refund helper', short: 'Refund helper', desc: 'Answer two questions and get the official place to ask for a refund.' },
  { slug: 'tools/subscription-spreadsheet', name: 'Free subscription tracker spreadsheet', short: 'Tracker spreadsheet', desc: 'Download a spreadsheet with prices for your country filled in. Opens in Excel, Numbers or Google Sheets.' },
];
export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug)!;

/** Who sends the bill. App Store rows and Apple's own services are Apple; Google and Amazon bill their own services. */
export type Biller = 'apple' | 'google' | 'amazon' | 'direct';
const APPLE_OWN = new Set(['apple-one', 'icloud', 'apple-music', 'apple-tv', 'apple-arcade', 'apple-fitness', 'apple-news']);
const GOOGLE_OWN = new Set(['google-one', 'google-ai-pro', 'youtube-premium', 'youtube-music', 'youtube-tv']);
const AMAZON_OWN = new Set(['amazon-prime', 'amazon-music']);
export function billerOf(r: PriceRow): Biller {
  if (APPLE_OWN.has(r.serviceId) || isAppStorePrice(r)) return 'apple';
  if (GOOGLE_OWN.has(r.serviceId)) return 'google';
  if (AMAZON_OWN.has(r.serviceId)) return 'amazon';
  return 'direct';
}

/** One checked price, flattened for the browser tools. a = amount in minor units. */
export type Pt = { s: string; n: string; c: string; cur: string; p: string; a: number; cy: Cycle; b: Biller; g: string | null; h: string | null; l: boolean; d: boolean };
export function allPoints(): Pt[] {
  const out: Pt[] = [];
  for (const svc of SERVICES) {
    for (const r of verifiedPrices(svc.id)) {
      const def = defaultPlan(r).id;
      for (const p of r.plans) {
        out.push({ s: svc.id, n: svc.name, c: r.country, cur: r.currency, p: p.name, a: p.amountMinor, cy: p.cycle, b: billerOf(r), g: guideById(svc.id) ? slugOf(svc.id) : null, h: priceHubServices().some((x) => x.id === svc.id) ? slugOf(svc.id) : null, l: hasLogo(svc.id), d: p.id === def });
      }
    }
  }
  return out;
}
export const countryList = () => COUNTRIES.map((c) => ({ code: c.code, name: c.name, short: c.short }));
export const countryName = (code: string) => COUNTRY[code]?.name ?? code;
export const serviceName = (id: string) => serviceById(id)?.name ?? id;
