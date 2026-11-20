// Bank sync client: the shapes the server sends, the dev/web sample data, and merging a sync
// into the transactions the phone keeps. bank.ts (phone) and bank.web.ts (preview) both use it.
// The server never stores transactions, so the phone is where they live (DECISIONS #67).

import { addDays, addMonthsClamped, type DateOnly } from '@/domain/dates';
import type { BankTxn } from '@/import/bankSync';

export type BankLinkStatus = 'active' | 'needs_relogin' | 'expiring' | 'error' | 'removing';

/** One connected bank, as Settings shows it. Never holds a token. */
export type BankLinkInfo = {
  id: string;
  institutionName: string | null;
  status: BankLinkStatus;
  needsReloginSince: string | null;
  /** The bank has new charges waiting (the app checks on open and in background refresh). */
  updatesAvailable: boolean;
  /** The bank has an account not shared with Ditch yet (Plaid NEW_ACCOUNTS_AVAILABLE). Missing from older servers. */
  newAccounts?: boolean;
  createdAt: string;
};

export type BankAccess = {
  allowed: boolean;
  reason: 'subscription' | 'trial' | 'grace' | 'lifetime_first_year' | 'bank_addon' | 'trial_ending' | 'lifetime_year_over' | 'expired' | 'revoked' | 'billing_retry' | 'family_shared' | 'none';
  until: string | null;
};

/** The server's BankTxn: outgoing positive, whole minor units. */
export type ServerTxn = { id: string; date: DateOnly; text: string; merchantName: string | null; amountMinor: number; currency: string; pending: boolean };

export type SyncedLink = {
  linkId: string;
  institutionName: string | null;
  status: BankLinkStatus;
  /** The bank has an account not shared with Ditch yet. Missing from older servers (keep what the phone had). */
  newAccounts?: boolean;
  /** False while the bank's history is still loading (first minutes after connecting). */
  ready: boolean;
  added: ServerTxn[];
  modified: ServerTxn[];
  removed: string[];
  syncToken: string | null;
};

export type BankSyncResponse = { links: SyncedLink[] };
export type BankListResponse = { links: BankLinkInfo[]; access: BankAccess; maxLinks: number };
/** What bank-link-token takes: a new bank, or update mode on one (`newAccounts`: with Account Select, to share new accounts). */
export type LinkTokenRequest = { mode: 'new' } | { mode: 'update'; linkId: string; newAccounts?: boolean };
export type LinkTokenResponse = { linkToken: string; expiration: string | null; provider: 'plaid' | 'stripe'; mode: 'new' | 'update' };
export type ExchangeResponse = { link: BankLinkInfo; replaced: string | null };
export type EntitlementSyncResponse = {
  access: BankAccess;
  removed: number;
  entitlements: { kind: 'yearly' | 'weekly' | 'lifetime' | 'bank_addon'; status: string; expiresAt: string | null; inTrial: boolean }[];
};

/** A failed call. `code` is the server's short error ('not_entitled', 'bank_limit', ...). */
export class BankApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly reason?: string,
  ) {
    super(`bank api ${status} ${code}`);
  }
}

const toBankTxn = (t: ServerTxn): BankTxn => ({ id: t.id, date: t.date, text: t.text, merchantName: t.merchantName, amountMinor: t.amountMinor, currency: t.currency, pending: t.pending });

/**
 * Applies a sync to the transactions the phone keeps: upsert added/modified by id, drop removed.
 * Keeps about two years (the most Plaid sends), newest first.
 */
