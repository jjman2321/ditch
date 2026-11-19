// A small, read-only X.509 (DER) reader: just enough to check Apple's certificate chain
// with WebCrypto. It never trusts anything on its own; appleJws.ts decides what's trusted.
// No dependencies, so it runs in Deno and in Jest.

type Tlv = { tag: number; start: number; end: number; valueStart: number };

function readTlv(b: Uint8Array, at: number): Tlv {
  if (at + 2 > b.length) throw new Error('asn1: truncated');
  const tag = b[at];
  let len = b[at + 1];
  let p = at + 2;
  if (len & 0x80) {
    const n = len & 0x7f;
    if (n === 0 || n > 4) throw new Error('asn1: bad length');
    len = 0;
    for (let i = 0; i < n; i++) len = len * 256 + b[p++];
  }
  const end = p + len;
  if (end > b.length) throw new Error('asn1: length past end');
  return { tag, start: at, end, valueStart: p };
}

function children(b: Uint8Array, parent: Tlv): Tlv[] {
  const out: Tlv[] = [];
  let p = parent.valueStart;
  while (p < parent.end) {
    const t = readTlv(b, p);
    out.push(t);
    p = t.end;
  }
  return out;
}

function oidString(b: Uint8Array, t: Tlv): string {
  if (t.tag !== 0x06) throw new Error('asn1: expected OID');
  const v = b.subarray(t.valueStart, t.end);
  const parts: number[] = [Math.floor(v[0] / 40), v[0] % 40];
  let n = 0;
  for (let i = 1; i < v.length; i++) {
    n = n * 128 + (v[i] & 0x7f);
    if (!(v[i] & 0x80)) {
      parts.push(n);
      n = 0;
    }
  }
  return parts.join('.');
}

function parseTime(b: Uint8Array, t: Tlv): Date {
  const s = new TextDecoder().decode(b.subarray(t.valueStart, t.end));
  let m: RegExpMatchArray | null;
  if (t.tag === 0x17 && (m = s.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/))) {
    const yy = Number(m[1]);
    return new Date(Date.UTC(yy < 50 ? 2000 + yy : 1900 + yy, Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6])));
  }
  if (t.tag === 0x18 && (m = s.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/))) {
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6])));
  }
  throw new Error('asn1: bad time');
}

export type Cert = {
  der: Uint8Array<ArrayBuffer>;
  tbs: Uint8Array<ArrayBuffer>;
  /** ecdsa-with-SHA256 / 384 / 512, as a WebCrypto hash name. */
  sigHash: 'SHA-256' | 'SHA-384' | 'SHA-512';
  /** The signature as DER (SEQUENCE of r, s). */
  sigDer: Uint8Array;
  issuer: Uint8Array;
  subject: Uint8Array;
  notBefore: Date;
  notAfter: Date;
  spki: Uint8Array<ArrayBuffer>;
  curve: 'P-256' | 'P-384' | 'P-521';
  extensions: Map<string, Uint8Array>;
  isCA: boolean;
};

const SIG_HASH: Record<string, Cert['sigHash']> = {
  '1.2.840.10045.4.3.2': 'SHA-256',
  '1.2.840.10045.4.3.3': 'SHA-384',
  '1.2.840.10045.4.3.4': 'SHA-512',
};
const CURVES: Record<string, Cert['curve']> = {
  '1.2.840.10045.3.1.7': 'P-256',
  '1.3.132.0.34': 'P-384',
  '1.3.132.0.35': 'P-521',
};
const EC_PUBLIC_KEY = '1.2.840.10045.2.1';
const BASIC_CONSTRAINTS = '2.5.29.19';

