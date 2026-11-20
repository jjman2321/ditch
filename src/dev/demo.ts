// Example lists for the web preview and screenshots only (design/v10 data).
// Never used on the phone. Dates are relative to the given "today" so the
// renders' Mon, Nov 9 2026 example reads the same.

import { addDays, type DateOnly } from '@/domain/dates';
import type { Settings } from '@/domain/settings';
import { makeSub, type Sub } from '@/domain/subs';
import { SERVICES } from '@/catalog/services';
import { proTrialSub } from '@/state/fromOnboarding';
import { webParam } from './webParams';

export type DemoName = 'demo' | 'pro' | 'off' | 'ditched' | 'empty' | 'onboarding' | 'mixed' | 'overlap' | `n${number}`;

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
    snapAmountMinor: monthly,
    snapCurrency: 'USD',
    snapCycle: 'monthly',
  });
}

export function demoData(name: DemoName, today: DateOnly): { subs: Sub[]; settings: Partial<Settings> } {
  if (name === 'onboarding') return { subs: [], settings: {} };
  if (/^n\d+$/.test(name)) return countData(Number(name.slice(1)), today);
  const settings: Partial<Settings> = { onboardingDone: true, country: 'US', currency: 'USD', holdHintDone: name !== 'pro' };
  if (name === 'empty') return { subs: [], settings };
  const d = (n: number) => addDays(today, n);
  // Two without a date, like a user who skipped them (DECISIONS #33).
  const none = { dateSource: 'none' as const };
  const list: Sub[] = [
    sub('netflix', 'Netflix', 'netflix', 'Streaming', 1999, d(5), { freePick: true, paidWith: 'Visa ending 4821', accountEmail: 'sam@example.com' }),
    sub('spotify', 'Spotify', 'spotify', 'Music', 1199, d(7), { paidWith: 'Amex ending 1005' }),
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
  if (name === 'overlap') {
    // Two music services: shows the overlap card (DECISIONS #60).
    list.push(sub('applemusic2', 'Apple Music', 'apple-music', 'Music', 1099, d(9)));
    list.push({ ...sub('costco', 'Costco', 'costco', 'Shopping', 6500, d(70)), cycle: 'yearly' as const });
    // An old checked price on a real plan: shows Price watch (Pro) and the yearly check (Claude has a yearly plan).
    list.push(sub('claude', 'Claude', 'claude-pro', 'AI', 1800, d(20), { planId: 'monthly', planName: 'Pro (monthly)', priceSource: 'catalog', priceCountry: 'US' }));
    // Paid on the 25th: shows Before payday on Home.
    return { subs: list, settings: { ...settings, payday: 25 } };
  }
  if (name === 'pro') {
    list.push({ ...proTrialSub(today, NOW), id: 'trial' });
    return { subs: list, settings: { ...settings, proPlan: 'yearly' } };
  }
  if (name === 'ditched' || name === 'off') {
    const n = list[0];
    list[0] = { ...n, status: 'ditched-pending', ditchedOn: today, snapAmountMinor: n.amountMinor, snapCurrency: 'USD', snapCycle: 'monthly' };
  }
  return { subs: list, settings };
}

// ---------- State screenshots: ?seed=n0, n1, n3, n20, n60 (owner, Nov 19, plan item 22) ----------

/**
 * `count` active subscriptions from the catalog, most popular first, with mixed prices,
 * cycles and dates (a few with no date), so every screen can be checked from empty to a long list.
 */
function countData(count: number, today: DateOnly): { subs: Sub[]; settings: Partial<Settings> } {
  const settings: Partial<Settings> = { onboardingDone: true, country: 'US', currency: 'USD', holdHintDone: true };
  const pool = [...SERVICES].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const cycles = ['monthly', 'monthly', 'monthly', 'yearly', 'monthly', 'weekly', 'monthly', 'quarterly'] as const;
  // ?x=10 multiplies every price, for big-spend checks ($200 to $3,000 a month).
  const mult = Math.max(0.01, Number(webParam('x') ?? '1') || 1);
  // Past the catalog's size (?seed=n3000) the names repeat with a number, like "Netflix 2".
  const subs = Array.from({ length: count }, (_, i) => {
    const round = Math.floor(i / pool.length);
    const x0 = pool[i % pool.length];
    const x = round ? { ...x0, name: `${x0.name} ${round + 1}` } : x0;
    const cycle = cycles[i % cycles.length];
    const base = Math.round([1799, 1199, 2000, 999, 1499, 699, 2999, 499][i % 8] * mult);
    const amountMinor = cycle === 'yearly' ? base * 10 : cycle === 'weekly' ? Math.round(base / 4) : cycle === 'quarterly' ? base * 3 : base;
    // Every 7th has no date yet; the rest spread over the next 5 weeks.
    const extra: Partial<Sub> = { cycle, freePick: i < 3, ...(i % 7 === 6 ? { dateSource: 'none' as const } : {}) };
    return sub(`n${i}`, x.name, x.id, x.category, amountMinor, addDays(today, (i * 5) % 35), extra);
  });
  return { subs, settings: { ...settings, payday: count >= 3 ? 25 : null } };
}
