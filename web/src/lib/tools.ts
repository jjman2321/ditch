/**
 * Free tools (owner, Nov 13: launch with ~10). Every tool runs in the browser on our hand-checked price list.
 * Nothing anyone types is sent anywhere. Each page also writes its answer in the HTML, for search and AI answers.
 */
import { COUNTRIES, COUNTRY, isAppStorePrice, serviceById, slugOf, verifiedPrices, type PriceRow, SERVICES, defaultPlan, guideById, hasLogo, priceHubServices } from './data';
import type { Cycle } from './money';

export type Tool = { slug: string; name: string; short: string; desc: string };
export const TOOLS: Tool[] = [
  { slug: 'charges', name: 'Subscription charge finder', short: 'Charge finder', desc: 'Type the amount on your statement. See which subscriptions cost exactly that.' },
  { slug: 'tools/subscription-cost-calculator', name: 'Subscription cost calculator', short: 'Cost calculator', desc: 'Tap what you pay for. See the total a month and a year.' },
  { slug: 'tools/free-trial-calculator', name: 'Free trial calculator', short: 'Free trial deadline', desc: 'The day your trial charges, and the day to cancel by.' },
  { slug: 'tools/apple-one-calculator', name: 'Apple One calculator', short: 'Apple One', desc: 'Apple One or each Apple service on its own: which costs less.' },
  { slug: 'tools/monthly-vs-yearly', name: 'Monthly vs yearly calculator', short: 'Monthly or yearly', desc: 'What a yearly plan costs next to 12 months of monthly.' },
  { slug: 'tools/family-plan-split', name: 'Family plan split calculator', short: 'Family plan split', desc: 'What each person pays on a family or duo plan.' },
  { slug: 'tools/compare-prices', name: 'Subscription price comparison', short: 'Compare prices', desc: 'Two services side by side, plan by plan.' },
  { slug: 'tools/cost-per-hour', name: 'Cost per hour calculator', short: 'Cost per hour', desc: 'What a subscription costs for each hour you use it.' },
  { slug: 'tools/refund-helper', name: 'Subscription refund helper', short: 'Refund helper', desc: 'Where to ask Apple, Google or Amazon for a refund.' },
  { slug: 'tools/subscription-spreadsheet', name: 'Subscription tracker spreadsheet', short: 'Tracker spreadsheet', desc: 'A free spreadsheet with your prices filled in.' },
];

