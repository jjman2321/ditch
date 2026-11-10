import { combinedTotal, convertMinor, newerRates, parseRates, type Rates } from '../fx';
import { spendTotals } from '../money';

const FX: Rates = { date: '2026-11-10', rates: { USD: 1, GBP: 0.745, EUR: 0.89, JPY: 158.18, AUD: 1.448, CAD: 1.41, NZD: 1.78, INR: 93.9, CHF: 0.82, SEK: 9.8 } };

describe('convertMinor', () => {
  it('converts between minor units', () => {
    expect(convertMinor(1000, 'USD', 'GBP', FX)).toBeCloseTo(745, 6); // $10 → £7.45
    expect(convertMinor(745, 'GBP', 'USD', FX)).toBeCloseTo(1000, 6);
  });
  it('respects zero-decimal currencies', () => {
    expect(convertMinor(1490, 'JPY', 'USD', FX)).toBeCloseTo((1490 / 158.18) * 100, 6); // ¥1,490 → about $9.42
    expect(convertMinor(1000, 'USD', 'JPY', FX)).toBeCloseTo(1581.8, 6); // $10 → ¥1,582
  });
  it('is a no-op in the same currency and null when a rate is missing', () => {
    expect(convertMinor(1299, 'EUR', 'EUR', FX)).toBe(1299);
    expect(convertMinor(1299, 'EGP', 'USD', FX)).toBeNull();
  });
});

describe('combinedTotal (the "≈ in all" line)', () => {
  const mixed = spendTotals([
    { amountMinor: 1000, currency: 'GBP', cycle: 'monthly' }, // £120 a year
    { amountMinor: 1799, currency: 'USD', cycle: 'monthly' }, // $215.88 a year
  ]);

  it('adds every currency up in the home currency, from unrounded values', () => {
    const c = combinedTotal(mixed, 'GBP', FX, '2026-11-10')!;
    expect(c.currency).toBe('GBP');
    expect(c.yearlyMinor).toBeCloseTo(12000 + 21588 * 0.745, 6); // ≈ £280.83
    expect(c.monthlyMinor).toBeCloseTo(c.yearlyMinor / 12, 9);
    expect(c.date).toBe('2026-11-10');
  });

  it('works when the home currency is not on the list', () => {
    const c = combinedTotal(mixed, 'EUR', FX, '2026-11-10')!;
    expect(c.yearlyMinor).toBeCloseTo((120 / 0.745) * 0.89 * 100 + 215.88 * 0.89 * 100, 6);
  });

  it('only shows for 2+ currencies', () => {
    const one = spendTotals([{ amountMinor: 1549, currency: 'USD', cycle: 'monthly' }]);
    expect(combinedTotal(one, 'USD', FX, '2026-11-10')).toBeNull();
  });

  it('shows nothing rather than a partial sum when a rate is missing', () => {
    const odd = spendTotals([
      { amountMinor: 1000, currency: 'GBP', cycle: 'monthly' },
      { amountMinor: 9900, currency: 'EGP', cycle: 'monthly' },
    ]);
    expect(combinedTotal(odd, 'GBP', FX, '2026-11-10')).toBeNull();
  });

  it('hides once the rates are too old to trust', () => {
    expect(combinedTotal(mixed, 'GBP', FX, '2026-12-25')).not.toBeNull(); // 45 days
    expect(combinedTotal(mixed, 'GBP', FX, '2026-12-26')).toBeNull(); // 46 days
  });

  it('needs a home currency and rates', () => {
    expect(combinedTotal(mixed, undefined, FX, '2026-11-10')).toBeNull();
    expect(combinedTotal(mixed, 'GBP', null, '2026-11-10')).toBeNull();
  });
});

describe('rates files', () => {
  it('accepts a good file and keeps only valid rates', () => {
    const r = parseRates({ date: '2026-11-11', rates: { ...FX.rates, BAD: -1, xx: 2, NAN: Number.NaN } })!;
    expect(r.date).toBe('2026-11-11');
    expect(r.rates.GBP).toBe(0.745);
    expect(r.rates.BAD).toBeUndefined();
    expect(r.rates.NAN).toBeUndefined();
  });
  it('rejects junk', () => {
    expect(parseRates(null)).toBeNull();
    expect(parseRates({ date: 'yesterday', rates: FX.rates })).toBeNull();
    expect(parseRates({ date: '2026-11-11', rates: { USD: 1, GBP: 0.7 } })).toBeNull(); // too few
    expect(parseRates({ date: '2026-11-11', rates: { ...FX.rates, USD: 2 } })).toBeNull(); // not USD-based
  });
  it('keeps the newer of two', () => {
    const older = { ...FX, date: '2026-11-01' };
    expect(newerRates(older, FX)).toBe(FX);
    expect(newerRates(FX, older)).toBe(FX);
    expect(newerRates(null, FX)).toBe(FX);
  });
});
