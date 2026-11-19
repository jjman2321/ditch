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
  createdAt: string;
};

export type BankAccess = {
  allowed: boolean;
  reason:
    | 'subscription'
    | 'trial'
    | 'grace'
    | 'lifetime_first_year'
    | 'bank_addon'
    | 'trial_ending'
    | 'lifetime_year_over'
    | 'expired'
    | 'revoked'
    | 'billing_retry'
    | 'family_shared'
    | 'none';
  until: string | null;
};

/** The server's BankTxn: outgoing positive, whole minor units. */
export type ServerTxn = { id: string; date: DateOnly; text: string; merchantName: string | null; amountMinor: number; currency: string; pending: boolean };

export type SyncedLink = {
  linkId: string;
  institutionName: string | null;
  status: BankLinkStatus;
  /** False while the bank's history is still loading (first minutes after connecting). */
  ready: boolean;
  added: ServerTxn[];
  modified: ServerTxn[];
  removed: string[];
  syncToken: string | null;
};

export type BankSyncResponse = { links: SyncedLink[] };
export type BankListResponse = { links: BankLinkInfo[]; access: BankAccess; maxLinks: number };
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

/** A believable US bank: three months of Netflix, Spotify (price rise), a gym, ChatGPT, and noise. */
export function sampleBankTxns(today: DateOnly): ServerTxn[] {
  const out: ServerTxn[] = [];
  const month = (back: number, day: number) => {
    const d = addMonthsClamped(today.slice(0, 8) + String(day).padStart(2, '0'), -back);
    return d > today ? addMonthsClamped(d, -1) : d;
  };
  const add = (id: string, date: DateOnly, text: string, merchantName: string | null, amountMinor: number) =>
    out.push({ id, date, text, merchantName, amountMinor, currency: 'USD', pending: false });
  for (const back of [3, 2, 1, 0]) {
    add(`s-nflx-${back}`, month(back, 3), 'NETFLIX.COM 866-579-7172 CA', 'Netflix', 1799);
    add(`s-spot-${back}`, month(back, 5), 'SPOTIFY USA', 'Spotify', back === 0 ? 1299 : 1199);
    add(`s-gym-${back}`, month(back, 9), 'PLANET FITNESS #1234', 'Planet Fitness', 2499);
    add(`s-oai-${back}`, month(back, 14), 'OPENAI *CHATGPT SUBSCR', 'OpenAI', 2000);
    add(`s-shell-${back}`, month(back, 12), 'SHELL OIL 57444 HOUSTON TX', 'Shell', 4510 + back * 37);
  }
  add('s-refund', addDays(today, -4), 'AMAZON MKTPLACE REFUND', 'Amazon', -2399);
  add('s-pending', addDays(today, -1), 'UBER *TRIP', 'Uber', 1850);
  out[out.length - 1].pending = true;
  return out;
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
  let delivered = false;
  const access: BankAccess = { allowed: true, reason: 'trial', until: null };
  return {
    async listBanks(): Promise<BankListResponse> {
      return { links, access, maxLinks: 3 };
    },
    async createLinkToken(): Promise<LinkTokenResponse> {
      if (links.length >= 3) throw new BankApiError(409, 'bank_limit');
      return { linkToken: 'link-sample', expiration: null, provider: 'plaid', mode: 'new' };
    },
    async exchangePublicToken(): Promise<ExchangeResponse> {
      const link = { ...SAMPLE_BANK, id: `sample-bank-${links.length + 1}`, createdAt: new Date().toISOString() };
      links = [...links, link];
      delivered = false;
      return { link, replaced: null };
    },
    async syncBank(): Promise<BankSyncResponse> {
      const first = !delivered;
      delivered = true;
      return {
        links: links.map((l, i) => ({
          linkId: l.id,
          institutionName: l.institutionName,
          status: l.status,
          ready: true,
          added: first && i === 0 ? sampleBankTxns(today()) : [],
          modified: [],
          removed: [],
          syncToken: null,
        })),
      };
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
