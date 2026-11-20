// Bank sync client for the phone (DECISIONS #67). Talks to the Supabase Edge Functions in
// supabase/functions. Without EXPO_PUBLIC_API_URL (Expo Go, local dev) it uses sample data.
//
// Identity: no accounts. A random app user id + a per-install secret live in the iOS Keychain
// (expo-secure-store). The same id is the RevenueCat app user id (src/services/purchases.ts), so
// the bank server can later ask RevenueCat whether this phone has Pro. The secret never leaves the phone except as a
// header to our own server, which keeps only a hash of it.
//
// Not wired to any screen yet; Plaid Link itself needs a new native build (docs/plans/bank-sync-build.md).

import { requireOptionalNativeModule } from 'expo-modules-core';

import { today } from './clock';
import {
  BankApiError,
  createBankMock,
  type BankListResponse,
  type BankSyncResponse,
  type EntitlementSyncResponse,
  type ExchangeResponse,
  type LinkTokenRequest,
  type LinkTokenResponse,
} from './bankShared';

export * from './bankShared';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || null;
/** True when a real server is configured; false means sample data. */
export const BANK_LIVE = API_URL !== null;

const ID_KEY = 'ditch.appUserId';
const SECRET_KEY = 'ditch.installSecret';
const ACK_KEY = 'ditch.bankSyncAck';

// The Keychain and random-bytes modules are native code added after TestFlight build 5. Importing them
// at the top crashed that build at launch, so iOS rolled every over-the-air update back (Nov 19). They're
// loaded only when bank sync needs them, and only if this build has them; otherwise bank sync says it
// needs the new build instead of taking the whole app down.
type Natives = { SecureStore: typeof import('expo-secure-store'); Crypto: typeof import('expo-crypto') };
let natives: Natives | null | undefined;
function loadNatives(): Natives | null {
  if (natives !== undefined) return natives;
  if (!requireOptionalNativeModule('ExpoSecureStore') || !requireOptionalNativeModule('ExpoCrypto')) return (natives = null);
  natives = {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SecureStore: require('expo-secure-store'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Crypto: require('expo-crypto'),
  };
  return natives;
}
function needNatives(): Natives {
  const n = loadNatives();
  if (!n) throw new BankApiError(0, 'needs_new_build', 'Bank sync needs the newest Ditch build.');
  return n;
}
/** Readable after the first unlock, so background refresh can sync while the phone is locked. */
const keychain = (n: Natives) => ({ keychainAccessible: n.SecureStore.AFTER_FIRST_UNLOCK });

/** True when this build has what bank sync needs on the phone. */
export const BANK_NATIVE_READY = () => loadNatives() !== null;

type Identity = { id: string; secret: string };
let identity: Promise<Identity> | null = null;

function base64Url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function loadIdentity(): Promise<Identity> {
  identity ??= (async () => {
    const n = needNatives();
    const { SecureStore, Crypto } = n;
    let id = await SecureStore.getItemAsync(ID_KEY, keychain(n));
    let secret = await SecureStore.getItemAsync(SECRET_KEY, keychain(n));
    if (!id || !secret) {
      id = Crypto.randomUUID().toLowerCase();
      secret = base64Url(Crypto.getRandomBytes(32));
      await SecureStore.setItemAsync(ID_KEY, id, keychain(n));
      await SecureStore.setItemAsync(SECRET_KEY, secret, keychain(n));
    }
    return { id, secret };
  })();
  identity.catch(() => (identity = null));
  return identity;
}

/** The random app user id. Also RevenueCat's app user id (src/services/purchases.ts). */
export async function getAppUserId(): Promise<string> {
  return (await loadIdentity()).id;
}

async function call<T>(fn: string, body: unknown = {}, timeoutMs = 30_000): Promise<T> {
  const { id, secret } = await loadIdentity();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ditch-user': id, 'x-ditch-secret': secret },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; reason?: string };
    if (!res.ok) throw new BankApiError(res.status, json.error ?? 'http_error', json.reason);
    return json as T;
  } finally {
    clearTimeout(timer);
  }
}

const mock = createBankMock(today);

/**
 * Sends StoreKit 2's signed transactions (Transaction.jwsRepresentation for each current
 * entitlement) and renewal info. Call after a purchase, on launch and on restore. The server
 * creates the user on first proof and removes banks if access ended.
 * Not called since purchases moved to RevenueCat (Nov 20): the server will check Pro through
 * RevenueCat instead (docs/plans/revenuecat-setup.md).
 */
export function syncEntitlements(transactions: string[], renewals: string[] = []): Promise<EntitlementSyncResponse> {
  return API_URL ? call('entitlement-sync', { transactions, renewals }) : mock.syncEntitlements();
}

export function listBanks(): Promise<BankListResponse> {
  return API_URL ? call('bank-list') : mock.listBanks();
}

/**
 * A Link token to open the bank's sign-in. `update` re-logs-in an existing bank (same connection);
 * with `newAccounts` it also lets the person tick the bank's new accounts (Plaid Account Select).
 */
export function createLinkToken(opts: LinkTokenRequest = { mode: 'new' }): Promise<LinkTokenResponse> {
  return API_URL ? call('bank-link-token', opts) : mock.createLinkToken(opts);
}

/** After the bank sign-in succeeds: hand the one-time public token to the server. */
export function exchangePublicToken(publicToken: string, provider?: 'plaid' | 'stripe', linkSessionId?: string | null): Promise<ExchangeResponse> {
  return API_URL ? call('bank-exchange', { publicToken, provider, linkSessionId: linkSessionId ?? undefined }) : mock.exchangePublicToken();
}

/** How Plaid's sign-in ended when it didn't finish: IDs and codes for troubleshooting with Plaid. Best effort. */
export async function logLinkExit(info: {
  linkId?: string;
  mode: 'new' | 'update';
  linkSessionId: string | null;
  requestId: string | null;
  errorCode: string | null;
  errorType: string | null;
  step: string | null;
  institutionId: string | null;
}): Promise<void> {
  if (!API_URL) return;
  await call('link-event', info).catch(() => undefined);
}

async function readAcks(): Promise<Record<string, string>> {
  try {
    const n = needNatives();
    return JSON.parse((await n.SecureStore.getItemAsync(ACK_KEY, keychain(n))) ?? '{}');
  } catch {
    return {};
  }
}

/**
 * New, changed and removed bank transactions since the last confirmed sync. After saving them
 * on the phone, call confirmBankSync(result) so the server moves on; if the app dies before
 * that, the next sync sends the same batch again (nothing lost).
 */
export async function syncBank(linkId?: string, repaired?: string): Promise<BankSyncResponse> {
  if (!API_URL) return mock.syncBank();
  // repaired: the link just fixed in update mode, so the server clears its "needs sign-in"/"expiring" flag.
  return call('bank-sync', { linkId, ack: await readAcks(), repaired }, 90_000);
}

/** Records that this sync's transactions are saved; sent along with the next syncBank(). */
export async function confirmBankSync(res: BankSyncResponse): Promise<void> {
  if (!API_URL) return;
  const acks = await readAcks();
  for (const l of res.links) if (l.syncToken) acks[l.linkId] = l.syncToken;
  const n = needNatives();
  await n.SecureStore.setItemAsync(ACK_KEY, JSON.stringify(acks), keychain(n));
}

/** Disconnects one bank (Settings → Bank → Disconnect), or all of them. */
export function removeBank(linkId?: string): Promise<{ removed: number; pending: number }> {
  if (!API_URL) return mock.removeBank(linkId);
  return call('bank-remove', linkId ? { linkId } : { all: true });
}
