import { describe, expect, it } from 'vitest';

import { verifiedPrices } from './data';
import { SERVICE_TOOLS } from './tools';

/**
 * Comparison answers quote US prices as text (Nov 15). If a price changes, the quote must change too:
 * every $ amount in a comparison's questions and "What you get" rows must be a checked US price of one of the
 * two services, or the gap between two of them, or a price stated on the official page we list below.
 */
const STATED_ON_PAGE: Record<string, string[]> = {
  // Prime Video Ultra (ad-free add-on), from Amazon's own news page; not a plan in our prices file.
  'netflix-vs-prime-video': ['4.99', '45.99'],
  // Live TV plans and the Extra Member add-on, from the services' own pages.
  'netflix-vs-hulu': ['99.99'],
  'disney-plus-basic-vs-premium': ['6.99', '9.99'],
  // Apple's own "Save $17/mo." and "Save $35/mo." lines, quoted.
  'apple-one-family-vs-premier': ['17.00', '35.00'],
};

describe('comparison pages quote current prices', () => {
  const pairs = SERVICE_TOOLS.filter((t) => (t.kind === 'vs' || t.kind === 'tiers') && t.facts?.length);
  it('has comparison pages', () => expect(pairs.length).toBeGreaterThan(20));
  for (const t of pairs) {
    it(t.slug, () => {
      const ids = [t.s, t.a, t.b].filter((x): x is string => Boolean(x));
      const amts = ids.flatMap((id) => verifiedPrices(id).find((r) => r.country === 'US')?.plans.map((p) => p.amountMinor) ?? []);
      const ok = new Set<string>([...amts, ...amts.flatMap((x) => amts.map((y) => Math.abs(x - y)))].map((v) => (v / 100).toFixed(2)));
      for (const v of STATED_ON_PAGE[t.slug] ?? []) ok.add(v);
      const text = [...t.faq.map((f) => f.a), ...(t.facts ?? []).flatMap((r) => [r.a, r.b])].join(' ');
      const bad = [...text.matchAll(/\$(\d[\d,]*(?:\.\d\d)?)/g)].map((m) => (+m[1].replace(/,/g, '')).toFixed(2)).filter((v) => !ok.has(v));
      expect(bad, `${t.slug}: ${text.slice(0, 200)}`).toEqual([]);
    });
  }
});

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import OG from '@/data/og.json';
import { priceHubServices, publishedGuides, slugOf } from './data';

/** Every comparison, price page and guide has its own share image on disk (npm run og redraws them). */
describe('share images', () => {
  const want = [
    ...SERVICE_TOOLS.filter((t) => t.kind === 'vs' || t.kind === 'tiers').map((t) => `c/${t.slug}`),
    ...priceHubServices().map((s) => `p/${slugOf(s.id)}`),
    ...publishedGuides().map((g) => `g/${slugOf(g.id)}`),
  ];
  it('every page has one', () => expect(want.filter((f) => !(OG as string[]).includes(f))).toEqual([]));
  it('every listed image exists', () => expect((OG as string[]).filter((f) => !existsSync(join(__dirname, '../../public/og', `${f}.jpg`)))).toEqual([]));
});

import { CANCEL_NAME, PRICE_SEARCH } from './searchNames';
import { guideById } from './data';

/** Search-matched titles (Nov 15) only work when keyed by the real service id. */
describe('search names', () => {
  it('every price title belongs to a live price page and fits in 60 characters', () => {
    const hubs = new Set(priceHubServices().map((s) => s.id));
    expect(Object.keys(PRICE_SEARCH).filter((id) => !hubs.has(id))).toEqual([]);
    expect(Object.entries(PRICE_SEARCH).filter(([, v]) => v.title(29).length > 60).map(([k]) => k)).toEqual([]);
  });
  it('every cancel name belongs to a guide', () => expect(Object.keys(CANCEL_NAME).filter((id) => !guideById(id))).toEqual([]));
});
