// Data access the functions need. The real one talks to Postgres (deno/supabaseStore.ts);
// the tests use an in-memory one. Nothing here ever holds a transaction.

import type { AppUser, BankLink, Entitlement, EventRow, ProviderName } from './types.ts';

export type NewLink = Omit<BankLink, 'id' | 'created_at'>;

export interface Store {
  getUser(id: string): Promise<AppUser | null>;
  createUser(id: string, secretHash: string): Promise<void>;
  setUserSecret(id: string, secretHash: string): Promise<void>;
  /** Which of these user ids exist. */
  existingUsers(ids: string[]): Promise<Set<string>>;

  getEntitlements(userId: string): Promise<Entitlement[]>;
  getEntitlementsFor(userIds: string[]): Promise<Map<string, Entitlement[]>>;
  getEntitlementByOriginal(originalTransactionId: string): Promise<Entitlement | null>;
  /** Upsert by original_transaction_id. */
  putEntitlement(e: Entitlement): Promise<void>;

  listLinks(userId: string): Promise<BankLink[]>;
  /** Every link not yet removed, for the cleanup job. */
  listLiveLinks(): Promise<BankLink[]>;
  getLink(id: string): Promise<BankLink | null>;
  getLinkByItem(provider: ProviderName, itemId: string): Promise<BankLink | null>;
  insertLink(row: NewLink): Promise<BankLink>;
  updateLink(id: string, patch: Partial<BankLink>): Promise<void>;

  /** Returns false when dedupe_key was already used (the event is a repeat). */
  logEvent(e: EventRow): Promise<boolean>;
  countEvents(userId: string, kind: string, sinceIso: string): Promise<number>;
}
