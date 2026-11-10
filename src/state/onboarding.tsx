// Onboarding answers, kept in memory while the user moves through the flow.
// Phase 2 saves them to SQLite so a force-quit resumes where they left off.

import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { COUNTRY_BY_CODE, supportedCountry, type Country } from '@/catalog/prices';
import { type CatalogService } from '@/catalog/services';
import { SERVICE_BY_ID } from '@/catalog/services';
import { chargeFrom, guessNextCharge, roughDate, type DateSource, type RoughWhen } from '@/domain/charges';
import { addDays, anchorForDayOfMonth, type DateOnly } from '@/domain/dates';
import { webParam } from '@/dev/webParams';
import { today as clockToday } from '@/services/clock';
import { CYCLE_SHORT, CYCLE_WORDS, formatMoney, formatWholeMoney, spendTotals, type Cycle, type SpendTotal } from '@/domain/money';
import type { PlanId } from '@/services/purchases';

import { chooseCycle, choosePlan, isPriced as isPricedPick, newPick, repriceForCountry, setOwnPrice, yearlyOf, type Picked } from './picks';

export type { Picked, PricedPick } from './picks';
export { isPriced } from './picks';

export type NotificationChoice = 'unasked' | 'granted' | 'denied' | 'later';

type OnboardingState = {
  picked: Record<string, Picked>;
  order: string[]; // tick order, so lists don't jump around
  /** Whose prices we show (ISO code), from the iPhone's Region. Null = not one of our 12. */
  country: string | null;
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
  setCountry: (code: string) => void;
  setPlan: (id: string, planId: string) => void;
  setPrice: (id: string, amountMinor: number, currency: string, cycle: Cycle) => void;
  setDate: (id: string, anchor: DateOnly, source: Exclude<DateSource, 'guess'>) => void;
  /** "This week" / "Next week" / "Later": stored as the middle of the range, still "around". */
  setRough: (id: string, when: RoughWhen) => void;
  /** Back to not answered (the row shows its quick picks again). */
  clearDate: (id: string) => void;
  revertToGuess: (id: string) => void;
  setCycle: (id: string, cycle: Cycle) => void;
  setReminderPicks: (ids: string[]) => void;
  setNotifications: (choice: NotificationChoice) => void;
  setPro: (plan: PlanId | null) => void;
  markTotalShown: () => void;
};

const Ctx = createContext<(OnboardingState & Actions) | null>(null);

/** The iPhone's Region (Settings → General → Language & Region), if we support it. */
export function regionCountry(): string | null {
  try {
    return supportedCountry(getLocales()[0]?.regionCode);
  } catch {
    return null;
  }
}

/** Today for onboarding (the web preview can pin it with ?today=). */
const todayNow = () => clockToday();

function emptyState(): OnboardingState {
  return { picked: {}, order: [], country: regionCountry(), reminderPicks: null, notifications: 'unasked', pro: null, totalShown: false };
}

/**
 * Web preview only: ?ob=v12 (or v12dates) loads the six picks from
 * design/v12 so screenshots can open any step. Never on the phone.
 */
