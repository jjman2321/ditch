import { makeSub } from '@/domain/subs';
import { analyzeBank, rememberHandled, type BankTxn } from '../bankSync';

const TODAY = '2026-11-19';
let n = 0;
const tx = (date: string, text: string, amountMinor: number, extra: Partial<BankTxn> = {}): BankTxn => ({ id: `t${n++}`, date, text, amountMinor, currency: 'USD', ...extra });

describe('analyzeBank', () => {
  it('auto-adds a known service that repeats, once', () => {
    const txns = [tx('2026-09-03', 'NETFLIX.COM 866-579-7172 CA', 1799), tx('2026-10-03', 'NETFLIX.COM 866-579-7172 CA', 1799), tx('2026-11-03', 'NETFLIX.COM', 1799)];
    const r = analyzeBank(txns, [], { handled: [] }, TODAY);
    expect(r.added.map((f) => f.catalogId)).toEqual(['netflix']);
    expect(r.added[0].date).toBe('2026-12-03');
    // Handled once: never added again.
    const again = analyzeBank(
      txns,
      [],
      rememberHandled(
        { handled: [] },
        r.added.map((f) => f.key),
      ),
      TODAY,
    );
    expect(again.added).toEqual([]);
  });

  it('does not add something already on the list, and ignores pending and duplicate charges', () => {
    const sub = makeSub({ name: 'Netflix', catalogId: 'netflix', cycle: 'monthly', anchor: '2026-12-03', dateSource: 'next', amountMinor: 1799, currency: 'USD' });
    const t = tx('2026-11-03', 'NETFLIX.COM', 1799);
    const txns = [tx('2026-10-03', 'NETFLIX.COM', 1799), t, { ...t }, tx('2026-11-18', 'NETFLIX.COM', 1799, { pending: true })];
    const r = analyzeBank(txns, [sub], { handled: [] }, TODAY);
    expect(r.added).toEqual([]);
    expect(r.priceChanges).toEqual([]);
  });

  it('keeps unsure repeats as suggestions, not auto-adds', () => {
    const txns = [tx('2026-09-10', 'BLUE APRON MEALS', 6000), tx('2026-10-10', 'BLUE APRON MEALS', 6000)];
    const r = analyzeBank(txns, [], { handled: [] }, TODAY);
    expect(r.added).toEqual([]);
    expect(r.suggestions.length).toBe(1);
  });

  it('spots a charge, a price change and a subscription that looks cancelled', () => {
    const spotify = makeSub({ name: 'Spotify', catalogId: 'spotify', cycle: 'monthly', anchor: '2026-12-15', dateSource: 'next', amountMinor: 1199, currency: 'USD' });
    const hulu = makeSub({ name: 'Hulu', catalogId: 'hulu', cycle: 'monthly', anchor: '2026-11-01', dateSource: 'next', amountMinor: 999, currency: 'USD' });
    const txns = [tx('2026-10-15', 'SPOTIFY USA', 1199), tx('2026-11-15', 'SPOTIFY USA', 1299), tx('2026-09-01', 'HULU 877-8244858 CA', 999), tx('2026-10-01', 'HULU', 999)];
    const r = analyzeBank(txns, [spotify, hulu], { handled: [] }, TODAY);
    expect(r.charged).toEqual([{ subId: spotify.id, date: '2026-11-15', amountMinor: 1299, currency: 'USD' }]);
    expect(r.priceChanges).toEqual([{ subId: spotify.id, fromMinor: 1199, toMinor: 1299, currency: 'USD', date: '2026-11-15' }]);
    // Hulu last charged Oct 1, was due Nov 1, and it's Nov 19: more than a week late.
    expect(r.lookCancelled).toEqual([{ subId: hulu.id, expected: '2026-11-01', lastSeen: '2026-10-01' }]);
  });

  it('says nothing about subscriptions paid from somewhere else', () => {
    const disney = makeSub({ name: 'Disney+', catalogId: 'disney-plus', cycle: 'monthly', anchor: '2026-12-01', dateSource: 'next', amountMinor: 1599, currency: 'USD' });
    const r = analyzeBank([tx('2026-11-03', 'NETFLIX.COM', 1799)], [disney], { handled: [] }, TODAY);
    expect(r.lookCancelled).toEqual([]);
    expect(r.charged).toEqual([]);
  });
});
