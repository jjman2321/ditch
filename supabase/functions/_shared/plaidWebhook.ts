// Plaid webhooks: verify (JWT in the Plaid-Verification header, ES256, key from
// /webhook_verification_key/get, iat at most 5 minutes old, SHA-256 of the raw body), then
// turn the payload into one action. Pure apart from crypto.subtle; tested in Jest.

import { timingSafeEqual } from './bytes.ts';
import { sha256Hex } from './crypto.ts';
import { decodeJws, verifyEs256 } from './jws.ts';
import type { PlaidJwk } from './plaid.ts';

export const MAX_WEBHOOK_AGE_S = 5 * 60;

export async function verifyPlaidWebhook(
  rawBody: string,
  verificationHeader: string | null,
  getKey: (kid: string) => Promise<PlaidJwk>,
  now: Date,
): Promise<{ ok: true } | { ok: false; why: string }> {
  if (!verificationHeader) return { ok: false, why: 'missing header' };
  let d;
  try {
    d = decodeJws(verificationHeader);
  } catch {
    return { ok: false, why: 'bad jwt' };
  }
  if (d.header.alg !== 'ES256') return { ok: false, why: 'alg' };
  const kid = d.header.kid;
  if (typeof kid !== 'string' || !kid) return { ok: false, why: 'kid' };
  let jwk: PlaidJwk;
  try {
    jwk = await getKey(kid);
  } catch {
    return { ok: false, why: 'key lookup failed' };
  }
  if (jwk.expired_at != null && jwk.expired_at * 1000 <= now.getTime()) return { ok: false, why: 'key expired' };
  const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
  if (!(await verifyEs256(key, d))) return { ok: false, why: 'signature' };
  const claims = d.payload as { iat?: number; request_body_sha256?: string };
  if (typeof claims.iat !== 'number' || now.getTime() / 1000 - claims.iat > MAX_WEBHOOK_AGE_S) return { ok: false, why: 'too old' };
  if (typeof claims.request_body_sha256 !== 'string') return { ok: false, why: 'no body hash' };
  if (!timingSafeEqual(await sha256Hex(rawBody), claims.request_body_sha256)) return { ok: false, why: 'body hash' };
  return { ok: true };
}

export type PlaidWebhookBody = {
  webhook_type?: string;
  webhook_code?: string;
  item_id?: string;
  environment?: string;
  initial_update_complete?: boolean;
  historical_update_complete?: boolean;
  error?: { error_code?: string } | null;
  reason?: string;
  disconnect_time?: string;
  consent_expiration_time?: string;
};

export type PlaidAction =
  | { kind: 'sync_ready'; itemId: string; historical: boolean }
  | { kind: 'needs_relogin'; itemId: string; code: string }
  | { kind: 'error'; itemId: string; code: string }
  | { kind: 'expiring'; itemId: string; at: string | null }
  | { kind: 'repaired'; itemId: string }
  | { kind: 'revoked'; itemId: string }
  | { kind: 'new_accounts'; itemId: string }
  | { kind: 'ignore'; reason: string };

/** One webhook -> one thing to do. Unknown codes are ignored (and logged by the caller). */
export function plaidWebhookAction(b: PlaidWebhookBody): PlaidAction {
  const type = b.webhook_type;
  const code = b.webhook_code ?? '';
  const itemId = b.item_id;
  if (!itemId) return { kind: 'ignore', reason: `${type}:${code}:no-item` };
  if (type === 'TRANSACTIONS') {
    if (code === 'SYNC_UPDATES_AVAILABLE') return { kind: 'sync_ready', itemId, historical: !!b.historical_update_complete };
    return { kind: 'ignore', reason: `TRANSACTIONS:${code}` }; // DEFAULT_UPDATE etc.: /transactions/get era, not used
  }
  if (type === 'ITEM') {
    switch (code) {
      case 'ERROR': {
        const ec = b.error?.error_code ?? 'UNKNOWN';
        return ec === 'ITEM_LOGIN_REQUIRED' ? { kind: 'needs_relogin', itemId, code: ec } : { kind: 'error', itemId, code: ec };
      }
      case 'PENDING_DISCONNECT': // US/CA, 7 days ahead
        return { kind: 'expiring', itemId, at: b.disconnect_time ?? null };
      case 'PENDING_EXPIRATION': // UK/EU, 7 days ahead
        return { kind: 'expiring', itemId, at: b.consent_expiration_time ?? null };
      case 'LOGIN_REPAIRED':
        return { kind: 'repaired', itemId };
      case 'USER_PERMISSION_REVOKED':
        return { kind: 'revoked', itemId };
      case 'NEW_ACCOUNTS_AVAILABLE': // the bank has an account the person hasn't shared yet
        return { kind: 'new_accounts', itemId };
      default:
        // USER_ACCOUNT_REVOKED (one account only), WEBHOOK_UPDATE_ACKNOWLEDGED
        return { kind: 'ignore', reason: `ITEM:${code}` };
    }
  }
  return { kind: 'ignore', reason: `${type}:${code}` };
}
