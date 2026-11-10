// Example lists for the web preview and screenshots only (design/v10 data).
// Never used on the phone. Dates are relative to the given "today" so the
// renders' Mon, Nov 9 2026 example reads the same.

import { addDays, type DateOnly } from '@/domain/dates';
import type { Settings } from '@/domain/settings';
import { makeSub, type Sub } from '@/domain/subs';
import { proTrialSub } from '@/state/fromOnboarding';

export type DemoName = 'demo' | 'pro' | 'off' | 'ditched' | 'empty' | 'onboarding' | 'mixed';

const NOW = '2026-11-09T09:41:00.000Z';

function sub(id: string, name: string, catalogId: string, category: string, amountMinor: number, anchor: DateOnly, extra: Partial<Sub> = {}): Sub {
  return makeSub(
    {
      id,
      name,
      catalogId,
      category,
      amountMinor,
      currency: 'USD',
      cycle: 'monthly',
      anchor,
      dateSource: 'next',
      priceSource: 'catalog',
      priceCountry: 'US',
      amountIsEstimate: true,
      source: 'onboarding',
      ...extra,
    },
    NOW,
  );
}

function cancelled(id: string, name: string, catalogId: string, monthly: number, on: DateOnly): Sub {
  return sub(id, name, catalogId, 'Music', monthly, on, {
    status: 'ditched-confirmed',
    ditchedOn: on,
    confirmedOn: on,
    cancelBy: on,
    snapAmountMinor: monthly,
    snapCurrency: 'USD',
    snapCycle: 'monthly',
  });
}

export function demoData(name: DemoName, today: DateOnly): { subs: Sub[]; settings: Partial<Settings> } {
  if (name === 'onboarding') return { subs: [], settings: {} };
  const settings: Partial<Settings> = { onboardingDone: true, country: 'US', currency: 'USD', holdHintDone: name !== 'pro' };
  if (name === 'empty') return { subs: [], settings };
  const d = (n: number) => addDays(today, n);
  // Two without a date, like a user who skipped them (DECISIONS #33).
  const none = { dateSource: 'none' as const };
  const list: Sub[] = [
    sub('netflix', 'Netflix', 'netflix', 'Streaming', 1799, d(5), { freePick: true }),
    sub('spotify', 'Spotify', 'spotify', 'Music', 1199, d(7)),
    sub('disney', 'Disney+', 'disney-plus', 'Streaming', 1199, today, none),
    sub('chatgpt', 'ChatGPT', 'chatgpt-plus', 'AI & apps', 2000, d(12), { freePick: true }),
    sub('youtube', 'YouTube Premium', 'youtube-premium', 'Streaming', 1399, d(18)),
    sub('amazon', 'Amazon Prime', 'amazon-prime', 'Shopping', 1499, today, { ...none, freePick: true }),
    cancelled('applemusic', 'Apple Music', 'apple-music', 1099, '2026-09-17'),
    cancelled('audible', 'Audible Premium Plus', 'audible', 1495, '2026-08-22'),
    cancelled('hulu', 'Hulu', 'hulu', 999, '2026-06-14'),
  ];
  if (name === 'mixed') {
    // A UK list with two US-dollar subs: shows the "≈ in all" line (DECISIONS #32).
    const gbp = (id: string, amountMinor: number) => ({ id, amountMinor, currency: 'GBP', priceCountry: 'GB' });
    const uk: Record<string, ReturnType<typeof gbp>> = { netflix: gbp('netflix', 1299), spotify: gbp('spotify', 1199), disney: gbp('disney', 999), amazon: gbp('amazon', 899) };
    return { subs: list.map((x) => (uk[x.id] ? { ...x, ...uk[x.id] } : x)), settings: { ...settings, country: 'GB', currency: 'GBP' } };
  }
  if (name === 'pro') {
    list.push({ ...proTrialSub(today, NOW), id: 'trial' });
    return { subs: list, settings: { ...settings, proPlan: 'yearly' } };
  }
  if (name === 'ditched' || name === 'off') {
    const n = list[0];
    list[0] = { ...n, status: 'ditched-pending', ditchedOn: today, cancelBy: n.anchor, snapAmountMinor: n.amountMinor, snapCurrency: 'USD', snapCycle: 'monthly' };
  }
  return { subs: list, settings };
}
