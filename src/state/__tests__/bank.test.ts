import { bankRegion } from '@/config/features';
import { makeSub, type Sub } from '@/domain/subs';
import { practiceSync, sampleBankTxns, type BankSyncResponse, type ServerTxn } from '@/services/bankShared';

import {
  FOUND_TAG_DAYS,
  addLink,
  answerSuggestion,
  applySync,
  bankToKv,
  canAddLink,
  clearNewAccounts,
  dismiss,
  emptyBank,
  findTotals,
  foundTagShows,
  laterLink,
  laterNewAccounts,
  linkStatusWords,
  NEW_ACCOUNTS_LATER_DAYS,
  parseBank,
  rememberKeys,
  removeLink,
  spokenMoney,
  syncCards,
  undoFind,
  type BankState,
} from '../bankLogic';

const TODAY = '2026-11-19';
const NOW = '2026-11-19T09:41:00.000Z';
const OPTS = { today: TODAY, nowIso: NOW, country: 'US', currency: 'USD' };

const chase = (s: BankState = emptyBank()) => addLink(s, { id: 'l1', bankId: 'chase', name: 'Chase', status: 'active', accounts: null, connectedOn: TODAY });
const res = (added: ServerTxn[], extra: Partial<BankSyncResponse['links'][number]> = {}): BankSyncResponse => ({
  links: [{ linkId: 'l1', institutionName: 'Chase', status: 'active', ready: true, added, modified: [], removed: [], syncToken: null, ...extra }],
});
let n = 0;
const t = (date: string, text: string, amountMinor: number): ServerTxn => ({ id: `t${n++}`, date, text, merchantName: null, amountMinor, currency: 'USD', pending: false });

/** The list after a sync: what was there plus what the sync added. */
const withAdded = (subs: Sub[], added: Sub[]) => [...subs, ...added];

describe('applySync', () => {
  it('adds the sure finds on their own, marked found today, and queues the unsure ones', () => {
    const { state, added } = applySync(chase(), res(sampleBankTxns(TODAY)), [], OPTS);
    expect(added.map((s) => s.catalogId).sort()).toEqual(['chatgpt-plus', 'hulu', 'max', 'netflix', 'spotify']);
    expect(added.every((s) => s.source === 'import' && s.foundInBankOn === TODAY && s.status === 'active')).toBe(true);
    // Unknown repeats are only asked about.
    expect(state.suggestions.map((f) => f.name).sort()).toEqual(['Blue Apron', 'Corner Yoga Studio']);
    expect(state.finds).toHaveLength(5);
    expect(state.links[0].checkedAt).toBe(NOW);
    // The headline number: Netflix + Spotify + ChatGPT + Hulu + Max, a year.
    expect(findTotals(state.finds)).toEqual([{ currency: 'USD', yearlyMinor: (1799 + 1199 + 2000 + 999 + 1699) * 12 }]);
  });

  it('never adds the same thing twice, and Undo means it never comes back', () => {
    const first = applySync(chase(), res(sampleBankTxns(TODAY)), [], OPTS);
    const netflix = first.added.find((s) => s.catalogId === 'netflix')!;
    // Undo: the sub is deleted from the list; its key stays remembered.
    const undone = undoFind(first.state, netflix.id);
    const list = first.added.filter((s) => s.id !== netflix.id);
    const again = applySync(undone, res([t('2026-11-18', 'NETFLIX.COM', 1799)]), list, OPTS);
    expect(again.added).toEqual([]);
    expect(again.state.finds.find((f) => f.subId === netflix.id)?.undone).toBe(true);
  });

  it('in onboarding keeps the finds for the results screen only, and remembers them at "Looks right"', () => {
    const { state, added } = applySync(chase(), res(sampleBankTxns(TODAY)), [], { ...OPTS, autoAdd: false });
    expect(added).toEqual([]);
    expect(state.finds).toHaveLength(5);
    expect(state.memory.handled).toEqual([]);
    // Left early: the next check (after onboarding) still adds them, with no duplicate finds.
    const later = applySync(state, res([]), [], OPTS);
    expect(later.added).toHaveLength(5);
    expect(later.state.finds).toHaveLength(5);
    // Or "Looks right": nothing is offered again.
    const done = rememberKeys(
      state,
      state.finds.map((f) => f.key),
    );
    expect(applySync(done, res([]), [], OPTS).added).toEqual([]);
  });

  it('asks before adding an unsure one; No is remembered too', () => {
    const { state } = applySync(chase(), res(sampleBankTxns(TODAY)), [], OPTS);
    const [yoga, apron] = state.suggestions;
    const yes = answerSuggestion(state, yoga.key, true, OPTS);
    expect(yes.sub?.foundInBankOn).toBe(TODAY);
    expect(yes.sub?.amountMinor).toBe(yoga.price?.amountMinor);
    const no = answerSuggestion(yes.state, apron.key, false, OPTS);
    expect(no.sub).toBeNull();
    expect(no.state.suggestions).toEqual([]);
    expect(no.state.memory.handled).toEqual(expect.arrayContaining([yoga.key, apron.key]));
    expect(syncCards(no.state, [], TODAY).some((c) => c.kind === 'check')).toBe(false);
  });
});

