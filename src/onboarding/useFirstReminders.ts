// The user's own first reminders, worded exactly like the notifications the
// phone will show (src/domain/reminders.ts). Used by the reminders pre-ask
// and "You're set".

import { useMemo } from 'react';

import { addDays, weekdayName, type DateOnly } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { headsUpBody } from '@/domain/reminders';
import { now as clockNow } from '@/services/clock';
import { planById } from '@/services/purchases';
import { subFromPick } from '@/state/fromOnboarding';
import { byYearlyDesc, chargeOf, followingChargeOf, onboardingToday, useCountry, useOnboarding, usePickedList, useRemindedIds, type Picked } from '@/state/onboarding';

import { firstReminderRows, undatedNames, type ReminderRow, type SetSub } from './summary';

export type FirstReminder = ReminderRow & { body: string; pick?: Picked };

export function toSetSubs(list: Picked[], today: DateOnly): SetSub[] {
  return [...list].sort(byYearlyDesc).map((x) => ({
    id: x.id,
    name: x.name,
    charge: chargeOf(x, today),
    following: followingChargeOf(x, today),
  }));
}

export function useFirstReminders(max: number) {
  const list = usePickedList();
  const remindedIds = useRemindedIds();
  const { pro } = useOnboarding();
  const home = useCountry()?.currency;
  const today = onboardingToday();
  return useMemo(() => {
    const subs = toSetSubs(list, today);
    const trialCharge = pro === 'yearly' ? addDays(today, planById('yearly').trialDays) : null;
    const rows = firstReminderRows({ subs, remindedIds, trialCharge, today, nowHour: clockNow().getHours(), max });
    const money = (a: number, c: string) => formatMoney(a, c, { home });
    const reminders: FirstReminder[] = rows.map((r) => {
      const pick = list.find((x) => x.id === r.id);
      // Ditch's own trial: worded like its real reminder (src/domain/reminders.ts).
      if (r.trial) {
        const plan = planById('yearly');
        return { ...r, body: `Your Ditch Pro trial ends ${weekdayName(r.charge)}. Then it’s ${plan.priceString} a year. Keep it or ditch it.` };
      }
      if (!pick) return { ...r, body: '' };
      const sub = subFromPick(pick, { freePick: true, nowIso: '', id: pick.id });
      return { ...r, pick, body: headsUpBody(sub, r.charge, r.reminder, money) };
    });
    return { reminders, undated: undatedNames(subs), subs, trialCharge };
  }, [list, remindedIds, pro, home, today, max]);
}