/** Service-specific tools: one per search people actually make (Google autocomplete, Nov 13). Same engines, preset. */
export type ServiceTool = { slug: string; name: string; desc: string; meta: string; kind: 'split' | 'vs' | 'bundle' | 'myr'; s?: string; a?: string; b?: string; ap?: string; bp?: string; faq: { q: string; a: string }[]; sources?: string[] };
export const SERVICE_TOOLS: ServiceTool[] = [
  { slug: 'spotify-family-split', name: 'Spotify Family split calculator', kind: 'split', s: 'spotify', desc: 'What each person pays on Spotify Premium Family or Duo.', meta: 'Spotify Family cost per person: split calculator', faq: [{ q: 'How many people can be on Spotify Family?', a: 'Up to 6 accounts, and they need to live at the same address. Duo is for 2 people at the same address.' }, { q: 'Is Spotify Family worth it?', a: 'Once 2 or more people would pay for Premium anyway, Family or Duo costs each person less than Premium Individual.' }], sources: ['https://www.spotify.com/us/premium/'] },
  { slug: 'apple-music-family-split', name: 'Apple Music Family split calculator', kind: 'split', s: 'apple-music', desc: 'What each person pays on Apple Music Family.', meta: 'Apple Music Family cost per person: split calculator', faq: [{ q: 'How many people can share Apple Music Family?', a: 'You and up to 5 family members, through Apple’s Family Sharing.' }, { q: 'Is Apple Music Family worth it?', a: 'With 2 or more people who’d pay for Apple Music anyway, Family costs each person less than Individual.' }], sources: ['https://support.apple.com/en-us/108380'] },
  { slug: 'microsoft-365-family-split', name: 'Microsoft 365 Family split calculator', kind: 'split', s: 'microsoft-365', desc: 'What each person pays on Microsoft 365 Family.', meta: 'Microsoft 365 Family cost per person: split calculator', faq: [{ q: 'How many people can use Microsoft 365 Family?', a: 'Up to 6 people: you and 5 others, each with their own account.' }], sources: ['https://www.microsoft.com/en-us/microsoft-365/p/microsoft-365-family/cfq7ttc0k5dm'] },
  { slug: 'netflix-cost-per-person', name: 'Netflix cost per person calculator', kind: 'split', s: 'netflix', desc: 'Split a Netflix plan between the people in your home.', meta: 'Netflix cost per person: split calculator', faq: [{ q: 'Can I split Netflix with people I don’t live with?', a: 'Netflix says an account is for one household. In some countries you can pay for an extra member slot, but not on plans with ads.' }], sources: ['https://help.netflix.com/en/node/123277'] },
  { slug: 'disney-hulu-bundle-calculator', name: 'Disney+ and Hulu bundle calculator', kind: 'bundle', desc: 'Is the Disney+, Hulu bundle cheaper than paying for both?', meta: 'Disney+ Hulu bundle calculator: is the bundle cheaper?', faq: [{ q: 'Is the Disney+ and Hulu bundle cheaper?', a: 'Yes, if you’d pay for both. In the US the bundle costs a little more than one service on its own, and much less than both.' }] },
  { slug: 'spotify-vs-apple-music', name: 'Spotify vs Apple Music price', kind: 'vs', a: 'spotify', b: 'apple-music', ap: 'premium individual', bp: 'individual', desc: 'Every plan side by side, in your country.', meta: 'Spotify vs Apple Music price: every plan compared', faq: [{ q: 'Is Spotify or Apple Music cheaper?', a: 'It depends on the plan and the country. The tool shows both, plan by plan, from each service’s own prices.' }] },
  { slug: 'chatgpt-plus-vs-claude-pro', name: 'ChatGPT Plus vs Claude Pro price', kind: 'vs', a: 'chatgpt-plus', b: 'claude-pro', ap: 'plus', bp: 'pro', desc: 'Every plan side by side, in your country.', meta: 'ChatGPT Plus vs Claude Pro price: plans compared', faq: [{ q: 'Is ChatGPT Plus or Claude Pro cheaper?', a: 'In the US both are about $20 a month. Claude Pro also has a yearly plan. Prices in the iPhone app can differ from the website.' }] },
  { slug: 'netflix-vs-disney-plus', name: 'Netflix vs Disney+ price', kind: 'vs', a: 'netflix', b: 'disney-plus', desc: 'Every plan side by side, in your country.', meta: 'Netflix vs Disney+ price: every plan compared', faq: [{ q: 'Is Netflix or Disney+ cheaper?', a: 'Both have a cheaper plan with ads. The tool shows every plan for your country side by side.' }] },
  { slug: 'netflix-vs-hbo-max', name: 'Netflix vs HBO Max price', kind: 'vs', a: 'netflix', b: 'max', desc: 'Every plan side by side, in your country.', meta: 'Netflix vs HBO Max price: every plan compared', faq: [{ q: 'Is Netflix or HBO Max cheaper?', a: 'Both have a plan with ads. HBO Max also sells yearly plans. The tool shows each plan side by side.' }] },
  { slug: 'amazon-prime-monthly-vs-yearly', name: 'Amazon Prime monthly vs yearly', kind: 'myr', s: 'amazon-prime', desc: 'What yearly Prime costs next to 12 months of monthly.', meta: 'Amazon Prime monthly vs yearly: which is cheaper?', faq: [{ q: 'Is Amazon Prime cheaper yearly?', a: 'Yes. Yearly Prime costs less than 12 months of monthly Prime, but you pay it all at once.' }] },
];
/** Built but not live: only Saudi/Qatar YouTube prices are checked, so US visitors would see SAR. Back in SERVICE_TOOLS once US prices are checked. */
export const PARKED_TOOLS: ServiceTool[] = [
  { slug: 'youtube-premium-family-split', name: 'YouTube Premium Family split calculator', kind: 'split', s: 'youtube-premium', desc: 'What each person pays on YouTube Premium Family.', meta: 'YouTube Premium Family cost per person: split calculator', faq: [{ q: 'How many people can share YouTube Premium Family?', a: 'You and up to 5 other members of your household. Everyone must live at the same address.' }], sources: ['https://support.google.com/youtube/answer/7507349'] },
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

/**
 * One readable name from service + plan, without doubled words:
 * "Discord Nitro" + "Nitro Basic" → "Discord Nitro Basic"; "Dropbox Plus" + "Plus" → "Dropbox Plus";
 * "Amazon Prime" + "Prime (yearly)" → "Amazon Prime"; "Netflix" + "Standard" → "Netflix Standard".
 */
export const planLabel = (n: string, plan: string) => {
  const pl = plan.replace(/\s*\((monthly|yearly|annual|quarterly|weekly|a month|a year|1 month|3 months|12 months)\)/gi, '').trim();
  if (!pl) return n;
  const nw = n.split(/\s+/), pw = pl.split(/\s+/);
  const lc = (x: string[]) => x.join(' ').toLowerCase();
  if (lc(pw).startsWith(lc(nw))) return pl;
  for (let k = Math.min(nw.length, pw.length); k >= 1; k--) {
    if (lc(nw.slice(-k)) === lc(pw.slice(0, k))) return [...nw, ...pw.slice(k)].join(' ');
  }
  if (lc(nw).includes(lc(pw))) return n;
  return `${n} ${pl}`;
};

/** Free tools about one service, for "Related" on its price and cancel pages (internal links both ways). */
export const toolsFor = (id: string) =>
  SERVICE_TOOLS.filter((t) => [t.s, t.a, t.b].includes(id) || (t.kind === 'bundle' && ['disney-plus', 'hulu'].includes(id))).map((t) => ({ href: `/tools/${t.slug}`, name: t.name, desc: t.desc }));
