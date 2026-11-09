// Money rules (see docs/SPEC.md §5.1).
// Amounts are whole minor units (cents). Never floats in storage.
// Different currencies are never added together.

export type Cycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type Money = { amountMinor: number; currency: string };

const CHARGES_PER_YEAR: Record<Cycle, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

/** Exact yearly cost in minor units. Always a whole number. */
export function yearlyMinor(amountMinor: number, cycle: Cycle): number {
  return amountMinor * CHARGES_PER_YEAR[cycle];
}

/**
 * Monthly equivalent in minor units, unrounded.
 * weekly × 52 / 12, monthly × 1, quarterly ÷ 3, yearly ÷ 12.
 * Round only when displaying.
 */
export function monthlyMinorExact(amountMinor: number, cycle: Cycle): number {
  return yearlyMinor(amountMinor, cycle) / 12;
}

/** How many decimals a currency really uses (USD 2, JPY 0, ...). */
export function currencyDigits(currency: string): number {
  try {
    return (
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

/** Round half-up to whole minor units. */
export function roundMinor(exactMinor: number): number {
  // Small epsilon guards against float noise like 4333.3333333 or 824.99999.
  return Math.floor(exactMinor + 0.5 + 1e-9);
}

type FormatOptions = {
  locale?: string;
  /** Drop ".00" on whole amounts, e.g. "$1,284" instead of "$1,284.00". */
  trimWhole?: boolean;
};

export function formatMoney(
  amountMinor: number,
  currency: string,
  { locale = 'en-US', trimWhole = false }: FormatOptions = {},
): string {
  const digits = currencyDigits(currency);
  const rounded = roundMinor(amountMinor);
  const major = rounded / 10 ** digits;
  const isWhole = rounded % 10 ** digits === 0;
  const fraction = trimWhole && isWhole ? 0 : digits;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(major);
}

/** Sum per currency. Returns one entry per currency, biggest first. */
export function totalsByCurrency(
  items: { amountMinor: number; currency: string }[],
): Money[] {
  const map = new Map<string, number>();
  for (const it of items) {
    map.set(it.currency, (map.get(it.currency) ?? 0) + it.amountMinor);
  }
  return [...map.entries()]
    .map(([currency, amountMinor]) => ({ currency, amountMinor }))
    .sort((a, b) => b.amountMinor - a.amountMinor);
}

export const CYCLE_SHORT: Record<Cycle, string> = {
  weekly: '/wk',
  monthly: '/mo',
  quarterly: '/qtr',
  yearly: '/yr',
};
