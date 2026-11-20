// Bank sync state (DECISIONS #67, #70): connected banks, the charges the phone keeps, what
// was handled, and the Home cards. Saved in SQLite (bank_state, migration 5). The rules live in
// bankLogic.ts; this file loads, saves, talks to the bank service and touches the list.
//
// Without EXPO_PUBLIC_API_URL (TestFlight today, Expo Go, the web preview) the bank service is
// the mock in services/bankShared.ts: a practice bank with sample charges. The bank sign-in is
// then a practice sheet (src/app/bank/signin.tsx), clearly labelled as a test.
//
// Checks run on app open and when the app comes back to the front. No polling loops.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { PLAID_READY, openPlaidLink } from '@/services/plaidLink';

import { bankEntry, type BankEntry } from '@/bank/banks';
import { showBankSync } from '@/config/features';
import { openRepo } from '@/db/open';
import { webParam } from '@/dev/webParams';
import { addDays, type DateOnly } from '@/domain/dates';
import { runningProTrial, type Sub } from '@/domain/subs';
import * as bank from '@/services/bank';
import { today as clockToday } from '@/services/clock';
import { useApp } from '@/state/app';
import { proTrialSub } from '@/state/fromOnboarding';

import {
  MAX_LINKS,
  addLink,
  answerSuggestion,
  applySync,
  bankToKv,
  dismiss,
  emptyBank,
  laterLink,
  parseBank,
  priceKey,
  redoFind,
  rememberKeys,
  removeLink,
  setLinkStatus,
  syncCards,
  undoFind,
  type BankLink,
  type BankState,
  type SyncCard,
} from './bankLogic';

export type BankToast = { id: string; subId: string; name: string; amountMinor: number | null; currency: string | null; cycle: Sub['cycle'] };

type BankValue = {
  ready: boolean;
  /** Bank sync is shown at all (test builds, US/Canada). */
  on: boolean;
  /** A real server is set up (false: the practice bank). */
  live: boolean;
  state: BankState;
  /** The latest state right now (for a screen that awaited a sync). */
  stateRef: () => BankState;
  maxLinks: number;
  /** Waiting Home cards, most important first. Home shows the first. */
  cards: SyncCard[];
  toast: BankToast | null;
  syncing: boolean;
  /** After the bank sign-in succeeds: saves the connection. Throws a BankApiError on failure (e.g. bank_limit). */
  connect: (b: BankEntry) => Promise<BankLink>;
  /** New charges from every bank, read on the phone. `onboarding`: keep the finds for the results screen only. */
  runSync: (opts?: { toast?: boolean; onboarding?: boolean }) => Promise<{ added: Sub[] }>;
  reconnect: (linkId: string) => Promise<void>;
  later: (linkId: string) => Promise<void>;
  disconnect: (linkId?: string) => Promise<void>;
  /** Undo an auto-add: the sub goes and never comes back. */
  undo: (subId: string) => Promise<void>;
  /** Tick it again (results screen). */
  redo: (sub: Sub) => Promise<void>;
  /** Yes / No on an unsure find. `toList: false` (onboarding) returns the sub without saving it. */
  answer: (key: string, yes: boolean, opts?: { toList?: boolean }) => Promise<Sub | null>;
  dismissCard: (key: string) => Promise<void>;
  dismissToast: () => void;
  /** The results screen shows the new finds itself: no toasts for them. */
  quietToasts: () => void;
  /** Onboarding's "Looks right": never offer these again. */
  remember: (keys: string[]) => Promise<void>;
  /** Test builds only: what the practice bank sends next. */
  practice: (kind: bank.PracticeEvent) => Promise<void>;
  /** "Delete all my data": disconnect every bank and forget everything. */
  wipe: () => Promise<void>;
};

const Ctx = createContext<BankValue | null>(null);

/**
 * Plaid's sign-in sheet. Closed without finishing: 'link_closed' (the screen shows "didn't finish").
 * This build has no Plaid code yet: 'needs_new_build'.
 */
async function signIn(linkToken: string): Promise<{ publicToken: string; accounts: string | null }> {
  if (!PLAID_READY()) throw new bank.BankApiError(0, 'needs_new_build', 'Bank sync needs the newest Ditch build.');
  const r = await openPlaidLink(linkToken);
  if (r.status === 'exit') throw new bank.BankApiError(0, r.errorCode ? 'link_failed' : 'link_closed', r.message ?? undefined);
  return r;
}

