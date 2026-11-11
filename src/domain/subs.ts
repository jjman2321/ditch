// A subscription on the user's list, and the pure rules around it:
// totals, Home groups, ditching, savings and the calendar.
// Money is whole minor units, dates are "YYYY-MM-DD", currencies never mix.

import { chargeFrom, type DateSource } from './charges';
import { addDays, daysBetween, monthGrid, occurrence, parseDate, weekdayOf, type DateOnly } from './dates';
import { spendTotals, yearlyMinor, type Cycle, type SpendTotal } from './money';

export type SubStatus = 'active' | 'ditched-pending' | 'ditched-confirmed' | 'deleted';
/** 'ditch_pro_trial' is Ditch's own trial entry (DECISIONS #15). */
export type SubKind = 'user' | 'ditch_pro_trial';
export type PriceSource = 'catalog' | 'user' | 'none';
export type SubSource = 'onboarding' | 'manual' | 'catalog' | 'import' | 'trial';

export type Sub = {
  id: string;
  kind: SubKind;
  /** Links to the bundled catalog (logo, cancel help). Null for custom ones. */
  catalogId: string | null;
  name: string;
  category: string | null;
  /** Null until we know the price ("Add your price"). */
  amountMinor: number | null;
  currency: string | null;
  cycle: Cycle;
  /** True while it's still the catalog's typical price. */
  amountIsEstimate: boolean;
  planId: string | null;
  planName: string | null;
  priceSource: PriceSource;
  /** Country the catalog price is for. */
  priceCountry: string | null;
  /** The date we know. Keeps the billing day; the next charge is worked out from it. Meaningless while dateSource is 'none'. */
  anchor: DateOnly;
  /** 'none' until the user gives a next charge or a last receipt ("No date yet"). */
  dateSource: DateSource;
  /** When true, `anchor` is the trial end (the first charge). */
  isTrial: boolean;
  /** One of the 3 free reminder slots. */
  freePick: boolean;
  /** Pro only: the user switched reminders off for this one. */
  muted: boolean;
  status: SubStatus;
  /** The day it was ditched. */
  ditchedOn: DateOnly | null;
  /** The charge it has to be cancelled before (the next charge on the ditch day). */
  cancelBy: DateOnly | null;
  /** The day the user said "I cancelled it". */
  confirmedOn: DateOnly | null;
  /** Price snapshot taken when ditched; savings come from this, not the live price. */
  snapAmountMinor: number | null;
  snapCurrency: string | null;
  snapCycle: Cycle | null;
  source: SubSource;
  createdAt: string;
  updatedAt: string;
};

export type PricedSub = Sub & { amountMinor: number; currency: string };

export function isPricedSub(s: Sub): s is PricedSub {
  return s.amountMinor !== null && s.currency !== null;
}

/** A fresh id. Not cryptographic; only has to be unique on one phone. */
export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

/** Defaults for a new subscription; pass what you know. */
export function makeSub(fields: Partial<Sub> & Pick<Sub, 'name' | 'cycle' | 'anchor'>, nowIso = new Date().toISOString()): Sub {
  return {
    id: newId(),
    kind: 'user',
    catalogId: null,
    category: null,
    amountMinor: null,
    currency: null,
    amountIsEstimate: false,
    planId: null,
    planName: null,
    priceSource: 'none',
    priceCountry: null,
    dateSource: 'next',
    isTrial: false,
    freePick: false,
    muted: false,
    status: 'active',
    ditchedOn: null,
    cancelBy: null,
    confirmedOn: null,
    snapAmountMinor: null,
    snapCurrency: null,
    snapCycle: null,
    source: 'manual',
    createdAt: nowIso,
    updatedAt: nowIso,
    ...fields,
  };
}

/** The next charge on or after today (a charge due today stays today). Null: no date yet. */
export function chargeOfSub(s: Sub, today: DateOnly): DateOnly | null {
  return chargeFrom(s.anchor, s.dateSource, s.cycle, today);
}

