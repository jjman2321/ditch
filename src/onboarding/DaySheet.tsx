// "Pick day" → which day it charges (design/v13-dates screens 2 and 4,
// DECISIONS #33: no guesses). Monthly: the 31 days and "Last day of the
// month", like Apple Wallet; the anchor day is kept and clamps in short
// months. Yearly: the month, then the day. Weekly and every 3 months: a
// calendar for the next charge. The yellow box says exactly what will
// happen, reminders included. "I'm not sure" leaves it with no date.
// Today is picked to start with (owner, Nov 19, replaces the "Paid it today" button):
// most people add a subscription the day it charges. Today's day counts as already
// charged, so the next charge is one cycle later (src/domain/paidToday.ts) and the
// yellow box shows that date before they save. Any other day can be tapped.

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { HEADS_UP_LEADS, chargeFrom, ordinal } from '@/domain/charges';
import { chargesSoonLine, shortPlanName } from '@/domain/copy';
import { paidToday } from '@/domain/paidToday';
import { reminderDaysFor } from '@/domain/reminders';
import {
  addDays,
  anchorForDayOfMonth,
  daysBetween,
  anchorForMonthDay,
  daysInMonth,
  longDate,
  monthGrid,
  monthTitle,
  nextChargeDate,
  parseDate,
  shiftMonth,
  shortDate,
  weekdayDate,
  type DateOnly,
} from '@/domain/dates';
import { now as clockNow } from '@/services/clock';
import { onboardingToday, usePickPrice, type Picked } from '@/state/onboarding';
import { Button, ChevronLeft, ChevronRight, F, IconButton, LogoTile, Sheet, Txt, haptic, usePalette } from '@/ui/sunflower';

import { CloseButton } from './Parts';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const EVERY = { weekly: 'every week', biweekly: 'every 2 weeks', monthly: 'every month', quarterly: 'every 3 months', semiannual: 'every 6 months', yearly: 'every year' } as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * "Reminders Fri, Nov 13 and Sun, Nov 15 at 9 AM." (or why there are none).
 * `off`: this one won't get reminders (e.g. the free 3 are in use), so say that instead.
 */
export function remindersLine(
  next: DateOnly,
  today: DateOnly,
  leads: readonly number[],
  time: string,
  { reminderTime = '09:00', now = clockNow(), off }: { reminderTime?: string; now?: Date; off?: string } = {},
): string {
  if (off) return off;
  const heads = reminderDaysFor(next, now, leads, reminderTime);
  // Plain words (owner, Nov 19): "Charges tomorrow, so no reminder this time."
  if (heads.length === 0) return `${chargesSoonLine(next, today)}, so no reminder this time.`;
  if (heads.length === 1) return `Reminder ${weekdayDate(heads[0])} at ${time}.`;
  return `Reminders ${heads.slice(0, -1).map(weekdayDate).join(', ')} and ${weekdayDate(heads[heads.length - 1])} at ${time}.`;
}

/**
 * The next charge, worded for the box and the dates list: "Fri, Dec 19", or with the year once it's
 * 6+ months away ("Nov 19, 2027"), so a yearly one picked as today never reads like this week.
 */
export function nextChargeLabel(next: DateOnly, today: DateOnly): string {
  return daysBetween(today, next) >= 180 ? `${shortDate(next)}, ${parseDate(next).y}` : weekdayDate(next);
}

function DayCell({ label, on, disabled, a11y, onPress }: { label: string; on: boolean; disabled?: boolean; a11y: string; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ selected: on, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? p.accent : 'transparent' }}>
        <Txt v="label" num color={on ? p.accentFg : disabled ? p.disabledFg : p.fg} style={{ fontSize: 16 }} maxFontSizeMultiplier={1.2}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

function MonthChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          alignSelf: 'stretch',
          marginHorizontal: 2,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? p.accent : p.dark ? '#26241F' : '#EFE8D8',
        }}
      >
        <Txt v="label" color={on ? p.accentFg : p.fg} style={{ fontSize: 14 }} maxFontSizeMultiplier={1.2}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

function DayGrid({ days, value, onPick }: { days: number; value: number | null; onPick: (d: number) => void }) {
  return (
    <View style={{ marginTop: 8 }}>
      {[0, 1, 2, 3, 4].map((r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {Array.from({ length: 7 }, (_, c) => {
            const d = r * 7 + c + 1;
            if (d > days) return <View key={c} style={{ flex: 1 }} />;
            return <DayCell key={c} label={String(d)} on={value === d} a11y={`The ${ordinal(d)}`} onPress={() => onPick(d)} />;
          })}
        </View>
      ))}
    </View>
  );
}

