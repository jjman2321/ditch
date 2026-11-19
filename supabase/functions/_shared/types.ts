// Shapes shared by the functions, the phone client and the tests. No Deno-only imports.

/**
 * One bank transaction as the phone's engine wants it (src/import/bankSync.ts BankTxn).
 * Money leaving the account is positive; refunds and deposits are negative. Whole minor units.
 */
export type BankTxn = {
  id: string;
  /** YYYY-MM-DD (date only). */
  date: string;
  text: string;
  merchantName: string | null;
  amountMinor: number;
  currency: string;
  pending: boolean;
};

export type ProviderName = 'plaid' | 'stripe';

export type LinkStatus = 'active' | 'needs_relogin' | 'expiring' | 'error' | 'removing' | 'removed';

/** A row of bank_links. access_token_enc never leaves the server. */
export type BankLink = {
  id: string;
  app_user_id: string;
  provider: ProviderName;
  item_id: string;
  access_token_enc: string | null;
  /** The last /transactions/sync cursor the phone confirmed it saved. */
  cursor: string | null;
  /** The cursor handed to the phone but not yet confirmed. Promoted to `cursor` on ack. */
  pending_cursor: string | null;
  status: LinkStatus;
  institution_id: string | null;
  institution_name: string | null;
  needs_relogin_since: string | null;
  updates_available: boolean;
  last_error: string | null;
  remove_attempts: number;
  created_at: string;
  removed_at: string | null;
};

export type EntitlementKind = 'yearly' | 'weekly' | 'lifetime' | 'bank_addon';

export type EntitlementStatus =
  | 'trial'
  | 'trial_cancelled'
  | 'active'
  | 'grace'
  | 'billing_retry'
  | 'expired'
  | 'revoked';

/** A row of entitlements, one per Apple original transaction. */
export type Entitlement = {
  app_user_id: string;
  kind: EntitlementKind;
  original_transaction_id: string;
  product_id: string;
  status: EntitlementStatus;
  /** Subscriptions: when the current period ends. Lifetime: null. */
  expires_at: string | null;
  /** First purchase (Lifetime's bank-sync year counts from here). */
  purchased_at: string | null;
  in_trial: boolean;
  auto_renew: boolean | null;
  grace_until: string | null;
  /** Family Sharing copy: Pro on the phone, but no bank sync (each bank costs us monthly). */
  family_shared: boolean;
  environment: string;
  /** Apple's signedDate of the data this row came from. Older data never overwrites newer. */
  signed_at: string;
  updated_at: string;
};

export type AppUser = { id: string; secret_hash: string; created_at: string };

export type EventRow = {
  kind: string;
  app_user_id?: string | null;
  link_id?: string | null;
  /** Small facts only: codes, counts, reasons. Never tokens, never transactions. */
  detail?: Record<string, unknown>;
  /** Makes the event idempotent (e.g. Apple's notificationUUID). */
  dedupe_key?: string | null;
};