/** Has a real date (DECISIONS #33). Without one it shows "Add date" and gets no reminders. */
export const hasDate = (s: Sub) => s.dateSource !== 'none';
export const isActive = (s: Sub) => s.status === 'active';
export const isPending = (s: Sub) => s.status === 'ditched-pending';
export const isConfirmed = (s: Sub) => s.status === 'ditched-confirmed';
export const isProTrial = (s: Sub) => s.kind === 'ditch_pro_trial';

/** Still in a free trial: the trial end hasn't come yet (or we don't know it yet). */
export function inTrial(s: Sub, today: DateOnly): boolean {
  return s.isTrial && (!hasDate(s) || s.anchor >= today);
}

/** Yearly cost in minor units (0 when there's no price). */
export function yearlyOfSub(s: Sub): number {
  return isPricedSub(s) ? yearlyMinor(s.amountMinor, s.cycle) : 0;
}

/** What the user pays now: active, priced, not in a trial, not Ditch's own trial. */
export function payingSubs(subs: Sub[], today: DateOnly): PricedSub[] {
  return subs.filter((s): s is PricedSub => isActive(s) && !isProTrial(s) && isPricedSub(s) && !inTrial(s, today));
}

/** One total per currency; the user's own currency first, then biggest first. */
export function homeFirst<T extends { currency: string }>(totals: T[], home: string | undefined): T[] {
  return [...totals.filter((t) => t.currency === home), ...totals.filter((t) => t.currency !== home)];
}

/** Monthly and yearly totals per currency (Home's yellow card). Ditched ones don't count. */
export function homeTotals(subs: Sub[], today: DateOnly, home?: string): SpendTotal[] {
  return homeFirst(spendTotals(payingSubs(subs, today)), home);
}

/** The user's own subs on the list (not Ditch's trial, not ditched). */
export function listedUserSubs(subs: Sub[]): Sub[] {
  return subs.filter((s) => isActive(s) && !isProTrial(s));
}

/**
 * Which subs get reminders. Pro: every active one that isn't muted.
 * Free: the picked ones, at most 3 (biggest yearly first if more slipped in).
 * Only subs with a date: there's nothing to remind about without one.
 * Ditch's own trial entry never counts toward the 3.
 */
export const FREE_REMINDERS = 3;
export function remindedIds(subs: Sub[], pro: boolean): Set<string> {
  const live = listedUserSubs(subs).filter(hasDate);
  if (pro) return new Set(live.filter((s) => !s.muted).map((s) => s.id));
  const picked = live.filter((s) => s.freePick).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a));
  return new Set(picked.slice(0, FREE_REMINDERS).map((s) => s.id));
}

/**
 * Free plan: keep the "3 reminders" promise exact when subs change.
 * - A sub with no date holds no slot (nothing could fire).
 * - A changed sub that asks for a slot only gets one if fewer than 3 dated
 *   subs already have one; subs that already held a slot keep it.
 * So giving one sub a date can never quietly turn another one's reminder off.
 * Returns the changed subs, adjusted. Pro ignores slots, so nothing changes.
 */
export function settleFreePicks(all: Sub[], changed: Sub[], pro: boolean): Sub[] {
  if (pro) return changed;
  const ids = new Set(changed.map((s) => s.id));
  const before = new Map(all.map((s) => [s.id, s]));
  // Slots held by subs that aren't changing, or that already held one with a date.
  const keeps = (s: Sub) => s.freePick && hasDate(s) && isActive(s) && !isProTrial(s);
  const held = (s: Sub) => {
    const was = before.get(s.id);
    return !!was && keeps(was);
  };
  let used = all.filter((s) => !ids.has(s.id) && keeps(s)).length + changed.filter((s) => keeps(s) && held(s)).length;
  return changed.map((s) => {
    // Ditched ones keep theirs (it doesn't count), so Undo brings the reminder back if there's room.
    if (!s.freePick || isProTrial(s) || !isActive(s)) return s;
    if (!hasDate(s)) return { ...s, freePick: false };
    if (held(s)) return s;
    if (used < FREE_REMINDERS) {
      used += 1;
      return s;
    }
    return { ...s, freePick: false };
  });
}

