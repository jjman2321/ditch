// Bank sync on the phone, the pure part (DECISIONS #67, #70; spec docs/research/bank-sync-ux-2026-11-19.md).
// src/state/bank.tsx keeps this state, saves it and calls the server; everything that decides
// what happens lives here so Jest can check it.
//
// Rules that matter (audit checklist in the spec):
// - Sure finds go on the list on their own, tagged "FOUND IN YOUR BANK" for 7 days, with Undo.
//   Undo removes the sub and its key stays remembered, so it never comes back.
// - Unsure finds are only added after a Yes.
// - A price change or a "looks cancelled" is only ever a card: nothing changes without a tap.
// - One sync card on Home at a time: reconnect > new account > price change > looks cancelled > check these > trial recap.

import { addDays, daysBetween, type DateOnly } from '@/domain/dates';
import { formatMoney, yearlyMinor } from '@/domain/money';
import type { Sub } from '@/domain/subs';
import { analyzeBank, rememberHandled, type BankSyncMemory, type BankTxn, type LooksCancelled, type PriceChange } from '@/import/bankSync';
import { foundToSub } from '@/import/toSubs';
import type { Found } from '@/import/types';
import { mergeBankTxns, type BankLinkStatus, type BankSyncResponse } from '@/services/bankShared';

export const MAX_LINKS = 3;
/** "FOUND IN YOUR BANK" stays on the row this many days (the add day counts as day 1). */
export const FOUND_TAG_DAYS = 7;
/** "Later" on the reconnect card hides it this long. */
export const LATER_DAYS = 3;
/** "Not now" on the new-account card hides it this long. */
export const NEW_ACCOUNTS_LATER_DAYS = 30;
/** The added toast stays this long (and until dismissed while VoiceOver is on). */
export const TOAST_MS = 8000;
/** The trial recap shows from day 5 of the 7-day trial: 2 days or fewer left. */
export const RECAP_DAYS_LEFT = 2;

export type BankLink = {
  /** The server's link id. */
  id: string;
  /** Our picker id (src/bank/banks.ts), for the tile. Null for a bank we don't list. */
  bankId: string | null;
  name: string;
  status: BankLinkStatus;
  /** "Visa ending 4821 · Checking ending 1005", when the provider says. */
  accounts: string | null;
  connectedOn: DateOnly;
  /** Last time new charges came in (ISO). */
  checkedAt: string | null;
  /** Reconnect card hidden until this day ("Later"). */
  laterUntil: DateOnly | null;
  /** The bank has an account not shared with Ditch yet (Plaid NEW_ACCOUNTS_AVAILABLE). */
  newAccounts?: boolean;
  /** New-account card hidden until this day ("Not now"). */
  newAccountsLaterUntil?: DateOnly | null;
};

/** One thing the bank added or the user said yes to, kept for the results screen and the trial recap. */
export type BankFind = {
  key: string;
  subId: string;
  linkId: string | null;
  name: string;
  catalogId: string | null;
  amountMinor: number | null;
  currency: string | null;
  yearlyMinor: number;
  /** Proof: the real charge dates ("Sep 10, Oct 10, Nov 10"). */
  evidence: string;
  next: DateOnly | null;
  on: DateOnly;
  how: 'auto' | 'yes';
  /** Unticked on the results screen or Undo on the toast. */
  undone: boolean;
  /** What the engine saw (onboarding turns it into a pick). */
  src: Found;
};

/** A price rise the bank caught and the user saw ("Caught Netflix going up $2.50"). */
export type Caught = { subId: string; name: string; deltaMinor: number; currency: string };

export type BankState = {
  links: BankLink[];
  /** The charges the phone keeps (the server never stores them). */
  txns: BankTxn[];
  /** Which txn came from which bank, so a card can say "at Chase". */
  txnLink: Record<string, string>;
  memory: BankSyncMemory;
  finds: BankFind[];
  /** Waiting for a tap, from the last check. */
  suggestions: (Found & { linkId: string | null })[];
  priceChanges: PriceChange[];
  lookCancelled: LooksCancelled[];
  /** Card keys answered with "It was a one-off", "Still paying", "Got it". */
  dismissed: string[];
  caught: Caught[];
  lastSyncAt: string | null;
};

