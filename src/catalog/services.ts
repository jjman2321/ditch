// Bundled catalog of services: names, logos, categories.
// Prices are NOT here: they're per country in prices.ts (DECISIONS #17).
// `cycle` is only the usual billing cycle, used when the user adds their
// own price.
// Logos: real app icons in src/catalog/logos.ts; services without one
// fall back to a brand-colour monogram tile.

import type { Cycle } from '@/domain/money';

export type Category =
  | 'Streaming'
  | 'Music'
  | 'AI & apps'
  | 'Cloud'
  | 'Shopping'
  | 'Fitness'
  | 'News'
  | 'Gaming';

export type CatalogService = {
  id: string;
  name: string;
  category: Category;
  color: string; // tile background
  ink?: string; // monogram colour, defaults to white
  mono: string; // 1–2 letters on the tile
  cycle: Cycle; // usual billing cycle
  /** Countries where it's sold. Omitted = everywhere we support. */
  availableIn?: string[];
  billedVia?: 'apple' | 'direct';
  popular?: boolean; // shown first
};

export const CATEGORIES: Category[] = [
  'Streaming',
  'Music',
  'AI & apps',
  'Cloud',
  'Shopping',
  'Fitness',
  'News',
  'Gaming',
];

const s = (
  id: string,
  name: string,
  category: Category,
  color: string,
  mono: string,
  cycle: Cycle = 'monthly',
  extra: Partial<CatalogService> = {},
): CatalogService => ({ id, name, category, color, mono, cycle, ...extra });

const US_ONLY = { availableIn: ['US'] };

export const SERVICES: CatalogService[] = [
  // Streaming
  s('netflix', 'Netflix', 'Streaming', '#E50914', 'N', 'monthly', { popular: true }),
  s('disney-plus', 'Disney+', 'Streaming', '#0B1F5C', 'D+', 'monthly', { popular: true }),
  s('hulu', 'Hulu', 'Streaming', '#1CE783', 'h', 'monthly', { ink: '#0B2A17', popular: true, ...US_ONLY }),
  s('max', 'HBO Max', 'Streaming', '#002BE7', 'M', 'monthly', { popular: true }),
  s('prime-video', 'Prime Video', 'Streaming', '#00A8E1', 'pv'),
  s('apple-tv', 'Apple TV', 'Streaming', '#111111', 'tv', 'monthly', { billedVia: 'apple', popular: true }),
  s('peacock', 'Peacock', 'Streaming', '#1A1A1A', 'P', 'monthly', US_ONLY),
  s('paramount-plus', 'Paramount+', 'Streaming', '#0064FF', 'P+'),
  s('youtube-premium', 'YouTube Premium', 'Streaming', '#FF0033', 'YT', 'monthly', { popular: true }),
  s('crunchyroll', 'Crunchyroll', 'Streaming', '#F47521', 'C'),
  // Music
  s('spotify', 'Spotify', 'Music', '#1DB954', 'S', 'monthly', { ink: '#0B2A17', popular: true }),
  s('apple-music', 'Apple Music', 'Music', '#FA2D48', '♪', 'monthly', { billedVia: 'apple' }),
  s('youtube-music', 'YouTube Music', 'Music', '#FF0033', 'YM'),
  s('audible', 'Audible', 'Music', '#F8991C', 'A'),
  s('siriusxm', 'SiriusXM', 'Music', '#0000EB', 'SX', 'monthly', US_ONLY),
  // AI & apps
  s('chatgpt-plus', 'ChatGPT Plus', 'AI & apps', '#10A37F', 'G', 'monthly', { popular: true }),
  s('claude-pro', 'Claude Pro', 'AI & apps', '#D97757', 'C'),
  s('adobe-cc', 'Adobe Creative Cloud', 'AI & apps', '#DA1F26', 'Ac'),
  s('microsoft-365', 'Microsoft 365', 'AI & apps', '#0078D4', '365', 'yearly'),
  s('canva-pro', 'Canva Pro', 'AI & apps', '#7D2AE8', 'C', 'yearly'),
  s('duolingo', 'Duolingo Super', 'AI & apps', '#58CC02', 'D', 'yearly', { ink: '#0F2A00' }),
  s('notion', 'Notion Plus', 'AI & apps', '#191919', 'N'),
  // Cloud
  s('icloud', 'iCloud+', 'Cloud', '#3693F3', '☁', 'monthly', { billedVia: 'apple', popular: true }),
  s('google-one', 'Google One', 'Cloud', '#4285F4', 'G1'),
  s('dropbox', 'Dropbox Plus', 'Cloud', '#0061FE', 'Db'),
  s('apple-one', 'Apple One', 'Cloud', '#1D1D1F', '1', 'monthly', { billedVia: 'apple' }),
  // Shopping
  s('amazon-prime', 'Amazon Prime', 'Shopping', '#FF9900', 'a', 'monthly', { ink: '#1A1200', popular: true }),
  s('walmart-plus', 'Walmart+', 'Shopping', '#0071CE', 'W+', 'monthly', US_ONLY),
  s('costco', 'Costco', 'Shopping', '#E31837', 'Co', 'yearly', US_ONLY),
  s('doordash', 'DashPass', 'Shopping', '#FF3008', 'DD', 'monthly', US_ONLY),
  s('uber-one', 'Uber One', 'Shopping', '#000000', 'U1'),
  s('instacart', 'Instacart+', 'Shopping', '#0AAD0A', 'i+', 'monthly', US_ONLY),
  // Fitness
  s('peloton', 'Peloton App', 'Fitness', '#000000', 'P'),
  s('strava', 'Strava', 'Fitness', '#FC4C02', 'S'),
  s('planet-fitness', 'Planet Fitness', 'Fitness', '#5C2D91', 'PF'),
  s('headspace', 'Headspace', 'Fitness', '#F47D31', 'H'),
  s('calm', 'Calm', 'Fitness', '#2E7BD6', 'C', 'yearly'),
  // News
  s('nyt', 'NYTimes', 'News', '#121212', 'T'),
  s('wsj', 'WSJ', 'News', '#0274B6', 'W'),
  s('substack', 'Substack', 'News', '#FF6719', 'S'),
  // Gaming
  s('xbox-game-pass', 'Xbox Game Pass', 'Gaming', '#107C10', 'X'),
  s('ps-plus', 'PlayStation Plus', 'Gaming', '#0070D1', 'PS', 'yearly'),
  s('nintendo-online', 'Nintendo Switch Online', 'Gaming', '#E60012', 'NS', 'yearly'),
  s('apple-arcade', 'Apple Arcade', 'Gaming', '#FF2D55', 'AA', 'monthly', { billedVia: 'apple' }),
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((x) => [x.id, x]));

/** What "Popular" shows, most common first (US, Nov 2026). */
export const POPULAR_ORDER = [
  'netflix',
  'spotify',
  'chatgpt-plus',
  'amazon-prime',
  'youtube-premium',
  'disney-plus',
  'max',
  'apple-music',
  'hulu',
  'icloud',
  'apple-tv',
  'audible',
  'claude-pro',
  'xbox-game-pass',
  'peacock',
  'paramount-plus',
];

export const POPULAR: CatalogService[] = POPULAR_ORDER.map((id) => SERVICE_BY_ID[id]).filter(Boolean);

/** Sold in this country? Unknown country shows everything. */
export function availableIn(service: CatalogService, country: string | null): boolean {
  return !country || !service.availableIn || service.availableIn.includes(country);
}
