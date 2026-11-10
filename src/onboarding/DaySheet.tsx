// 4b · "Pick a day" → "Which day does it charge you?" (design/v12 render 04b).
// Monthly: the 31 days and "Last day of the month"; the anchor day is kept
// and clamps in short months (src/domain/dates). Yearly and quarterly: a
// month calendar for the next charge. The sentence under it says when the
// next charge is and how it repeats.

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ordinal } from '@/domain/charges';
import { shortPlanName } from '@/domain/copy';
import {
  addDays,
  anchorForDayOfMonth,
  longDate,
  monthGrid,
  monthTitle,
  nextChargeDate,
  parseDate,
  shiftMonth,
  weekdayDate,
  type DateOnly,
} from '@/domain/dates';
import { CYCLE_WORDS } from '@/domain/money';
import { onboardingToday, usePickPrice, type Picked } from '@/state/onboarding';
import { Button, CardIcon, ChevronLeft, ChevronRight, F, IconButton, LogoTile, Sheet, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

import { CloseButton } from './Parts';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const EVERY = { weekly: 'every week', monthly: 'every month', quarterly: 'every 3 months', yearly: 'every year' } as const;

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

function Body({ pick, onDone, onClose }: { pick: Picked; onDone: (anchor: DateOnly) => void; onClose: () => void }) {
  const p = usePalette();
  const priceOf = usePickPrice();
  const today = onboardingToday();
  const monthly = pick.cycle === 'monthly';
  const known = pick.when === 'day' && pick.dateSource !== 'guess';
  // Monthly: the day of the month (31 = last day). Never pre-filled from a rough guess.
  const [day, setDay] = useState<number | null>(known && monthly ? parseDate(pick.anchor).d : null);
  // Other cycles: the next charge date itself.
  const [date, setDate] = useState<DateOnly | null>(known && !monthly ? nextChargeDate(pick.anchor, pick.cycle, today) : null);
  const [view, setView] = useState(() => parseDate(date ?? today));

  const anchor = monthly ? (day ? anchorForDayOfMonth(day, today) : null) : date;
  const next = anchor ? nextChargeDate(anchor, pick.cycle, today) : null;
  const price = priceOf(pick, 'words');
  const plan = pick.planName ? shortPlanName(pick.planName, pick.name) : null;
  const detail = [plan, price].filter(Boolean).join(' · ');
  const then = monthly ? (day === 31 ? 'Then the last day of every month.' : day ? `Then the ${ordinal(day)} of every month.` : '') : `Then ${EVERY[pick.cycle]}.`;

  const max = addDays(today, pick.cycle === 'yearly' ? 365 : pick.cycle === 'quarterly' ? 92 : 31);
  const canPrev = view.y * 12 + view.m > parseDate(today).y * 12 + parseDate(today).m;
  const canNext = view.y * 12 + view.m < parseDate(max).y * 12 + parseDate(max).m;
  const cells = monthly ? [] : monthGrid(view.y, view.m);
  const weeks: (DateOnly | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push([...cells.slice(i, i + 7), ...Array(Math.max(0, i + 7 - cells.length)).fill(null)]);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <LogoTile id={pick.id} size={40} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt v="strong" numberOfLines={1}>
            {pick.name}
          </Txt>
          {detail ? (
            <Txt v="sub" tone="mute" num numberOfLines={1}>
              {detail}
            </Txt>
          ) : null}
        </View>
        <CloseButton onPress={onClose} />
      </View>
      <Txt v="heading" accessibilityRole="header" style={{ marginTop: 16 }}>
        {monthly ? 'Which day does it charge you?' : 'When does it charge you next?'}
      </Txt>
      <Txt v="sub" tone="fg2" style={{ marginTop: 4 }}>
        {monthly ? 'Your bank app shows the last one.' : 'Your bank app or the receipt email has it.'}
      </Txt>

      {monthly ? (
        <>
          <View style={{ marginTop: 12 }}>
            {[0, 1, 2, 3, 4].map((r) => (
              <View key={r} style={{ flexDirection: 'row' }}>
                {Array.from({ length: 7 }, (_, c) => {
                  const d = r * 7 + c + 1;
                  if (d > 31) return <View key={c} style={{ flex: 1 }} />;
                  return <DayCell key={c} label={String(d)} on={day === d} a11y={`The ${ordinal(d)}`} onPress={() => setDay(d)} />;
                })}
              </View>
            ))}
          </View>
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

      <View
        accessible
        accessibilityLiveRegion="polite"
        style={{ marginTop: 16, borderRadius: 16, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}
      >
        <View style={{ marginTop: 2 }}>
          <CardIcon color={p.dark ? p.fg : brand.ink} size={20} />
        </View>
        <Txt v="body" num style={{ flex: 1, fontFamily: F.semi }}>
          {next ? `Next charge: ${weekdayDate(next)}.` : 'Pick the day it charges.'}
          {'\n'}
          <Txt v="body" tone="fg2">
            {next ? then : `We’ll remind you 3 days and 1 day before, ${CYCLE_WORDS[pick.cycle].replace('a ', 'each ')}.`}
          </Txt>
        </Txt>
      </View>
      <Button label="Done" disabled={!anchor} onPress={() => anchor && onDone(anchor)} style={{ marginTop: 16 }} />
    </View>
  );
}

export function DaySheet({ pick, visible, onClose, onDone }: { pick: Picked | null; visible: boolean; onClose: () => void; onDone: (anchor: DateOnly) => void }) {
  return (
    <Sheet visible={visible && !!pick} onClose={onClose} fit gap={0} maxContent={420} label={pick ? `${pick.name} charge day` : 'Charge day'}>
      {pick ? <Body key={pick.id} pick={pick} onDone={onDone} onClose={onClose} /> : null}
    </Sheet>
  );
}
