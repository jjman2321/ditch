// Plaid's own bank sign-in sheet (react-native-plaid-link-sdk). Native code, so it only exists in
// builds made after it was added. It's loaded lazily and only if this build has it: importing it at
// the top would crash older TestFlight builds at launch, like the Nov 19 bank-module crash.

import { requireOptionalNativeModule } from 'expo-modules-core';

type Sdk = typeof import('react-native-plaid-link-sdk');

let sdk: Sdk | null | undefined;
function load(): Sdk | null {
  if (sdk !== undefined) return sdk;
  if (!requireOptionalNativeModule('ReactNativePlaidLinkSdk')) return (sdk = null);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sdk = require('react-native-plaid-link-sdk') as Sdk;
  return sdk;
}

/** True when this build can show Plaid's sign-in. */
export const PLAID_READY = () => load() !== null;

export type LinkResult = { status: 'success'; publicToken: string; accounts: string | null } | { status: 'exit'; errorCode: string | null; message: string | null };

/**
 * Opens Plaid's sign-in with a Link token from our server and waits for the person to finish or
 * close it. Success hands back the one-time public token (exchanged on our server, never stored).
 */
export async function openPlaidLink(token: string): Promise<LinkResult> {
  const s = load();
  if (!s) throw new Error('needs_new_build');
  return new Promise<LinkResult>((resolve, reject) => {
    s.createPlaidLinkSession({
      token,
      onSuccess: (x) =>
        resolve({
          status: 'success',
          publicToken: x.publicToken,
          // "Checking ending 1005 · Visa ending 4821", for Settings → Bank connections.
          accounts: x.metadata.accounts.length ? x.metadata.accounts.map((a) => `${a.name}${a.mask ? ` ending ${a.mask}` : ''}`).join(' · ') : null,
        }),
      onExit: (x) => resolve({ status: 'exit', errorCode: x.error?.errorCode ?? null, message: x.error?.displayMessage ?? null }),
      onEvent: () => {},
    })
      .then((session) => session.open())
      .catch(reject);
  });
}