export function BankProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const appRef = useRef(app);
  useEffect(() => {
    appRef.current = app;
  }, [app]);
  const on = showBankSync(app.settings.country, app.settings.currency);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<BankState>(emptyBank);
  const ref = useRef(state);
  const [toasts, setToasts] = useState<BankToast[]>([]);
  const [syncing, setSyncing] = useState(false);
  const inFlight = useRef<Promise<{ added: Sub[] }> | null>(null);

  /** Save only what changed, then show it. */
  const put = useCallback(async (next: BankState) => {
    const prev = ref.current;
    ref.current = next;
    setState(next);
    const kv = bankToKv(next, prev);
    if (Object.keys(kv).length) await (await openRepo()).saveBank(kv).catch(() => {});
  }, []);

  // Load (again after "Delete all my data").
  useEffect(() => {
    let alive = true;
    (async () => {
      const repo = await openRepo();
      const loaded = parseBank(await repo.loadBank());
      if (!alive) return;
      ref.current = loaded;
      setState(loaded);
      setToasts([]);
      setReady(true);
    })().catch(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [app.generation]);

  const opts = () => {
    const a = appRef.current;
    return { today: clockToday(), nowIso: new Date().toISOString(), country: a.settings.country, currency: a.settings.currency };
  };

  const toastsFor = (subs: Sub[]): BankToast[] => subs.map((s) => ({ id: `${s.id}:${Date.now()}`, subId: s.id, name: s.name, amountMinor: s.amountMinor, currency: s.currency, cycle: s.cycle }));

  // Subs this provider just added, until the list (a render later) has them too.
  const justAdded = useRef<Sub[]>([]);
  const apply = useCallback(
    async (res: bank.BankSyncResponse, o: { toast?: boolean; onboarding?: boolean } = {}) => {
      const a = appRef.current;
      const have = new Set(a.subs.map((s) => s.id));
      const subs = [...a.subs, ...justAdded.current.filter((s) => !have.has(s.id))];
      const { state: next, added } = applySync(ref.current, res, subs, { ...opts(), autoAdd: !o.onboarding });
      await put(next);
      if (added.length) {
        justAdded.current = [...justAdded.current, ...added].slice(-50);
        await a.addSubs(added);
        if (o.toast !== false) setToasts((t) => [...t, ...toastsFor(added)]);
      }
      return { added };
    },
    [put],
  );

  const runSync = useCallback(
    (o: { toast?: boolean; onboarding?: boolean } = {}) => {
      if (!ref.current.links.length) return Promise.resolve({ added: [] as Sub[] });
      if (inFlight.current) return inFlight.current;
      const run = (async () => {
        setSyncing(true);
        try {
          const res = await bank.syncBank();
          // The practice bank forgets its banks when the app restarts; ours are saved, so keep them.
          const known = new Set(ref.current.links.map((l) => l.id));
          const r = await apply({ links: res.links.filter((l) => known.has(l.linkId)) }, o);
          await bank.confirmBankSync(res).catch(() => {});
          return r;
        } catch (e) {
          if (__DEV__) console.warn('bank sync failed', e);
          return { added: [] };
        } finally {
          setSyncing(false);
          inFlight.current = null;
        }
      })();
      inFlight.current = run;
      return run;
    },
    [apply],
  );

  // Check on open and when the app comes back to the front. Onboarding does its own first read.
  const canAuto = ready && on && app.ready && app.settings.onboardingDone;
  useEffect(() => {
    if (!canAuto) return;
    void runSync();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void runSync();
    });
    return () => sub.remove();
  }, [canAuto, runSync]);

  // Web preview only: ?bank=… opens the app with a connected practice bank in a given state.
  const demoDone = useRef(false);
  useEffect(() => {
    const demo = webParam('bank');
    if (!demo || demoDone.current || !ready || !app.ready || !app.settings.onboardingDone) return;
    demoDone.current = true;
    void runDemo(demo, { put, apply, ref, setToasts, app: appRef.current });
  }, [ready, app.ready, app.settings.onboardingDone, put, apply]);

  const actions = useMemo(
    () => ({
      connect: async (b: BankEntry) => {
        const { linkToken } = await bank.createLinkToken({ mode: 'new' });
        // Real server: Plaid's own sign-in opens and hands back a one-time token. Practice bank: a fixed one.
        let publicToken = 'practice-public-token';
        let accounts: string | null = null;
        if (bank.BANK_LIVE) {
          const r = await signIn(linkToken);
          publicToken = r.publicToken;
          accounts = r.accounts;
        }
        const { link } = await bank.exchangePublicToken(publicToken);
        const today = clockToday();
        const next: BankLink = {
          id: link.id,
          bankId: b.id,
          name: b.name,
          status: link.status,
          accounts: bank.BANK_LIVE ? accounts : 'Visa ending 4821 · Checking ending 1005',
          connectedOn: today,
          checkedAt: null,
          laterUntil: null,
        };
        await put(addLink(ref.current, next));
        return next;
      },
      reconnect: async (linkId: string) => {
        // The repair flow opens the bank's sign-in in update mode (often just a code). Same connection, no exchange.
        const { linkToken } = await bank.createLinkToken({ mode: 'update', linkId });
        if (bank.BANK_LIVE) await signIn(linkToken);
        await put(setLinkStatus(ref.current, linkId, 'active'));
        await runSync();
      },
      later: (linkId: string) => put(laterLink(ref.current, linkId, clockToday())),
      disconnect: async (linkId?: string) => {
        await bank.removeBank(linkId).catch(() => {});
        await put(removeLink(ref.current, linkId));
      },
      undo: async (subId: string) => {
        setToasts((t) => t.filter((x) => x.subId !== subId));
        await put(undoFind(ref.current, subId));
        await appRef.current.removeSub(subId);
      },
      redo: async (sub: Sub) => {
        await put(redoFind(ref.current, sub.id));
        await appRef.current.addSub({ ...sub, status: 'active', updatedAt: new Date().toISOString() });
      },
      answer: async (key: string, yes: boolean, o: { toList?: boolean } = {}) => {
        const { state: next, sub } = answerSuggestion(ref.current, key, yes, opts());
        await put(next);
        if (sub && o.toList !== false) await appRef.current.addSub(sub);
        return sub;
      },
      dismissCard: (key: string) => put(dismiss(ref.current, key)),
      dismissToast: () => setToasts((t) => t.slice(1)),
      quietToasts: () => setToasts([]),
      remember: (keys: string[]) => put(rememberKeys(ref.current, keys)),
      practice: async (kind: bank.PracticeEvent) => {
        await apply(bank.practiceSync(kind, ref.current.links, clockToday()));
      },
      wipe: async () => {
        await bank.removeBank().catch(() => {});
        await put(emptyBank());
        setToasts([]);
      },
    }),
    [put, apply, runSync],
  );

  const trial = runningProTrial(app.subs, app.today);
  const cards = useMemo(() => (on ? syncCards(state, app.subs, app.today, trial?.anchor ?? null) : []), [on, state, app.subs, app.today, trial?.anchor]);
  // A toast whose sub is gone (undone elsewhere) is skipped.
  const toast = on ? (toasts.find((t) => app.subs.some((s) => s.id === t.subId)) ?? null) : null;

  const value: BankValue = { ready, on, live: bank.BANK_LIVE, state, stateRef: () => ref.current, maxLinks: MAX_LINKS, cards, toast, syncing, runSync, ...actions };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBank(): BankValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBank must be inside BankProvider');
  return v;
}

