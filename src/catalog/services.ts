// Bundled catalog of services: names, logos, categories, search.
// The list itself is generated: edit scripts/catalog/catalog.txt and run
// `npm run catalog` (writes services.data.ts and logos.ts).
// Prices are NOT here: they're per country in prices.ts (DECISIONS #17).
// `cycle` is only the usual billing cycle, used when the user adds their
// own price.
// Logos: real app icons in src/catalog/logos.ts; services without one
// fall back to a brand-colour monogram tile.

import type { Cycle } from '@/domain/money';

import { SERVICE_ROWS, TOP_IDS } from './services.data';

export type Category =
  | 'Streaming'
  | 'Music & audio'
  | 'AI'
  | 'Productivity'
  | 'Cloud & security'
  | 'Shopping & food'
  | 'Health & fitness'
  | 'Dating'
  | 'Social'
  | 'News & reading'
  | 'Gaming'
  | 'Learning';

export type CatalogService = {
  id: string;
  name: string;
  category: Category;
  color: string; // tile background
  ink?: string; // monogram colour, defaults to white
  mono: string; // 1–3 letters on the tile
  cycle: Cycle; // usual billing cycle
  /** Countries where it's sold. Omitted = everywhere we support. */
  availableIn?: string[];
  /** Other words people search for ("HBO" for HBO Max, "Prime" for Amazon Prime). */
  aliases?: string[];
  billedVia?: 'apple' | 'direct';
  /** 1–100 for the 100 most popular services (scripts/catalog/top100.txt). */
  rank?: number;
  popular?: boolean; // the top 20: the editor's first suggestions
};

export const CATEGORIES: Category[] = [
  'Streaming',
  'Music & audio',
  'AI',
  'Productivity',
  'Cloud & security',
  'Shopping & food',
  'Health & fitness',
  'Dating',
  'Social',
  'News & reading',
  'Gaming',
  'Learning',
];

/** The whole catalog, most popular first within each category. */
export const SERVICES: CatalogService[] = SERVICE_ROWS;

export const SERVICE_BY_ID: Record<string, CatalogService> = Object.fromEntries(SERVICES.map((x) => [x.id, x]));

/** What "Popular" shows, most common first (Nov 2026). */
export const POPULAR_ORDER: string[] = TOP_IDS;

/** How many services the "Popular" chip lists (after the country filter). */
export const POPULAR_SHOWN = 30;

export const POPULAR: CatalogService[] = POPULAR_ORDER.map((id) => SERVICE_BY_ID[id]).filter(Boolean);

/** The "Popular" list for a country: the top services sold there. */
export function popularIn(country: string | null, n = POPULAR_SHOWN): CatalogService[] {
  return POPULAR.filter((s) => availableIn(s, country)).slice(0, n);
}

/** Sold in this country? Unknown country shows everything. */
export function availableIn(service: CatalogService, country: string | null): boolean {
  return !country || !service.availableIn || service.availableIn.includes(country);
}

/** Lowercase, no accents, "+" as "plus", "&" as "and", only letters, digits and single spaces. */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

type Term = { words: string; tight: string; weight: number };
const TERMS = new Map<string, Term[]>(
  SERVICES.map((s) => [
    s.id,
    [
      { text: s.name, weight: 10 },
      ...(s.aliases ?? []).map((text) => ({ text, weight: 5 })),
      { text: s.id.replace(/-/g, ' '), weight: 0 },
    ].map(({ text, weight }) => {
      const words = normalizeSearch(text);
      return { words, tight: words.replace(/ /g, ''), weight };
    }),
  ]),
);

/** How well a service matches a query: 0 = no match. */
function matchScore(s: CatalogService, words: string, tight: string): number {
  let best = 0;
  for (const t of TERMS.get(s.id) ?? []) {
    let score = 0;
    if (t.words === words || t.tight === tight) score = 100;
    else if (t.words.startsWith(words) || t.tight.startsWith(tight)) score = 80;
    else if ((' ' + t.words).includes(' ' + words)) score = 60;
    else if (tight.length >= 3 && t.tight.includes(tight)) score = 30;
    if (score) best = Math.max(best, score + t.weight);
  }
  return best;
}

/**
 * Catalog search, best match first: exact name or alias ("HBO" finds HBO
 * Max, "Prime" finds Amazon Prime), then starts-with, then word starts-with,
 * then anywhere in the name. Ties go to the more popular service.
 */
export function searchServices(query: string, list: CatalogService[] = SERVICES): CatalogService[] {
  const words = normalizeSearch(query);
  if (!words) return [];
  const tight = words.replace(/ /g, '');
  return list
    .map((s, i) => ({ s, i, score: matchScore(s, words, tight) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.s.rank ?? 999) - (b.s.rank ?? 999) || a.i - b.i)
    .map((x) => x.s);
}
