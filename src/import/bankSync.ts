// Always-on bank sync (DECISIONS #67): what the phone does with the latest bank charges.
// The server only passes transactions through (never stores them); everything below runs
// on the phone, with the same repeat detector as statements (statement.ts).
//
// Four results, each one honest about what it is:
// - added:        new repeating charges we're sure about. They go on the list on their own,
//                 marked "Found in your bank", with an Undo. Never a guess: high/medium only.
// - suggestions:  repeats we're not sure about ("maybe"). Shown to tick, never added alone.
// - charged:      a subscription on the list was charged (proof the reminder matched).
// - priceChanges: the latest charge differs from the saved price (the user is asked; we never
//                 change a price silently, autosync.md).
// - lookCancelled:a listed subscription that used to charge this bank and has now missed its
//                 date by more than a week ("Looks cancelled. Mark it ditched?").

import { nextFromLastCharge } from '@/domain/charges';
import { addDays, daysBetween, type DateOnly } from '@/domain/dates';
import type { Sub } from '@/domain/subs';
import { matchMerchant } from './match';
import { cleanMerchant, findRepeats, groupKey, isApple, type Txn } from './statement';
import { alreadyOnList } from './toSubs';
import type { Found } from './types';

/** One bank transaction as the server hands it over. Outgoing amounts are positive minor units. */
export type BankTxn = Txn & {
  /** The bank's transaction id, so a charge is never counted twice. */
  id: string;
  /** The cleaner merchant name the bank data provider gives, when it has one. */
  merchantName?: string | null;
  /** Pending charges can still change or vanish: ignored until they post. */
  pending?: boolean;
};

/** What we remember between syncs, stored on the phone. */
export type BankSyncMemory = {
  /** Found keys that were auto-added or that the user said no to: never offered again. */
  handled: string[];
};

export type ChargeSeen = { subId: string; date: DateOnly; amountMinor: number; currency: string };
export type PriceChange = { subId: string; fromMinor: number; toMinor: number; currency: string; date: DateOnly };
export type LooksCancelled = { subId: string; expected: DateOnly; lastSeen: DateOnly };

export type BankSyncResult = {
  added: Found[];
  suggestions: Found[];
  charged: ChargeSeen[];
  priceChanges: PriceChange[];
  lookCancelled: LooksCancelled[];
};

/** A week of grace before "looks cancelled": banks post late and billing days drift. */
export const CANCEL_GRACE_DAYS = 7;

const live = (s: Sub) => s.status === 'active' || s.status === 'ditched-pending';

/** The merchant text we trust most for one transaction. */
function textOf(t: BankTxn): string {
  return t.merchantName?.trim() ? t.merchantName : t.text;
}

/** Same grouping as the statement reader, so a sub and its charges meet on one key. */
function keyOfText(text: string): string | null {
  const clean = cleanMerchant(text);
  if (!clean || isApple(clean)) return null;
  return groupKey(clean);
}

function keyOfSub(s: Sub): string {
  if (s.catalogId) return `svc:${s.catalogId}`;
  return keyOfText(s.name) ?? s.name.toLowerCase();
}

export function analyzeBank(txns: BankTxn[], subs: Sub[], memory: BankSyncMemory, today: DateOnly): BankSyncResult {
  // Posted charges only, each once.
  const seen = new Set<string>();
  const posted = txns.filter((t) => !t.pending && t.amountMinor > 0 && !seen.has(t.id) && (seen.add(t.id), true));
  const asTxn: Txn[] = posted.map((t) => ({ date: t.date, text: textOf(t), amountMinor: t.amountMinor, currency: t.currency }));

  // 1. New repeats not on the list yet.
  const handled = new Set(memory.handled);
  const { found } = findRepeats(asTxn, today);
  const fresh = found.filter((f) => !handled.has(f.key) && !alreadyOnList(f, subs) && f.state === 'renews');
  const added = fresh.filter((f) => f.confidence === 'high' || f.confidence === 'medium').map((f) => ({ ...f, source: 'statement' as const }));
  const suggestions = fresh.filter((f) => f.confidence === 'maybe');

  // 2–4. Charges against subscriptions already on the list.
  const byKey = new Map<string, BankTxn[]>();
  for (const t of posted) {
    const k = keyOfText(textOf(t));
    if (!k) continue;
    const list = byKey.get(`${k}|${t.currency}`) ?? [];
    list.push(t);
    byKey.set(`${k}|${t.currency}`, list);
  }
  const charged: ChargeSeen[] = [];
  const priceChanges: PriceChange[] = [];
  const lookCancelled: LooksCancelled[] = [];
  for (const s of subs.filter(live)) {
    if (!s.currency) continue;
    const list = (byKey.get(`${keyOfSub(s)}|${s.currency}`) ?? []).sort((a, b) => a.date.localeCompare(b.date));
    if (!list.length) continue; // Paid from another account or card: nothing to say.
    const last = list[list.length - 1];
    // Charged recently (within one cycle's worth of the last week): proof it's still running.
    if (daysBetween(last.date, today) <= 7) charged.push({ subId: s.id, date: last.date, amountMinor: last.amountMinor, currency: last.currency });
    // The bill moved by more than a rounding blip (50 cents, or 2%).
    if (s.amountMinor != null && Math.abs(last.amountMinor - s.amountMinor) > Math.max(50, Math.round(s.amountMinor * 0.02))) {
      priceChanges.push({ subId: s.id, fromMinor: s.amountMinor, toMinor: last.amountMinor, currency: s.currency, date: last.date });
    }
    // It used to charge here, and the next one is more than a week late.
    if (s.status === 'active') {
      const expected = nextFromLastCharge(last.date, s.cycle, last.date);
      if (addDays(expected, CANCEL_GRACE_DAYS) < today) lookCancelled.push({ subId: s.id, expected, lastSeen: last.date });
    }
  }
  return { added, suggestions, charged, priceChanges, lookCancelled };
}

/** Remember what was handled, so nothing is offered or added twice. */
export function rememberHandled(memory: BankSyncMemory, keys: string[]): BankSyncMemory {
  return { handled: [...new Set([...memory.handled, ...keys])] };
}

/** Does this merchant look like a known subscription service? (Used for the "New: Max" line.) */
export function knownService(text: string) {
  const clean = cleanMerchant(text);
  return clean ? matchMerchant(clean) : null;
}
