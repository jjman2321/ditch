import { daysBetween, toDateOnly } from '@/domain/dates';
import { currencyDigits, formatMoney, yearlyMinor } from '@/domain/money';

import { COUNTRIES, COUNTRY_BY_CODE, PRICE_ROWS, catalogPrice, planChoices, priceRow, supportedCountry } from '../prices';
import { SERVICE_BY_ID } from '../services';

describe('price data (prices.data.ts, generated)', () => {
  it('ships only verified rows', () => {
    expect(PRICE_ROWS.length).toBeGreaterThan(90);
    expect(PRICE_ROWS.every((r) => r.status === 'verified')).toBe(true);
  });

  it('every amount is a whole number of minor units above zero', () => {
    for (const r of PRICE_ROWS) for (const p of r.plans) expect(Number.isSafeInteger(p.amountMinor) && p.amountMinor > 0).toBe(true);
  });

  it("every row's currency matches its country, and the country is one of the 12", () => {
    for (const r of PRICE_ROWS) expect(COUNTRY_BY_CODE[r.country]?.currency).toBe(r.currency);
  });

  it('every row is for a service in the catalog, with a source and a checked date', () => {
    for (const r of PRICE_ROWS) {
      expect(SERVICE_BY_ID[r.serviceId]).toBeDefined();
      expect(r.source).toMatch(/^https:\/\//);
      expect(r.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('each row has exactly one default plan and unique plan ids', () => {
    for (const r of PRICE_ROWS) {
      expect(r.plans.filter((p) => p.default).length).toBe(1);
      expect(new Set(r.plans.map((p) => p.id)).size).toBe(r.plans.length);
    }
  });

  it('no row is older than 120 days (prices go stale: refresh the research file)', () => {
    const today = toDateOnly();
    const stale = PRICE_ROWS.filter((r) => daysBetween(r.checked, today) > 120).map((r) => `${r.serviceId}:${r.country}`);
    expect(stale).toEqual([]);
  });

  it('12 countries, each with a currency Intl knows', () => {
    expect(COUNTRIES.map((c) => c.code)).toEqual(['US', 'GB', 'CA', 'AU', 'IE', 'NZ', 'DE', 'NL', 'FR', 'IT', 'ES', 'IN']);
    for (const c of COUNTRIES) expect(currencyDigits(c.currency)).toBe(2);
  });
});

describe('price lookup by country', () => {
  it('US Netflix Standard is $19.99, so $239.88 a year', () => {
    const c = catalogPrice('netflix', 'US')!;
    expect([c.planId, c.amountMinor, c.currency, c.cycle]).toEqual(['standard', 1999, 'USD', 'monthly']);
    expect(formatMoney(yearlyMinor(c.amountMinor, c.cycle), c.currency)).toBe('$239.88');
  });

  it('fixes the stale US prices', () => {
    const us = (id: string) => catalogPrice(id, 'US')?.amountMinor;
    expect(us('spotify')).toBe(1299);
    expect(us('apple-music')).toBe(1199);
    expect(us('apple-tv')).toBe(1499);
    expect(us('apple-one')).toBe(2195);
    expect(us('max')).toBe(1849);
  });

  it('each country gets its own price and currency, never a converted one', () => {
    expect(catalogPrice('netflix', 'GB')).toMatchObject({ amountMinor: 1399, currency: 'GBP' });
    expect(catalogPrice('netflix', 'IN')).toMatchObject({ amountMinor: 49900, currency: 'INR' });
    expect(catalogPrice('spotify', 'IN')).toMatchObject({ planId: 'standard', currency: 'INR' });
  });

  it('"Add your price" fallback: no checked price means null, not another country’s', () => {
    expect(catalogPrice('amazon-prime', 'US')).toBeNull(); // not checked
    expect(catalogPrice('youtube-premium', 'US')).toBeNull(); // unverified, not shipped
    expect(catalogPrice('max', 'GB')).toBeNull(); // US-only row
    expect(catalogPrice('netflix', null)).toBeNull(); // region we don't cover
    expect(priceRow('netflix', 'JP')).toBeNull();
  });

  it('picks a named plan, falling back to the default', () => {
    expect(catalogPrice('netflix', 'US', 'premium')?.amountMinor).toBe(2699);
    expect(catalogPrice('netflix', 'US', 'no-such-plan')?.planId).toBe('standard');
  });

  it('offers plan choices only when there is more than one plan', () => {
    expect(planChoices('netflix', 'US').map((p) => p.id)).toEqual(['standard-ads', 'standard', 'premium']);
    expect(planChoices('apple-tv', 'US')).toEqual([]);
    expect(planChoices('amazon-prime', 'US')).toEqual([]);
  });

  it('reads the Region code', () => {
    expect(supportedCountry('gb')).toBe('GB');
    expect(supportedCountry('JP')).toBeNull();
    expect(supportedCountry(null)).toBeNull();
  });
});
