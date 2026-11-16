// Matching a name read from a screenshot or a bank statement to our catalog.
// Stricter than the Add-sheet search: a wrong match here would put the wrong
// service (and price) on someone's list, so weak matches return null and the
// row is shown as the user's own entry instead.

import { SERVICES, normalizeSearch, type CatalogService } from '@/catalog/services';
import { MERCHANT_ALIASES } from './merchants';

const BY_TERM = new Map<string, string>();
for (const s of SERVICES) {
  for (const t of [s.name, ...(s.aliases ?? [])]) {
    const key = normalizeSearch(t).replace(/ /g, '');
    if (key.length >= 3 && !BY_TERM.has(key)) BY_TERM.set(key, s.id);
  }
}
const TERMS = [...BY_TERM.entries()].sort((a, b) => b[0].length - a[0].length);

const BY_ID = new Map(SERVICES.map((s) => [s.id, s]));

/**
 * A service name as Apple's Subscriptions screen shows it ("Spotify Premium",
 * "YouTube Premium", "ChatGPT Plus", "Disney+: Streaming") → a catalog service.
 */
export function matchName(raw: string): CatalogService | null {
  const head = raw.split(/[:|–—]| - /)[0];
  for (const text of [raw, head]) {
    const key = normalizeSearch(text).replace(/ /g, '');
    if (!key) continue;
    const exact = BY_TERM.get(key);
    if (exact) return BY_ID.get(exact) ?? null;
    // The longest catalog name the text starts with ("spotifypremium" → spotify), at least 4 letters.
    const hit = TERMS.find(([t]) => t.length >= 4 && key.startsWith(t));
    if (hit) return BY_ID.get(hit[1]) ?? null;
  }
  return null;
}

/** A cleaned bank-statement merchant ("NETFLIX.COM", "SPOTIFY USA") → a catalog service. */
export function matchMerchant(clean: string): CatalogService | null {
  const key = clean.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [pattern, id] of MERCHANT_ALIASES) if (pattern.test(key)) return BY_ID.get(id) ?? null;
  return matchName(clean);
}
