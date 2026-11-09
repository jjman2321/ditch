// Bundled catalog of popular US services.
// Prices are typical US list prices for the most common plan, used only
// as editable starting points ("about $15.49/mo"). Checked: Nov 2026.
// Logos: brand-colour monogram tiles for now. Real logo assets are an
// open question (licensing) — see docs/SPEC.md §12.

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
  amountMinor: number;
  currency: 'USD';
  cycle: Cycle;
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
  amountMinor: number,
  cycle: Cycle = 'monthly',
  extra: Partial<CatalogService> = {},
): CatalogService => ({ id, name, category, color, mono, amountMinor, currency: 'USD', cycle, ...extra });

export const SERVICES: CatalogService[] = [
  // Streaming
  s('netflix', 'Netflix', 'Streaming', '#E50914', 'N', 1799, 'monthly', { popular: true }),
  s('disney-plus', 'Disney+', 'Streaming', '#0B1F5C', 'D+', 1199, 'monthly', { popular: true }),
  s('hulu', 'Hulu', 'Streaming', '#1CE783', 'h', 999, 'monthly', { ink: '#0B2A17', popular: true }),
  s('max', 'Max', 'Streaming', '#002BE7', 'M', 1699, 'monthly', { popular: true }),
  s('prime-video', 'Prime Video', 'Streaming', '#00A8E1', 'pv', 899),
  s('apple-tv', 'Apple TV+', 'Streaming', '#111111', 'tv', 1299, 'monthly', { billedVia: 'apple', popular: true }),
  s('peacock', 'Peacock', 'Streaming', '#1A1A1A', 'P', 1099),
  s('paramount-plus', 'Paramount+', 'Streaming', '#0064FF', 'P+', 799),
  s('youtube-premium', 'YouTube Premium', 'Streaming', '#FF0033', 'YT', 1399, 'monthly', { popular: true }),
  s('crunchyroll', 'Crunchyroll', 'Streaming', '#F47521', 'C', 799),
  // Music
  s('spotify', 'Spotify', 'Music', '#1DB954', 'S', 1199, 'monthly', { ink: '#0B2A17', popular: true }),
  s('apple-music', 'Apple Music', 'Music', '#FA2D48', '♪', 1099, 'monthly', { billedVia: 'apple' }),
  s('youtube-music', 'YouTube Music', 'Music', '#FF0033', 'YM', 1099),
  s('audible', 'Audible', 'Music', '#F8991C', 'A', 1495),
  s('siriusxm', 'SiriusXM', 'Music', '#0000EB', 'SX', 1099),
  // AI & apps
  s('chatgpt-plus', 'ChatGPT Plus', 'AI & apps', '#10A37F', 'G', 2000, 'monthly', { popular: true }),
  s('claude-pro', 'Claude Pro', 'AI & apps', '#D97757', 'C', 2000),
  s('adobe-cc', 'Adobe Creative Cloud', 'AI & apps', '#DA1F26', 'Ac', 5999),
  s('microsoft-365', 'Microsoft 365', 'AI & apps', '#0078D4', '365', 9999, 'yearly'),
  s('canva-pro', 'Canva Pro', 'AI & apps', '#7D2AE8', 'C', 11999, 'yearly'),
  s('duolingo', 'Duolingo Super', 'AI & apps', '#58CC02', 'D', 8399, 'yearly', { ink: '#0F2A00' }),
  s('notion', 'Notion Plus', 'AI & apps', '#191919', 'N', 1200),
  // Cloud
  s('icloud', 'iCloud+', 'Cloud', '#3693F3', '☁', 299, 'monthly', { billedVia: 'apple', popular: true }),
  s('google-one', 'Google One', 'Cloud', '#4285F4', 'G1', 299),
  s('dropbox', 'Dropbox Plus', 'Cloud', '#0061FE', 'Db', 1199),
  s('apple-one', 'Apple One', 'Cloud', '#1D1D1F', '1', 1995, 'monthly', { billedVia: 'apple' }),
  // Shopping
  s('amazon-prime', 'Amazon Prime', 'Shopping', '#FF9900', 'a', 1499, 'monthly', { ink: '#1A1200', popular: true }),
  s('walmart-plus', 'Walmart+', 'Shopping', '#0071CE', 'W+', 1295),
  s('costco', 'Costco', 'Shopping', '#E31837', 'Co', 6500, 'yearly'),
  s('doordash', 'DashPass', 'Shopping', '#FF3008', 'DD', 999),
  s('uber-one', 'Uber One', 'Shopping', '#000000', 'U1', 999),
  s('instacart', 'Instacart+', 'Shopping', '#0AAD0A', 'i+', 999),
  // Fitness
  s('peloton', 'Peloton App', 'Fitness', '#000000', 'P', 1299),
  s('strava', 'Strava', 'Fitness', '#FC4C02', 'S', 1199),
  s('planet-fitness', 'Planet Fitness', 'Fitness', '#5C2D91', 'PF', 1500),
  s('headspace', 'Headspace', 'Fitness', '#F47D31', 'H', 1299),
  s('calm', 'Calm', 'Fitness', '#2E7BD6', 'C', 6999, 'yearly'),
  // News
  s('nyt', 'NYTimes', 'News', '#121212', 'T', 2500),
  s('wsj', 'WSJ', 'News', '#0274B6', 'W', 3899),
  s('substack', 'Substack', 'News', '#FF6719', 'S', 800),
  // Gaming
  s('xbox-game-pass', 'Xbox Game Pass', 'Gaming', '#107C10', 'X', 1999),
  s('ps-plus', 'PlayStation Plus', 'Gaming', '#0070D1', 'PS', 7999, 'yearly'),
  s('nintendo-online', 'Nintendo Switch Online', 'Gaming', '#E60012', 'NS', 1999, 'yearly'),
  s('apple-arcade', 'Apple Arcade', 'Gaming', '#FF2D55', 'AA', 699, 'monthly', { billedVia: 'apple' }),
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((x) => [x.id, x]));