export function emptyBank(): BankState {
  return { links: [], txns: [], txnLink: {}, memory: { handled: [] }, finds: [], suggestions: [], priceChanges: [], lookCancelled: [], dismissed: [], caught: [], lastSyncAt: null };
}

// ---------- saving ----------

const KEYS = ['links', 'txns', 'txnLink', 'memory', 'finds', 'suggestions', 'priceChanges', 'lookCancelled', 'dismissed', 'caught', 'lastSyncAt'] as const;
type Key = (typeof KEYS)[number];

/** Forgiving: anything missing or broken falls back to empty. */
export function parseBank(kv: Record<string, string>): BankState {
  const out = emptyBank() as Record<Key, unknown>;
  for (const k of KEYS) {
    if (kv[k] === undefined) continue;
    try {
      const v: unknown = JSON.parse(kv[k]);
      const want = out[k];
      if (Array.isArray(want) ? Array.isArray(v) : want === null ? typeof v === 'string' || v === null : typeof v === 'object' && v !== null && !Array.isArray(v)) out[k] = v;
    } catch {
      // keep the empty value
    }
  }
  const s = out as BankState;
  if (!Array.isArray(s.memory?.handled)) s.memory = { handled: [] };
  return s;
}

/** Only the parts that changed between two states (txns are the big one). */
export function bankToKv(next: BankState, prev?: BankState): Record<string, string> {
  const kv: Record<string, string> = {};
  for (const k of KEYS) if (!prev || prev[k] !== next[k]) kv[k] = JSON.stringify(next[k]);
  return kv;
}

// ---------- links ----------

export const canAddLink = (s: BankState) => s.links.length < MAX_LINKS;

export function addLink(s: BankState, link: Omit<BankLink, 'laterUntil' | 'checkedAt'> & { checkedAt?: string | null }): BankState {
  const rest = s.links.filter((l) => l.id !== link.id);
  return { ...s, links: [...rest, { laterUntil: null, checkedAt: null, ...link }].slice(0, MAX_LINKS) };
}

/** Disconnect: the bank goes, everything on the list stays (its charges go too). */
export function removeLink(s: BankState, id?: string): BankState {
  const links = id ? s.links.filter((l) => l.id !== id) : [];
  const keep = new Set(links.map((l) => l.id));
  const txnLink = Object.fromEntries(Object.entries(s.txnLink).filter(([, l]) => keep.has(l)));
  const txns = s.txns.filter((t) => txnLink[t.id]);
  return {
    ...s,
    links,
    txns,
    txnLink,
    suggestions: s.suggestions.filter((f) => f.linkId && keep.has(f.linkId)),
    priceChanges: links.length ? s.priceChanges : [],
    lookCancelled: links.length ? s.lookCancelled : [],
  };
}

export function setLinkStatus(s: BankState, id: string, status: BankLinkStatus): BankState {
  return { ...s, links: s.links.map((l) => (l.id === id ? { ...l, status, laterUntil: status === 'active' ? null : l.laterUntil } : l)) };
}

export function laterLink(s: BankState, id: string, today: DateOnly): BankState {
  return { ...s, links: s.links.map((l) => (l.id === id ? { ...l, laterUntil: addDays(today, LATER_DAYS) } : l)) };
}

/** "Not now" on the new-account card: hidden for 30 days. Settings still shows it. */
export function laterNewAccounts(s: BankState, id: string, today: DateOnly): BankState {
  return { ...s, links: s.links.map((l) => (l.id === id ? { ...l, newAccountsLaterUntil: addDays(today, NEW_ACCOUNTS_LATER_DAYS) } : l)) };
}

/** The new accounts were shared (update mode with Account Select): the card and the Settings line go. */
export function clearNewAccounts(s: BankState, id: string, accounts?: string | null): BankState {
  return { ...s, links: s.links.map((l) => (l.id === id ? { ...l, newAccounts: false, newAccountsLaterUntil: null, ...(accounts ? { accounts } : {}) } : l)) };
}

export const needsSignIn = (l: BankLink) => l.status === 'needs_relogin' || l.status === 'expiring' || l.status === 'error';

