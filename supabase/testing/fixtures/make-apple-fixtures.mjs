// Makes a FAKE Apple-style certificate chain and a few signed JWS strings for the
// apple JWS tests. Nothing here is trusted in production: the tests pin this fake
// root on purpose. Keys live only in a temp folder and are thrown away.
// Run: node supabase/testing/fixtures/make-apple-fixtures.mjs  (needs openssl)
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { createPrivateKey, sign } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'apple-fixtures-'));
const p = (f) => join(dir, f);
const ssl = (...args) => execFileSync('openssl', args, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });

writeFileSync(p('ext.cnf'), `
[root]
basicConstraints=critical,CA:TRUE
keyUsage=critical,keyCertSign,cRLSign
[inter]
basicConstraints=critical,CA:TRUE,pathlen:0
keyUsage=critical,keyCertSign,cRLSign
1.2.840.113635.100.6.2.1=ASN1:NULL
[rogue]
basicConstraints=critical,CA:TRUE,pathlen:0
keyUsage=critical,keyCertSign,cRLSign
[leaf]
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature
1.2.840.113635.100.6.11.1=ASN1:NULL
`);

const key = (name, curve) => ssl('ecparam', '-name', curve, '-genkey', '-noout', '-out', p(`${name}.k`));
key('root', 'secp384r1');
key('inter', 'secp384r1');
key('rogue', 'secp384r1');
key('leaf', 'prime256v1');
key('leaf2', 'prime256v1');

ssl('req', '-new', '-x509', '-key', p('root.k'), '-sha384', '-days', '36500', '-subj', '/CN=Test Root CA - G3/O=Test', '-extensions', 'root', '-config', p('ext.cnf'), '-out', p('root.crt'));
const issue = (name, signer, ext, cn) => {
  ssl('req', '-new', '-key', p(`${name}.k`), '-subj', `/CN=${cn}/O=Test`, '-out', p(`${name}.csr`));
  ssl('x509', '-req', '-in', p(`${name}.csr`), '-CA', p(`${signer}.crt`), '-CAkey', p(`${signer}.k`), '-set_serial', String(Math.floor(Math.random() * 1e9)), '-days', '36500', '-sha384', '-extfile', p('ext.cnf'), '-extensions', ext, '-out', p(`${name}.crt`));
};
issue('inter', 'root', 'inter', 'Test WWDR G6');
issue('rogue', 'root', 'rogue', 'Rogue Intermediate');
issue('leaf', 'inter', 'leaf', 'Test Receipt Signing');
issue('leaf2', 'rogue', 'leaf', 'Leaf Under Rogue');

const der = (name) => {
  ssl('x509', '-in', p(`${name}.crt`), '-outform', 'DER', '-out', p(`${name}.der`));
  return readFileSync(p(`${name}.der`)).toString('base64');
};
const certs = { root: der('root'), inter: der('inter'), rogue: der('rogue'), leaf: der('leaf'), leaf2: der('leaf2') };

const b64u = (b) => Buffer.from(b).toString('base64url');
const jws = (payload, leafName, chain) => {
  const header = { alg: 'ES256', x5c: chain };
  const input = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(payload))}`;
  const k = createPrivateKey(readFileSync(p(`${leafName}.k`)));
  const sig = sign('sha256', Buffer.from(input), { key: k, dsaEncoding: 'ieee-p1363' });
  return `${input}.${b64u(sig)}`;
};

const signedAt = Date.now() + 5 * 60_000; // after the fresh certificates' start date
const tx = {
  transactionId: '2000000000000001', originalTransactionId: '2000000000000001', bundleId: 'app.ditchsubs.ditch',
  productId: 'test.yearly', purchaseDate: signedAt, originalPurchaseDate: signedAt, expiresDate: signedAt + 7 * 86_400_000,
  type: 'Auto-Renewable Subscription', inAppOwnershipType: 'PURCHASED', signedDate: signedAt, environment: 'Sandbox',
  appAccountToken: '7f0c2a52-8d9e-4b8e-9a51-2a3b4c5d6e7f', offerType: 1, offerDiscountType: 'FREE_TRIAL', price: 0, currency: 'USD',
};
const out = {
  note: 'FAKE test chain made by make-apple-fixtures.mjs. Never trusted outside tests.',
  certs,
  transaction: tx,
  validJws: jws(tx, 'leaf', [certs.leaf, certs.inter, certs.root]),
  rogueJws: jws(tx, 'leaf2', [certs.leaf2, certs.rogue, certs.root]),
  // Leaf certificate swapped: signature made by leaf2's key but leaf's certificate is presented.
  wrongKeyJws: jws(tx, 'leaf2', [certs.leaf, certs.inter, certs.root]),
};
writeFileSync(new URL('./apple-test-chain.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
rmSync(dir, { recursive: true, force: true });
console.log('wrote apple-test-chain.json');
