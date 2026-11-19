// Money from a bank data provider -> the phone's integer minor units (CLAUDE.md rule 1).
// No Deno-only imports: the app's Jest runs these tests too.

/** Currencies with no minor unit (ISO 4217 exponent 0). */
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'UYI', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
/** Currencies with three decimals (ISO 4217 exponent 3). */
const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

/** A three-letter ISO currency code, upper case. */
export function isIsoCurrency(code: unknown): code is string {
  return typeof code === 'string' && /^[A-Z]{3}$/.test(code);
}

/** How many decimals a currency really uses (USD 2, JPY 0, KWD 3). */
export function currencyDigits(currency: string): number {
  const c = currency.toUpperCase();
  if (ZERO_DECIMAL.has(c)) return 0;
  if (THREE_DECIMAL.has(c)) return 3;
  return 2;
}

/**
 * A decimal amount in major units (Plaid sends 15.49) -> whole minor units (1549).
 * Goes through a fixed-decimal string so float noise like 15.49 * 100 = 1548.9999 can't leak in.
 */
export function majorToMinor(amount: number, currency: string): number {
  if (!Number.isFinite(amount)) throw new Error('amount is not a finite number');
  const digits = currencyDigits(currency);
  const neg = amount < 0;
  const [whole, frac = ''] = Math.abs(amount).toFixed(digits).split('.');
  const minor = Number(whole + frac.padEnd(digits, '0'));
  return neg && minor !== 0 ? -minor : minor;
}