/** The sheet's content on its own, so other sheets can show it as a step. */
export function DayBody({
  pick,
  onDone,
  onNotSure,
  onClose,
  leads,
  time,
  reminderTime,
  off,
  progress,
}: {
  /** "3 of 8": where they are when Save moves through the list. */
  progress?: string;
  pick: Picked;
  /** `source` is 'receipt' when today is the day (it charged today), or a saved last charge is kept as it was. */
  onDone: (anchor: DateOnly, source: 'next' | 'receipt') => void;
  onNotSure: () => void;
  onClose: () => void;
  leads: readonly number[];
  time: string;
  /** "HH:MM", to leave out reminders whose time has passed today. */
  reminderTime?: string;
  /** Shown instead of the reminder dates when this one won't get any. */
  off?: string;
}) {
  const p = usePalette();
  const priceOf = usePickPrice();
  const today = onboardingToday();
  const monthly = pick.cycle === 'monthly';
  const yearly = pick.cycle === 'yearly';
  const known = pick.dateSource !== 'none';
  // A "Paid it today" anchor is the LAST charge, so the next one comes from chargeFrom, never the anchor itself.
  const knownNext = chargeFrom(pick.anchor, pick.dateSource, pick.cycle, today);
  // Until they tap something, Save keeps the date exactly as it was saved (a last charge stays a last charge).
  const [touched, setTouched] = useState(false);
  // Monthly: the day of the month (31 = last day). Yearly: month + day. Others: the next charge itself.
  const t = parseDate(today);
  const paid = paidToday(pick.cycle, today);
  const [day, setDayRaw] = useState<number | null>(monthly || yearly ? (known ? parseDate(pick.anchor).d : t.d) : null);
  const [month, setMonthRaw] = useState<number | null>(yearly ? (known ? parseDate(pick.anchor).m : t.m) : null);
  const [date, setDateRaw] = useState<DateOnly | null>(!monthly && !yearly ? (known ? knownNext : paid.next) : null);
  const setDay = (d: number) => (setTouched(true), setDayRaw(d));
  const setMonth = (m: number) => (setTouched(true), setMonthRaw(m));
  const setDate = (d: DateOnly) => (setTouched(true), setDateRaw(d));
  const keep = pick.dateSource === 'receipt' && !touched;
  const [view, setView] = useState(() => parseDate(date ?? today));

  const yearDays = month ? (month === 2 ? 29 : daysInMonth(2024, month)) : 31;
  // Today's own day means it charged today: save today as the last charge, next one a cycle later.
  const isToday = !keep && ((monthly && day === t.d) || (yearly && month === t.m && day === t.d));
  const anchor =
    keep || isToday
      ? keep
        ? pick.anchor
        : today
      : monthly
        ? day
          ? anchorForDayOfMonth(day, today)
          : null
        : yearly
          ? month && day && day <= yearDays
            ? anchorForMonthDay(month, day, today)
            : null
          : date;
  const source: 'next' | 'receipt' = keep || isToday ? 'receipt' : 'next';
  const next = keep ? knownNext : isToday ? paid.next : anchor ? nextChargeDate(anchor, pick.cycle, today) : null;
  const price = priceOf(pick, 'short');
  const plan = pick.planName ? shortPlanName(pick.planName, pick.name) : null;
  const detail = [plan, price].filter(Boolean).join(' · ') || EVERY[pick.cycle].replace('every', 'Every');

  // A no-break space keeps the last two words together.
  const head = monthly ? `Which day does ${pick.name}\u00A0charge?` : yearly ? `When does ${pick.name}\u00A0renew?` : `When does ${pick.name} charge\u00A0next?`;
  const rule = !next
    ? null
    : isToday
      ? // Say why today is picked, so a quick Save is a choice, not an accident (audit, Nov 19).
        yearly
        ? `Charged today, ${shortDate(today)}.`
        : `Charged today, the ${ordinal(t.d)}.`
      : monthly
        ? day === 31
          ? 'Charges on the last day of every month.'
          : `Charges on the ${ordinal(day!)} of every month.`
        : yearly
          ? `Renews every year on ${shortDate(next)}.`
          : `Charges ${EVERY[pick.cycle]}.`;

  // The next charge is at most one cycle away.
  const max = addDays(today, pick.cycle === 'semiannual' ? 184 : pick.cycle === 'quarterly' ? 92 : 31);
  const canPrev = view.y * 12 + view.m > parseDate(today).y * 12 + parseDate(today).m;
  const canNext = view.y * 12 + view.m < parseDate(max).y * 12 + parseDate(max).m;
  const cells = monthly || yearly ? [] : monthGrid(view.y, view.m);
  const weeks: (DateOnly | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push([...cells.slice(i, i + 7), ...Array(Math.max(0, i + 7 - cells.length)).fill(null)]);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <LogoTile id={pick.id} size={40} />
        <View style={{ flex: 1, minWidth: 0 }}>
          {progress ? (
            <Txt v="fine" tone="mute" num>
              {progress}
            </Txt>
          ) : null}
          <Txt v="strong" accessibilityRole="header">
            {head}
          </Txt>
          <Txt v="sub" tone="mute" num numberOfLines={1}>
            {detail}
          </Txt>
        </View>
        <CloseButton onPress={onClose} />
      </View>

      {monthly ? (
        <>
          <DayGrid days={31} value={day} onPick={setDay} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Last day of the month"
            accessibilityState={{ selected: day === 31 }}
            onPress={() => {
              haptic.select();
              setDay(31);
            }}
            style={({ pressed }) => ({
              marginTop: 8,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: day === 31 ? p.accent : p.chipBg,
              borderWidth: day === 31 ? 0 : 1.5,
              borderColor: p.chipBorder,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Txt v="label" color={day === 31 ? p.accentFg : p.fg}>
              Last day of the month
            </Txt>
          </Pressable>
        </>
      ) : yearly ? (
        <>
          <View style={{ marginTop: 12 }} accessibilityRole="radiogroup" accessibilityLabel="Month">
            {[0, 1].map((r) => (
              <View key={r} style={{ flexDirection: 'row' }}>
                {MONTHS.slice(r * 6, r * 6 + 6).map((mName, i) => (
                  <MonthChip key={mName} label={mName} on={month === r * 6 + i + 1} onPress={() => setMonth(r * 6 + i + 1)} />
                ))}
              </View>
            ))}
          </View>
          <DayGrid days={yearDays} value={day && day <= yearDays ? day : null} onPick={setDay} />
        </>
      ) : (
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Txt v="label" accessibilityRole="header" style={{ fontSize: 16 }}>
              {monthTitle(view.y, view.m)}
            </Txt>
            <View style={{ flexDirection: 'row', marginRight: -8 }}>
              <IconButton label="Previous month" disabled={!canPrev} onPress={() => setView({ ...view, ...shiftMonth(view.y, view.m, -1) })}>
                <ChevronLeft color={p.fg} />
              </IconButton>
              <IconButton label="Next month" disabled={!canNext} onPress={() => setView({ ...view, ...shiftMonth(view.y, view.m, 1) })}>
                <ChevronRight color={p.fg} size={22} />
              </IconButton>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            {WEEKDAYS.map((w, i) => (
              <View key={i} style={{ flex: 1, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="eyebrow" tone="mute" style={{ letterSpacing: 0 }}>
                  {w}
                </Txt>
              </View>
            ))}
          </View>
          {weeks.map((w, r) => (
            <View key={r} style={{ flexDirection: 'row' }}>
              {w.map((d, c) =>
                d ? (
                  <DayCell key={c} label={String(parseDate(d).d)} on={d === date} disabled={d < today || d > max} a11y={longDate(d)} onPress={() => setDate(d)} />
                ) : (
                  <View key={c} style={{ flex: 1, height: 44 }} />
                ),
              )}
            </View>
          ))}
        </View>
      )}

      {/* Says exactly what will happen, so the reminders are real before the paywall. */}
      <View accessible accessibilityLiveRegion="polite" style={{ marginTop: 14, borderRadius: 16, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', paddingVertical: 12, paddingHorizontal: 14 }}>
        <Txt v="body" num style={{ fontFamily: F.semi }}>
          {rule ?? (monthly ? 'Tap the day it charges.' : yearly ? 'Tap the month, then the day.' : 'Tap the day it charges next.')}
        </Txt>
        <Txt v="body" tone="fg2" num style={{ marginTop: 2 }}>
          {/* One short line (owner, Nov 20: the box had too much text). The reminder days are on the reminders step. */}
          {next ? `Next charge ${nextChargeLabel(next, today)}${off ? ' · no reminder on free' : ''}` : 'It’s in your bank app or the receipt email.'}
        </Txt>
      </View>
      <Button label="Save" disabled={!anchor} onPress={() => anchor && onDone(anchor, source)} style={{ marginTop: 16 }} />
      <Button kind="text" label="I’m not sure" hint="Leaves it with no date and no reminders" onPress={onNotSure} style={{ marginTop: 4 }} />
    </View>
  );
}

export function DaySheet({
  pick,
  visible,
  onClose,
  onDone,
  onNotSure,
  leads = HEADS_UP_LEADS,
  time = '9 AM',
  progress,
  off,
}: {
  progress?: string;
  pick: Picked | null;
  visible: boolean;
  onClose: () => void;
  onDone: (anchor: DateOnly, source: 'next' | 'receipt') => void;
  /** Leaves it with no date: no reminder until they add one. */
  onNotSure: () => void;
  /** Days before the charge that reminders go out, and when ("9 AM"). */
  leads?: readonly number[];
  time?: string;
  /** Shown instead of the reminder dates when this one won't get any (e.g. free covers the 3 biggest). */
  off?: string;
}) {
  return (
    <Sheet visible={visible && !!pick} onClose={onClose} fit gap={0} maxContent={420} label={pick ? `${pick.name} charge day` : 'Charge day'}>
      {pick ? <DayBody key={pick.id} pick={pick} onDone={onDone} onNotSure={onNotSure} onClose={onClose} leads={leads} time={time} progress={progress} off={off} /> : null}
    </Sheet>
  );
}
