import { decryptToken, encryptToken, hashSecret, importTokenKey, sha256Hex } from '../functions/_shared/crypto.ts';
import { fromBase64Url, timingSafeEqual, toBase64Url } from '../functions/_shared/bytes.ts';

const KEY = Buffer.alloc(32, 1).toString('base64');

describe('token encryption (AES-256-GCM)', () => {
  it('round-trips, and the stored text never contains the token', async () => {
    const key = await importTokenKey(KEY);
    const enc = await encryptToken(key, 'access-sandbox-abc', 'plaid:item-1');
    expect(enc.startsWith('v1:')).toBe(true);
    expect(enc).not.toContain('access-sandbox');
    expect(await decryptToken(key, enc, 'plaid:item-1')).toBe('access-sandbox-abc');
    // A fresh IV every time.
    expect(await encryptToken(key, 'access-sandbox-abc', 'plaid:item-1')).not.toBe(enc);
  });

  it('fails on another row, another key, or tampering', async () => {
    const key = await importTokenKey(KEY);
    const enc = await encryptToken(key, 'tok', 'plaid:item-1');
    await expect(decryptToken(key, enc, 'plaid:item-2')).rejects.toBeTruthy();
    await expect(decryptToken(await importTokenKey(Buffer.alloc(32, 2).toString('base64')), enc, 'plaid:item-1')).rejects.toBeTruthy();
    const [v, iv, ct] = enc.split(':');
    const flipped = ct.slice(0, -2) + (ct.slice(-2) === 'AA' ? 'AB' : 'AA');
    await expect(decryptToken(key, `${v}:${iv}:${flipped}`, 'plaid:item-1')).rejects.toBeTruthy();
  });

  it('refuses a missing or short key', async () => {
    await expect(importTokenKey(undefined)).rejects.toThrow('TOKEN_ENC_KEY');
    await expect(importTokenKey(Buffer.alloc(16).toString('base64'))).rejects.toThrow('32 bytes');
  });
});

describe('helpers', () => {
  it('sha256 and secret hash', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await hashSecret('x')).toBe(await hashSecret('x'));
    expect(await hashSecret('x')).not.toBe(await hashSecret('y'));
  });
  it('base64url and constant-time compare', () => {
    const b = new Uint8Array([251, 255, 0, 1]);
    expect(Array.from(fromBase64Url(toBase64Url(b)))).toEqual([251, 255, 0, 1]);
    expect(timingSafeEqual('abc', 'abc')).toBe(true);
    expect(timingSafeEqual('abc', 'abd')).toBe(false);
    expect(timingSafeEqual('abc', 'abcd')).toBe(false);
  });
});