describe('Home sync cards', () => {
  const netflix = makeSub({ id: 'nflx', name: 'Netflix', catalogId: 'netflix', cycle: 'monthly', anchor: '2026-12-10', dateSource: 'next', amountMinor: 1799, currency: 'USD' });
  const hulu = makeSub({ id: 'hulu', name: 'Hulu', catalogId: 'hulu', cycle: 'monthly', anchor: '2026-12-12', dateSource: 'next', amountMinor: 999, currency: 'USD' });
  const subs = [netflix, hulu];
  const base = () => applySync(chase(), res(sampleBankTxns(TODAY)), subs, OPTS);

  it('a price change is a card, never a silent change; Update or "one-off" clears it', () => {
    const b = base();
    const list = withAdded(subs, b.added);
    const r = applySync(b.state, practiceSync('price', b.state.links, TODAY, 1), list, OPTS);
    expect(r.added).toEqual([]);
    const card = syncCards(r.state, list, TODAY).find((c) => c.kind === 'price');
    expect(card).toMatchObject({ kind: 'price', change: { subId: 'nflx', fromMinor: 1799, toMinor: 2299, date: TODAY }, bank: 'Chase' });
    // The list still says $17.99 until a tap.
    expect(list.find((s) => s.id === 'nflx')!.amountMinor).toBe(1799);
    const updated = list.map((s) => (s.id === 'nflx' ? { ...s, amountMinor: 2299 } : s));
    expect(syncCards(r.state, updated, TODAY).some((c) => c.kind === 'price')).toBe(false);
    expect(syncCards(dismiss(r.state, card!.key), list, TODAY).some((c) => c.kind === 'price')).toBe(false);
  });

  it('"looks cancelled" after the missed date plus a week, never ditched on its own', () => {
    const b = base();
    const list = withAdded(subs, b.added);
    const r = applySync(b.state, practiceSync('cancelled', b.state.links, TODAY, 1), list, OPTS);
    const card = syncCards(r.state, list, TODAY).find((c) => c.kind === 'cancelled');
    expect(card).toMatchObject({ kind: 'cancelled', sub: { id: 'hulu', status: 'active' }, gone: { lastSeen: '2026-10-10', expected: '2026-11-10' } });
    // Ditched (by a tap): the card goes.
    const ditched = list.map((s) => (s.id === 'hulu' ? { ...s, status: 'ditched-pending' as const } : s));
    expect(syncCards(r.state, ditched, TODAY).some((c) => c.kind === 'cancelled')).toBe(false);
  });

  it('one at a time, in order: reconnect > price > looks cancelled > check these > trial recap', () => {
    const b = base();
    let list = withAdded(subs, b.added);
    let s = applySync(b.state, practiceSync('price', b.state.links, TODAY, 1), list, OPTS).state;
    s = applySync(s, practiceSync('cancelled', s.links, TODAY, 2), list, OPTS).state;
    s = applySync(s, practiceSync('relogin', s.links, TODAY, 3), list, OPTS).state;
    // A Ditch Pro trial ending in 2 days: day 5 of 7.
    const kinds = syncCards(s, list, TODAY, '2026-11-21').map((c) => c.kind);
    expect(kinds).toEqual(['reconnect', 'price', 'cancelled', 'check', 'recap']);
    // "Later" hides the reconnect card for 3 days, then it's back.
    const later = laterLink(s, 'l1', TODAY);
    expect(syncCards(later, list, TODAY)[0].kind).toBe('price');
    expect(syncCards(later, list, '2026-11-22')[0].kind).toBe('reconnect');
    // Signed back in: gone.
    s = applySync(s, practiceSync('back', s.links, TODAY, 4), list, OPTS).state;
    list = list.map((x) => x);
    expect(syncCards(s, list, TODAY)[0].kind).toBe('price');
  });

  it('the trial recap shows from day 5 only, with real counts and the price rise it caught', () => {
    const b = base();
    const list = withAdded(subs, b.added);
    const s = applySync(b.state, practiceSync('price', b.state.links, TODAY, 1), list, OPTS).state;
    expect(syncCards(s, list, TODAY, '2026-11-24').some((c) => c.kind === 'recap')).toBe(false); // day 2
    const recap = syncCards(s, list, TODAY, '2026-11-21').find((c) => c.kind === 'recap');
    expect(recap).toMatchObject({ found: b.added.length, bank: 'Chase', caught: { name: 'Netflix', deltaMinor: 500 } });
    expect(syncCards(dismiss(s, recap!.key), list, TODAY, '2026-11-21').some((c) => c.kind === 'recap')).toBe(false);
  });
});