export function parseCert(der: Uint8Array): Cert {
  const bytes = new Uint8Array(der);
  const root = readTlv(bytes, 0);
  const [tbsT, algT, sigT] = children(bytes, root);
  if (!tbsT || !algT || !sigT || sigT.tag !== 0x03) throw new Error('x509: bad certificate');
  const sigHash = SIG_HASH[oidString(bytes, children(bytes, algT)[0])];
  if (!sigHash) throw new Error('x509: unsupported signature algorithm');

  const tbsKids = children(bytes, tbsT);
  let i = tbsKids[0].tag === 0xa0 ? 1 : 0; // optional [0] version
  i++; // serial
  i++; // signature algorithm (repeated)
  const issuerT = tbsKids[i++];
  const validity = children(bytes, tbsKids[i++]);
  const subjectT = tbsKids[i++];
  const spkiT = tbsKids[i++];
  const [spkiAlg] = children(bytes, spkiT);
  const [keyOid, curveOid] = children(bytes, spkiAlg);
  if (oidString(bytes, keyOid) !== EC_PUBLIC_KEY) throw new Error('x509: not an EC key');
  const curve = CURVES[oidString(bytes, curveOid)];
  if (!curve) throw new Error('x509: unsupported curve');

  const extensions = new Map<string, Uint8Array>();
  let isCA = false;
  for (const t of tbsKids.slice(i)) {
    if (t.tag !== 0xa3) continue;
    for (const ext of children(bytes, children(bytes, t)[0])) {
      const parts = children(bytes, ext);
      const id = oidString(bytes, parts[0]);
      const value = parts[parts.length - 1];
      const inner = bytes.subarray(value.valueStart, value.end);
      extensions.set(id, inner);
      if (id === BASIC_CONSTRAINTS) {
        const seq = readTlv(inner, 0);
        const first = seq.valueStart < seq.end ? readTlv(inner, seq.valueStart) : null;
        isCA = !!first && first.tag === 0x01 && inner[first.valueStart] !== 0;
      }
    }
  }

  return {
    der: bytes,
    tbs: bytes.slice(tbsT.start, tbsT.end),
    sigHash,
    sigDer: bytes.subarray(sigT.valueStart + 1, sigT.end), // skip the "unused bits" byte
    issuer: bytes.slice(issuerT.start, issuerT.end),
    subject: bytes.slice(subjectT.start, subjectT.end),
    notBefore: parseTime(bytes, validity[0]),
    notAfter: parseTime(bytes, validity[1]),
    spki: bytes.slice(spkiT.start, spkiT.end),
    curve,
    extensions,
    isCA,
  };
}

const CURVE_BYTES: Record<Cert['curve'], number> = { 'P-256': 32, 'P-384': 48, 'P-521': 66 };

/** DER ECDSA signature (SEQUENCE { r, s }) -> the raw r||s WebCrypto wants. */
export function derSigToRaw(sig: Uint8Array, curve: Cert['curve']): Uint8Array<ArrayBuffer> {
  const size = CURVE_BYTES[curve];
  const seq = readTlv(sig, 0);
  const [r, s] = children(sig, seq);
  const out = new Uint8Array(size * 2);
  const put = (t: Tlv, off: number) => {
    let v = sig.subarray(t.valueStart, t.end);
    while (v.length > size && v[0] === 0) v = v.subarray(1);
    if (v.length > size) throw new Error('x509: bad signature integer');
    out.set(v, off + size - v.length);
  };
  put(r, 0);
  put(s, size);
  return out;
}

export function importCertKey(cert: Cert): Promise<CryptoKey> {
  return crypto.subtle.importKey('spki', cert.spki, { name: 'ECDSA', namedCurve: cert.curve }, false, ['verify']);
}

/** Was `child` signed by `parent`'s key, and does its issuer name match the parent's subject? */
export async function isSignedBy(child: Cert, parent: Cert): Promise<boolean> {
  if (!sameBytes(child.issuer, parent.subject)) return false;
  const key = await importCertKey(parent);
  return crypto.subtle.verify({ name: 'ECDSA', hash: child.sigHash }, key, derSigToRaw(child.sigDer, parent.curve), child.tbs);
}

export function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
