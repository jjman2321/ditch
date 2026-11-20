// Web preview only: no Keychain, no bank sign-in, no server. Same API as bank.ts with
// sample data, so screens can be laid out and screenshotted.

import { today } from './clock';
import { createBankMock, type BankSyncResponse, type EntitlementSyncResponse, type LinkTokenRequest } from './bankShared';

export * from './bankShared';

export const BANK_LIVE = false;

const mock = createBankMock(today);

export async function getAppUserId(): Promise<string> {
  return '00000000-0000-4000-8000-000000000000';
}
export function syncEntitlements(_transactions: string[], _renewals: string[] = []): Promise<EntitlementSyncResponse> {
  return mock.syncEntitlements();
}
export const listBanks = () => mock.listBanks();
export const createLinkToken = (opts?: LinkTokenRequest) => mock.createLinkToken(opts);
export const exchangePublicToken = (_publicToken: string, _provider?: 'plaid' | 'stripe') => mock.exchangePublicToken();
export const syncBank = (_linkId?: string, _repaired?: string): Promise<BankSyncResponse> => mock.syncBank();
export async function confirmBankSync(_res: BankSyncResponse): Promise<void> {}
export const removeBank = (linkId?: string) => mock.removeBank(linkId);