/** The bank has a new account to add, and nothing else stands in the way (Settings → Bank connections shows "New account found"). */
export const newAccountsWaiting = (l: BankLink) => !!l.newAccounts && !needsSignIn(l) && l.status !== 'removing';

export function linkName(s: BankState, id: string | null | undefined): string {
  return s.links.find((l) => l.id === id)?.name ?? (s.links.length === 1 ? s.links[0].name : 'your bank');
}

// ---------- a sync ----------

export type SyncOpts = { today: DateOnly; nowIso: string; country: string | null; currency: string };

/**
 * Applies one sync: keep the new charges, read them, add the sure finds. Returns the new state
 * and the subs to add (each marked foundInBankOn = today, source 'import'). `autoAdd: false`
 * (onboarding) keeps the sure finds as finds for the results screen without adding them to the
 * saved list, since onboarding saves its own list at the end.
 */
export function applySync(s: BankState, res: BankSyncResponse, subs: Sub[], opts: SyncOpts & { autoAdd?: boolean }): { state: BankState; added: Sub[] } {
  const txnLink = { ...s.txnLink };
  for (const l of res.links) for (const t of [...l.added, ...l.modified]) txnLink[t.id] = l.linkId;
  const txns = mergeBankTxns(s.txns, res.links, opts.today);
  const ids = new Set(txns.map((t) => t.id));
  for (const id of Object.keys(txnLink)) if (!ids.has(id)) delete txnLink[id];
  const byLink = new Map(res.links.map((l) => [l.linkId, l]));
  const links = s.links.map((l) => {
    const r = byLink.get(l.id);
    if (!r) return l;
    // New accounts: the server's word when it sends one (older servers and the practice bank don't). Once it's
    // cleared, "Not now" is forgotten too, so the next new account shows right away.
    const na = r.newAccounts ?? l.newAccounts;
    const newAccts = na === undefined ? {} : { newAccounts: na, newAccountsLaterUntil: na ? (l.newAccountsLaterUntil ?? null) : null };
    return { ...l, status: r.status, checkedAt: r.ready ? opts.nowIso : l.checkedAt, laterUntil: r.status === 'active' ? null : l.laterUntil, ...newAccts };
  });

  const r = analyzeBank(txns, subs, s.memory, opts.today);
  // Which bank a find came from: the bank of its latest matching charge.
  const linkOf = (f: Found): string | null => {
    const last = txns.find((t) => f.name && (t.merchantName ?? t.text).toLowerCase().includes(f.name.toLowerCase().split(' ')[0]));
    return (last && txnLink[last.id]) ?? (links.length === 1 ? links[0].id : null);
  };
  const added = r.added.map((f) => ({ ...foundToSub(f, { country: opts.country, currency: opts.currency, today: opts.today, nowIso: opts.nowIso }), foundInBankOn: opts.today }));
  // A find seen again (onboarding left before "Looks right") replaces its old entry.
  const newKeys = new Set(r.added.map((f) => f.key));
  const finds = [...s.finds.filter((f) => !newKeys.has(f.key)), ...r.added.map((f, i) => toFind(f, added[i], linkOf(f), opts.today, 'auto'))];
  // Onboarding remembers them only at "Looks right" (rememberKeys), so leaving early loses nothing.
  const memory =
    opts.autoAdd === false
      ? s.memory
      : rememberHandled(
          s.memory,
          r.added.map((f) => f.key),
        );
  const subById = new Map(subs.map((x) => [x.id, x]));
  const caught = [...s.caught];
  for (const c of r.priceChanges) {
    const sub = subById.get(c.subId);
    if (sub && c.toMinor > c.fromMinor && !caught.some((x) => x.subId === c.subId && x.deltaMinor === c.toMinor - c.fromMinor))
      caught.push({ subId: c.subId, name: sub.name, deltaMinor: c.toMinor - c.fromMinor, currency: c.currency });
  }
  const state: BankState = {
    ...s,
    links,
    txns,
    txnLink,
    memory,
    finds,
    caught,
    suggestions: r.suggestions.map((f) => ({ ...f, linkId: linkOf(f) })),
    priceChanges: r.priceChanges,
    lookCancelled: r.lookCancelled,
    lastSyncAt: opts.nowIso,
  };
  return { state, added: opts.autoAdd === false ? [] : added };
}

