// The app's saved state: the list, the settings and the reminder health.
// Every change is saved to SQLite first-hand and then the reminders are
// rescheduled (CLAUDE.md rule 3): after add/edit/ditch/delete, on launch,
// when the app comes back to the front, and when the day changes.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { openRepo } from '@/db/open';
import type { Repo } from '@/db/repo';
import type { DateOnly } from '@/domain/dates';
import { formatMoney, formatWholeMoney } from '@/domain/money';
import { planReminders, type PlannedReminder } from '@/domain/reminders';
import { markAsked, pastReminderDays, REVIEW_REMINDER_DAYS, shouldAskForReview, type ReviewMoment } from '@/domain/review';
import { DEFAULT_SETTINGS, effectiveLeads, type ProPlan, type Settings } from '@/domain/settings';
import {
  FREE_REMINDERS,
  confirmCancel,
  ditchSub,
  isProTrial,
  reactivateSub,
  defaultFreePicks,
  remindedIds,
  settleFreePicks,
  type Sub,
} from '@/domain/subs';
import { now as clockNow, today as clockToday } from '@/services/clock';
import {
  applyPlan,
  cancelAllReminders,
  getNotifStatus,
  requestNotifPermission,
  sendTestReminder,
  setupNotifications,
  type NotifStatus,
} from '@/services/notifications';
import { offerReview } from '@/services/review';
import { MARKETING_VERSION } from '@/settings/version';

import { proTrialSub, subsFromOnboarding } from './fromOnboarding';
import type { Picked } from './picks';

type Data = {
  ready: boolean;
  subs: Sub[];
  settings: Settings;
  notif: NotifStatus;
  today: DateOnly;
  /** What should be pending right now (soonest first). */
  plan: PlannedReminder[];
  /** Bumps after "Delete all data", so onboarding starts clean. */
  generation: number;
};

export type OnboardingResult = {
  picks: Picked[];
  reminderIds: string[];
  pro: ProPlan | null;
  country: string | null;
  currency: string;
};

type Actions = {
  addSub: (s: Sub) => Promise<void>;
  /** Several at once (the Add picker), in one save and one reschedule. */
  addSubs: (s: Sub[]) => Promise<void>;
  saveSub: (s: Sub) => Promise<void>;
  removeSub: (id: string) => Promise<void>;
  /** Returns the sub as it was, for Undo. */
  ditch: (id: string) => Promise<Sub | null>;
  undoDitch: (before: Sub) => Promise<void>;
  confirmCancelled: (id: string) => Promise<void>;
  /** Offer Apple's rating prompt after a win, if the rules allow (src/domain/review.ts). */
  maybeAskReview: (moment: ReviewMoment) => Promise<void>;
  reactivate: (id: string) => Promise<void>;
  /** Free: false when 3 are already on. */
  setReminder: (id: string, on: boolean) => Promise<boolean>;
  setFreePicks: (ids: string[]) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  /** Stub until RevenueCat. A yearly trial adds Ditch's own trial to the list. */
  setPro: (plan: ProPlan | null, opts?: { startTrial?: boolean }) => Promise<void>;
  finishOnboarding: (r: OnboardingResult) => Promise<void>;
  deleteAll: () => Promise<void>;
  refreshNotif: () => Promise<NotifStatus>;
  askNotif: () => Promise<NotifStatus>;
  sendTest: () => Promise<boolean>;
  /** Health check: read the permission again and make the phone match the plan. */
  recheck: () => Promise<NotifStatus>;
};

export type AppValue = Data & Actions & { pro: boolean };

const Ctx = createContext<AppValue | null>(null);

