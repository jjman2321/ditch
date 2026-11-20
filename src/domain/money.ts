// Money rules (see docs/SPEC.md §5.1).
// Amounts are whole minor units (cents). Never floats in storage.
// Different currencies are never added together.

/** biweekly = every 2 weeks, semiannual = every 6 months (Nov 15: Bobby users asked for both; DECISIONS #57). */
export type Cycle = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semiannual' | 'yearly';

export type Money = { amountMinor: number; currency: string };

const CHARGES_PER_YEAR: Record<Cycle, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  yearly: 1,
};

/** Exact yearly cost in minor units. Always a whole number. */
export function yearlyMinor(amountMinor: number, cycle: Cycle): number {
  return amountMinor * CHARGES_PER_YEAR[cycle];
}

/**
 * Monthly equivalent in minor units, unrounded.
 * weekly × 52 / 12, every 2 weeks × 26 / 12, monthly × 1, quarterly ÷ 3, every 6 months ÷ 6, yearly ÷ 12.
 * Round only when displaying.
 */
export function monthlyMinorExact(amountMinor: number, cycle: Cycle): number {
  return yearlyMinor(amountMinor, cycle) / 12;
}

/** How many decimals a currency really uses (USD 2, JPY 0, ...). */
export function currencyDigits(currency: string): number {
  if (ZERO_DECIMAL.has(currency)) return 0;
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
  /**
   * The user's own currency. It gets the plain local symbol ("$" for an
   * Australian's AUD); every other currency gets one that can't be mixed
   * up ("US$", "A$", "CA$", "NZ$"). Without it, en-US symbols are used.
   */
  home?: string;
};

/** Symbols that never collide, for currencies that aren't the user's own. */
const DISTINCT_SYMBOL: Record<string, string> = { USD: 'US$', AUD: 'A$', CAD: 'CA$', NZD: 'NZ$' };

export function formatMoney(
  amountMinor: number,
  currency: string,
  { locale = 'en-US', trimWhole = false, home }: FormatOptions = {},
): string {
  const digits = currencyDigits(currency);
  const rounded = roundMinor(amountMinor);
  const major = rounded / 10 ** digits;
  const isWhole = rounded % 10 ** digits === 0;
  const fraction = trimWhole && isWhole ? 0 : digits;
  return withSymbol(major, currency, fraction, locale, home);
}

/** Currencies with no minor unit, so we don't depend on Intl for them. */
const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'CLP', 'VND', 'ISK', 'HUF', 'TWD', 'UGX', 'XAF', 'XOF']);

type Display = 'symbol' | 'narrowSymbol' | 'code';

/**
 * iPhone's JavaScript engine (Hermes) has a smaller Intl than browsers and Node:
 * no formatToParts, and some options can throw. Build formatters defensively.
 */
const formats = new Map<string, Intl.NumberFormat>();
/** Cached: making a formatter costs ~60µs, and the reminder plan formats thousands of prices (audit, Nov 20). */
function currencyFormat(locale: string, currency: string, fraction: number, display: Display): Intl.NumberFormat {
  const key = `${locale}|${currency}|${fraction}|${display}`;
  let f = formats.get(key);
  if (!f) {
    f = makeCurrencyFormat(locale, currency, fraction, display);
    formats.set(key, f);
  }
  return f;
}

function makeCurrencyFormat(locale: string, currency: string, fraction: number, display: Display): Intl.NumberFormat {
  const base = { style: 'currency' as const, currency, minimumFractionDigits: fraction, maximumFractionDigits: fraction };
  try {
    return new Intl.NumberFormat(locale, { ...base, currencyDisplay: display });
  } catch {
    return new Intl.NumberFormat(locale, base);
  }
}

