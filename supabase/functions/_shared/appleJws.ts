// Verifies Apple's signed data (StoreKit 2 transactions, renewal info, and App Store Server
// Notifications V2). Same checks as Apple's own app-store-server-library:
//   1. header alg is ES256 and x5c holds 3 certificates (leaf, intermediate, root)
//   2. the root is Apple Root CA - G3 (pinned by SHA-256 fingerprint of the certificate)
//   3. intermediate is signed by the root, is a CA, and has Apple's WWDR OID 1.2.840.113635.100.6.2.1
//   4. leaf is signed by the intermediate and has Apple's receipt-signing OID 1.2.840.113635.100.6.11.1
//   5. all three certificates are valid at the payload's signedDate (or now)
//   6. the JWS signature checks out with the leaf's key
// It does not do online revocation (OCSP) checks; neither does Apple's library by default.

import { fromBase64 } from './bytes.ts';
import { sha256Hex } from './crypto.ts';
import { decodeJws, verifyEs256 } from './jws.ts';
import { importCertKey, isSignedBy, parseCert, type Cert } from './x509.ts';

/** SHA-256 of Apple Root CA - G3 (https://www.apple.com/certificateauthority/AppleRootCA-G3.cer). */
export const APPLE_ROOT_CA_G3_SHA256 = '63343abfb89a6a03ebb57e9b3f5fa7be7c4f5c756f3017b3a8c488c3653e9179';

const OID_WWDR_INTERMEDIATE = '1.2.840.113635.100.6.2.1';
const OID_RECEIPT_SIGNING_LEAF = '1.2.840.113635.100.6.11.1';
const CLOCK_SKEW_MS = 60_000;

export class AppleJwsError extends Error {}

export type AppleJwsOptions = {
  /** Trusted root fingerprints (lower-case hex SHA-256). Defaults to Apple Root CA - G3. Tests pin a fake root. */
  rootFingerprints?: string[];
  /** Overrides the date used for certificate validity (defaults to payload.signedDate, then now). */
  at?: Date;
};

const validAt = (c: Cert, at: Date) => c.notBefore.getTime() - CLOCK_SKEW_MS <= at.getTime() && at.getTime() <= c.notAfter.getTime() + CLOCK_SKEW_MS;

export async function verifyAppleJws<T = Record<string, unknown>>(jws: string, opts: AppleJwsOptions = {}): Promise<T> {
  let d;
  try {
    d = decodeJws(jws);
  } catch (e) {
    throw new AppleJwsError(`bad jws: ${(e as Error).message}`);
  }
  if (d.header.alg !== 'ES256') throw new AppleJwsError('alg must be ES256');
  const x5c = d.header.x5c;
  if (!Array.isArray(x5c) || x5c.length !== 3 || !x5c.every((c) => typeof c === 'string')) throw new AppleJwsError('x5c must hold 3 certificates');

  const ders = (x5c as string[]).map((c) => fromBase64(c));
  const roots = (opts.rootFingerprints ?? [APPLE_ROOT_CA_G3_SHA256]).map((f) => f.toLowerCase());
  if (!roots.includes(await sha256Hex(ders[2]))) throw new AppleJwsError('root is not Apple Root CA - G3');

  let leaf: Cert, inter: Cert, root: Cert;
  try {
    [leaf, inter, root] = ders.map(parseCert);
  } catch (e) {
    throw new AppleJwsError(`bad certificate: ${(e as Error).message}`);
  }
  if (!inter.isCA || !inter.extensions.has(OID_WWDR_INTERMEDIATE)) throw new AppleJwsError('intermediate is not an Apple WWDR CA');
  if (!leaf.extensions.has(OID_RECEIPT_SIGNING_LEAF)) throw new AppleJwsError('leaf is not an Apple signing certificate');
  if (!(await isSignedBy(inter, root))) throw new AppleJwsError('intermediate not signed by root');
  if (!(await isSignedBy(leaf, inter))) throw new AppleJwsError('leaf not signed by intermediate');

  const payload = d.payload as Record<string, unknown>;
  const signedDate = typeof payload?.signedDate === 'number' ? new Date(payload.signedDate) : null;
  const at = opts.at ?? signedDate ?? new Date();
  if (![leaf, inter, root].every((c) => validAt(c, at))) throw new AppleJwsError('certificate not valid at signing time');

  if (!(await verifyEs256(await importCertKey(leaf), d))) throw new AppleJwsError('bad signature');
  return payload as T;
}

// ---------- Apple payload shapes (only the fields we read) ----------

/** JWSTransactionDecodedPayload. */
export type AppleTransaction = {
  transactionId?: string;
  originalTransactionId?: string;
  bundleId?: string;
  productId?: string;
  purchaseDate?: number;
  originalPurchaseDate?: number;
  expiresDate?: number;
  revocationDate?: number;
  revocationReason?: number;
  type?: string; // 'Auto-Renewable Subscription' | 'Non-Consumable' | ...
  inAppOwnershipType?: string; // 'PURCHASED' | 'FAMILY_SHARED'
  appAccountToken?: string;
  offerType?: number; // 1 introductory, 2 promotional, 3 offer code, 4 win-back
  offerDiscountType?: string; // 'FREE_TRIAL' | 'PAY_AS_YOU_GO' | 'PAY_UP_FRONT'
  price?: number;
  environment?: string; // 'Sandbox' | 'Production'
  signedDate?: number;
};

/** JWSRenewalInfoDecodedPayload. */
export type AppleRenewalInfo = {
  originalTransactionId?: string;
  autoRenewProductId?: string;
  productId?: string;
  autoRenewStatus?: number; // 1 on, 0 off
  expirationIntent?: number;
  gracePeriodExpiresDate?: number;
  isInBillingRetryPeriod?: boolean;
  environment?: string;
  signedDate?: number;
};

/** responseBodyV2DecodedPayload. */
export type AppleNotification = {
  notificationType?: string;
  subtype?: string;
  notificationUUID?: string;
  version?: string;
  signedDate?: number;
  data?: {
    bundleId?: string;
    environment?: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
    status?: number; // 1 active, 2 expired, 3 billing retry, 4 grace period, 5 revoked
  };
  summary?: unknown;
};