describe('New account at the bank (Plaid NEW_ACCOUNTS_AVAILABLE)', () => {
  const netflix = makeSub({ id: 'nflx', name: 'Netflix', catalogId: 'netflix', cycle: 'monthly', anchor: '2026-12-10', dateSource: 'next', amountMinor: 1799, currency: 'USD' });
  const hulu = makeSub({ id: 'hulu', name: 'Hulu', catalogId: 'hulu', cycle: 'monthly', anchor: '2026-12-12', dateSource: 'next', amountMinor: 999, currency: 'USD' });
  const subs = [netflix, hulu];
  const base = () => applySync(chase(), res(sampleBankTxns(TODAY)), subs, OPTS);
  const kinds = (s: BankState, list: Sub[], today = TODAY, trialEnds: string | null = null) => syncCards(s, list, today, trialEnds).map((c) => c.kind);

  it('applySync takes the flag from the server; a server that says nothing keeps what the phone had', () => {
    const b = base();
    const on = applySync(b.state, practiceSync('newaccounts', b.state.links, TODAY, 1), subs, OPTS).state;
    expect(on.links[0]).toMatchObject({ newAccounts: true, newAccountsLaterUntil: null });
    // Older server / practice bank: no newAccounts in the entry.
    expect(applySync(on, res([]), subs, OPTS).state.links[0].newAccounts).toBe(true);
    // Cleared on the server: gone, and "Not now" is forgotten with it.
    const hidden = laterNewAccounts(on, 'l1', TODAY);
    const off = applySync(hidden, res([], { newAccounts: false }), subs, OPTS).state;
    expect(off.links[0]).toMatchObject({ newAccounts: false, newAccountsLaterUntil: null });
    // A link that never had it isn't touched.
    expect('newAccounts' in applySync(chase(), res([]), subs, OPTS).state.links[0]).toBe(false);
  });

  it('ranks right after reconnect: reconnect > new account > price > looks cancelled > check these > trial recap', () => {
    const b = base();
    const list = withAdded(subs, b.added);
    // A second bank that needs a sign-in, so both bank cards can wait at once.
    let s = addLink(b.state, { id: 'l2', bankId: 'amex', name: 'Amex', status: 'active', accounts: null, connectedOn: TODAY });
    s = applySync(s, practiceSync('price', s.links, TODAY, 1), list, OPTS).state;
    s = applySync(s, practiceSync('cancelled', s.links, TODAY, 2), list, OPTS).state;
    s = applySync(s, practiceSync('newaccounts', s.links, TODAY, 3), list, OPTS).state;
    s = applySync(s, { links: [{ linkId: 'l2', institutionName: 'Amex', status: 'needs_relogin', ready: true, added: [], modified: [], removed: [], syncToken: null }] }, list, OPTS).state;
    expect(kinds(s, list, TODAY, '2026-11-21')).toEqual(['reconnect', 'newAccounts', 'price', 'cancelled', 'check', 'recap']);
    const card = syncCards(s, list, TODAY)[1];
    expect(card).toMatchObject({ kind: 'newAccounts', key: 'bank-newaccounts:l1', link: { id: 'l1', name: 'Chase' } });
    // Home shows the first: with the reconnect put off, the new-account card is on top.
    expect(kinds(laterLink(s, 'l2', TODAY), list)[0]).toBe('newAccounts');
  });

  it('"Not now" hides it for 30 days, then it\'s back; adding it clears it for good', () => {
    const b = base();
    const s = applySync(b.state, practiceSync('newaccounts', b.state.links, TODAY, 1), subs, OPTS).state;
    expect(kinds(s, subs)).toContain('newAccounts');
    expect(NEW_ACCOUNTS_LATER_DAYS).toBe(30);
    const later = laterNewAccounts(s, 'l1', TODAY);
    expect(later.links[0].newAccountsLaterUntil).toBe('2026-12-19');
    expect(kinds(later, subs)).not.toContain('newAccounts');
    expect(kinds(later, subs, '2026-12-18')).not.toContain('newAccounts');
    expect(kinds(later, subs, '2026-12-19')).toContain('newAccounts');
    // Added (update mode with Account Select): gone, and the bank's accounts line is updated when Plaid says.
    const added = clearNewAccounts(s, 'l1', 'Checking ending 1005 · Savings ending 2231');
    expect(added.links[0]).toMatchObject({ newAccounts: false, newAccountsLaterUntil: null, accounts: 'Checking ending 1005 · Savings ending 2231' });
    expect(kinds(added, subs)).not.toContain('newAccounts');
    expect(clearNewAccounts(s, 'l1', null).links[0].accounts).toBe(s.links[0].accounts);
    // It's saved with the bank.
    expect(parseBank(bankToKv(later)).links[0]).toEqual(later.links[0]);
  });

  it('hidden while the same bank needs a sign-in: Reconnect first, then the new account', () => {
    const b = base();
    let s = applySync(b.state, practiceSync('newaccounts', b.state.links, TODAY, 1), subs, OPTS).state;
    s = applySync(s, practiceSync('relogin', s.links, TODAY, 2), subs, OPTS).state;
    expect(s.links[0]).toMatchObject({ status: 'needs_relogin', newAccounts: true });
    expect(kinds(s, subs)).toEqual(['reconnect', 'check']);
    // "Later" on the reconnect card doesn't let the new-account card through either.
    expect(kinds(laterLink(s, 'l1', TODAY), subs)).toEqual(['check']);
    // Signed back in: now the new account shows.
    s = applySync(s, practiceSync('back', s.links, TODAY, 3), subs, OPTS).state;
    expect(kinds(s, subs)[0]).toBe('newAccounts');
  });
});

