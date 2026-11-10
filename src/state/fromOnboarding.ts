// Turning onboarding answers into saved subscriptions (DECISIONS #11:
// every ticked sub is saved; the free picks get reminders). Pure.

import { addDays, type DateOnly } from '@/domain/dates';
import type { ProPlan } from '@/domain/settings';
import { makeSub, newId, type Sub } from '@/domain/subs';
import { planById } from '@/services/purchases';

import type { Picked } from './picks';

export function subFromPick(p: Picked, opts: { freePick: boolean; nowIso: string; id?: string }): Sub {
  return makeSub(
    {
      id: opts.id ?? newId(),
      catalogId: p.id,
      name: p.name,
      category: p.category ?? null,
      amountMinor: p.amountMinor,
      currency: p.currency,
      cycle: p.cycle,
      amountIsEstimate: p.amountIsEstimate,
      planId: p.planId,
      planName: p.planName,
      priceSource: p.priceSource,
      priceCountry: p.priceCountry,
      anchor: p.anchor,
      dateSource: p.dateSource,
      freePick: opts.freePick,
      source: 'onboarding',
    },
    opts.nowIso,
  );
}

/** Ditch's own trial on the user's list, so it gets the same heads-ups (DECISIONS #15). */
export function proTrialSub(today: DateOnly, nowIso: string): Sub {
  const yearly = planById('yearly');
  return makeSub(
    {
      kind: 'ditch_pro_trial',
      name: 'Ditch Pro trial',
      category: 'AI & apps',
      amountMinor: yearly.priceMinor,
      currency: yearly.currency,
      cycle: 'yearly',
      priceSource: 'catalog',
      anchor: addDays(today, yearly.trialDays),
      dateSource: 'next',
      isTrial: true,
      source: 'trial',
    },
    nowIso,
  );
}

export function subsFromOnboarding({
  picks,
  reminderIds,
  pro,
  today,
  nowIso,
}: {
  picks: Picked[];
  /** Catalog ids that get the free reminders. */
  reminderIds: string[];
  pro: ProPlan | null;
  today: DateOnly;
  nowIso: string;
}): Sub[] {
  const free = new Set(reminderIds.slice(0, 3));
  const subs = picks.map((p) => subFromPick(p, { freePick: free.has(p.id), nowIso }));
  if (pro === 'yearly' && planById('yearly').trialDays > 0) subs.push(proTrialSub(today, nowIso));
  return subs;
}
