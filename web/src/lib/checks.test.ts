import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { COUNTRIES, priceHubServices, publicNotes, publishedGuides, verifiedPrices } from './data';
import { formatMoney, monthlyMinor, yearlyMinor } from './money';

// CLAUDE.md rule 5 and the website plan: phrases the site must never use.
const BANNED = [/we cancel (it )?for you/i, /automatically (find|detect)s?/i, /finds every/i, /nothing leaves your phone/i, /\byou save\b/i, /saved (you )?\$|\$[\d,.]+ saved|you(.ve)? saved/i, /all future features/i, /limited time/i, /seamless/i, /effortless/i, /heads-up/i];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts') ? [p] : [];
  });
}

describe('copy lint', () => {
  it('no banned phrases in the site source', () => {
    const hits = files(join(__dirname, '..')).flatMap((f) => {
      const text = readFileSync(f, 'utf8');
      return BANNED.filter((b) => b.test(text)).map((b) => `${f}: ${b}`);
    });
    expect(hits).toEqual([]);
  });
});

describe('money', () => {
  it('Netflix $15.49/mo → $185.88/yr; $99/yr → $8.25/mo', () => {
    expect(formatMoney(yearlyMinor(1549, 'monthly'), 'USD')).toBe('$185.88');
    expect(formatMoney(monthlyMinor(9900, 'yearly'), 'USD')).toBe('$8.25');
  });
  it('US dollars outside the US say US$', () => {
    expect(formatMoney(1199, 'USD', { country: 'KW' })).toBe('US$11.99');
    expect(formatMoney(1199, 'USD', { country: 'US' })).toBe('$11.99');
  });
});

describe('publishing gates', () => {
  it('only verified rows, only high-confidence guides', () => {
    for (const s of priceHubServices()) for (const r of verifiedPrices(s.id)) expect(r.status).toBe('verified');
    for (const g of publishedGuides()) expect(g.confidence).toBe('high');
  });
  it('every published row has a source and a checked date', () => {
    for (const s of priceHubServices())
      for (const r of verifiedPrices(s.id)) {
        expect(r.source).toMatch(/^https:\/\//);
        expect(r.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(COUNTRIES.some((c) => c.code === r.country)).toBe(true);
      }
  });
  it('notes shown on pages never mention how we fetched things', () => {
    for (const g of publishedGuides()) for (const n of publicNotes(g.note)) expect(n).not.toMatch(/automated|cancel\.ts|snippet/i);
  });
});