function toFind(f: Found, sub: Sub, linkId: string | null, today: DateOnly, how: BankFind['how']): BankFind {
  return {
    key: f.key,
    subId: sub.id,
    linkId,
    name: sub.name,
    catalogId: sub.catalogId,
    amountMinor: sub.amountMinor,
    currency: sub.currency,
    yearlyMinor: sub.amountMinor != null ? yearlyMinor(sub.amountMinor, sub.cycle) : 0,
    evidence: f.evidence,
    next: f.date,
    on: today,
    how,
    undone: false,
    src: f,
  };
}

/** Onboarding's "Looks right": everything shown is handled, ticked or not. */
export function rememberKeys(s: BankState, keys: string[]): BankState {
  return { ...s, memory: rememberHandled(s.memory, keys) };
}

/** Undo (toast or unticked on results): the key stays handled, so it's never offered again. */
export function undoFind(s: BankState, subId: string): BankState {
  return { ...s, finds: s.finds.map((f) => (f.subId === subId ? { ...f, undone: true } : f)) };
}

/** Ticked again on the results screen. */
export function redoFind(s: BankState, subId: string): BankState {
  return { ...s, finds: s.finds.map((f) => (f.subId === subId ? { ...f, undone: false } : f)) };
}

/**
 * Yes / No on an unsure find. Either way it's remembered and never asked again.
 * Yes returns the sub to add (marked found today).
 */
export function answerSuggestion(s: BankState, key: string, yes: boolean, opts: SyncOpts): { state: BankState; sub: Sub | null } {
  const f = s.suggestions.find((x) => x.key === key);
  const memory = rememberHandled(s.memory, [key]);
  const suggestions = s.suggestions.filter((x) => x.key !== key);
  if (!f || !yes) return { state: { ...s, memory, suggestions }, sub: null };
  const sub = { ...foundToSub(f, { country: opts.country, currency: opts.currency, today: opts.today, nowIso: opts.nowIso }), foundInBankOn: opts.today };
  return { state: { ...s, memory, suggestions, finds: [...s.finds, toFind(f, sub, f.linkId, opts.today, 'yes')] }, sub };
}

export function dismiss(s: BankState, key: string): BankState {
  return s.dismissed.includes(key) ? s : { ...s, dismissed: [...s.dismissed, key].slice(-300) };
}

// ---------- Home ----------

export type SyncCard =
  | { kind: 'reconnect'; key: string; link: BankLink }
  | { kind: 'newAccounts'; key: string; link: BankLink }
  | { kind: 'price'; key: string; change: PriceChange; sub: Sub; bank: string }
  | { kind: 'cancelled'; key: string; gone: LooksCancelled; sub: Sub }
  | { kind: 'check'; key: string; items: (Found & { linkId: string | null })[] }
  | { kind: 'recap'; key: string; trialEnds: DateOnly; found: number; totals: { currency: string; yearlyMinor: number }[]; bank: string; caught: Caught | null };

const ORDER: SyncCard['kind'][] = ['reconnect', 'newAccounts', 'price', 'cancelled', 'check', 'recap'];

export const priceKey = (c: PriceChange) => `bank-price:${c.subId}:${c.toMinor}:${c.date}`;
export const cancelKey = (c: LooksCancelled) => `bank-gone:${c.subId}:${c.expected}`;
export const recapKey = (trialEnds: DateOnly) => `bank-recap:${trialEnds}`;

/** Live finds (not undone) in yearly money, one line per currency (never added across currencies). */
export function findTotals(finds: BankFind[]): { currency: string; yearlyMinor: number }[] {
  const by = new Map<string, number>();
  for (const f of finds) if (!f.undone && f.currency && f.yearlyMinor) by.set(f.currency, (by.get(f.currency) ?? 0) + f.yearlyMinor);
  return [...by.entries()].map(([currency, y]) => ({ currency, yearlyMinor: y }));
}

/**
 * Every sync card that's waiting, most important first. Home shows only the first one.
 * `trialEnds`: the running Pro trial's end date, for the day-5 recap.
 */
