// Access tokens are encrypted at rest with AES-256-GCM. The key comes from the
// TOKEN_ENC_KEY secret (32 random bytes, base64). Plain WebCrypto, so the same code runs in
// Deno (Edge Functions) and Node (Jest).
//
// Stored format: "v1:<iv base64>:<ciphertext+tag base64>". The item id is bound in as
// additional data, so a ciphertext copied onto another row won't decrypt.

import { fromBase64, toBase64, toHex, utf8, fromUtf8 } from './bytes.ts';

const VERSION = 'v1';

export async function importTokenKey(base64Key: string | undefined): Promise<CryptoKey> {
  if (!base64Key) throw new Error('TOKEN_ENC_KEY is not set');
  const raw = fromBase64(base64Key.trim());
  if (raw.length !== 32) throw new Error('TOKEN_ENC_KEY must be 32 bytes (base64)');
  return await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptToken(key: CryptoKey, plaintext: string, boundTo: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: utf8(boundTo) }, key, utf8(plaintext)));
  return `${VERSION}:${toBase64(iv)}:${toBase64(ct)}`;
}

export async function decryptToken(key: CryptoKey, stored: string, boundTo: string): Promise<string> {
  const [v, iv, ct] = stored.split(':');
  if (v !== VERSION || !iv || !ct) throw new Error('unknown token format');
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(iv), additionalData: utf8(boundTo) }, key, fromBase64(ct));
  return fromUtf8(new Uint8Array(pt));
}

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === 'string' ? utf8(data) : new Uint8Array(data);
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)));
}

/**
 * The per-install secret is 32 random bytes made on the phone, so a plain SHA-256 is enough
 * (no slow password hash needed: there's nothing to guess).
 */
export const hashSecret = (secret: string) => sha256Hex(`ditch-install-secret:${secret}`);
