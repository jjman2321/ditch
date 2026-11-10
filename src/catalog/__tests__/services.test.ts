import { COUNTRY_BY_CODE } from '../prices';
import { CATEGORIES, POPULAR_ORDER, SERVICES, SERVICE_BY_ID, availableIn, normalizeSearch, popularIn, searchServices } from '../services';

const first = (q: string, country: string | null = null) => searchServices(q, SERVICES.filter((s) => availableIn(s, country)))[0]?.id;

describe('catalog (services.data.ts, generated)', () => {
  it('has 200+ services with unique ids', () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(200);
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(SERVICES.length);
  });

  it('every service is in a known category, and every category has at least 5', () => {
    for (const s of SERVICES) expect(CATEGORIES).toContain(s.category);
    for (const c of CATEGORIES) expect(SERVICES.filter((s) => s.category === c).length).toBeGreaterThanOrEqual(5);
  });

  it('availableIn only names our 12 countries', () => {
    for (const s of SERVICES) for (const c of s.availableIn ?? []) expect(COUNTRY_BY_CODE[c]).toBeDefined();
  });

  it('has a top 100, each in the catalog, ranked 1 to 100', () => {
    expect(POPULAR_ORDER).toHaveLength(100);
    POPULAR_ORDER.forEach((id, i) => expect(SERVICE_BY_ID[id]?.rank).toBe(i + 1));
  });

  it('keeps the ids older lists may already store', () => {
    for (const id of ['netflix', 'max', 'apple-tv', 'chatgpt-plus', 'icloud', 'amazon-prime', 'duolingo', 'xbox-game-pass', 'nyt', 'calm']) expect(SERVICE_BY_ID[id]).toBeDefined();
  });

  it('every tile has a monogram and a #RRGGBB colour', () => {
    for (const s of SERVICES) {
      expect(s.mono.length).toBeGreaterThan(0);
      expect(s.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('popular list', () => {
  it('only lists services sold in the country', () => {
    const uk = popularIn('GB');
    expect(uk.map((s) => s.id)).not.toContain('hulu');
    expect(uk.length).toBe(30);
    expect(uk.every((s) => availableIn(s, 'GB'))).toBe(true);
    expect(popularIn('US')[0].id).toBe('netflix');
  });
});

describe('search', () => {
  it('normalises case, accents, + and &', () => {
    expect(normalizeSearch('Disney+')).toBe('disney plus');
    expect(normalizeSearch('  El País ')).toBe('el pais');
    expect(normalizeSearch('AT&T')).toBe('at and t');
  });

  it('finds services by their nicknames', () => {
    expect(first('HBO')).toBe('max');
    expect(first('max')).toBe('max');
    expect(first('Prime')).toBe('amazon-prime');
    expect(first('YT')).toBe('youtube-premium');
    expect(first('gemini')).toBe('google-ai-pro');
    expect(first('twitter')).toBe('x-premium');
    expect(first('office')).toBe('microsoft-365');
    expect(first('hotstar', 'IN')).toBe('jiohotstar');
  });

  it('puts an exact name first, then starts-with, then the rest', () => {
    expect(first('netflix')).toBe('netflix');
    expect(first('net')).toBe('netflix');
    expect(first('disney plus')).toBe('disney-plus');
    expect(first('disney+')).toBe('disney-plus');
    expect(first('apple tv+')).toBe('apple-tv');
    const yt = searchServices('youtube').map((s) => s.id);
    expect(yt.slice(0, 3).sort()).toEqual(['youtube-music', 'youtube-premium', 'youtube-tv']);
  });

  it('matches inside a name only from 3 letters', () => {
    expect(searchServices('lix').map((s) => s.id)).toContain('netflix');
    expect(searchServices('ix').map((s) => s.id)).not.toContain('netflix');
  });

  it('finds nothing for nonsense, and nothing for an empty query', () => {
    expect(searchServices('zzqx')).toEqual([]);
    expect(searchServices('   ')).toEqual([]);
  });

  it('respects the country list it is given', () => {
    expect(first('hulu', 'GB')).toBeUndefined();
    expect(first('hulu', 'US')).toBe('hulu');
  });
});
