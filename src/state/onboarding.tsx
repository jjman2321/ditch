// Onboarding answers, kept in memory while the user moves through the flow.
// M1 will save each step to SQLite so a force-quit resumes where they left off.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { SERVICE_BY_ID, type CatalogService } from '@/catalog/services';
import { nextChargeDate, toDateOnly, type DateOnly } from '@/domain/dates';
import { monthlyMinorExact, yearlyMinor, type Cycle } from '@/domain/money';

export type Picked = {
  id: string; // catalog id or "custom-…"
  name: string;
  amountMinor: number;
  currency: string;
  cycle: Cycle;
  amountIsEstimate: boolean;
  anchorDate: DateOnly | null; // null = date unknown
  color: string;
  ink?: string;
  mono: string;
};

type OnboardingState = {
  picked: Record<string, Picked>;
  order: string[]; // tick order, so lists don't jump around
  reminderPicks: string[]; // free tier: up to 3
  notificationsAsked: boolean;
};

type Actions = {
  toggleService: (service: CatalogService) => void;
  addCustom: (input: { name: string; amountMinor: number; cycle: Cycle; currency?: string }) => void;
  setAnchor: (id: string, anchor: DateOnly | null) => void;
  setReminderPicks: (ids: string[]) => void;
  setNotificationsAsked: () => void;
};

const Ctx = createContext<(OnboardingState & Actions) | null>(null);

const CUSTOM_COLORS = ['#3A5A40', '#6B4E9B', '#B5651D', '#2B6CB0', '#9B2C2C'];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    picked: {},
    order: [],
    reminderPicks: [],
    notificationsAsked: false,
  });

  const toggleService = useCallback((service: CatalogService) => {
    setState((s) => {
      if (s.picked[service.id]) {
        const { [service.id]: _removed, ...rest } = s.picked;
        return { ...s, picked: rest, order: s.order.filter((x) => x !== service.id) };
      }
      const p: Picked = {
        id: service.id,
        name: service.name,
        amountMinor: service.amountMinor,
        currency: service.currency,
        cycle: service.cycle,
        amountIsEstimate: true,
        anchorDate: null,
        color: service.color,
        ink: service.ink,
        mono: service.mono,
      };
      return { ...s, picked: { ...s.picked, [service.id]: p }, order: [...s.order, service.id] };
    });
  }, []);

  const addCustom = useCallback<Actions['addCustom']>(({ name, amountMinor, cycle, currency = 'USD' }) => {
    setState((s) => {
      const id = `custom-${Date.now()}`;
      const p: Picked = {
        id,
        name,
        amountMinor,
        currency,
        cycle,
        amountIsEstimate: false,
        anchorDate: null,
        color: CUSTOM_COLORS[s.order.length % CUSTOM_COLORS.length],
        mono: name.trim().slice(0, 1).toUpperCase() || '?',
      };
      return { ...s, picked: { ...s.picked, [id]: p }, order: [...s.order, id] };
    });
  }, []);

  const setAnchor = useCallback((id: string, anchor: DateOnly | null) => {
    setState((s) =>
      s.picked[id] ? { ...s, picked: { ...s.picked, [id]: { ...s.picked[id], anchorDate: anchor } } } : s,
    );
  }, []);

  const setReminderPicks = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, reminderPicks: ids.slice(0, 3) }));
  }, []);

  const setNotificationsAsked = useCallback(() => {
    setState((s) => ({ ...s, notificationsAsked: true }));
  }, []);

  const value = useMemo(
    () => ({ ...state, toggleService, addCustom, setAnchor, setReminderPicks, setNotificationsAsked }),
    [state, toggleService, addCustom, setAnchor, setReminderPicks, setNotificationsAsked],
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
  return order.map((id) => picked[id]).filter(Boolean);
}

/** Biggest yearly cost first. */
export function byYearlyDesc(a: Picked, b: Picked) {
  return yearlyMinor(b.amountMinor, b.cycle) - yearlyMinor(a.amountMinor, a.cycle);
}

export function nextDateFor(p: Picked, today: DateOnly = toDateOnly()): DateOnly | null {
  return p.anchorDate ? nextChargeDate(p.anchorDate, p.cycle, today) : null;
}

export { monthlyMinorExact, yearlyMinor, SERVICE_BY_ID };
