// A ticked subscription during onboarding, and the pure rules for pricing
// it. Kept free of React so Jest can test it.

import { catalogPrice, priceRow } from '@/catalog/prices';
import type { CatalogService } from '@/catalog/services';
import { guessNextCharge, type DateSource, type RoughWhen } from '@/domain/charges';
import type { DateOnly } from '@/domain/dates';
import { yearlyMinor, type Cycle } from '@/domain/money';

/** Where the price came from. "none" shows "Add your price". */
export type PriceSource = 'catalog' | 'user' | 'none';

export type Picked = {
  id: string; // catalog id
  name: string;
  category?: string;
  color: string;
  ink?: string;
  mono: string;
  cycle: Cycle;
  /** Null until we know a price (no checked price in this country). */
  amountMinor: number | null;
  currency: string | null;
  planId: string | null;
  planName: string | null;
  priceSource: PriceSource;
  /** Country the catalog price is for. */
  priceCountry: string | null;
  /** "Typical price from …, checked …" for the detail view later. */
  checked?: string;
  source?: string;
  /** True while the price is a catalog typical price ("about $19.99"). */
  amountIsEstimate: boolean;
  /** The date the user gave (or our guess). Keeps the billing day. */
  anchor: DateOnly;
  /** "guess" until the user confirms a next charge or a last receipt. */
  dateSource: DateSource;
  /** The answer on the charge-dates screen: a quick pick, a real day, or not answered yet. */
  when?: RoughWhen | 'day' | null;
};

export type PricedPick = Picked & { amountMinor: number; currency: string };

export function isPriced(p: Picked): p is PricedPick {
  return p.amountMinor !== null && p.currency !== null;
}

/** Price fields from the catalog for this country (or "none"). */
function catalogFields(serviceId: string, fallbackCycle: Cycle, country: string | null, planId?: string | null) {
  const c = catalogPrice(serviceId, country, planId);
  if (!c) {
    return {
      cycle: fallbackCycle,
      amountMinor: null,
      currency: null,
      planId: null,
      planName: null,
      priceSource: 'none' as const,
      priceCountry: country,
      checked: undefined,
      source: undefined,
      amountIsEstimate: false,
    };
  }
  return {
    cycle: c.cycle,
    amountMinor: c.amountMinor,
    currency: c.currency,
    planId: c.planId,
    planName: c.planName,
    priceSource: 'catalog' as const,
    priceCountry: c.country,
    checked: c.checked,
    source: c.source,
    amountIsEstimate: true,
  };
}

/** A new pick: the local default plan's price, and a labelled guess for the date. */
export function newPick(service: CatalogService, country: string | null, today: DateOnly): Picked {
  const price = catalogFields(service.id, service.cycle, country);
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    color: service.color,
    ink: service.ink,
    mono: service.mono,
    ...price,
    anchor: guessNextCharge(service.id, price.cycle, today),
    dateSource: 'guess',
  };
}

/** Switch to another local plan (from the inline plan chip). */
export function choosePlan(p: Picked, planId: string): Picked {
  if (!p.priceCountry) return p;
  const price = catalogFields(p.id, p.cycle, p.priceCountry, planId);
  return price.priceSource === 'catalog' ? { ...p, ...price } : p;
}

/**
 * The user changed which country's prices to use. Catalog prices follow
 * the new country (same plan if it exists there); prices the user typed
 * in are theirs and never change.
 */
export function repriceForCountry(p: Picked, country: string | null): Picked {
  if (p.priceSource === 'user') return p;
  return { ...p, ...catalogFields(p.id, p.cycle, country, p.planId) };
}

/** The user's own price ("Add your price"). Never an estimate. */
export function setOwnPrice(p: Picked, amountMinor: number, currency: string, cycle: Cycle): Picked {
  return {
    ...p,
    amountMinor,
    currency,
    cycle,
    planId: null,
    planName: null,
    priceSource: 'user',
    amountIsEstimate: false,
    checked: undefined,
    source: undefined,
  };
}

/** Yearly cost for sorting; unpriced picks count as 0. */
export function yearlyOf(p: Picked): number {
  return isPriced(p) ? yearlyMinor(p.amountMinor, p.cycle) : 0;
}

/** Billing cycles the date sheet can offer for this pick. */
export function cycleChoices(p: Picked): Cycle[] {
  if (p.priceSource !== 'catalog') return ['monthly', 'yearly'];
  const row = priceRowFor(p);
  const cycles = new Set(row?.plans.map((x) => x.cycle) ?? [p.cycle]);
  return (['monthly', 'yearly'] as Cycle[]).filter((c) => cycles.has(c));
}

/**
 * "I pay yearly". With a catalog price, move to the local plan billed that
 * way (the closest name match); with the user's own price, just the cycle.
 */
export function chooseCycle(p: Picked, cycle: Cycle): Picked {
  if (p.cycle === cycle) return p;
  if (p.priceSource !== 'catalog') return { ...p, cycle };
  const plans = priceRowFor(p)?.plans.filter((x) => x.cycle === cycle) ?? [];
  if (!plans.length) return p;
  const stem = (p.planId ?? '').replace(/-(monthly|yearly)$/, '');
  const match = plans.find((x) => x.id.replace(/-(monthly|yearly)$/, '') === stem) ?? plans.find((x) => x.default) ?? plans[0];
  return choosePlan(p, match.id);
}

function priceRowFor(p: Picked) {
  return priceRow(p.id, p.priceCountry);
}