function withSymbol(major: number, currency: string, fraction: number, locale: string, home?: string): string {
  const own = home === undefined || currency === home;
  const distinct = !own ? DISTINCT_SYMBOL[currency] : undefined;
  const fmt = currencyFormat(locale, currency, fraction, own && home !== undefined ? 'narrowSymbol' : 'symbol');
  if (!distinct) return fmt.format(major);

  if (typeof fmt.formatToParts === 'function') {
    try {
      return fmt
        .formatToParts(major)
        .map((p) => (p.type === 'currency' ? distinct : p.value))
        .join('');
    } catch {
      // fall through to the code-based swap below
    }
  }
  // Fallback: format with the ISO code ("USD 15.99" / "15,99 USD") and swap it for our symbol.
  const withCode = currencyFormat(locale, currency, fraction, 'code').format(major);
  if (withCode.includes(currency)) {
    return withCode.replace(new RegExp(`${currency}[\\s\\u00a0\\u202f]?`), distinct).trim();
  }
  return fmt.format(major);
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
  biweekly: '/2 wks',
  monthly: '/mo',
  quarterly: '/qtr',
  semiannual: '/6 mo',
  yearly: '/yr',
};

/** "a month", "a year"… for "about $17.99 a month". */
export const CYCLE_WORDS: Record<Cycle, string> = {
  weekly: 'a week',
  biweekly: 'every 2 weeks',
  monthly: 'a month',
  quarterly: 'every 3 months',
  semiannual: 'every 6 months',
  yearly: 'a year',
};

/** Whole major units for a headline, rounded half-up: $1,091.40 → "$1,091". */
export function formatWholeMoney(amountMinor: number, currency: string, { locale = 'en-US', home }: { locale?: string; home?: string } = {}): string {
  const digits = currencyDigits(currency);
  const major = roundMinor(amountMinor / 10 ** digits);
  return withSymbol(major, currency, 0, locale, home);
}

export type SpendTotal = {
  currency: string;
  /** Exact, always whole minor units. */
  yearlyMinor: number;
  /** Unrounded. Round only for display. */
  monthlyMinor: number;
  /** Unrounded. Yearly ÷ 365. */
  dailyMinor: number;
};

/**
 * Yearly, monthly and daily spend, one entry per currency (biggest first).
 * Monthly and daily come from the exact yearly sum, so nothing is
 * rounded twice.
 */
export function spendTotals(
  items: { amountMinor: number; currency: string; cycle: Cycle }[],
): SpendTotal[] {
  return totalsByCurrency(items.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) }))).map(
    (t) => ({ currency: t.currency, yearlyMinor: t.amountMinor, monthlyMinor: t.amountMinor / 12, dailyMinor: t.amountMinor / 365 }),
  );
}

/**
 * What the user typed ("12.99", "12,99", "£1,299.00") → whole minor units.
 * Null if it isn't a positive amount. Never uses floats for the result.
 */
export function parseAmountInput(text: string, currency: string): number | null {
  const digits = currencyDigits(currency);
  let t = text.replace(/[^\d.,]/g, '');
  // Mid-typing "12." or "12,": the cents aren't in yet, so read it as 12.
  if (digits > 0 && /^\d+[.,]$/.test(t)) t = t.slice(0, -1);
  if (!t) return null;
  const lastDot = t.lastIndexOf('.');
  const lastComma = t.lastIndexOf(',');
  const sep = Math.max(lastDot, lastComma);
  let whole = t;
  let frac = '';
  // The last separator is the decimal point if 1–2 digits follow it (or the currency has none).
  if (sep >= 0 && t.length - sep - 1 >= 1 && t.length - sep - 1 <= 2 && digits > 0) {
    whole = t.slice(0, sep);
    frac = t.slice(sep + 1);
  }
  // Anything left of the decimal point may only use separators as thousands
  // groups ("1,299" or "1.299"). "12.9911" is a typo, not a price: refuse it
  // instead of guessing $129,911.
  const groups = whole.split(/[.,]/);
  if (groups.length > 1 && (groups[0].length < 1 || groups[0].length > 3 || groups.slice(1).some((g) => g.length !== 3))) return null;
  // One dot group that makes it 10,000 or more ("15.490") is almost always a typo for 15.49, not a price.
  // Not with a comma ("10,000") or with cents ("12,345.67"): those are what they say (audit, Nov 20).
  if (digits > 0 && !frac && groups.length === 2 && whole.includes('.') && Number(groups.join('')) >= 10_000) return null;
  whole = groups.join('');
  t = whole || '0';
  const minor = Number(t) * 10 ** digits + Number((frac + '00').slice(0, digits) || 0);
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}
