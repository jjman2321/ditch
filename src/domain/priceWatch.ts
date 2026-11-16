// Price watch and the cheaper-plan check (Pro, DECISIONS #60). Built on our own checked price data,
// which no rival has. Honest by design:
// - only subs that took our checked price get "it changed" (a price the user typed is theirs);
// - same plan, same country, same currency, same cycle, or nothing;
// - a yearly saving uses what they really pay now × 12.

import type { CountryPrice } from '@/catalog/prices';

import { isActive, isPricedSub, isProTrial, type PricedSub, type Sub } from './subs';

type Lookup = (serviceId: string, country: string | null) => CountryPrice | null;

export type PriceChange = { key: string; sub: PricedSub; planName: string; was: number; now: number; up: boolean; checked: string; source: string };

export function priceChanges(subs: Sub[], lookup: Lookup): PriceChange[] {
  const out: PriceChange[] = [];
  for (const s of subs) {
    if (!isActive(s) || isProTrial(s) || !isPricedSub(s) || s.priceSource !== 'catalog' || !s.catalogId || !s.planId || !s.priceCountry) continue;
    const row = lookup(s.catalogId, s.priceCountry);
    const plan = row?.plans.find((p) => p.id === s.planId);
    if (!row || !plan || row.currency !== s.currency || plan.cycle !== s.cycle || plan.amountMinor === s.amountMinor) continue;
    out.push({ key: `price:${s.id}:${plan.amountMinor}`, sub: s, planName: plan.name, was: s.amountMinor, now: plan.amountMinor, up: plan.amountMinor > s.amountMinor, checked: row.checked, source: row.source });
  }
  return out;
}

export type YearlySaving = { planName: string; yearlyMinor: number; monthlyTimes12: number; lessBy: number; currency: string };

/** "Paying yearly would cost $40 less": only when the same plan has a yearly price in their country. */
export function yearlySaving(s: Sub, lookup: Lookup): YearlySaving | null {
  if (!isPricedSub(s) || s.cycle !== 'monthly' || !s.catalogId || !s.planId || !s.priceCountry) return null;
  const row = lookup(s.catalogId, s.priceCountry);
  if (!row || row.currency !== s.currency) return null;
  const ids = [`${s.planId}-yearly`, ...(s.planId === 'monthly' ? ['yearly'] : [])];
  const yearly = row.plans.find((p) => ids.includes(p.id) && p.cycle === 'yearly');
  if (!yearly) return null;
  const monthlyTimes12 = s.amountMinor * 12;
  const lessBy = monthlyTimes12 - yearly.amountMinor;
  return lessBy > 0 ? { planName: yearly.name, yearlyMinor: yearly.amountMinor, monthlyTimes12, lessBy, currency: row.currency } : null;
}
