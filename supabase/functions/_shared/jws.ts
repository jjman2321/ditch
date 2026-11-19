// Compact JWS / JWT helpers for ES256 (used by Plaid webhooks and Apple's signed data).

import { fromBase64Url, fromUtf8, utf8 } from './bytes.ts';

export type DecodedJws = { header: Record<string, unknown>; payload: unknown; signingInput: Uint8Array<ArrayBuffer>; signature: Uint8Array<ArrayBuffer> };

/** Splits and decodes a compact JWS. Does NOT verify anything. */
export function decodeJws(jws: string): DecodedJws {
  if (typeof jws !== 'string') throw new Error('jws: not a string');
  const parts = jws.split('.');
  if (parts.length !== 3) throw new Error('jws: expected 3 parts');
  const header = JSON.parse(fromUtf8(fromBase64Url(parts[0])));
  const payload = JSON.parse(fromUtf8(fromBase64Url(parts[1])));
  if (!header || typeof header !== 'object') throw new Error('jws: bad header');
  return { header, payload, signingInput: utf8(`${parts[0]}.${parts[1]}`), signature: fromBase64Url(parts[2]) };
}

/** ES256 signature check (raw r||s, 64 bytes, as JWS uses). */
export async function verifyEs256(key: CryptoKey, d: DecodedJws): Promise<boolean> {
  if (d.signature.length !== 64) return false;
  return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, d.signature, d.signingInput);
}