describe('FOUND IN YOUR BANK tag', () => {
  it('shows for 7 days from the day it was added', () => {
    expect(FOUND_TAG_DAYS).toBe(7);
    expect(foundTagShows({ foundInBankOn: '2026-11-19' }, '2026-11-19')).toBe(true);
    expect(foundTagShows({ foundInBankOn: '2026-11-19' }, '2026-11-25')).toBe(true);
    expect(foundTagShows({ foundInBankOn: '2026-11-19' }, '2026-11-26')).toBe(false);
    expect(foundTagShows({ foundInBankOn: null }, '2026-11-19')).toBe(false);
    expect(foundTagShows({}, '2026-11-19')).toBe(false);
  });
});

describe('links', () => {
  it('caps at 3; disconnecting drops that bank’s charges and questions, never the list', () => {
    let s = chase();
    s = addLink(s, { id: 'l2', bankId: 'amex', name: 'Amex', status: 'active', accounts: null, connectedOn: TODAY });
    expect(canAddLink(s)).toBe(true);
    s = addLink(s, { id: 'l3', bankId: 'citi', name: 'Citi', status: 'active', accounts: null, connectedOn: TODAY });
    expect(canAddLink(s)).toBe(false);
    s = applySync(s, res(sampleBankTxns(TODAY)), [], OPTS).state;
    const gone = removeLink(s, 'l1');
    expect(gone.links.map((l) => l.id)).toEqual(['l2', 'l3']);
    expect(gone.txns).toEqual([]);
    expect(gone.suggestions).toEqual([]);
    // Finds (and so the subs on the list) stay.
    expect(gone.finds).toHaveLength(5);
    expect(removeLink(s).links).toEqual([]);
  });

  it('status in words', () => {
    const l = chase().links[0];
    const now = new Date('2026-11-19T11:41:00.000Z');
    expect(linkStatusWords({ ...l, checkedAt: '2026-11-19T09:41:00.000Z' }, now)).toEqual({ text: 'Checked 2 hours ago', tone: 'ok' });
    expect(linkStatusWords({ ...l, status: 'needs_relogin' }, now)).toEqual({ text: 'Needs sign-in', tone: 'warn' });
  });
});

describe('saving', () => {
  it('round-trips, saves only what changed, and survives broken values', () => {
    const s = applySync(chase(), res(sampleBankTxns(TODAY)), [], OPTS).state;
    const back = parseBank(bankToKv(s));
    expect(back).toEqual(s);
    const next = dismiss(s, 'x');
    expect(Object.keys(bankToKv(next, s))).toEqual(['dismissed']);
    expect(parseBank({ links: '{nope', memory: '[]', txns: '"x"' })).toEqual(emptyBank());
  });
});

describe('gating and words', () => {
  it('bank sync is US and Canada only; the web preview counts as the US', () => {
    expect(bankRegion('US', 'USD', false)).toBe(true);
    expect(bankRegion('CA', 'CAD', false)).toBe(true);
    expect(bankRegion('GB', 'GBP', false)).toBe(false);
    expect(bankRegion('GB', 'USD', true)).toBe(false);
    expect(bankRegion(null, 'GBP', true)).toBe(true);
    expect(bankRegion(null, 'USD', false)).toBe(true);
    expect(bankRegion(null, 'EUR', false)).toBe(false);
  });

  it('VoiceOver hears money in words', () => {
    expect(spokenMoney(1799, 'USD')).toBe('17 dollars 99');
    expect(spokenMoney(2000, 'USD')).toBe('20 dollars');
    expect(spokenMoney(100, 'USD')).toBe('1 dollar');
    expect(spokenMoney(999, 'CAD')).toBe('9 Canadian dollars 99');
  });
});
