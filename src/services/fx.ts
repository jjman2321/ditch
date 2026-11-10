// Exchange rates for the "≈ in all" line (DECISIONS #32).
// Starts from the rates bundled in the app, then the last ones saved on this
// phone. Downloads fresh ones at most once a day, and only for people whose
// list has 2+ currencies. The request carries nothing about the user: it's
// the same public file for everyone. If it fails, we keep what we have.

import { File, Paths } from 'expo-file-system';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import { BUNDLED_RATES } from '@/catalog/fx.data';
import { combinedTotal, newerRates, parseRates, type Combined, type Rates } from '@/domain/fx';
import type { SpendTotal } from '@/domain/money';

import { now, today } from './clock';

const URL = 'https://open.er-api.com/v6/latest/USD';
const DAY_MS = 24 * 60 * 60 * 1000;
const NAME = 'fx-rates.json';

let current: Rates = BUNDLED_RATES;
let lastTry = 0;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function cacheFile(): File | null {
  if (Platform.OS === 'web') return null;
  try {
    return new File(Paths.document, NAME);
  } catch {
    return null;
  }
}

async function readCache(): Promise<Rates | null> {
  try {
    const f = cacheFile();
    if (!f?.exists) return null;
    const saved = JSON.parse(await f.text()) as { rates?: unknown; triedAt?: number };
    if (typeof saved.triedAt === 'number') lastTry = Math.max(lastTry, saved.triedAt);
    return parseRates(saved.rates);
  } catch {
    return null;
  }
}

function writeCache(rates: Rates) {
  try {
    const f = cacheFile();
    if (!f) return;
    if (!f.exists) f.create();
    f.write(JSON.stringify({ rates, triedAt: lastTry }));
  } catch {
    // Not worth bothering anyone about: we'll try again tomorrow.
  }
}

async function download(): Promise<Rates | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(URL, { signal: ctrl.signal });
    const data = (await res.json()) as { result?: string; base_code?: string; time_last_update_unix?: number; rates?: unknown };
    if (data.result !== 'success' || data.base_code !== 'USD' || typeof data.time_last_update_unix !== 'number') return null;
    return parseRates({ date: new Date(data.time_last_update_unix * 1000).toISOString().slice(0, 10), rates: data.rates });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function publish(r: Rates | null) {
  const next = newerRates(current, r);
  if (next && next !== current) {
    current = next;
    listeners.forEach((l) => l());
  }
}

function refresh(): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    publish(await readCache());
    if (now().getTime() - lastTry < DAY_MS) return;
    lastTry = now().getTime();
    const fresh = await download();
    publish(fresh);
    writeCache(current);
  })().finally(() => {
    loading = null;
  });
  return loading;
}

/** The best rates we have. Pass `wanted: false` to skip any download. */
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function useRates(wanted: boolean): Rates {
  const rates = useSyncExternalStore(subscribe, () => current);
  useEffect(() => {
    if (wanted) void refresh();
  }, [wanted]);
  return rates;
}

/** The rough combined total in `home`, or null for single-currency lists. */
export function useCombinedTotal(totals: SpendTotal[], home: string | undefined): Combined | null {
  const fx = useRates(totals.length > 1);
  return useMemo(() => combinedTotal(totals, home, fx, today()), [totals, home, fx]);
}
