// 12 · Calendar. A month of charges: logos on charge days, reminder dots,
// today, the month's total per currency, the selected day's charges with
// their reminder days, and the subs with no date yet (DECISIONS #33).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { MONTH_LONG, WEEKDAY_LONG, addDays, daysInMonth, parseDate, shiftMonth, toDateOnly, weekdayDate, weekdayOf, weekdayShort, type DateOnly } from '@/domain/dates';
import { HEADS_UP_LEADS } from '@/domain/charges';
import { chargesSoonLine } from '@/domain/copy';
import { effectiveLeads, shortTimeLabel, timeLabel } from '@/domain/settings';
import {
  FREE_REMINDERS,
  calendarMonth,
  homeFirst,
  isActive,
  isPending,
  isPricedSub,
  isProTrial,
  monthDue,
  remindedIds,
  undatedSubs,
  undatedTotals,
  yearAhead,
  yearlyOfSub,
  type CalendarCharge,
  type CalendarDay,
} from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { OffBanner, openPhoneSettings } from '@/home/HomeParts';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { Bang, BottomFade, Button, Card, ChevronLeft, ChevronRight, F, IconButton, SectionHeader, Txt, brand, haptic, useInsets, usePalette, usePageEdge } from '@/ui/sunflower';

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const GAP = 4;
/** A day with hundreds of charges (or a long "No date yet") shows this many rows, then "Show all". */
const FIRST_ROWS = 20;

/** "1,341": counts with thousands separators. */
const count = (n: number) => n.toLocaleString('en-US');
/** "1 charge", "1,341 charges". */
const charges = (n: number) => `${count(n)} ${n === 1 ? 'charge' : 'charges'}`;

