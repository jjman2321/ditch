// Money on the website follows the app's rules (CLAUDE.md rule 1): amounts are whole minor units,
// maths happens on exact values, rounding only for display, and different currencies are never added.

export type Cycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/** Minor units per major unit. KWD, BHD and OMR have 3 decimals; JPY has none. */
export function minorPerMajor(currency: string): number {
  if (['KWD', 'BHD', 'OMR', 'JOD'].includes(currency)) return 1000;
  if (['JPY', 'KRW'].includes(currency)) return 1;
  return 100;
}

/** Yearly cost in minor units, exact (weekly × 52, monthly × 12, quarterly × 4). */
export function yearlyMinor(amountMinor: number, cycle: Cycle): number {
  switch (cycle) {
    case 'weekly': return amountMinor * 52;
    case 'monthly': return amountMinor * 12;
    case 'quarterly': return amountMinor * 4;
    case 'yearly': return amountMinor;
  }
}

/** Monthly equivalent in minor units, unrounded (yearly ÷ 12, quarterly ÷ 3, weekly × 52 ÷ 12). */
export function monthlyMinor(amountMinor: number, cycle: Cycle): number {
  return yearlyMinor(amountMinor, cycle) / 12;
}

const fmtCache = new Map<string, Intl.NumberFormat>();

/** "$19.99", "£13.99", "CA$18.99", "A$20.99", "€14.99", "₹149", "AED 49.00". US dollars outside the US show as "US$".
 * Whole amounts drop ".00" only when `whole`. */
export function formatMoney(amountMinor: number, currency: string, opts: { whole?: boolean; country?: string } = {}): string {
  const per = minorPerMajor(currency);
  const value = amountMinor / per;
  const digits = per === 1 ? 0 : Math.log10(per);
  const isWhole = Math.abs(value - Math.round(value)) < 1e-9;
  const frac = opts.whole && isWhole ? 0 : digits;
  const key = `${currency}:${frac}`;
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: frac, maximumFractionDigits: frac });
    fmtCache.set(key, f);
  }
  const out = f.format(value);
  if (currency === 'USD' && opts.country && opts.country !== 'US') return `US${out}`;
  return out;
}

export const CYCLE_WORD: Record<Cycle, string> = { weekly: 'a week', monthly: 'a month', quarterly: 'every 3 months', yearly: 'a year' };
export const CYCLE_SHORT: Record<Cycle, string> = { weekly: '/wk', monthly: '/mo', quarterly: '/qtr', yearly: '/yr' };
