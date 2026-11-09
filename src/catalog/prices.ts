// Service prices by country (DECISIONS #17). The catalog (names, logos)
// stays in services.ts; prices live here because they change often.
// Data: prices.data.ts, generated from docs/research/prices-2026-11.json.
// Never convert a price between currencies: no local price means
// "Add your price".

import type { Cycle } from '@/domain/money';

import { PRICE_ROWS } from './prices.data';

export type PlanPrice = {
  id: string; // 'standard', 'standard-ads'
  name: string; // as the service names it locally
  amountMinor: number;
  cycle: Cycle;
  default?: boolean;
};

export type CountryPrice = {
  serviceId: string;
  country: string; // ISO 3166, e.g. 'GB'
  currency: string; // ISO 4217, e.g. 'GBP'
  status: 'verified' | 'partial' | 'unverified';
  plans: PlanPrice[];
  source: string; // official page
  checked: string; // 'YYYY-MM-DD'
  note?: string;
};

export type Country = { code: string; name: string; flag: string; currency: string };

/** The 12 launch countries, in the order the picker shows them. */
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'US', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'UK', flag: '🇬🇧', currency: 'GBP' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: 'EUR' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR' },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

/** A supported country for an iPhone Region code, or null. */
export function supportedCountry(regionCode: string | null | undefined): string | null {
  const code = (regionCode ?? '').toUpperCase();
  return COUNTRY_BY_CODE[code] ? code : null;
}

const BY_KEY = new Map(PRICE_ROWS.map((r) => [`${r.serviceId}:${r.country}`, r]));

/** Checked local prices for a service, or null if we have none for this country. */
export function priceRow(serviceId: string, country: string | null, rows: Map<string, CountryPrice> = BY_KEY): CountryPrice | null {
  if (!country) return null;
  return rows.get(`${serviceId}:${country}`) ?? null;
}

/** The plan we pre-pick: the row's default, else its first plan. */
export function defaultPlan(row: CountryPrice): PlanPrice {
  return row.plans.find((p) => p.default) ?? row.plans[0];
}

/** What a pick costs, from the catalog. */
export type CatalogPrice = {
  planId: string;
  planName: string;
  amountMinor: number;
  currency: string;
  cycle: Cycle;
  country: string;
  checked: string;
  source: string;
};

/**
 * The price for a service in a country, on a given plan (or the default
 * plan). Null when we have no checked price there: show "Add your price".
 */
export function catalogPrice(serviceId: string, country: string | null, planId?: string | null): CatalogPrice | null {
  const row = priceRow(serviceId, country);
  if (!row) return null;
  const plan = (planId && row.plans.find((p) => p.id === planId)) || defaultPlan(row);
  return {
    planId: plan.id,
    planName: plan.name,
    amountMinor: plan.amountMinor,
    currency: row.currency,
    cycle: plan.cycle,
    country: row.country,
    checked: row.checked,
    source: row.source,
  };
}

/** Plans to offer in the inline chip (only when there's a real choice). */
export function planChoices(serviceId: string, country: string | null): PlanPrice[] {
  const row = priceRow(serviceId, country);
  return row && row.plans.length > 1 ? row.plans : [];
}

export { PRICE_ROWS };
