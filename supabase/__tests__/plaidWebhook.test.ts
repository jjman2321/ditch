import { toBase64Url, utf8 } from '../functions/_shared/bytes.ts';
import { sha256Hex } from '../functions/_shared/crypto.ts';
import type { PlaidJwk } from '../functions/_shared/plaid.ts';
import { plaidWebhookAction, verifyPlaidWebhook } from '../functions/_shared/plaidWebhook.ts';

const NOW = new Date('2026-11-19T12:00:00Z');
let keys: CryptoKeyPair;
let jwk: PlaidJwk;

beforeAll(async () => {
  keys = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair;
  const pub = await crypto.subtle.exportKey('jwk', keys.publicKey);
  jwk = { alg: 'ES256', crv: 'P-256', kid: 'kid-1', kty: 'EC', use: 'sig', x: pub.x!, y: pub.y!, created_at: 1700000000, expired_at: null };
});

async function sign(body: string, over: { iat?: number; alg?: string; hash?: string } = {}) {
  const header = toBase64Url(utf8(JSON.stringify({ alg: over.alg ?? 'ES256', kid: 'kid-1', typ: 'JWT' })));
  const claims = toBase64Url(utf8(JSON.stringify({ iat: over.iat ?? Math.floor(NOW.getTime() / 1000) - 10, request_body_sha256: over.hash ?? (await sha256Hex(body)) })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, keys.privateKey, utf8(`${header}.${claims}`)));
  return `${header}.${claims}.${toBase64Url(sig)}`;
}

const body = JSON.stringify({ webhook_type: 'TRANSACTIONS', webhook_code: 'SYNC_UPDATES_AVAILABLE', item_id: 'item-1', environment: 'sandbox' }, null, 2);
const getKey = async () => jwk;

describe('verifyPlaidWebhook', () => {
  it('accepts a fresh, correctly signed webhook with the matching body hash', async () => {
    expect(await verifyPlaidWebhook(body, await sign(body), getKey, NOW)).toEqual({ ok: true });
  });

  it('rejects a changed body, a missing header, an old token, a wrong alg, an expired key', async () => {
    const good = await sign(body);
    expect((await verifyPlaidWebhook(body.replace('item-1', 'item-2'), good, getKey, NOW)).ok).toBe(false);
    expect((await verifyPlaidWebhook(body, null, getKey, NOW)).ok).toBe(false);
    expect(await verifyPlaidWebhook(body, await sign(body, { iat: Math.floor(NOW.getTime() / 1000) - 301 }), getKey, NOW)).toEqual({ ok: false, why: 'too old' });
    expect(await verifyPlaidWebhook(body, await sign(body, { alg: 'HS256' }), getKey, NOW)).toEqual({ ok: false, why: 'alg' });
    expect(await verifyPlaidWebhook(body, good, async () => ({ ...jwk, expired_at: 1700000001 }), NOW)).toEqual({ ok: false, why: 'key expired' });
    expect(await verifyPlaidWebhook(body, good, async () => Promise.reject(new Error('x')), NOW)).toEqual({ ok: false, why: 'key lookup failed' });
  });

  it('rejects a token signed by another key', async () => {
    const other = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair;
    const pub = await crypto.subtle.exportKey('jwk', other.publicKey);
    expect(await verifyPlaidWebhook(body, await sign(body), async () => ({ ...jwk, x: pub.x!, y: pub.y! }), NOW)).toEqual({ ok: false, why: 'signature' });
  });
});

describe('plaidWebhookAction (dispatch)', () => {
  const a = (o: object) => plaidWebhookAction({ item_id: 'i', ...o });
  it('maps each webhook to one action', () => {
    expect(a({ webhook_type: 'TRANSACTIONS', webhook_code: 'SYNC_UPDATES_AVAILABLE', historical_update_complete: true })).toEqual({ kind: 'sync_ready', itemId: 'i', historical: true });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'ERROR', error: { error_code: 'ITEM_LOGIN_REQUIRED' } })).toEqual({ kind: 'needs_relogin', itemId: 'i', code: 'ITEM_LOGIN_REQUIRED' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'ERROR', error: { error_code: 'INSTITUTION_DOWN' } })).toEqual({ kind: 'error', itemId: 'i', code: 'INSTITUTION_DOWN' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'PENDING_DISCONNECT', disconnect_time: '2026-11-26T00:00:00Z' })).toEqual({ kind: 'expiring', itemId: 'i', at: '2026-11-26T00:00:00Z' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'PENDING_EXPIRATION', consent_expiration_time: 'x' })).toEqual({ kind: 'expiring', itemId: 'i', at: 'x' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'LOGIN_REPAIRED' })).toEqual({ kind: 'repaired', itemId: 'i' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'USER_PERMISSION_REVOKED' })).toEqual({ kind: 'revoked', itemId: 'i' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'NEW_ACCOUNTS_AVAILABLE' })).toEqual({ kind: 'new_accounts', itemId: 'i' });
    expect(a({ webhook_type: 'ITEM', webhook_code: 'WEBHOOK_UPDATE_ACKNOWLEDGED' }).kind).toBe('ignore');
    expect(a({ webhook_type: 'TRANSACTIONS', webhook_code: 'DEFAULT_UPDATE' }).kind).toBe('ignore');
    expect(plaidWebhookAction({ webhook_type: 'ITEM', webhook_code: 'ERROR' }).kind).toBe('ignore');
  });
});
