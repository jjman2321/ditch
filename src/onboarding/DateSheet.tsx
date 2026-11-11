// The editor's date picker: a month calendar with two ways to answer.
// "Next charge": tap the day it charges next (today or later).
// "From my last receipt": tap the day you were last charged (today or
// earlier) and we roll it forward with the date rules in src/domain/dates.

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { HEADS_UP_LEADS, nextFromLastCharge, previousCharge } from '@/domain/charges';
import { addDays, longDate, monthGrid, monthTitle, parseDate, shiftMonth, shortDate, toDateOnly, weekdayDate, type DateOnly } from '@/domain/dates';
import { type Cycle } from '@/domain/money';
import { reminderDaysFor } from '@/domain/reminders';
import { now as clockNow } from '@/services/clock';
import { usePickPrice, type Picked } from '@/state/onboarding';
import { chooseCycle, cycleChoices } from '@/state/picks';
import {
  Bell,
  Button,
  Card,
  CardIcon,
  ChevronLeft,
  ChevronRight,
  F,
  IconButton,
  LogoTile,
  Segmented,
  Txt,
  brand,
  haptic,
  usePalette,
} from '@/ui/sunflower';

type Mode = 'next' | 'receipt';
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EVERY: Record<Cycle, string> = { weekly: 'every week', monthly: 'every month', quarterly: 'every 3 months', yearly: 'every year' };

function B({ children }: { children: string }) {
  return <Txt v="body" style={{ fontFamily: F.bold, fontSize: 14 }}>{children}</Txt>;
}

