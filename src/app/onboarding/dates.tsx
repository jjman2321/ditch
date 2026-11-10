// 4 · When do they charge you? (design/v12 render 04). One quick pick per
// subscription: This week · Next week · Later · Pick a day. A quick pick is
// stored as the middle of its range and stays "around …" (a guess) until a
// real day is picked. A moment after a tap the row folds to one line, so
// progress shows and the list gets shorter. Skipped rows keep a guess.

import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, LinearTransition, useReducedMotion } from 'react-native-reanimated';

import type { RoughWhen } from '@/domain/charges';
import { weekdayDate } from '@/domain/dates';
import { DaySheet } from '@/onboarding/DaySheet';
import { OnbRoot } from '@/onboarding/Parts';
import { byYearlyDesc, chargeOf, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, Check, F, LogoTile, StepHeader, Txt, brand, haptic, useFrame, usePalette } from '@/ui/sunflower';

type Choice = RoughWhen | 'day';
const SEGMENTS: { value: Choice; label: string; hint?: string; a11y: string }[] = [
  { value: 'this', label: 'This week', a11y: 'This week' },
  { value: 'next', label: 'Next week', a11y: 'Next week' },
  { value: 'later', label: 'Later', hint: 'in 2+ weeks', a11y: 'Later, in 2 weeks or more' },
  { value: 'day', label: 'Pick a day', a11y: 'Pick a day' },
];
/** How long a just-answered row stays open before it folds. */
const FOLD_MS = 700;

