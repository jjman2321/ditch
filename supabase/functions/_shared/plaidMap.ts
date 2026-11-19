// Plaid transaction -> the phone's BankTxn, and merging /transactions/sync pages.
// Plaid: positive amount = money leaving the account, same as the phone. Amounts are decimals
// in major units; we convert to whole minor units for the currency (JPY 0 decimals, USD 2).

import { isIsoCurrency, majorToMinor } from './money.ts';
import type { BankTxn } from './types.ts';

/** The fields of a Plaid transaction we read. */
export type PlaidTxn = {
  transaction_id: string;
  amount: number;
  iso_currency_code: string | null;
  unofficial_currency_code?: string | null;
  date: string;
  authorized_date?: string | null;
  name?: string | null;
  merchant_name?: string | null;
  original_description?: string | null;
  pending: boolean;
};

/** null when the transaction can't be used (no ISO currency, e.g. crypto; bad amount). */
export function mapPlaidTxn(t: PlaidTxn): BankTxn | null {
  const currency = t.iso_currency_code?.toUpperCase();
  if (!isIsoCurrency(currency) || typeof t.amount !== 'number' || !Number.isFinite(t.amount)) return null;
  const date = (t.authorized_date || t.date || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  // The raw bank line is what the phone's statement matcher was built on; fall back to Plaid's name.
  const text = (t.original_description || t.name || t.merchant_name || '').trim();
  return {
    id: t.transaction_id,
    date,
    text,
    merchantName: t.merchant_name?.trim() || null,
    amountMinor: majorToMinor(t.amount, currency),
    currency,
    pending: !!t.pending,
  };
}

export type SyncPage<T> = { added: T[]; modified: T[]; removed: { transaction_id: string }[]; next_cursor: string; has_more: boolean };

export type MergedSync = { added: BankTxn[]; modified: BankTxn[]; removed: string[] };

/**
 * Folds pages in order. A transaction added and then modified in a later page stays "added"
 * (latest version); anything removed later in the batch drops out of added/modified.
 */
export function mergeSyncPages(pages: SyncPage<PlaidTxn>[]): MergedSync {
  const added = new Map<string, BankTxn>();
  const modified = new Map<string, BankTxn>();
  const removed = new Set<string>();
  for (const page of pages) {
    for (const raw of page.added) {
      const t = mapPlaidTxn(raw);
      if (!t) continue;
      removed.delete(t.id);
      added.set(t.id, t);
    }
    for (const raw of page.modified) {
      const t = mapPlaidTxn(raw);
      if (!t) continue;
      if (added.has(t.id)) added.set(t.id, t);
      else modified.set(t.id, t);
    }
    for (const r of page.removed) {
      added.delete(r.transaction_id);
      modified.delete(r.transaction_id);
      removed.add(r.transaction_id);
    }
  }
  return { added: [...added.values()], modified: [...modified.values()], removed: [...removed] };
}

/**
 * Runs /transactions/sync until has_more is false. If Plaid says the data changed mid-way
 * (TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION), start over from the first cursor, as Plaid says.
 */
export async function paginateSync(
  fetchPage: (cursor: string | null) => Promise<SyncPage<PlaidTxn>>,
  startCursor: string | null,
  maxRestarts = 3,
  maxPages = 200,
): Promise<{ pages: SyncPage<PlaidTxn>[]; nextCursor: string }> {
  for (let attempt = 0; ; attempt++) {
    const pages: SyncPage<PlaidTxn>[] = [];
    let cursor = startCursor;
    try {
      for (let i = 0; i < maxPages; i++) {
        const page = await fetchPage(cursor);
        pages.push(page);
        cursor = page.next_cursor;
        if (!page.has_more) return { pages, nextCursor: page.next_cursor };
      }
      throw new Error('too many sync pages');
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code !== 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' || attempt >= maxRestarts) throw e;
    }
  }
}