const isPro = (s: Settings) => s.proPlan !== null;

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(() => ({
    ready: false,
    subs: [],
    settings: DEFAULT_SETTINGS,
    notif: 'undetermined',
    today: clockToday(),
    plan: [],
    generation: 0,
  }));
  // Always the latest data, for actions (updated by `set`, never during render).
  const ref = useRef(data);
  const repoRef = useRef<Repo | null>(null);

  const set = useCallback((patch: Partial<Data>) => {
    ref.current = { ...ref.current, ...patch };
    setData(ref.current);
  }, []);

  /** Plan from the current list and settings, then hand it to iOS. */
  const reschedule = useCallback(() => {
    const { subs, settings } = ref.current;
    const plan = planReminders(subs, { ...settings, pro: isPro(settings) }, clockNow());
    set({ plan });
    applyPlan(plan).catch(() => {});
  }, [set]);

  const refreshNotif = useCallback(async () => {
    const notif = await getNotifStatus();
    if (notif !== ref.current.notif) set({ notif });
    return notif;
  }, [set]);

  // Load, then schedule. Launch counts as a reschedule.
  useEffect(() => {
    let alive = true;
    setupNotifications();
    (async () => {
      const repo = await openRepo();
      const [subs, settings, notif] = await Promise.all([repo.loadSubs(), repo.loadSettings(), getNotifStatus()]);
      if (!alive) return;
      repoRef.current = repo;
      // First launch with this code: remember the day, for the rating rules.
      const withInstall = settings.review.installedOn ? settings : { ...settings, review: { ...settings.review, installedOn: clockToday() } };
      if (withInstall !== settings) repo.saveSettings({ review: withInstall.review }).catch(() => {});
      set({ ready: true, subs, settings: withInstall, notif, today: clockToday() });
      reschedule();
    })().catch(() => set({ ready: true }));
    return () => {
      alive = false;
    };
  }, [set, reschedule]);

  // Back to the front: new day? new permission? Reschedule either way.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !ref.current.ready) return;
      set({ today: clockToday() });
      refreshNotif().finally(reschedule);
    });
    // The day can also change while the app stays open.
    const timer = setInterval(() => {
      if (ref.current.ready && clockToday() !== ref.current.today) {
        set({ today: clockToday() });
        reschedule();
      }
    }, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, [set, reschedule, refreshNotif]);

  /** Save changed subs, update memory, reschedule. */
  const commit = useCallback(
    async (input: Sub[]) => {
      // Free: the 3 reminder slots stay exact, whatever changed (settleFreePicks).
      const changed = settleFreePicks(ref.current.subs, input, isPro(ref.current.settings));
      const byId = new Map(changed.map((s) => [s.id, s]));
      const existing = new Set(ref.current.subs.map((s) => s.id));
      const subs = [
        ...ref.current.subs.map((s) => byId.get(s.id) ?? s),
        ...changed.filter((s) => !existing.has(s.id)),
      ].filter((s) => s.status !== 'deleted');
      set({ subs });
      reschedule();
      await repoRef.current?.saveSubs(changed);
    },
    [set, reschedule],
  );

  const stamp = () => new Date().toISOString();
  const find = (id: string) => ref.current.subs.find((s) => s.id === id) ?? null;

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      set({ settings: { ...ref.current.settings, ...patch } });
      reschedule();
      await repoRef.current?.saveSettings(patch);
    },
    [set, reschedule],
  );

  const maybeAskReview = useCallback(
    async (moment: ReviewMoment) => {
      const { settings, subs, notif } = ref.current;
      const today = clockToday();
      if (!shouldAskForReview(settings.review, { today, version: MARKETING_VERSION, onboardingDone: settings.onboardingDone })) return;
      if (moment === 'reminders-worked') {
        if (notif !== 'granted' && notif !== 'quiet') return;
        const pro = isPro(settings);
        const days = pastReminderDays(subs, { pro, leads: effectiveLeads(settings, pro), from: settings.review.installedOn!, today });
        if (days < REVIEW_REMINDER_DAYS) return;
      }
      if (await offerReview()) await updateSettings({ review: markAsked(ref.current.settings.review, today, MARKETING_VERSION) });
    },
    [updateSettings],
  );

  // Reminders have done their job: offer the rating a moment after opening, never on top of launch.
  useEffect(() => {
    if (!data.ready) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const later = () => {
      clearTimeout(timer);
      timer = setTimeout(() => maybeAskReview('reminders-worked').catch(() => {}), 4000);
    };
    later();
    const sub = AppState.addEventListener('change', (state) => (state === 'active' ? later() : clearTimeout(timer)));
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, [data.ready, maybeAskReview]);

  const actions: Actions = useMemo(
    () => ({
      maybeAskReview,
      addSub: (s) => commit([s]),
      addSubs: (list) => commit(list),
      saveSub: (s) => commit([{ ...s, updatedAt: stamp() }]),
      removeSub: async (id) => {
        const s = find(id);
        if (s) await commit([{ ...s, status: 'deleted', updatedAt: stamp() }]);
      },
      ditch: async (id) => {
        const s = find(id);
        if (!s) return null;
        await commit([ditchSub(s, ref.current.today, stamp())]);
        if (!ref.current.settings.holdHintDone) await updateSettings({ holdHintDone: true });
        return s;
      },
      undoDitch: (before) => commit([{ ...before, updatedAt: stamp() }]),
      confirmCancelled: async (id) => {
        const s = find(id);
        if (s) await commit([confirmCancel(s, ref.current.today, stamp())]);
      },
      reactivate: async (id) => {
        const s = find(id);
        if (s) await commit([reactivateSub(s, stamp())]);
      },
      setReminder: async (id, on) => {
        const s = find(id);
        if (!s) return false;
        if (isPro(ref.current.settings)) {
          await commit([{ ...s, muted: !on, freePick: on ? s.freePick : false, updatedAt: stamp() }]);
          return true;
        }
        if (on && !s.freePick && remindedIds(ref.current.subs, false).size >= FREE_REMINDERS) return false;
        await commit([{ ...s, freePick: on, muted: false, updatedAt: stamp() }]);
        return true;
      },
      setFreePicks: async (ids) => {
        const keep = new Set(ids.slice(0, FREE_REMINDERS));
        const changed = ref.current.subs.filter((s) => !isProTrial(s) && s.freePick !== keep.has(s.id)).map((s) => ({ ...s, freePick: keep.has(s.id), updatedAt: stamp() }));
        await commit(changed);
      },
      updateSettings,
      setPro: async (plan, opts) => {
        await updateSettings({ proPlan: plan });
        const hasTrial = ref.current.subs.some((s) => isProTrial(s) && s.status === 'active');
        if (plan === 'yearly' && opts?.startTrial && !hasTrial) await commit([proTrialSub(ref.current.today, stamp())]);
        // Ditch's trial entry (and its "trial ends" reminders) only belongs to a yearly trial.
        const trials = ref.current.subs.filter((s) => isProTrial(s) && s.status === 'active');
        if (plan !== 'yearly' && trials.length) await commit(trials.map((s) => ({ ...s, status: 'deleted' as const, updatedAt: stamp() })));
        if (!plan) {
          // Pro ended: keep everything; reminders drop back to 3. If fewer than 3 are
          // picked, the biggest ones with a date fill the gap (SPEC §6).
          const subs = ref.current.subs;
          const have = remindedIds(subs, false);
          const fill = defaultFreePicks(subs.filter((s) => !have.has(s.id))).slice(0, Math.max(0, FREE_REMINDERS - have.size));
          if (fill.length) await commit(subs.filter((s) => fill.includes(s.id)).map((s) => ({ ...s, freePick: true, updatedAt: stamp() })));
        }
      },
      finishOnboarding: async (r) => {
        const subs = subsFromOnboarding({ picks: r.picks, reminderIds: r.reminderIds, pro: r.pro, today: ref.current.today, nowIso: stamp() });
        const settings: Partial<Settings> = { onboardingDone: true, country: r.country, currency: r.currency, proPlan: r.pro };
        set({ settings: { ...ref.current.settings, ...settings } });
        // The list is saved before "onboarding done", so a crash in between can't
        // leave someone past onboarding with an empty list.
        await commit(subs);
        await repoRef.current?.saveSettings(settings);
        await refreshNotif();
        reschedule();
      },
      deleteAll: async () => {
        await repoRef.current?.wipe();
        await cancelAllReminders();
        set({ subs: [], settings: DEFAULT_SETTINGS, plan: [], generation: ref.current.generation + 1 });
      },
      refreshNotif,
      askNotif: async () => {
        const notif = await requestNotifPermission();
        set({ notif });
        reschedule();
        return notif;
      },
      sendTest: () => sendTestReminder(),
      recheck: async () => {
        const notif = await refreshNotif();
        reschedule();
        return notif;
      },
    }),
    [commit, updateSettings, refreshNotif, reschedule, set, maybeAskReview],
  );

  const value = useMemo(() => ({ ...data, ...actions, pro: isPro(data.settings) }), [data, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be inside AppProvider');
  return v;
}

/** Money in the user's terms: their own currency gets its plain symbol. */
export function useAppMoney() {
  const home = useApp().settings.currency;
  return useCallback(
    (amountMinor: number, currency: string, opts: { whole?: boolean } = {}) =>
      opts.whole ? formatWholeMoney(amountMinor, currency, { home }) : formatMoney(amountMinor, currency, { home }),
    [home],
  );
}