/** The bank a link or picker id points to, for its tile. */
export function bankOf(link: Pick<BankLink, 'bankId' | 'name'>): BankEntry | null {
  return bankEntry(link.bankId) ?? bankEntry(link.name);
}

// ---------- web preview demos (screenshots of each Home card) ----------

type DemoKit = {
  put: (s: BankState) => Promise<void>;
  apply: (res: bank.BankSyncResponse, o?: { toast?: boolean; onboarding?: boolean }) => Promise<{ added: Sub[] }>;
  ref: { current: BankState };
  setToasts: (f: (t: BankToast[]) => BankToast[]) => void;
  app: { setPro: (plan: 'yearly' | null, o?: { startTrial?: boolean }) => Promise<void>; addSub: (s: Sub) => Promise<void> };
};

/** ?bank=connected|toast|price|cancelled|reconnect|recap|check: a practice Chase in that state. */
async function runDemo(kind: string, kit: DemoKit) {
  const today: DateOnly = clockToday();
  const chase = bankEntry('chase')!;
  const amex = bankEntry('amex')!;
  await kit.put(
    addLink(emptyBank(), {
      id: 'demo-chase',
      bankId: chase.id,
      name: chase.name,
      status: 'active',
      accounts: 'Visa ending 4821 · Checking ending 1005',
      connectedOn: today,
      checkedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    }),
  );
  if (kind === 'settings') {
    await kit.put(addLink(kit.ref.current, { id: 'demo-amex', bankId: amex.id, name: 'American Express', status: 'needs_relogin', accounts: 'Gold ending 3007', connectedOn: today }));
  }
  const first = { links: [{ linkId: 'demo-chase', institutionName: 'Chase', status: 'active' as const, ready: true, added: bank.sampleBankTxns(today), modified: [], removed: [], syncToken: null }] };
  const { added } = await kit.apply(first, { toast: false });
  // Everything but the newest find has been on the list a while (no tag), so the toast demo reads like a later sync.
  if (kind === 'toast') {
    const max = added.find((s) => s.catalogId === 'max');
    if (max) kit.setToasts(() => [{ id: 'demo', subId: max.id, name: max.name, amountMinor: max.amountMinor, currency: max.currency, cycle: max.cycle }]);
  }
  const answerAll = async () => {
    for (const f of kit.ref.current.suggestions) await kit.put(answerSuggestion(kit.ref.current, f.key, false, { today, nowIso: new Date().toISOString(), country: 'US', currency: 'USD' }).state);
  };
  if (kind !== 'check' && kind !== 'connected') await answerAll();
  if (kind === 'recap') {
    // Day 5 of the free week: Pro on, Ditch's trial ends in 2 days, and Netflix's price went up.
    await kit.app.setPro('yearly');
    await kit.app.addSub(proTrialSub(addDays(today, -5), new Date().toISOString()));
    await kit.apply(bank.practiceSync('price', kit.ref.current.links, today, 1));
    for (const c of kit.ref.current.priceChanges) await kit.put(dismiss(kit.ref.current, priceKey(c)));
  }
  if (kind === 'price' || kind === 'cancelled' || kind === 'reconnect') await kit.apply(bank.practiceSync(kind === 'reconnect' ? 'relogin' : kind, kit.ref.current.links, today, 1));
}