export default function Calendar() {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  // 320pt wide (SE with Display Zoom): "September" fits next to the arrows.
  const narrow = useWindowDimensions().width < 350;
  const app = useApp();
  const money = useAppMoney();
  const editor = useEditor();
  const { subs, today, pro, settings } = app;
  const t = parseDate(today);
  const [view, setView] = useState({ y: t.y, m: t.m });
  const reminded = useMemo(() => remindedIds(subs, pro), [subs, pro]);
  const leads = useMemo(() => effectiveLeads(settings, pro), [settings, pro]);
  // A ditched sub's one last check ("Did you cancel Netflix?") is a reminder too, so it gets a dot. Taken from the plan, like the day list.
  const lastChecks = useMemo(() => app.plan.filter((r) => r.kind === 'last-check').map((r) => toDateOnly(r.fireAt)), [app.plan]);
  const days = useMemo(() => calendarMonth(subs, view.y, view.m, today, reminded, leads, lastChecks), [subs, view, today, reminded, leads, lastChecks]);
  // Nothing tracked yet: an empty card with "Add a subscription" under the grid, and no legend.
  const empty = !subs.some((s) => (isActive(s) || isPending(s)) && !isProTrial(s));
  // Their payday this month (clamped to short months), marked on the grid.
  const paydayDate = settings.payday ? `${view.y}-${String(view.m).padStart(2, '0')}-${String(Math.min(settings.payday, daysInMonth(view.y, view.m))).padStart(2, '0')}` : null;
  const due = monthDue(days, settings.currency);
  // This month only: what's still to come from today (Monzo/Orbit-style "still to pay"). One currency only, so nothing is added across currencies.
  const isThisMonth = view.y === t.y && view.m === t.m;
  const left = isThisMonth
    ? monthDue(
        days.map((d) => (d && d.date >= today ? d : null)),
        settings.currency,
      )
    : null;
  const stillLine =
    left && due.totals.length === 1 && left.totals.length <= 1 && left.count < due.count
      ? left.count
        ? `${money(left.totals[0].amountMinor, left.totals[0].currency)} still to come in ${MONTH_LONG[view.m - 1]}`
        : 'All paid for this month'
      : null;
  const undated = useMemo(() => undatedSubs(subs).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a)), [subs]);
  // The next 12 months at a glance (DECISIONS #60, free): which months are heavy, and the yearly charges in them.
  const ahead = useMemo(() => yearAhead(subs, today), [subs, today]);
  // One "Most months" line, then only the months that differ (the yearly and 6-monthly ones), so it isn't 12 identical rows.
  // Undated subs have no month, so the Year ahead leaves them out: a line under it says what they add (per currency).
  const undatedMonthly = useMemo(() => undatedTotals(subs, today, settings.currency), [subs, today, settings.currency]);
  const aheadRows = useMemo(() => {
    // Each currency on its own line, never joined with "+" (rule 1). The joined text is only a key for "Most months".
    const fmt = (a: (typeof ahead)[number]) =>
      homeFirst(a.totals, settings.currency)
        .map((x) => money(x.amountMinor, x.currency))
        .join('\n') || '–';
    // The 13th month is only its first days (up to a year from today): it shows only for a yearly or 6-monthly charge.
    const full = ahead.length > 12 ? ahead.slice(0, 12) : ahead;
    const counts = new Map<string, number>();
    full.forEach((a) => counts.set(fmt(a), (counts.get(fmt(a)) ?? 0) + 1));
    const usual = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (!usual || ahead.every((a) => !a.totals.length)) return [];
    const rows = [{ key: 'usual', label: usual[1] === 12 ? 'Every month' : 'Most months', amounts: usual[0], bigs: '', bigsSpoken: '', usual: true }];
    for (const [i, a] of ahead.entries()) {
      if (fmt(a) === usual[0] && !a.big.length) continue;
      if (i >= 12 && !a.big.length) continue;
      const { y, m } = parseDate(a.month);
      // This month only counts from today, so say so: "Rest of November".
      rows.push({
        key: a.month,
        label: i === 0 ? `Rest of ${MONTH_LONG[m - 1]}` : `${MONTH_LONG[m - 1]}${y !== t.y ? ` ${y}` : ''}`,
        amounts: fmt(a),
        bigs: a.big.map((b) => `${b.sub.name} ${money(b.sub.amountMinor, b.sub.currency)}`).join(' · '),
        bigsSpoken: a.big.map((b) => `${b.sub.name} ${money(b.sub.amountMinor, b.sub.currency)}`).join(', '),
        usual: false,
      });
    }
    return rows;
  }, [ahead, money, t.y, settings.currency]);
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
  // iPad: cells are ~100pt wide, so a fixed 64pt height looks squashed. Taller cells and bigger logos there.
  const big = cellW > 80;
  const cellH = big ? Math.round(cellW * 0.85) : 64;
  const rows: (CalendarDay | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  const blocked = app.notif === 'denied' || app.notif === 'undetermined';
  // A day with no charge but a reminder: say which one, e.g. "Reminder at 9 AM: Netflix charges Sat, Nov 14."
  // A ditched sub's last check: "Last reminder at 9 AM: cancel Netflix before Tue, Nov 24."
  const dayReminders = sel ? app.plan.filter((r) => r.kind !== 'keep-going' && toDateOnly(r.fireAt) === sel.date) : [];
  const names = dayReminders.map((r) => {
    const s = subs.find((x) => x.id === r.subId);
    const trial = !!s && isProTrial(s);
    if (r.kind === 'last-check') return `cancel ${s?.name ?? 'it'} before ${weekdayDate(r.chargeDate)}`;
    return `${trial ? 'your Ditch Pro trial' : (s?.name ?? 'Ditch')} ${trial ? 'ends' : 'charges'} ${weekdayDate(r.chargeDate)}`;
  });
  const onlyLast = dayReminders.length > 0 && dayReminders.every((r) => r.kind === 'last-check');
  const reminderLine = names.length ? `${onlyLast ? 'Last reminder' : 'Reminder'} at ${shortTimeLabel(settings.reminderTime)}: ${names.join('; ')}.`.replace(/ (\S+)$/, '\u00A0$1') : null;
  const emptyDayLine = !sel?.headsUp ? 'Nothing charges this day.' : (reminderLine ?? `A reminder goes off at ${shortTimeLabel(settings.reminderTime)}. Nothing charges this day.`);
  // The day list: the first 20, then "Show all" (a day can hold hundreds when the list is huge).
  const [allDay, setAllDay] = useState(false);
  const [allUndated, setAllUndated] = useState(false);
  const dayCharges = sel?.charges ?? [];
  const shownCharges = allDay ? dayCharges : dayCharges.slice(0, FIRST_ROWS);
  const shownUndated = allUndated ? undated : undated.slice(0, FIRST_ROWS);
  // Same words as before (owner, Nov 20: old wording); thousands separators only.
  const dayRight = dayCharges.length ? charges(dayCharges.length) : undefined;
  const room = pro ? 0 : Math.max(0, FREE_REMINDERS - reminded.size);
  const title = view.y === t.y ? MONTH_LONG[view.m - 1] : `${MONTH_LONG[view.m - 1]} ${view.y}`;

  const move = (n: number) => {
    haptic.select();
    setView(shiftMonth(view.y, view.m, n));
    setPicked(null);
    setAllDay(false);
  };
  const backToToday = () => {
    haptic.select();
    setView({ y: t.y, m: t.m });
    setPicked(null);
    setAllDay(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: edge, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Txt v="displayM" accessibilityRole="header" style={{ flex: 1, fontSize: narrow ? 26 : 32, lineHeight: 40 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {title}
          </Txt>
          <IconButton label="Previous month" onPress={() => move(-1)}>
            <ChevronLeft color={p.fg} size={26} />
          </IconButton>
          <IconButton label="Next month" onPress={() => move(1)} style={{ marginRight: -8 }}>
            <ChevronRight color={p.fg} size={26} />
          </IconButton>
        </View>

        {blocked ? (
          <View style={{ marginTop: 12 }}>
            <OffBanner status={app.notif} onTurnOn={() => (app.notif === 'denied' ? openPhoneSettings() : void app.askNotif())} />
          </View>
        ) : null}

        <View
          accessible
          accessibilityLabel={
            due.totals.length ? `${due.totals.map((x) => money(x.amountMinor, x.currency)).join(', and ')} due in ${MONTH_LONG[view.m - 1]}, ${charges(due.count)}` : `Nothing due in ${MONTH_LONG[view.m - 1]}`
          }
          style={{ marginTop: 8 }}
        >
          {/* The total always on its own line, the "due in" line always one line under it: the block is the same
              height every month and on every width, so the grid never jumps when the total passes $100. */}
          {/* The month name keeps its full size: "Today" sits on the total's line, where there's room. */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Txt v="displayM" tone="money" num style={{ flex: 1, fontSize: 31, lineHeight: 38 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {due.totals[0] ? money(due.totals[0].amountMinor, due.totals[0].currency) : money(0, settings.currency)}
            </Txt>
            {isThisMonth ? null : (
              // Away from this month: one tap back (Apple Calendar, Fantastical).
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to this month"
                onPress={backToToday}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                style={({ pressed }) => ({
                  minHeight: 32,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: p.fg,
                  justifyContent: 'center',
                  marginLeft: 8,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Txt v="label" color={p.fg} style={{ fontSize: 14, fontFamily: F.bold }}>
                  Today
                </Txt>
              </Pressable>
            )}
          </View>
          <Txt v="leadS" tone="fg2" num style={{ fontSize: 15, letterSpacing: -0.3 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            due in {MONTH_LONG[view.m - 1]} · {charges(due.count)}
          </Txt>
          {/* Other currencies: their own line each, no "+" (never added together). */}
          {due.totals.slice(1).map((x) => (
            <Txt key={x.currency} v="leadS" tone="fg2" num style={{ fontSize: 15, letterSpacing: -0.3 }}>
              {money(x.amountMinor, x.currency)} due in {MONTH_LONG[view.m - 1]}
            </Txt>
          ))}
        </View>
        {stillLine ? (
          <Txt v="sub" tone="fg2" num style={{ marginTop: 2 }}>
            {stillLine}
          </Txt>
        ) : null}

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
                  <DayCell
                    key={d.date}
                    day={d}
                    w={cellW}
                    h={cellH}
                    logo={big ? 30 : cellW < 46 ? 20 : 24}
                    payday={d.date === paydayDate}
                    selected={d.date === selected}
                    blocked={blocked}
                    onPress={() => (haptic.select(), setPicked(d.date), setAllDay(false))}
                  />
                ) : (
                  <View key={`x${i}`} style={{ width: cellW, height: cellH }} />
                ),
              )}
            </View>
          ))}
        </View>

        {empty ? (
          // Nothing tracked yet: say what this screen is for, and one way in (no legend, no empty day list).
          <Card style={{ marginTop: 20, paddingHorizontal: 18, paddingVertical: 18 }}>
            <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }}>
              Nothing on your calendar yet.
            </Txt>
            <Txt v="body" tone="mute" style={{ marginTop: 4 }}>
              Add what you pay for and every charge shows up here.
            </Txt>
            <Button label="Add a subscription" onPress={() => editor.openAdd()} style={{ marginTop: 16 }} />
          </Card>
        ) : (
          <>
            <Legend blocked={blocked} />

            <SectionHeader title={`${weekdayDate(selected).toUpperCase()}${selected === paydayDate ? ' · PAYDAY' : ''}`} right={dayRight} style={{ marginTop: 20, marginBottom: 8 }} />
            {sel && dayCharges.length ? (
              <>
                <Card style={{ paddingVertical: 4 }}>
                  {shownCharges.map((c, i) => (
                    <ChargeRow
                      key={c.sub.id}
                      c={c}
                      pro={pro}
                      first={i === 0}
                      today={today}
                      leads={isProTrial(c.sub) ? [...HEADS_UP_LEADS] : leads}
                      time={settings.reminderTime}
                      blocked={blocked}
                      room={room}
                      onPress={() => (isPending(c.sub) ? router.push(`/ditch/${c.sub.id}`) : editor.openEdit(c.sub.id))}
                    />
                  ))}
                  {shownCharges.length < dayCharges.length ? <ShowAll n={dayCharges.length} onPress={() => setAllDay(true)} /> : null}
                </Card>
                {/* A reminder for something else lands on this day too (e.g. a ditched sub's last check). */}
                {reminderLine ? (
                  <Txt v="sub" tone="mute" num style={{ marginTop: 6, marginHorizontal: 2 }}>
                    {reminderLine}
                  </Txt>
                ) : null}
              </>
            ) : (
              <Card style={{ paddingVertical: 4 }}>
                <Txt v="body" tone="mute" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                  {emptyDayLine}
                </Txt>
                {sel?.headsUp && blocked ? <OffRow /> : null}
              </Card>
            )}
          </>
        )}

        {aheadRows.length ? (
          <>
            <SectionHeader title="Year ahead" right="Next 12 months" style={{ marginTop: 20, marginBottom: 8 }} />
            <Card style={{ paddingVertical: 4 }}>
              {aheadRows.map((r, i) => (
                <View
                  key={r.key}
                  accessible
                  accessibilityLabel={`${r.label}: ${r.amounts.split('\n').join(', and ')}${r.bigsSpoken ? `. Big ones: ${r.bigsSpoken}` : ''}`}
                  style={{ minHeight: 48, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12 }}>
                    {/* "Most months": a grey label but a readable amount; the months that differ are bold. */}
                    <Txt v="label" color={r.usual ? p.mute : p.cardFg} style={{ flex: 1, fontSize: 16 }}>
                      {r.label}
                    </Txt>
                    <Txt v="label" num color={p.cardFg} style={{ fontSize: 16, fontFamily: r.usual ? undefined : F.bold, textAlign: 'right' }}>
                      {r.amounts}
                    </Txt>
                  </View>
                  {r.bigs ? (
                    <Txt v="sub" tone="mute" num style={{ marginTop: 2 }} numberOfLines={2}>
                      {r.bigs}
                    </Txt>
                  ) : null}
                </View>
              ))}
            </Card>
            {undatedMonthly.map((x) => (
              <Txt key={x.currency} v="sub" tone="mute" num style={{ marginTop: 6, marginHorizontal: 2 }}>
                + {money(x.monthlyMinor, x.currency)} a month with no date yet
              </Txt>
            ))}
          </>
        ) : null}

        {undated.length ? (
          <>
            <SectionHeader title="No date yet" right="No reminders" style={{ marginTop: 20, marginBottom: 8 }} />
            <Card style={{ paddingVertical: 4 }}>
              {shownUndated.map((u, i) => (
                <Pressable
                  key={u.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${u.name}, no date yet. Add date`}
                  onPress={() => editor.openEdit(u.id)}
                  style={({ pressed }) => ({
                    minHeight: 56,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: p.hair,
                    opacity: pressed ? 0.75 : 1,
                  })}
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
              {shownUndated.length < undated.length ? <ShowAll n={undated.length} onPress={() => setAllUndated(true)} /> : null}
            </Card>
          </>
        ) : null}
      </ScrollView>
      <BottomFade />
    </View>
  );
}

function DayCell({
  day,
  w,
  h,
  logo,
  payday,
  selected,
  blocked,
  onPress,
}: {
  day: CalendarDay;
  w: number;
  h: number;
  logo: number;
  payday: boolean;
  selected: boolean;
  blocked: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const { d } = parseDate(day.date);
  const first = day.charges[0];
  const label = `${WEEKDAY_LONG[weekdayOf(day.date)]}, ${MONTH_LONG[parseDate(day.date).m - 1]} ${d}${day.today ? ', today' : ''}${
    day.charges.length ? `, ${day.charges.map((c) => c.sub.name).join(', ')}` : ''
  }${day.headsUp ? (blocked ? ', reminder day, but reminders are off' : ', reminder day') : ''}${payday ? ', payday' : ''}`;
  const numColor = selected ? brand.ink : day.past ? p.mute : p.cardFg;
  // Narrow cells (SE, ~43pt): a smaller today circle and a "+N" tucked inside the corner, so the circle, the
  // logo and the badge never touch each other or the cell's border (audit, Nov 20).
  const tight = w < 46;
  const todaySize = tight ? 21 : 24;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        width: w,
        height: h,
        borderRadius: 12,
        backgroundColor: selected ? brand.sunflower : p.card,
        borderWidth: selected ? 2.5 : p.dark ? 1 : 0,
        borderColor: selected ? brand.ink : p.cardBorder,
        padding: selected ? 3.5 : 6,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      {/* Date row: the number on the left, the reminder dot on the right. The dot belongs to the day, never
          beside a logo; the logo always sits in the same place, centred below (audit, Nov 19: it jumped
          to the corner on dot days). Today keeps its ink circle even when selected. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
        {day.today ? (
          <View style={{ width: todaySize, height: todaySize, borderRadius: todaySize / 2, backgroundColor: p.dark && !selected ? p.fg : brand.ink, alignItems: 'center', justifyContent: 'center', marginLeft: tight ? -1 : -2 }}>
            <Txt v="label" num color={p.dark && !selected ? brand.ink : brand.white} style={{ fontFamily: F.bold, fontSize: tight ? 12.5 : 13.5 }} maxFontSizeMultiplier={1.1}>
              {d}
            </Txt>
          </View>
        ) : (
          <Txt v="label" num color={numColor} style={{ fontFamily: F.semi, fontSize: 14.5, lineHeight: 20 }} maxFontSizeMultiplier={1.1}>
            {d}
          </Txt>
        )}
        {day.headsUp ? (
          // Reminders off: a hollow dot, since nothing will actually arrive.
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: blocked ? 'transparent' : brand.sunflower,
              borderWidth: blocked || !p.dark || selected ? 1.5 : 0,
              borderColor: blocked ? p.mute : brand.ink,
            }}
          />
        ) : null}
      </View>
      {first ? (
        // One logo per day, like Orbit and Rocket Money (owner, Nov 19: it has to stay clean with 10+ subs).
        // More on the same day: a small "+N" badge on the logo's corner.
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View>
            <SubLogo sub={first.sub} size={logo} ditched={first.pending} />
            {day.charges.length > 1 ? <MoreBadge n={day.charges.length - 1} ring={selected ? brand.sunflower : p.card} tight={tight} /> : null}
          </View>
        </View>
      ) : payday ? (
        // Payday with nothing charged: a small word where a logo would sit. With a charge, the day list's header says it.
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: -5 }}>
          <Txt v="sub" color={selected ? brand.ink : p.fg2} style={{ fontSize: 9.5, lineHeight: 13, letterSpacing: -0.3, fontFamily: F.bold }} numberOfLines={1} maxFontSizeMultiplier={1}>
            Payday
          </Txt>
        </View>
      ) : null}
    </Pressable>
  );
}

/** "+2": how many more charges share the day, on the logo's top-right corner, cut out by a ring in the cell's colour. */
function MoreBadge({ n, ring, tight }: { n: number; ring: string; tight?: boolean }) {
  const p = usePalette();
  return (
    <View
      style={{
        position: 'absolute',
        top: tight ? -5 : -6,
        right: tight ? -7 : -9,
        minWidth: tight ? 15 : 17,
        height: tight ? 15 : 17,
        paddingHorizontal: 2.5,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: ring,
        backgroundColor: p.dark ? p.fg : brand.ink,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Txt v="label" num color={p.dark ? brand.ink : brand.white} style={{ fontFamily: F.bold, fontSize: tight ? 8.5 : 9.5, lineHeight: tight ? 10 : 11, letterSpacing: -0.2 }} maxFontSizeMultiplier={1}>
        {n > 99 ? '99+' : `+${n}`}
      </Txt>
    </View>
  );
}

function Legend({ blocked }: { blocked: boolean }) {
  const p = usePalette();
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}
      accessible
      accessibilityLabel={`Key: ${blocked ? 'hollow dot means a reminder, but reminders are off' : 'dot means a reminder'}, filled circle means today`}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {/* Reminders off: hollow, like the dots on the grid, since nothing will arrive. */}
        <View
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: blocked ? 'transparent' : brand.sunflower,
            borderWidth: blocked || !p.dark ? 1.5 : 0,
            borderColor: blocked ? p.mute : brand.ink,
          }}
        />
        <Txt v="body" tone="fg2" style={{ fontSize: 14.5 }}>
          {blocked ? 'Reminder (off)' : 'Reminder'}
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
  pro,
  first,
  today,
  leads,
  time,
  blocked,
  room,
  onPress,
}: {
  room: number;
  c: CalendarCharge;
  pro: boolean;
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
  const all = on ? [...leads].sort((a, b) => b - a).map((l) => addDays(c.date, -l)) : [];
  const heads = all.filter((d) => d >= today);
  // Ones already sent (only since it was added): "Reminded Wed 11, Fri 13".
  const sent = all.filter((d) => d < today && d >= s.createdAt.slice(0, 10));
  // One line that says when the reminders land: "Reminders Mon 16, Wed 18" (no pills; the time is in Settings and VoiceOver).
  const short = (d: DateOnly) => `${weekdayShort(d)} ${parseDate(d).d}`;
  // Set as "charged today" in the day sheet: this day's charge is already paid (owner, Nov 20: it said "Charges today").
  const paid = s.dateSource === 'receipt' && c.date === s.anchor;
  // A past charge is history first: "Charged", never a reminder or free-plan line (audit, Nov 20).
  const line = paid
    ? c.date === today
      ? c.pending
        ? 'Ditched · paid today'
        : 'Paid today'
      : 'Paid'
    : c.date < today
      ? 'Charged'
      : c.pending
        ? c.date === today
          ? 'Ditched · charges today'
          : `Ditched · charges ${short(c.date)}`
        : !on
          ? pro
            ? 'Reminders off for this one'
            : room > 0
              ? `No reminder · ${room} free left`
              : 'No reminder · 3 free in use'
          : blocked
            ? 'Reminders are off'
            : heads.length
              ? `${heads.length === 1 ? 'Reminder' : 'Reminders'} ${heads.map(short).join(', ')}`
              : sent.length
                ? `Reminded ${sent.map(short).join(', ')}`
                : // Too soon for its reminders: just say when it charges (owner, Nov 19).
                  chargesSoonLine(c.date, today);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${s.name}, ${isPricedSub(s) ? money(s.amountMinor, s.currency) : 'no price'}, ${line}${heads.length && on && !blocked ? `, at ${timeLabel(time)}` : ''}`}
      onPress={onPress}
      style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: first ? 0 : 1, borderTopColor: p.hair, opacity: pressed ? 0.75 : 1 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <SubLogo sub={s} ditched={c.pending} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
            {isProTrial(s) ? 'Ditch Pro trial' : s.name}
          </Txt>
          <Txt v="body" tone="mute" style={{ fontSize: 14.5, marginTop: 1 }} numberOfLines={2}>
            {line}
          </Txt>
        </View>
        <Txt v="moneyM" num color={p.cardFg} style={{ fontSize: 17.5, minWidth: 62, textAlign: 'right' }}>
          {isPricedSub(s) ? money(s.amountMinor, s.currency) : '–'}
        </Txt>
      </View>
    </Pressable>
  );
}

/** "Show all 1,341": the last row of a long list, opens the rest in place. */
function ShowAll({ n, onPress }: { n: number; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Show all ${count(n)}`}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 48, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: p.hair, opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="label" num color={p.cardFg} style={{ fontSize: 15.5, fontFamily: F.bold }}>
        {`Show all ${count(n)}`}
      </Txt>
    </Pressable>
  );
}

/** Reminders are off: a tangerine row with a "!" so it reads as a problem, not a note (same colours as Notice). */
function OffRow() {
  const p = usePalette();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 8,
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: p.dark ? '#7A3F22' : '#F3B79B',
        backgroundColor: p.dark ? '#2E1F17' : '#FFEDE3',
      }}
    >
      <Bang size={18} bg={brand.bill} color={brand.ink} />
      <Txt v="body" color={p.dark ? '#F6F0E3' : brand.ink} style={{ flex: 1, fontSize: 14.5, lineHeight: 19, fontFamily: F.semi }}>
        Reminders are off, so this one won’t arrive.
      </Txt>
    </View>
  );
}