export function mergeBankTxns(local: BankTxn[], links: SyncedLink[], today: DateOnly, keepDays = 731): BankTxn[] {
  const byId = new Map(local.map((t) => [t.id, t]));
  for (const l of links) {
    for (const t of [...l.added, ...l.modified]) byId.set(t.id, toBankTxn(t));
    for (const id of l.removed) byId.delete(id);
  }
  const oldest = addDays(today, -keepDays);
  return [...byId.values()].filter((t) => t.date >= oldest).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

// ---------- sample data for Expo Go without a server and the web preview ----------

/** The last `day` of the month on or before today, `back` months earlier (clamped to month end). */
function lastDay(today: DateOnly, day: number, back: number): DateOnly {
  let d = addMonthsClamped(today.slice(0, 8) + String(day).padStart(2, '0'), 0);
  if (d > today) d = addMonthsClamped(d, -1);
  return addMonthsClamped(d, -back);
}

/**
 * A believable US bank, matching the approved mockups (design/v32): Netflix, Spotify, ChatGPT,
 * Hulu and Max repeat (sure finds), two unknown repeats to ask about, Apple's bundled charge,
 * and noise (fuel on random days, a refund, a pending ride). `bank` > 0: a second or third
 * bank with a couple of different ones, so every connected bank has something to read.
 */
export function sampleBankTxns(today: DateOnly, bank = 0): ServerTxn[] {
  const out: ServerTxn[] = [];
  const add = (id: string, date: DateOnly, text: string, merchantName: string | null, amountMinor: number) =>
    out.push({ id: bank ? `b${bank}-${id}` : id, date, text, merchantName, amountMinor, currency: 'USD', pending: false });
  if (bank > 0) {
    for (const back of [2, 1, 0]) add(`s-nyt-${back}`, lastDay(today, 6, back), 'NYTIMES*NYTIMES SUBSCR', 'The New York Times', 2500);
    for (const back of [1, 0]) add(`s-pel-${back}`, lastDay(today, 15, back), 'PELOTON* MEMBERSHIP', 'Peloton', 4400);
    add('s-coffee', addDays(today, -3), 'BLUE BOTTLE COFFEE', 'Blue Bottle', 675);
    return out;
  }
  for (const back of [2, 1, 0]) add(`s-nflx-${back}`, lastDay(today, 10, back), 'NETFLIX.COM 866-579-7172 CA', 'Netflix', 1799);
  for (const back of [1, 0]) add(`s-spot-${back}`, lastDay(today, 26, back), 'SPOTIFY USA', 'Spotify', 1199);
  for (const back of [1, 0]) add(`s-oai-${back}`, lastDay(today, 1, back), 'OPENAI *CHATGPT SUBSCR', 'OpenAI', 2000);
  for (const back of [1, 0]) add(`s-hulu-${back}`, lastDay(today, 12, back), 'HULU 877-8244858 CA', 'Hulu', 999);
  for (const back of [1, 0]) add(`s-max-${back}`, lastDay(today, 24, back), 'MAX.COM HBO MAX', 'Max', 1699);
  // Not services we know: asked about, never added on their own.
  for (const back of [1, 0]) add(`s-yoga-${back}`, lastDay(today, 3, back), 'SQ *CORNER YOGA STUDIO', 'Corner Yoga Studio', 4500);
  for (const back of [1, 0]) add(`s-apron-${back}`, lastDay(today, 9, back), 'BLUE APRON MEALS', 'Blue Apron', 5999);
  // Apple bundles its subscriptions into one charge: pointed to the screenshot finder.
  for (const back of [1, 0]) add(`s-apple-${back}`, lastDay(today, 17, back), 'APPLE.COM/BILL 866-712-7753 CA', 'Apple', 1497);
  // Noise: fuel on uneven days and amounts, a refund, a pending ride.
  [4, 19, 33, 52, 61, 80].forEach((n, i) => add(`s-shell-${i}`, addDays(today, -n), 'SHELL OIL 57444 HOUSTON TX', 'Shell', 3120 + i * 611));
  add('s-refund', addDays(today, -4), 'AMAZON MKTPLACE REFUND', 'Amazon', -2399);
  add('s-pending', addDays(today, -1), 'UBER *TRIP', 'Uber', 1850);
  out[out.length - 1].pending = true;
  return out;
}

/** Test builds only: the practice bank's next sync, so every Home card can be tried before real banks. */
export type PracticeEvent = 'new' | 'price' | 'cancelled' | 'relogin' | 'back' | 'newaccounts';

export function practiceSync(kind: PracticeEvent, links: { id: string; name: string }[], today: DateOnly, seq = Date.now()): BankSyncResponse {
  const first = links[0];
  if (!first) return { links: [] };
  const txn = (id: string, date: DateOnly, text: string, merchantName: string, amountMinor: number): ServerTxn => ({
    id: `p-${id}-${seq}`,
    date,
    text,
    merchantName,
    amountMinor,
    currency: 'USD',
    pending: false,
  });
  let added: ServerTxn[] = [];
  let modified: ServerTxn[] = [];
  let removed: string[] = [];
  let status: BankLinkStatus = 'active';
  let newAccounts: boolean | undefined;
  if (kind === 'new') {
    // A new one that's sure: two Disney+ charges a month apart.
    added = [txn('dis1', addDays(today, -31), 'DISNEY PLUS 888-905-7888', 'Disney+', 1199), txn('dis2', addDays(today, -1), 'DISNEY PLUS 888-905-7888', 'Disney+', 1199)];
  } else if (kind === 'price') {
    // Netflix bills more today.
    added = [txn('nflx', today, 'NETFLIX.COM 866-579-7172 CA', 'Netflix', 2299)];
  } else if (kind === 'cancelled') {
    // Hulu stopped: its last charge is 40 days back, so the next one is over a week late.
    removed = ['s-hulu-0'];
    modified = [{ id: 's-hulu-1', date: addDays(today, -40), text: 'HULU 877-8244858 CA', merchantName: 'Hulu', amountMinor: 999, currency: 'USD', pending: false }];
  } else if (kind === 'relogin') {
    status = 'needs_relogin';
  } else if (kind === 'newaccounts') {
    // The bank opened a new account (Plaid NEW_ACCOUNTS_AVAILABLE).
    newAccounts = true;
  }
  return { links: [{ linkId: first.id, institutionName: first.name, status, ...(newAccounts ? { newAccounts } : {}), ready: true, added, modified, removed, syncToken: null }] };
}

export const SAMPLE_BANK: BankLinkInfo = {
  id: 'sample-bank',
  institutionName: 'Sample Bank',
  status: 'active',
  needsReloginSince: null,
  updatesAvailable: false,
  createdAt: '2026-11-19T09:41:00.000Z',
};

/** The offline stand-in for the server, used when EXPO_PUBLIC_API_URL isn't set and on the web. */
export function createBankMock(today: () => DateOnly) {
  let links: BankLinkInfo[] = [];
  const delivered = new Set<string>();
  const access: BankAccess = { allowed: true, reason: 'trial', until: null };
  return {
    async listBanks(): Promise<BankListResponse> {
      return { links, access, maxLinks: 3 };
    },
    async createLinkToken(opts: LinkTokenRequest = { mode: 'new' }): Promise<LinkTokenResponse> {
      // Update mode (reconnect, add new accounts) works on a bank already counted.
      if (opts.mode === 'update') return { linkToken: opts.newAccounts ? 'link-sample-update-accounts' : 'link-sample-update', expiration: null, provider: 'plaid', mode: 'update' };
      if (links.length >= 3) throw new BankApiError(409, 'bank_limit');
      return { linkToken: 'link-sample', expiration: null, provider: 'plaid', mode: 'new' };
    },
    async exchangePublicToken(): Promise<ExchangeResponse> {
      const link = { ...SAMPLE_BANK, id: `sample-bank-${links.length + 1}`, createdAt: new Date().toISOString() };
      links = [...links, link];
      return { link, replaced: null };
    },
    async syncBank(): Promise<BankSyncResponse> {
      // Each bank's sample charges arrive once, on its first sync (like the real first pull).
      const res = {
        links: links.map((l, i) => ({
          linkId: l.id,
          institutionName: l.institutionName,
          status: l.status,
          ready: true,
          added: delivered.has(l.id) ? [] : sampleBankTxns(today(), i),
          modified: [],
          removed: [],
          syncToken: null,
        })),
      };
      for (const l of links) delivered.add(l.id);
      return res;
    },
    async removeBank(linkId?: string): Promise<{ removed: number; pending: number }> {
      const before = links.length;
      links = linkId ? links.filter((l) => l.id !== linkId) : [];
      return { removed: before - links.length, pending: 0 };
    },
    async syncEntitlements(): Promise<EntitlementSyncResponse> {
      return { access, removed: 0, entitlements: [] };
    },
  };
}