function QuickPick({ value, onPick, name }: { value: Choice | null; onPick: (v: Choice) => void; name: string }) {
  const p = usePalette();
  const on = SEGMENTS.findIndex((s) => s.value === value);
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={`When ${name} charges`}
      style={{ flexDirection: 'row', height: 44, borderRadius: 14, backgroundColor: p.dark ? '#26241F' : '#EFE8D8', padding: 2, marginTop: 8 }}
    >
      {SEGMENTS.map((s, i) => {
        const sel = i === on;
        // A divider before each segment, except next to the selected one.
        const divider = i > 0 && !sel && i !== on + 1;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="radio"
            accessibilityLabel={s.a11y}
            accessibilityState={{ selected: sel }}
            onPress={() => {
              haptic.select();
              onPick(s.value);
            }}
            style={{ flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: sel ? (p.dark ? brand.sunflower : brand.ink) : 'transparent' }}
          >
            {divider ? <View style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 1, backgroundColor: p.dark ? 'rgba(246,240,227,0.12)' : 'rgba(22,20,15,0.12)' }} /> : null}
            <Txt v="label" numberOfLines={1} color={sel ? (p.dark ? brand.ink : brand.cream) : p.fg} style={{ fontSize: 14, letterSpacing: -0.2, lineHeight: s.hint ? 16 : 20 }} maxFontSizeMultiplier={1.25}>
              {s.label}
            </Txt>
            {s.hint ? (
              <Txt v="fine" numberOfLines={1} color={sel ? (p.dark ? brand.ink : brand.cream) : p.mute} style={{ fontSize: 11, lineHeight: 13 }} maxFontSizeMultiplier={1.2}>
                {s.hint}
              </Txt>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function DateRow({ x, first, open, onPick, onChange }: { x: Picked; first: boolean; open: boolean; onPick: (v: Choice) => void; onChange: () => void }) {
  const p = usePalette();
  const reduce = useReducedMotion();
  const answered = !!x.when;
  const exact = x.when === 'day' && x.dateSource !== 'guess';
  const date = weekdayDate(chargeOf(x));
  const layout = reduce ? undefined : LinearTransition.duration(220);
  const line = first ? null : <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: p.hair }} />;

  if (answered && !open) {
    return (
      <Animated.View layout={layout} entering={reduce ? undefined : FadeIn.duration(160)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${x.name}, ${exact ? date : `around ${date}, rough`}. Change`}
          onPress={onChange}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, minHeight: 64 }}
        >
          {line}
          <LogoTile id={x.id} size={32} />
          <Txt v="bodyStrong" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
            {x.name}
          </Txt>
          <View style={{ alignItems: 'flex-end' }}>
            {exact ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Check color={p.fg} size={14} />
                <Txt v="sub" num style={{ fontFamily: F.semi, color: p.fg }}>
                  {date}
                </Txt>
              </View>
            ) : (
              <Txt v="sub" num style={{ color: p.fg }}>
                {'around '}
                <Txt v="sub" num style={{ fontFamily: F.semi, color: p.fg }}>
                  {date}
                </Txt>
              </Txt>
            )}
            {/* The whole 64pt row is the button; "Change" just says so. */}
            <Txt v="sub" tone="mute">
              {exact ? '' : 'Rough · '}
              <Txt v="sub" style={{ fontFamily: F.semi, color: p.fg, textDecorationLine: 'underline' }}>
                Change
              </Txt>
            </Txt>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View layout={layout} style={{ paddingVertical: 12 }}>
      {line}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 32 }}>
        <LogoTile id={x.id} size={32} />
        <Txt v="bodyStrong" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
          {x.name}
        </Txt>
        {answered ? (
          <Txt v="sub" num style={{ color: p.fg }}>
            {exact ? '' : 'around '}
            <Txt v="sub" num style={{ fontFamily: F.semi, color: p.fg }}>
              {date}
            </Txt>
          </Txt>
        ) : null}
      </View>
      <QuickPick name={x.name} value={x.when ?? null} onPick={onPick} />
    </Animated.View>
  );
}

export default function Dates() {
  const p = usePalette();
  const f = useFrame({ colH: 1040 });
  const { setRough, setDate } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  // Rows that stay open: just answered (until they fold) or reopened with "Change".
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [dayFor, setDayFor] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);
  const [footerH, setFooterH] = useState(96);
  const set = list.filter((x) => x.when).length;
  const dayPick = dayFor ? (list.find((x) => x.id === dayFor) ?? null) : null;

  const foldSoon = (id: string) => {
    clearTimeout(timers.current[id]);
    setOpen((o) => ({ ...o, [id]: true }));
    timers.current[id] = setTimeout(() => setOpen((o) => ({ ...o, [id]: false })), FOLD_MS);
  };

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top, paddingHorizontal: f.edge }}>
        <StepHeader step={3} />
        <Animated.ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: footerH }}>
          <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
            {'When do they charge you?'}
          </Txt>
          <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
            Rough is fine. Skip any you don’t know.
          </Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: f.small ? 16 : 24 }}>
            <Txt v="eyebrow" tone="mute" accessibilityRole="header">
              Pick roughly
            </Txt>
            <Txt v="eyebrow" tone="mute" num accessibilityLabel={`${set} of ${list.length} set`}>
              {`${set} of ${list.length} set`}
            </Txt>
          </View>
          <View style={{ marginTop: 4 }}>
            {sorted.map((x, i) => (
              <DateRow
                key={x.id}
                x={x}
                first={i === 0}
                open={!!open[x.id]}
                onChange={() => {
                  haptic.select();
                  clearTimeout(timers.current[x.id]);
                  setOpen((o) => ({ ...o, [x.id]: true }));
                }}
                onPick={(v) => {
                  if (v === 'day') {
                    setDayFor(x.id);
                    return;
                  }
                  setRough(x.id, v);
                  foldSoon(x.id);
                }}
              />
            ))}
          </View>
        </Animated.ScrollView>
      </View>
      <View pointerEvents="box-none" onLayout={(e) => setFooterH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <LinearGradient pointerEvents="none" colors={[p.bg + '00', p.bg]} style={{ height: 24 }} />
        <View style={{ backgroundColor: p.bg, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
          <Button label="Continue" onPress={() => router.push('/onboarding/reminders')} />
        </View>
      </View>
      <DaySheet
        pick={dayPick}
        visible={!!dayPick}
        onClose={() => setDayFor(null)}
        onDone={(anchor) => {
          if (dayFor) {
            setDate(dayFor, anchor, 'next');
            foldSoon(dayFor);
          }
          setDayFor(null);
        }}
      />
    </OnbRoot>
  );
}
