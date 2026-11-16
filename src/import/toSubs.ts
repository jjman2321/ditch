// Turning ticked suggestions into subscriptions on the list.
// Price: what the screenshot or statement showed, else our checked catalog
// price for their country (marked as an estimate, so the editor says so).
// Date: the next charge we read or predicted; none → "no date yet".

import { catalogPrice } from '@/catalog/prices';
import { SERVICE_BY_ID } from '@/catalog/services';
import type { DateOnly } from '@/domain/dates';
import { makeSub, type Sub } from '@/domain/subs';
import type { Found } from './types';

export function foundToSub(f: Found, opts: { country: string | null; currency: string; today: DateOnly; nowIso?: string }): Sub {
  const svc = f.catalogId ? SERVICE_BY_ID[f.catalogId] : undefined;
  const cat = svc ? catalogPrice(svc.id, opts.country) : null;
  const cycle = f.cycle ?? cat?.cycle ?? svc?.cycle ?? 'monthly';
  const fromCatalog = !f.price && cat && cat.cycle === cycle;
  return makeSub(
    {
      name: svc?.name ?? f.name,
      catalogId: svc?.id ?? null,
      category: svc?.category ?? null,
      cycle,
      anchor: f.date ?? opts.today,
      dateSource: f.date ? 'next' : 'none',
      amountMinor: f.price?.amountMinor ?? (fromCatalog ? cat!.amountMinor : null),
      currency: f.price?.currency ?? (fromCatalog ? cat!.currency : opts.currency),
      priceSource: f.price ? 'user' : fromCatalog ? 'catalog' : 'none',
      amountIsEstimate: !f.price && !!fromCatalog,
      planId: fromCatalog ? cat!.planId : null,
      planName: fromCatalog ? cat!.planName : null,
      priceCountry: fromCatalog ? cat!.country : null,
      isTrial: f.state === 'trial',
      source: 'import',
    },
    opts.nowIso,
  );
}

/** Already on the list (same service, still active): shown as "on your list", never added twice. */
export function alreadyOnList(f: Found, subs: Sub[]): boolean {
  return subs.some((s) => (s.status === 'active' || s.status === 'ditched-pending') && ((f.catalogId && s.catalogId === f.catalogId) || s.name.trim().toLowerCase() === f.name.trim().toLowerCase()));
}
