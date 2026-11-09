// Onboarding answers, kept in memory while the user moves through the flow.
// Phase 2 saves them to SQLite so a force-quit resumes where they left off.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { type CatalogService } from '@/catalog/services';
import { chargeFrom, guessNextCharge, type DateSource } from '@/domain/charges';
import { toDateOnly, type DateOnly } from '@/domain/dates';
import { yearlyMinor, type Cycle } from '@/domain/money';
import type { PlanId } from '@/services/purchases';

export type Picked = {
  id: string; // catalog id
  name: string;
  category?: string;
  amountMinor: number;
  currency: string;
  cycle: Cycle;
  amountIsEstimate: boolean;
  /** The date the user gave (or our guess). Keeps the billing day. */
  anchor: DateOnly;
  /** "guess" until the user confirms a next charge or a last receipt. */
  dateSource: DateSource;
  color: string;
  ink?: string;
  mono: string;
};

export type NotificationChoice = 'unasked' | 'granted' | 'denied' | 'later';

type OnboardingState = {
  picked: Record<string, Picked>;
  order: string[]; // tick order, so lists don't jump around
  /** Free tier: up to 3. Null until the user has seen the picker. */
  reminderPicks: string[] | null;
  notifications: NotificationChoice;
  /** Set once a Pro plan is active (only a preview while purchases are stubbed). */
  pro: PlanId | null;
  /** The total's digit roll plays once per session. */
  totalShown: boolean;
};

type Actions = {
  toggleService: (service: CatalogService) => void;
  setDate: (id: string, anchor: DateOnly, source: Exclude<DateSource, 'guess'>) => void;
  revertToGuess: (id: string) => void;
  setCycle: (id: string, cycle: Cycle) => void;
  setReminderPicks: (ids: string[]) => void;
  setNotifications: (choice: NotificationChoice) => void;
  setPro: (plan: PlanId | null) => void;
  markTotalShown: () => void;
};

const Ctx = createContext<(OnboardingState & Actions) | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    picked: {},
    order: [],
    reminderPicks: null,
    notifications: 'unasked',
    pro: null,
    totalShown: false,
  });

  const toggleService = useCallback((service: CatalogService) => {
    setState((s) => {
      if (s.picked[service.id]) {
        const { [service.id]: _removed, ...rest } = s.picked;
        return {
          ...s,
          picked: rest,
          order: s.order.filter((x) => x !== service.id),
          reminderPicks: s.reminderPicks?.filter((x) => x !== service.id) ?? null,
        };
      }
      const p: Picked = {
        id: service.id,
        name: service.name,
        category: service.category,
        amountMinor: service.amountMinor,
        currency: service.currency,
        cycle: service.cycle,
        amountIsEstimate: true,
        anchor: guessNextCharge(service.id, service.cycle, toDateOnly()),
        dateSource: 'guess',
        color: service.color,
        ink: service.ink,
        mono: service.mono,
      };
      return { ...s, picked: { ...s.picked, [service.id]: p }, order: [...s.order, service.id] };
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<Picked>) => {
    setState((s) => (s.picked[id] ? { ...s, picked: { ...s.picked, [id]: { ...s.picked[id], ...patch } } } : s));
  }, []);

  const setDate = useCallback<Actions['setDate']>((id, anchor, source) => update(id, { anchor, dateSource: source }), [update]);

  const revertToGuess = useCallback(
    (id: string) =>
      setState((s) => {
        const p = s.picked[id];
        if (!p) return s;
        const guess = guessNextCharge(p.id, p.cycle, toDateOnly());
        return { ...s, picked: { ...s.picked, [id]: { ...p, anchor: guess, dateSource: 'guess' } } };
      }),
    [],
  );

  const setCycle = useCallback((id: string, cycle: Cycle) => update(id, { cycle }), [update]);
  const setReminderPicks = useCallback((ids: string[]) => setState((s) => ({ ...s, reminderPicks: ids.slice(0, 3) })), []);
  const setNotifications = useCallback((notifications: NotificationChoice) => setState((s) => ({ ...s, notifications })), []);
  const setPro = useCallback((pro: PlanId | null) => setState((s) => ({ ...s, pro })), []);
  const markTotalShown = useCallback(() => setState((s) => (s.totalShown ? s : { ...s, totalShown: true })), []);

  const value = useMemo(
    () => ({ ...state, toggleService, setDate, revertToGuess, setCycle, setReminderPicks, setNotifications, setPro, markTotalShown }),
    [state, toggleService, setDate, revertToGuess, setCycle, setReminderPicks, setNotifications, setPro, markTotalShown],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOnboarding must be inside OnboardingProvider');
  return v;
}

/** Picked items in tick order. */
export function usePickedList(): Picked[] {
  const { picked, order } = useOnboarding();
  return useMemo(() => order.map((id) => picked[id]).filter(Boolean), [picked, order]);
}

/** Biggest yearly cost first; ties keep their order. */
export function byYearlyDesc(a: Picked, b: Picked) {
  return yearlyMinor(b.amountMinor, b.cycle) - yearlyMinor(a.amountMinor, a.cycle);
}

/** The next charge for a pick, on or after today. */
export function chargeOf(p: Picked, today: DateOnly = toDateOnly()): DateOnly {
  return chargeFrom(p.anchor, p.dateSource, p.cycle, today);
}

/** Free tier default: the 3 biggest yearly charges (DECISIONS #11). */
export function defaultReminderPicks(list: Picked[]): string[] {
  return [...list].sort(byYearlyDesc).slice(0, 3).map((p) => p.id);
}

/** Which subs get heads-ups: all of them with Pro, otherwise the chosen 3. */
export function useRemindedIds(): string[] {
  const { pro, reminderPicks } = useOnboarding();
  const list = usePickedList();
  if (pro) return list.map((p) => p.id);
  return reminderPicks ?? defaultReminderPicks(list);
}
