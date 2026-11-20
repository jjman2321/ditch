// Every bank the provider supports, by name, with its logo (owner, Nov 20: "make all the banks Plaid has").
// The server's bank-institutions route searches the provider's US and Canada directory. Public data, no
// sign-in, nothing connected. Without a server (Expo Go, the web preview) it finds nothing and the
// picker keeps its built-in list. The provider is never named on Ditch's screens (DECISIONS #64).

import { rememberBanks, type BankEntry } from './banks';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || null;

type Institution = { id: string; name: string; logo: string | null; color: string | null; country: 'US' | 'CA' };

const cache = new Map<string, BankEntry[]>();

/** An institution as a picker entry: the provider's logo, or a letter tile in its colour. */
export function toEntry(i: Institution): BankEntry {
  const color = i.color && /^#[0-9a-f]{6}$/i.test(i.color) ? i.color : '#5A5248';
  return {
    id: i.id,
    plaidId: i.id,
    name: i.name,
    mono: i.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase() || 'B',
    color,
    ink: '#FFFFFF',
    logo: i.logo ? `data:image/png;base64,${i.logo}` : undefined,
    country: i.country,
  };
}

/** Banks whose name matches, from the provider's directory. [] when offline or too short. */
export async function searchDirectory(query: string): Promise<BankEntry[]> {
  const q = query.trim().toLowerCase();
  if (!API_URL || q.length < 2) return [];
  const hit = cache.get(q);
  if (hit) return hit;
  try {
    const res = await fetch(`${API_URL}/bank-institutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { institutions?: Institution[] };
    const list = (json.institutions ?? []).map(toEntry);
    rememberBanks(list);
    cache.set(q, list);
    return list;
  } catch {
    return [];
  }
}