/** The 3 biggest yearly charges with a date: the free default (DECISIONS #11, #33). */
export function defaultFreePicks(subs: Sub[]): string[] {
  return [...listedUserSubs(subs).filter(hasDate)]
    .sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a))
    .slice(0, FREE_REMINDERS)
    .map((s) => s.id);
}

// ---------- Home groups ----------

export type HomeGroup = 'This week' | 'Next week' | 'Later' | 'No date yet';
/** `charge` is null only in "No date yet". */
export type HomeRow = { sub: Sub; charge: DateOnly | null };

/** Sunday that starts the week of a date (weeks run Sun–Sat, like the calendar). */
export function weekStart(d: DateOnly): DateOnly {
  return addDays(d, -weekdayOf(d));
}

/**
 * Home's list: active and waiting-to-cancel subs, soonest first, grouped
 * into This week (to Saturday), Next week and Later, then "No date yet"
 * (biggest first). Empty groups are left out.
 */
export function homeGroups(subs: Sub[], today: DateOnly): { title: HomeGroup; rows: HomeRow[] }[] {
  const nextWeek = addDays(weekStart(today), 7);
  const later = addDays(nextWeek, 7);
  // Ditch's own Pro trial is never shown as one of your subscriptions (owner, Nov 10);
  // its two reminders still go out (src/domain/reminders.ts).
  const all = subs
    .filter((s) => (isActive(s) || isPending(s)) && !isProTrial(s))
    .map((sub) => ({ sub, charge: isPending(sub) && sub.cancelBy && sub.cancelBy >= today ? sub.cancelBy : chargeOfSub(sub, today) }));
  const dated = all
    .filter((r): r is { sub: Sub; charge: DateOnly } => r.charge !== null)
    .sort((a, b) => (a.charge === b.charge ? a.sub.name.localeCompare(b.sub.name) : a.charge < b.charge ? -1 : 1));
  const undated = all.filter((r) => r.charge === null).sort((a, b) => yearlyOfSub(b.sub) - yearlyOfSub(a.sub) || a.sub.name.localeCompare(b.sub.name));
  const groups: { title: HomeGroup; rows: HomeRow[] }[] = [
    { title: 'This week', rows: dated.filter((r) => r.charge < nextWeek) },
    { title: 'Next week', rows: dated.filter((r) => r.charge >= nextWeek && r.charge < later) },
    { title: 'Later', rows: dated.filter((r) => r.charge >= later) },
    { title: 'No date yet', rows: undated },
  ];
  return groups.filter((g) => g.rows.length > 0);
}

/** Active subs of the user's that have no date yet ("Add date"). */
export function undatedSubs(subs: Sub[]): Sub[] {
  return listedUserSubs(subs).filter((s) => !hasDate(s));
}

// ---------- Ditching ----------

/**
 * Ditch it: it waits for the user to cancel. The price is snapshotted so
 * savings never change if the live price is edited later.
 */
export function ditchSub(s: Sub, today: DateOnly, nowIso = new Date().toISOString()): Sub {
  return {
    ...s,
    status: 'ditched-pending',
    ditchedOn: today,
    cancelBy: chargeOfSub(s, today),
    confirmedOn: null,
    snapAmountMinor: s.amountMinor,
    snapCurrency: s.currency,
    snapCycle: s.cycle,
    updatedAt: nowIso,
  };
}

/** "I cancelled it." Only now does it count as saving. */
export function confirmCancel(s: Sub, today: DateOnly, nowIso = new Date().toISOString()): Sub {
  if (s.status !== 'ditched-pending' && s.status !== 'ditched-confirmed') return s;
  return { ...s, status: 'ditched-confirmed', confirmedOn: s.confirmedOn ?? today, updatedAt: nowIso };
}

