// The "≈ in all" line: a rough combined total for lists with 2+ currencies
// (DECISIONS #32). Real amounts are never changed or stored converted;
// this only adds one clearly marked estimate next to the real totals.
// Pure, so it's tested in Jest.

import { daysBetween, type DateOnly } from './dates';
import { currencyDigits, type SpendTotal } from './money';

/** Units of each currency per 1 US dollar, and the day they're from. */
export type Rates = { date: DateOnly; rates: Record<string, number> };

/** Older than this and we stop showing the estimate rather than mislead. */
export const MAX_RATE_AGE_DAYS = 45;

/** `amountMinor` of `from` in minor units of `to`, unrounded. Null if a rate is missing. */
export function convertMinor(amountMinor: number, from: string, to: string, fx: Rates): number | null {
  if (from === to) return amountMinor;
  const rFrom = fx.rates[from];
  const rTo = fx.rates[to];
  if (!(rFrom > 0) || !(rTo > 0)) return null;
  const major = amountMinor / 10 ** currencyDigits(from);
  return (major / rFrom) * rTo * 10 ** currencyDigits(to);
}

export type Combined = { currency: string; yearlyMinor: number; monthlyMinor: number; date: DateOnly };

/**
 * One rough total in `home`, only when the list has 2+ currencies and we
 * have every rate, from rates no older than MAX_RATE_AGE_DAYS.
 */
export function combinedTotal(totals: SpendTotal[], home: string | undefined, fx: Rates | null, today: DateOnly): Combined | null {
  if (!home || !fx || totals.length < 2) return null;
  if (daysBetween(fx.date, today) > MAX_RATE_AGE_DAYS) return null;
  let yearly = 0;
  for (const t of totals) {
    const v = convertMinor(t.yearlyMinor, t.currency, home, fx);
    if (v === null) return null;
    yearly += v;
  }
  return { currency: home, yearlyMinor: yearly, monthlyMinor: yearly / 12, date: fx.date };
}

/** Keep whichever rates are newer. */
export function newerRates(a: Rates | null, b: Rates | null): Rates | null {
  if (!a) return b;
  if (!b) return a;
  return b.date > a.date ? b : a;
}

/** Checks a downloaded or cached file before we trust it. */
export function parseRates(raw: unknown): Rates | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as { date?: unknown; rates?: unknown };
  if (typeof r.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) return null;
  if (!r.rates || typeof r.rates !== 'object') return null;
  const rates: Record<string, number> = {};
  for (const [k, v] of Object.entries(r.rates as Record<string, unknown>)) {
    if (/^[A-Z]{3}$/.test(k) && typeof v === 'number' && Number.isFinite(v) && v > 0) rates[k] = v;
  }
  if (rates.USD !== 1 || Object.keys(rates).length < 10) return null;
  return { date: r.date, rates };
}
