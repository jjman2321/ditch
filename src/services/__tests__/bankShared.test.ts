import { analyzeBank } from '@/import/bankSync';
import { createBankMock, mergeBankTxns, sampleBankTxns, type SyncedLink } from '../bankShared';

const TODAY = '2026-11-19';
const link = (o: Partial<SyncedLink>): SyncedLink => ({ linkId: 'l1', institutionName: 'Bank', status: 'active', ready: true, added: [], modified: [], removed: [], syncToken: null, ...o });
const t = (id: string, date: string, amountMinor = 1000) => ({ id, date, text: 'NETFLIX.COM', merchantName: 'Netflix', amountMinor, currency: 'USD', pending: false });

describe('mergeBankTxns', () => {
  it('upserts by id, drops removed, keeps ~2 years, newest first', () => {
    const local = [t('a', '2026-10-03'), t('old', '2024-01-01'), t('gone', '2026-11-01')];
    const merged = mergeBankTxns(local, [link({ added: [t('b', '2026-11-03')], modified: [t('a', '2026-10-03', 1100)], removed: ['gone'] })], TODAY);
    expect(merged.map((x) => [x.id, x.amountMinor])).toEqual([
      ['b', 1000],
      ['a', 1100],
    ]);
  });
});

describe('sample bank data (Expo Go / web preview)', () => {
  it('feeds the on-phone engine: finds the repeats and the Spotify price rise', () => {
    const txns = sampleBankTxns(TODAY);
    expect(txns.every((x) => x.date <= TODAY)).toBe(true);
    const r = analyzeBank(txns, [], { handled: [] }, TODAY);
    const names = [...r.added, ...r.suggestions].map((f) => f.catalogId ?? f.name);
    expect(names).toEqual(expect.arrayContaining(['netflix']));
  });

  it('the mock connects, syncs once, and caps at 3 banks', async () => {
    const m = createBankMock(() => TODAY);
    for (let i = 0; i < 3; i++) {
      await m.createLinkToken();
      await m.exchangePublicToken();
    }
    await expect(m.createLinkToken()).rejects.toMatchObject({ code: 'bank_limit' });
    // Update mode (reconnect, a new account at the bank) works on a bank already counted.
    expect(await m.createLinkToken({ mode: 'update', linkId: 'sample-bank-1', newAccounts: true })).toMatchObject({ mode: 'update' });
    const first = await m.syncBank();
    expect(first.links[0].added.length).toBeGreaterThan(10);
    expect((await m.syncBank()).links[0].added).toEqual([]);
    expect((await m.removeBank()).removed).toBe(3);
  });
});
