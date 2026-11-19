// The bank data provider behind one interface, so Plaid (primary) can be swapped for
// Stripe Financial Connections (fallback) without touching the functions.

import type { BankTxn, ProviderName } from './types.ts';

export type LinkTokenRequest =
  | { mode: 'new'; appUserId: string }
  | { mode: 'update'; appUserId: string; accessToken: string };

export type LinkToken = { linkToken: string; expiration: string | null };

export type Exchanged = {
  itemId: string;
  /** Secret. Encrypted before it touches the database; never logged or sent to the phone. */
  accessToken: string;
  institutionId: string | null;
  institutionName: string | null;
};

export type SyncDelta = {
  added: BankTxn[];
  modified: BankTxn[];
  removed: string[];
  /** Empty string while the bank's data isn't ready yet. */
  nextCursor: string;
  ready: boolean;
};

/** A provider error the functions know how to react to. */
export class ProviderError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 0,
  ) {
    super(message);
  }
  /** The bank wants the user to log in again (Plaid ITEM_LOGIN_REQUIRED and friends). */
  get needsRelogin() {
    return this.code === 'ITEM_LOGIN_REQUIRED' || this.code === 'PENDING_DISCONNECT' || this.code === 'ACCESS_NOT_GRANTED';
  }
  /** The connection is already gone on the provider's side: treat a remove as done. */
  get alreadyGone() {
    return this.code === 'ITEM_NOT_FOUND' || this.code === 'INVALID_ACCESS_TOKEN' || this.code === 'resource_missing';
  }
}

export interface BankProvider {
  readonly name: ProviderName;
  createLinkToken(req: LinkTokenRequest): Promise<LinkToken>;
  exchange(publicToken: string): Promise<Exchanged>;
  /** Everything since `cursor` (null = from the start), every page merged. */
  sync(accessToken: string, cursor: string | null): Promise<SyncDelta>;
  /** Stops billing. Idempotent: an already-removed connection counts as removed. */
  remove(accessToken: string): Promise<void>;
}