function seededState(): OnboardingState {
  const seed = webParam('ob');
  const base = emptyState();
  if (seed !== 'v12' && seed !== 'v12dates') return base;
  const today = todayNow();
  const country = 'US';
  const ids = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'youtube-premium', 'disney-plus'];
  const picked: Record<string, Picked> = {};
  for (const id of ids) picked[id] = newPick(SERVICE_BY_ID[id], country, today);
  // YouTube Premium has no checked US price yet (DECISIONS #28): typed in, like a user would.
  picked['youtube-premium'] = setOwnPrice(picked['youtube-premium'], 1599, 'USD', 'monthly');
  const day = (id: string, d: number) => (picked[id] = { ...picked[id], anchor: anchorForDayOfMonth(d, today), dateSource: 'next', when: 'day' });
  const rough = (id: string, w: RoughWhen) => (picked[id] = { ...picked[id], anchor: roughDate(w, picked[id].cycle, today), dateSource: 'guess', when: w });
  day('chatgpt-plus', 21);
  if (seed !== 'v12dates') {
    day('netflix', 19);
    day('youtube-premium', 17);
    day('spotify', 7);
    rough('amazon-prime', 'later');
    rough('disney-plus', 'next');
  }
  const notif = webParam('obnotif');
  const pro = webParam('obpro');
  return {
    ...base,
    country,
    picked,
    order: ids,
    totalShown: true,
    notifications: notif === 'later' || notif === 'denied' ? notif : seed === 'v12' ? 'granted' : 'unasked',
    pro: pro === 'yearly' || pro === 'monthly' || pro === 'lifetime' ? pro : null,
  };
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(seededState);

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
      const p = newPick(service, s.country, todayNow());
      return { ...s, picked: { ...s.picked, [service.id]: p }, order: [...s.order, service.id] };
    });
  }, []);

  const change = useCallback((id: string, fn: (p: Picked) => Picked) => {
    setState((s) => (s.picked[id] ? { ...s, picked: { ...s.picked, [id]: fn(s.picked[id]) } } : s));
  }, []);

  const setCountry = useCallback((code: string) => {
    setState((s) => ({
      ...s,
      country: code,
      picked: Object.fromEntries(Object.entries(s.picked).map(([k, p]) => [k, repriceForCountry(p, code)])),
    }));
  }, []);

  const setPlan = useCallback((id: string, planId: string) => change(id, (p) => choosePlan(p, planId)), [change]);
  const setPrice = useCallback<Actions['setPrice']>((id, amount, currency, cycle) => change(id, (p) => setOwnPrice(p, amount, currency, cycle)), [change]);
  const setDate = useCallback<Actions['setDate']>((id, anchor, source) => change(id, (p) => ({ ...p, anchor, dateSource: source, when: 'day' })), [change]);
  const setRough = useCallback(
    (id: string, when: RoughWhen) => change(id, (p) => ({ ...p, anchor: roughDate(when, p.cycle, todayNow()), dateSource: 'guess', when })),
    [change],
  );
  const revertToGuess = useCallback(
    (id: string) => change(id, (p) => ({ ...p, anchor: guessNextCharge(p.id, p.cycle, todayNow()), dateSource: 'guess', when: null })),
    [change],
  );
  const setCycle = useCallback((id: string, cycle: Cycle) => change(id, (p) => chooseCycle(p, cycle)), [change]);
  const setReminderPicks = useCallback((ids: string[]) => setState((s) => ({ ...s, reminderPicks: ids.slice(0, 3) })), []);
  const setNotifications = useCallback((notifications: NotificationChoice) => setState((s) => ({ ...s, notifications })), []);
  const setPro = useCallback((pro: PlanId | null) => setState((s) => ({ ...s, pro })), []);
  const markTotalShown = useCallback(() => setState((s) => (s.totalShown ? s : { ...s, totalShown: true })), []);

  const value = useMemo(
    () => ({
      ...state,
      toggleService,
      setCountry,
      setPlan,
      setPrice,
      setDate,
      setRough,
      clearDate: revertToGuess,
      revertToGuess,
      setCycle,
      setReminderPicks,
      setNotifications,
      setPro,
      markTotalShown,
    }),
    [state, toggleService, setCountry, setPlan, setPrice, setDate, setRough, revertToGuess, setCycle, setReminderPicks, setNotifications, setPro, markTotalShown],
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

/** The price country, with its flag and currency (null if none of our 12). */
export function useCountry(): Country | null {
  const { country } = useOnboarding();
  return country ? COUNTRY_BY_CODE[country] : null;
}

/** Biggest yearly cost first; unpriced last; ties keep their order. */
export function byYearlyDesc(a: Picked, b: Picked) {
  return yearlyOf(b) - yearlyOf(a);
}

/** The next charge for a pick, on or after today. */
export function chargeOf(p: Picked, today: DateOnly = todayNow()): DateOnly {
  return chargeFrom(p.anchor, p.dateSource, p.cycle, today);
}

/** The charge after the next one. */
export function followingChargeOf(p: Picked, today: DateOnly = todayNow()): DateOnly {
  return chargeFrom(p.anchor, p.dateSource, p.cycle, addDays(chargeOf(p, today), 1));
}

export { todayNow as onboardingToday };

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

/**
 * Money in the user's terms: their own currency gets its plain symbol,
 * any other gets one that can't be confused (US$ next to A$).
 */
export function useMoney() {
  const home = useCountry()?.currency;
  return useCallback(
    (amountMinor: number, currency: string, opts: { whole?: boolean } = {}) =>
      opts.whole ? formatWholeMoney(amountMinor, currency, { home }) : formatMoney(amountMinor, currency, { home }),
    [home],
  );
}

/** One total per currency for the priced picks; the user's own currency first. */
export function totalsFor(list: Picked[], home: string | undefined): SpendTotal[] {
  const totals = spendTotals(list.filter(isPricedPick));
  return [...totals.filter((t) => t.currency === home), ...totals.filter((t) => t.currency !== home)];
}

/** "£13.99/mo" (short) or "£13.99 a month" (words); null when there's no price yet. */
export function usePickPrice() {
  const money = useMoney();
  return useCallback(
    (p: Picked, form: 'short' | 'words' | 'amount' = 'words') => {
      if (!isPricedPick(p)) return null;
      const m = money(p.amountMinor, p.currency);
      return form === 'amount' ? m : form === 'short' ? `${m}${CYCLE_SHORT[p.cycle]}` : `${m} ${CYCLE_WORDS[p.cycle]}`;
    },
    [money],
  );
}
