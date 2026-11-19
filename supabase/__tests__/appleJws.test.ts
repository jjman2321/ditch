import fake from '../testing/fixtures/apple-test-chain.json';
import real from '../testing/fixtures/apple-real-certs.json';
import { APPLE_ROOT_CA_G3_SHA256, verifyAppleJws } from '../functions/_shared/appleJws.ts';
import { fromBase64, toBase64Url, utf8 } from '../functions/_shared/bytes.ts';
import { sha256Hex } from '../functions/_shared/crypto.ts';
import { isSignedBy, parseCert } from '../functions/_shared/x509.ts';

let fakeRoot = '';
beforeAll(async () => {
  fakeRoot = await sha256Hex(fromBase64(fake.certs.root));
});
const opts = () => ({ rootFingerprints: [fakeRoot] });

describe('Apple signed data (JWS with x5c chain)', () => {
  it('accepts a correctly signed transaction from the pinned root', async () => {
    const tx = await verifyAppleJws<{ appAccountToken: string; productId: string }>(fake.validJws, opts());
    expect(tx.appAccountToken).toBe(fake.transaction.appAccountToken);
    expect(tx.productId).toBe('test.yearly');
  });

  it('rejects a chain that does not end in Apple Root CA - G3 (the default pin)', async () => {
    await expect(verifyAppleJws(fake.validJws)).rejects.toThrow('Apple Root CA');
  });

  it('rejects an intermediate without Apple’s WWDR marker', async () => {
    await expect(verifyAppleJws(fake.rogueJws, opts())).rejects.toThrow('intermediate');
  });

  it('rejects a signature made by another key', async () => {
    await expect(verifyAppleJws(fake.wrongKeyJws, opts())).rejects.toThrow('bad signature');
  });

  it('rejects an edited payload (e.g. a longer expiry)', async () => {
    const [h, , s] = fake.validJws.split('.');
    const edited = toBase64Url(utf8(JSON.stringify({ ...fake.transaction, expiresDate: 4102444800000 })));
    await expect(verifyAppleJws(`${h}.${edited}.${s}`, opts())).rejects.toThrow('bad signature');
  });

  it('rejects alg none / HS256 and missing x5c', async () => {
    const [, p, s] = fake.validJws.split('.');
    const hdr = (o: object) => toBase64Url(utf8(JSON.stringify(o)));
    await expect(verifyAppleJws(`${hdr({ alg: 'none', x5c: [] })}.${p}.${s}`, opts())).rejects.toThrow('ES256');
    await expect(verifyAppleJws(`${hdr({ alg: 'ES256' })}.${p}.${s}`, opts())).rejects.toThrow('x5c');
    await expect(verifyAppleJws('not-a-jws', opts())).rejects.toThrow('bad jws');
  });

  it('rejects certificates used outside their validity window', async () => {
    await expect(verifyAppleJws(fake.validJws, { ...opts(), at: new Date('1999-01-01') })).rejects.toThrow('not valid');
  });
});

describe('real Apple certificates', () => {
  it('our pinned fingerprint is Apple Root CA - G3', async () => {
    expect(await sha256Hex(fromBase64(real.appleRootG3))).toBe(APPLE_ROOT_CA_G3_SHA256);
  });

  it('reads Apple WWDR G6 and checks it was signed by Apple Root CA - G3', async () => {
    const root = parseCert(fromBase64(real.appleRootG3));
    const g6 = parseCert(fromBase64(real.appleWwdrG6));
    expect(g6.isCA).toBe(true);
    expect(g6.extensions.has('1.2.840.113635.100.6.2.1')).toBe(true);
    expect(g6.curve).toBe('P-384');
    expect(await isSignedBy(g6, root)).toBe(true);
    expect(await isSignedBy(root, g6)).toBe(false);
  });
});
