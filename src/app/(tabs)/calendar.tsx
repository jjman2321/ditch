// 12 · Calendar. A month of charges: logos on charge days, reminder dots,
// today, the month's total per currency, the selected day's charges with
// their reminder days, and the subs with no date yet (DECISIONS #33).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { MONTH_LONG, WEEKDAY_LONG, addDays, parseDate, shiftMonth, weekdayDate, weekdayOf, type DateOnly } from '@/domain/dates';
import { HEADS_UP_LEADS } from '@/domain/charges';
import { effectiveLeads, timeLabel } from '@/domain/settings';
import { calendarMonth, isPending, isPricedSub, isProTrial, monthDue, remindedIds, undatedSubs, yearlyOfSub, type CalendarCharge, type CalendarDay } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { Bell, BellOff, Card, ChevronLeft, ChevronRight, EDGE, F, IconButton, SectionHeader, Txt, brand, haptic, useInsets, usePalette } from '@/ui/sunflower';

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const GAP = 4;

export default function Calendar() {
  const p = usePalette();
  const insets = useInsets();
  const app = useApp();
  const money = useAppMoney();
  const editor = useEditor();
  const { subs, today, pro, settings } = app;
  const t = parseDate(today);
  const [view, setView] = useState({ y: t.y, m: t.m });
  const reminded = useMemo(() => remindedIds(subs, pro), [subs, pro]);
  const leads = useMemo(() => effectiveLeads(settings, pro), [settings, pro]);
  const days = useMemo(() => calendarMonth(subs, view.y, view.m, today, reminded, leads), [subs, view, today, reminded, leads]);
  const due = monthDue(days, settings.currency);
  const undated = useMemo(() => undatedSubs(subs).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a)), [subs]);
  const [picked, setPicked] = useState<DateOnly | null>(null);
  const [gridW, setGridW] = useState(345);

  // Default: the next charge this month on or after today, else the first one, else today.
  const fallback = useMemo(() => {
    const real = days.filter((d): d is CalendarDay => !!d);
    return (real.find((d) => d.charges.length && d.date >= today) ?? real.find((d) => d.charges.length) ?? real.find((d) => d.today) ?? real[0]).date;
  }, [days, today]);
  const selected = picked && days.some((d) => d?.date === picked) ? picked : fallback;
  const sel = days.find((d) => d?.date === selected) ?? null;

  const cellW = (gridW - GAP * 6) / 7;
  const rows: (CalendarDay | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  const blocked = app.notif === 'denied' || app.notif === 'undetermined';
  const title = view.y === t.y ? MONTH_LONG[view.m - 1] : `${MONTH_LONG[view.m - 1]} ${view.y}`;

  const move = (n: number) => {
    haptic.select();
    setView(shiftMonth(view.y, view.m, n));
    setPicked(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: EDGE, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Txt v="displayM" accessibilityRole="header" style={{ flex: 1, fontSize: 32, lineHeight: 40 }} numberOfLines={1}>
            {title}
          </Txt>
          <IconButton label="Previous month" onPress={() => move(-1)}>
            <ChevronLeft color={p.fg} size={26} />
          </IconButton>
          <IconButton label="Next month" onPress={() => move(1)} style={{ marginRight: -8 }}>
            <ChevronRight color={p.fg} size={26} />
          </IconButton>
        </View>

        <View
          accessible
          accessibilityLabel={
            due.totals.length
              ? `${due.totals.map((x) => money(x.amountMinor, x.currency)).join(' plus ')} due in ${MONTH_LONG[view.m - 1]}, ${due.count} ${due.count === 1 ? 'charge' : 'charges'}`
              : `Nothing due in ${MONTH_LONG[view.m - 1]}`
          }
          style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 8, marginTop: 8 }}
        >
          <Txt v="displayM" tone="money" num style={{ fontSize: 31, lineHeight: 38 }}>
            {due.totals[0] ? money(due.totals[0].amountMinor, due.totals[0].currency) : money(0, settings.currency)}
          </Txt>
          <Txt v="leadS" tone="fg2" num style={{ fontSize: 15, letterSpacing: -0.3 }}>
            {due.totals.slice(1).map((x) => `+ ${money(x.amountMinor, x.currency)} `)}due in {MONTH_LONG[view.m - 1]} · {due.count} {due.count === 1 ? 'charge' : 'charges'}
          </Txt>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 16, marginBottom: 6 }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {WEEK.map((w, i) => (
            <View key={i} style={{ width: cellW, marginRight: i < 6 ? GAP : 0, alignItems: 'center' }}>
              <Txt v="sub" tone="mute" style={{ fontFamily: F.bold, fontSize: 13 }}>
                {w}
              </Txt>
            </View>
          ))}
        </View>

        <View onLayout={(e) => setGridW(e.nativeEvent.layout.width)} style={{ gap: 5 }}>
          {rows.map((row, r) => (
            <View key={r} style={{ flexDirection: 'row', gap: GAP }}>
              {Array.from({ length: 7 }, (_, i) => row[i] ?? null).map((d, i) =>
                d ? (
                  <DayCell key={d.date} day={d} w={cellW} selected={d.date === selected} onPress={() => (haptic.select(), setPicked(d.date))} />
                ) : (
                  <View key={`x${i}`} style={{ width: cellW, height: 64 }} />
                ),
              )}
            </View>
          ))}
        </View>

        <Legend />

        <SectionHeader
          title={weekdayDate(selected).toUpperCase()}
          right={sel?.charges.length ? `${sel.charges.length} ${sel.charges.length === 1 ? 'charge' : 'charges'}` : undefined}
          style={{ marginTop: 20, marginBottom: 8 }}
        />
        {sel && sel.charges.length ? (
          <Card style={{ paddingVertical: 4 }}>
            {sel.charges.map((c, i) => (
              <ChargeRow
                key={c.sub.id}
                c={c}
                first={i === 0}
                today={today}
                leads={isProTrial(c.sub) ? [...HEADS_UP_LEADS] : leads}
                time={settings.reminderTime}
                blocked={blocked}
                onPress={() => (isPending(c.sub) ? router.push(`/ditch/${c.sub.id}`) : editor.openEdit(c.sub.id))}
              />
            ))}
          </Card>
        ) : (
          <Card style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <Txt v="body" tone="mute">
              {sel?.headsUp ? `A reminder goes off at ${timeLabel(settings.reminderTime)} today. Nothing charges.` : 'Nothing charges this day.'}
            </Txt>
          </Card>
        )}

        {undated.length ? (
          <>
            <SectionHeader title="No date yet" right="No reminders" style={{ marginTop: 20, marginBottom: 8 }} />
            <Card style={{ paddingVertical: 4 }}>
              {undated.map((u, i) => (
                <Pressable
                  key={u.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${u.name}, no date yet. Add date`}
                  onPress={() => editor.openEdit(u.id)}
                  style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair, opacity: pressed ? 0.75 : 1 })}
                >
                  <SubLogo sub={u} size={32} />
                  <Txt v="label" color={p.cardFg} numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
                    {u.name}
                  </Txt>
                  <Txt v="label" color={p.cardFg} style={{ textDecorationLine: 'underline' }}>
                    Add date
                  </Txt>
                </Pressable>
              ))}
            </Card>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function DayCell({ day, w, selected, onPress }: { day: CalendarDay; w: number; selected: boolean; onPress: () => void }) {
  const p = usePalette();
  const { d } = parseDate(day.date);
  const first = day.charges[0];
  const more = day.charges.length - 1;
  const label = `${WEEKDAY_LONG[weekdayOf(day.date)]}, ${MONTH_LONG[parseDate(day.date).m - 1]} ${d}${day.today ? ', today' : ''}${
    day.charges.length ? `, ${day.charges.map((c) => c.sub.name).join(', ')}` : ''
  }${day.headsUp ? ', reminder day' : ''}`;
  const numColor = selected ? brand.ink : day.past ? p.mute : p.cardFg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        width: w,
        height: 64,
        borderRadius: 12,
        backgroundColor: selected ? brand.sunflower : p.card,
        borderWidth: selected ? 2.5 : p.dark ? 1 : 0,
        borderColor: selected ? brand.ink : p.cardBorder,
        padding: selected ? 3.5 : 6,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {day.today && !selected ? (
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: p.dark ? p.fg : brand.ink, alignItems: 'center', justifyContent: 'center', marginLeft: -2, marginTop: -1 }}>
            <Txt v="label" num color={p.dark ? brand.ink : brand.white} style={{ fontFamily: F.bold, fontSize: 13.5 }} maxFontSizeMultiplier={1.1}>
              {d}
            </Txt>
          </View>
        ) : (
          <Txt v="label" num color={numColor} style={{ fontFamily: F.semi, fontSize: 14.5, lineHeight: 20 }} maxFontSizeMultiplier={1.1}>
            {d}
          </Txt>
        )}
        {day.headsUp ? (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: brand.sunflower, borderWidth: p.dark ? 0 : 1.5, borderColor: brand.ink }} />
        ) : null}
      </View>
      {first ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: first.pending ? 0.4 : 1 }}>
          <SubLogo sub={first.sub} size={24} />
          {more > 0 ? (
            <Txt v="sub" num color={selected ? brand.ink : p.mute} style={{ position: 'absolute', right: -2, bottom: -2, fontFamily: F.bold, fontSize: 11 }} maxFontSizeMultiplier={1}>
              +{more}
            </Txt>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function Legend() {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }} accessible accessibilityLabel="Key: dot means a reminder, filled circle means today">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: brand.sunflower, borderWidth: p.dark ? 0 : 1.5, borderColor: brand.ink }} />
        <Txt v="body" tone="fg2" style={{ fontSize: 14.5 }}>
          Reminder
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: p.dark ? p.fg : brand.ink }} />
        <Txt v="body" tone="fg2" style={{ fontSize: 14.5 }}>
          Today
        </Txt>
      </View>
    </View>
  );
}

function ChargeRow({
  c,
  first,
  today,
  leads,
  time,
  blocked,
  onPress,
}: {
  c: CalendarCharge;
  first: boolean;
  today: DateOnly;
  leads: number[];
  time: string;
  blocked: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const money = useAppMoney();
  const s = c.sub;
  const on = (c.reminded || isProTrial(s)) && !c.pending;
  const heads = on ? leads.map((l) => addDays(c.date, -l)).filter((d) => d >= today) : [];
  const line = c.pending ? 'Ditched. Cancel before it charges.' : !on ? 'No reminder' : blocked ? 'Reminders are off' : `Reminders at ${timeLabel(time)}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${s.name}, ${isPricedSub(s) ? money(s.amountMinor, s.currency) : 'no price'}, ${line}${heads.length ? `, ${heads.map(weekdayDate).join(' and ')}` : ''}`}
      onPress={onPress}
      style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: first ? 0 : 1, borderTopColor: p.hair, opacity: pressed ? 0.75 : 1 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <SubLogo sub={s} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
            {isProTrial(s) ? 'Ditch Pro trial' : s.name}
          </Txt>
          <Txt v="body" tone="mute" style={{ fontSize: 14.5, marginTop: 1 }} numberOfLines={1}>
            {line}
          </Txt>
        </View>
        {on && !blocked ? <Bell color={p.dark ? brand.sunflower : brand.ink} fill={brand.sunflower} size={19} /> : <BellOff color={p.disabledFg} size={19} />}
        <Txt v="moneyM" num color={p.cardFg} style={{ fontSize: 17.5, minWidth: 62, textAlign: 'right' }}>
          {isPricedSub(s) ? money(s.amountMinor, s.currency) : '–'}
        </Txt>
      </View>
      {heads.length && !blocked ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginLeft: 48 }}>
          {heads.map((h) => (
            <View key={h} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, borderRadius: 16, paddingHorizontal: 12, backgroundColor: p.dark ? '#2E2B25' : '#FFF0C2' }}>
              <Bell color={p.dark ? brand.sunflower : brand.ink} fill={brand.sunflower} size={14} />
              <Txt v="label" num color={p.cardFg} style={{ fontSize: 15 }}>
                {weekdayDate(h)}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