export function syncCards(s: BankState, subs: Sub[], today: DateOnly, trialEnds: DateOnly | null = null): SyncCard[] {
  const out: SyncCard[] = [];
  const subById = new Map(subs.map((x) => [x.id, x]));
  for (const link of s.links) if (needsSignIn(link) && !(link.laterUntil && link.laterUntil > today)) out.push({ kind: 'reconnect', key: `bank-relogin:${link.id}`, link });
  // A bank that needs a sign-in shows only Reconnect; the new account waits until it's back.
  for (const link of s.links)
    if (newAccountsWaiting(link) && !(link.newAccountsLaterUntil && link.newAccountsLaterUntil > today)) out.push({ kind: 'newAccounts', key: `bank-newaccounts:${link.id}`, link });
  for (const c of s.priceChanges) {
    const sub = subById.get(c.subId);
    // Only while the list still has the old price (Update clears it), and never twice.
    if (!sub || sub.status === 'deleted' || sub.amountMinor !== c.fromMinor || s.dismissed.includes(priceKey(c))) continue;
    const txn = s.txns.find((t) => t.date === c.date && t.amountMinor === c.toMinor);
    out.push({ kind: 'price', key: priceKey(c), change: c, sub, bank: linkName(s, txn ? s.txnLink[txn.id] : null) });
  }
  for (const g of s.lookCancelled) {
    const sub = subById.get(g.subId);
    if (!sub || sub.status !== 'active' || s.dismissed.includes(cancelKey(g))) continue;
    out.push({ kind: 'cancelled', key: cancelKey(g), gone: g, sub });
  }
  const handled = new Set(s.memory.handled);
  const items = s.suggestions.filter((f) => !handled.has(f.key));
  if (items.length) out.push({ kind: 'check', key: 'bank-check', items });
  if (trialEnds && s.links.length && daysBetween(today, trialEnds) <= RECAP_DAYS_LEFT && daysBetween(today, trialEnds) >= 0 && !s.dismissed.includes(recapKey(trialEnds))) {
    const live = s.finds.filter((f) => !f.undone);
    if (live.length)
      out.push({ kind: 'recap', key: recapKey(trialEnds), trialEnds, found: live.length, totals: findTotals(live), bank: linkName(s, live[0].linkId), caught: s.caught[s.caught.length - 1] ?? null });
  }
  return out.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
}

/** "FOUND IN YOUR BANK" on the row: the day it was added and the 6 after. */
export function foundTagShows(sub: Pick<Sub, 'foundInBankOn'>, today: DateOnly): boolean {
  if (!sub.foundInBankOn) return false;
  const d = daysBetween(sub.foundInBankOn, today);
  return d >= 0 && d < FOUND_TAG_DAYS;
}

/** Settings → Bank connections: the status in words. */
export function linkStatusWords(l: BankLink, now: Date): { text: string; tone: 'ok' | 'warn' | 'mute' } {
  if (needsSignIn(l)) return { text: 'Needs sign-in', tone: 'warn' };
  if (l.status === 'removing') return { text: 'Disconnecting…', tone: 'mute' };
  if (!l.checkedAt) return { text: 'Reading your charges…', tone: 'mute' };
  const mins = Math.max(0, Math.round((now.getTime() - new Date(l.checkedAt).getTime()) / 60000));
  const ago =
    mins < 2
      ? 'just now'
      : mins < 60
        ? `${mins} minutes ago`
        : mins < 120
          ? '1 hour ago'
          : mins < 60 * 24
            ? `${Math.floor(mins / 60)} hours ago`
            : mins < 60 * 48
              ? 'yesterday'
              : `${Math.floor(mins / 1440)} days ago`;
  return { text: `Checked ${ago}`, tone: 'ok' };
}

/** Money as VoiceOver should say it: "17 dollars 99", "20 dollars". Other currencies: the formatted amount. */
export function spokenMoney(amountMinor: number, currency: string): string {
  if (currency === 'USD' || currency === 'CAD') {
    const whole = Math.floor(Math.abs(amountMinor) / 100);
    const cents = Math.abs(amountMinor) % 100;
    const unit = currency === 'CAD' ? 'Canadian dollars' : 'dollars';
    return `${whole} ${whole === 1 && currency === 'USD' ? 'dollar' : unit}${cents ? ` ${cents}` : ''}`;
  }
  return formatMoney(amountMinor, currency);
}