/** Undo or "Oops, still paying": back on the list, out of savings. */
export function reactivateSub(s: Sub, nowIso = new Date().toISOString()): Sub {
  return {
    ...s,
    status: 'active',
    ditchedOn: null,
    cancelBy: null,
    confirmedOn: null,
    snapAmountMinor: null,
    snapCurrency: null,
    snapCycle: null,
    updatedAt: nowIso,
  };
}

/** Yearly amount from the ditch snapshot. */
export function snapYearly(s: Sub): { amountMinor: number; currency: string } | null {
  if (s.snapAmountMinor === null || !s.snapCurrency || !s.snapCycle) return null;
  return { amountMinor: yearlyMinor(s.snapAmountMinor, s.snapCycle), currency: s.snapCurrency };
}

export type Savings = { currency: string; yearlyMinor: number; monthlyMinor: number; count: number };

function sumSnapshots(list: Sub[], home?: string): Savings[] {
  const map = new Map<string, Savings>();
  for (const s of list) {
    const y = snapYearly(s);
    if (!y) continue;
    const cur = map.get(y.currency) ?? { currency: y.currency, yearlyMinor: 0, monthlyMinor: 0, count: 0 };
    cur.yearlyMinor += y.amountMinor;
    cur.monthlyMinor = cur.yearlyMinor / 12;
    cur.count += 1;
    map.set(y.currency, cur);
  }
  return homeFirst([...map.values()].sort((a, b) => b.yearlyMinor - a.yearlyMinor), home);
}

/** "You're saving $X a year": confirmed cancels only, one total per currency. */
export function confirmedSavings(subs: Sub[], home?: string): Savings[] {
  return sumSnapshots(subs.filter(isConfirmed), home);
}

/** Ditched but not cancelled yet: "+$215.88 a year" once they cancel. */
export function pendingSavings(subs: Sub[], home?: string): Savings[] {
  return sumSnapshots(subs.filter(isPending), home);
}

/** Running total after each confirmed cancel, oldest first (the step chart). One currency. */
export function savingsSteps(subs: Sub[], currency: string): { date: DateOnly; addedMinor: number; totalMinor: number; name: string }[] {
  let total = 0;
  return subs
    .filter((s) => isConfirmed(s) && s.confirmedOn && s.snapCurrency === currency)
    .sort((a, b) => (a.confirmedOn! < b.confirmedOn! ? -1 : a.confirmedOn! > b.confirmedOn! ? 1 : 0))
    .map((s) => {
      const added = snapYearly(s)?.amountMinor ?? 0;
      total += added;
      return { date: s.confirmedOn!, addedMinor: added, totalMinor: total, name: s.name };
    });
}

// ---------- Calendar ----------

export type CalendarCharge = { sub: Sub; date: DateOnly; pending: boolean; reminded: boolean };
export type CalendarDay = { date: DateOnly; charges: CalendarCharge[]; headsUp: boolean; past: boolean; today: boolean };

/**
 * Every charge date of a sub inside [from, to], from the anchor onwards.
 * The anchor is the first date we know of (a next charge or a real
 * receipt), so nothing is invented before it.
 */
export function chargesBetween(s: Sub, from: DateOnly, to: DateOnly): DateOnly[] {
  if (!hasDate(s)) return [];
  // Jump close to `from`, counting from the anchor so month-end clamps never stick.
  // Divide by the LONGEST a cycle can be, so the jump can never land past `from`
  // (with 28-day months it overshot once an anchor was ~3 years old).
  const span = daysBetween(s.anchor, from);
  const per = s.cycle === 'weekly' ? 7 : s.cycle === 'monthly' ? 31 : s.cycle === 'quarterly' ? 92 : 366;
  let k = Math.max(0, Math.floor(span / per) - 2);
  const out: DateOnly[] = [];
  for (let guard = 0; guard < 400; guard++, k++) {
    const d = occurrence(s.anchor, s.cycle, k);
    if (d > to) break;
    if (d >= from) out.push(d);
  }
  return out;
}