export function DateBody({
  sub,
  onSave,
  onNotSure,
  trial = false,
  leads = HEADS_UP_LEADS,
  reminderTime = '09:00',
  off,
}: {
  sub: Picked;
  onSave: (anchor: DateOnly, source: Mode, cycle: Cycle) => void;
  onNotSure: () => void;
  /** A free trial: ask when it ends (a future day). There's no receipt yet. */
  trial?: boolean;
  leads?: readonly number[];
  reminderTime?: string;
  /** Shown instead of the reminder dates when this one won't get any. */
  off?: string;
}) {
  const p = usePalette();
  const priceOf = usePickPrice();
  const today = toDateOnly(clockNow());
  const confirmed = sub.dateSource !== 'none';
  const [mode, setMode] = useState<Mode>(trial || sub.dateSource === 'next' ? 'next' : 'receipt');
  // Switching modes shows the matching receipt, but the real next charge is kept,
  // so a 31st never becomes the 28th by going through February.
  const [keepNext, setKeepNext] = useState<DateOnly | null>(null);
  const [cycle, setCycle] = useState<Cycle>(sub.cycle);
  // Nothing is pre-selected without a real date: the user taps the real day.
  const [selected, setSelected] = useState<DateOnly | null>(confirmed ? sub.anchor : null);
  const start = (m: Mode, sel: DateOnly | null) => {
    const base = sel ?? (m === 'receipt' && parseDate(today).d <= 15 ? addDays(today, -parseDate(today).d) : today);
    const { y, m: mm } = parseDate(base);
    return { y, m: mm };
  };
  const [view, setView] = useState(() => start(mode, selected));

  const min = mode === 'next' ? today : addDays(today, -366);
  const max = mode === 'next' ? addDays(today, 366) : today;
  const monthIndex = (v: { y: number; m: number }) => v.y * 12 + v.m;
  const minM = parseDate(min);
  const maxM = parseDate(max);
  const canPrev = monthIndex(view) > monthIndex(minM);
  const canNext = monthIndex(view) < monthIndex(maxM);

  const switchMode = (m: Mode) => {
    // Carry the answer across: a next charge becomes the receipt before it, and back.
    let sel: DateOnly | null = null;
    let keep: DateOnly | null = null;
    if (selected) {
      const realNext = keepNext ?? (mode === 'receipt' ? nextFromLastCharge(selected, cycle, today) : selected);
      sel = m === 'receipt' ? previousCharge(realNext, cycle) : realNext;
      if (m === 'receipt' && sel > today) sel = null;
      keep = sel ? realNext : null;
    }
    setMode(m);
    setSelected(sel);
    setKeepNext(keep);
    setView(start(m, sel));
  };

  const next = selected ? (keepNext ?? (mode === 'receipt' ? nextFromLastCharge(selected, cycle, today) : selected)) : null;
  const heads = next ? reminderDaysFor(next, clockNow(), leads, reminderTime) : [];
  // Preview the plan the cycle switch would move to.
  const preview = chooseCycle(sub, cycle);
  const price = priceOf(preview) ?? 'No price yet';
  const cycles = cycleChoices(sub);
  const cells = monthGrid(view.y, view.m);
  const rows: (DateOnly | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push([...cells.slice(i, i + 7), ...Array(Math.max(0, i + 7 - cells.length)).fill(null)]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <LogoTile id={sub.id} size={40} color={sub.color} mono={sub.mono} ink={sub.ink} />
        <View style={{ flex: 1 }}>
          <Txt v="bodyStrong" style={{ fontSize: 17 }} accessibilityRole="header">
            {sub.name}
          </Txt>
          <Txt v="body" tone="mute" num style={{ fontSize: 14 }}>
            {price}
          </Txt>
        </View>
        {cycles.length > 1 ? (
        <Segmented
          label="How often it charges"
          value={cycle === 'monthly' || cycle === 'yearly' ? cycle : null}
          onChange={(c: 'monthly' | 'yearly') => setCycle(c)}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          height={36}
          fontSize={13.5}
          style={{ width: 150 }}
        />
        ) : null}
      </View>

      {trial ? (
        <Txt v="heading" accessibilityRole="header" style={{ marginTop: 14 }}>
          When does the trial end?
        </Txt>
      ) : (
        <Segmented
          label="Which date do you know"
          value={mode}
          onChange={switchMode}
          options={[
            { value: 'next', label: 'Next charge' },
            { value: 'receipt', label: 'From my last receipt' },
          ]}
          style={{ marginTop: 14 }}
        />
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <Txt v="heading" accessibilityRole="header">
          {monthTitle(view.y, view.m)}
        </Txt>
        <View style={{ flexDirection: 'row', marginRight: -8 }}>
          <IconButton label="Previous month" disabled={!canPrev} onPress={() => setView(shiftMonth(view.y, view.m, -1))}>
            <ChevronLeft color={p.fg} />
          </IconButton>
          <IconButton label="Next month" disabled={!canNext} onPress={() => setView(shiftMonth(view.y, view.m, 1))}>
            <ChevronRight color={p.fg} size={22} />
          </IconButton>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 2 }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {WEEKDAYS.map((w, i) => (
          <View key={i} style={{ flex: 1, height: 22, alignItems: 'center', justifyContent: 'center' }}>
            <Txt v="sub" tone="mute" style={{ fontFamily: F.bold, fontSize: 12 }}>
              {w}
            </Txt>
          </View>
        ))}
      </View>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', marginTop: 2 }}>
          {row.map((d, i) => {
            if (!d) return <View key={i} style={{ flex: 1, height: 42 }} />;
            const on = d === selected;
            const disabled = d < min || d > max;
            const isToday = d === today;
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`${WEEKDAY_NAMES[i]}, ${longDate(d).split(', ')[1]}${isToday ? ', today' : ''}`}
                accessibilityState={{ selected: on, disabled }}
                disabled={disabled}
                onPress={() => {
                  haptic.select();
                  setSelected(d);
                  setKeepNext(null);
                }}
                style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: on ? brand.sunflower : 'transparent',
                    borderWidth: on ? 2 : 0,
                    borderColor: brand.ink,
                  }}
                >
                  <Txt
                    v="label"
                    num
                    color={on ? brand.ink : disabled ? p.disabledFg : p.fg}
                    style={{ fontFamily: on ? F.heavy : F.semi, fontSize: 16 }}
                    maxFontSizeMultiplier={1.2}
                  >
                    {parseDate(d).d}
                  </Txt>
                  {isToday && !on ? <View style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: p.fg }} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Card style={{ marginTop: 12, paddingHorizontal: 14, paddingVertical: 11, gap: 6 }}>
        {next && selected ? (
          <>
            <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>
              <CardIcon color={p.fg} size={17} />
              <Txt v="body" style={{ flex: 1, fontSize: 14 }}>
                {mode === 'receipt' ? (
                  <>
                    Last charged <B>{shortDate(selected)}</B>, so next is <B>{weekdayDate(next)}</B>
                  </>
                ) : (
                  <>
                    Charges <B>{weekdayDate(next)}</B>, then {EVERY[cycle]}
                  </>
                )}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>
              <Bell color={p.fg} size={17} fill={brand.sunflower} />
              <Txt v="body" style={{ flex: 1, fontSize: 14 }}>
                {off ? (
                  off
                ) : heads.length >= 2 ? (
                  <>
                    Reminders <B>{heads.slice(0, -1).map(weekdayDate).join(', ')}</B> and <B>{weekdayDate(heads[heads.length - 1])}</B>
                  </>
                ) : heads.length === 1 ? (
                  <>
                    Reminder <B>{weekdayDate(heads[0])}</B>
                  </>
                ) : (
                  trial ? 'Too close for a reminder. Cancel it today if you don’t want it.' : 'Too close for a reminder this time. The next one gets them.'
                )}
              </Txt>
            </View>
          </>
        ) : (
          <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center', minHeight: 46 }}>
            <CardIcon color={p.fg} size={17} />
            <Txt v="body" style={{ flex: 1, fontSize: 14 }}>
              {trial
                ? `Tap the day your ${sub.name} trial ends. It’s in the sign-up email.`
                : mode === 'receipt'
                  ? `Tap the day on your last ${sub.name} receipt. Your email or bank app has it.`
                  : `Tap the day ${sub.name} charges you next.`}
            </Txt>
          </View>
        )}
      </Card>

      <View style={{ flex: 1, minHeight: 12 }} />
      <Button
        label={next ? (trial ? `Trial ends ${weekdayDate(next)}` : `Set next charge ${weekdayDate(next)}`) : 'Pick a day'}
        disabled={!selected}
        onPress={() => {
          if (!selected) return;
          if (keepNext) onSave(keepNext, 'next', cycle);
          else onSave(selected, mode, cycle);
        }}
      />
      <Button kind="text" label="I’m not sure" onPress={onNotSure} style={{ marginTop: 4 }} />
    </View>
  );
}