/**
 * One month of the calendar: each day's charges and whether a heads-up
 * lands on it. Receipt anchors are on-cycle, so the same maths applies.
 * Ditched-and-confirmed subs don't show; waiting ones show as pending.
 */
export function calendarMonth(
  subs: Sub[],
  y: number,
  m: number,
  today: DateOnly,
  reminded: Set<string>,
  leads: readonly number[],
): (CalendarDay | null)[] {
  const cells = monthGrid(y, m);
  const days = cells.filter((c): c is DateOnly => !!c);
  const from = days[0];
  const to = days[days.length - 1];
  const byDay = new Map<DateOnly, CalendarCharge[]>();
  const heads = new Set<DateOnly>();
  for (const s of subs) {
    if ((!isActive(s) && !isPending(s)) || isProTrial(s)) continue;
    const pending = isPending(s);
    // Look a little past the month too, so heads-ups for early next-month charges show.
    const maxLead = Math.max(0, ...leads);
    for (const d of chargesBetween(s, from, addDays(to, maxLead))) {
      if (d >= from && d <= to) {
        const list = byDay.get(d) ?? [];
        list.push({ sub: s, date: d, pending, reminded: reminded.has(s.id) });
        byDay.set(d, list);
      }
      if (reminded.has(s.id) && !pending) {
        for (const l of leads) {
          const h = addDays(d, -l);
          if (h >= from && h <= to && h >= today) heads.add(h);
        }
      }
    }
  }
  return cells.map((d) =>
    d
      ? {
          date: d,
          charges: (byDay.get(d) ?? []).sort((a, b) => yearlyOfSub(b.sub) - yearlyOfSub(a.sub)),
          headsUp: heads.has(d),
          past: d < today,
          today: d === today,
        }
      : null,
  );
}

/** What's due in a month: one total per currency, plus how many charges. Pending ditches don't count. */
export function monthDue(days: (CalendarDay | null)[], home?: string): { totals: { currency: string; amountMinor: number }[]; count: number } {
  const map = new Map<string, number>();
  let count = 0;
  for (const d of days) {
    for (const c of d?.charges ?? []) {
      if (c.pending || isProTrial(c.sub) || !isPricedSub(c.sub)) continue;
      count += 1;
      map.set(c.sub.currency, (map.get(c.sub.currency) ?? 0) + c.sub.amountMinor);
    }
  }
  const totals = [...map.entries()].map(([currency, amountMinor]) => ({ currency, amountMinor })).sort((a, b) => b.amountMinor - a.amountMinor);
  return { totals: homeFirst(totals, home), count };
}

// ---------- Export ----------

function csvCell(v: string | number | null): string {
  const s = v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** A spreadsheet of the list. Amounts are plain decimals in each sub's own currency. */
export function toCsv(subs: Sub[], today: DateOnly, digitsOf: (currency: string) => number): string {
  const head = ['Name', 'Amount', 'Currency', 'Billed', 'Next charge', 'Status', 'Ditched on', 'Cancelled on'];
  const rows = subs
    .filter((s) => s.status !== 'deleted' && !isProTrial(s))
    .map((s) => {
      const digits = s.currency ? digitsOf(s.currency) : 2;
      const amount = s.amountMinor === null ? '' : (s.amountMinor / 10 ** digits).toFixed(digits);
      const status = s.status === 'active' ? 'Active' : s.status === 'ditched-pending' ? 'Ditched, not cancelled yet' : 'Cancelled';
      return [s.name, amount, s.currency ?? '', s.cycle, s.status === 'active' ? (chargeOfSub(s, today) ?? '') : (s.cancelBy ?? ''), status, s.ditchedOn, s.confirmedOn];
    });
  return [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
}

/** Month index for comparing {y, m}. */
export function monthKey(d: DateOnly): number {
  const { y, m } = parseDate(d);
  return y * 12 + m;
}
