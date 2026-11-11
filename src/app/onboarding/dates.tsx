// 4 · Which day does each one charge? (design/v13-dates screen 1,
// DECISIONS #33). One row per subscription, biggest first. Monthly ones
// ask for a day, yearly ones a date. A set row turns sunflower and says
// the next charge; a skipped one has no date and gets no reminder until
// it has one. No guesses, no "around".

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ordinal } from '@/domain/charges';
import { parseDate, shortDate, weekdayDate } from '@/domain/dates';
import { DaySheet } from '@/onboarding/DaySheet';
import { OnbRoot } from '@/onboarding/Parts';
import { byYearlyDesc, chargeOf, pickHasDate, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, F, LogoTile, StepHeader, Txt, brand, haptic, useFrame, usePalette } from '@/ui/sunflower';

const CYCLE_LABEL = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Every 3 months', yearly: 'Yearly' } as const;

/** "19th" (monthly), "Apr 28" (yearly), "Thu, Nov 19" (others). */
function setLabel(x: Picked): string {
  const next = chargeOf(x);
  if (!next) return '';
  if (x.cycle === 'monthly') return ordinal(parseDate(x.anchor).d);
  if (x.cycle === 'yearly') return shortDate(next);
  return weekdayDate(next).split(', ')[1] ?? weekdayDate(next);
}

/** "Next: Thu, Nov 19" (the pill says which day), or the cycle while there's no date. */
function subLine(x: Picked): string {
  const next = chargeOf(x);
  return next ? `Next: ${weekdayDate(next)}` : CYCLE_LABEL[x.cycle];
}

function DateRow({ x, first, onPress }: { x: Picked; first: boolean; onPress: () => void }) {
  const p = usePalette();
  const set = pickHasDate(x);
  const ask = x.cycle === 'monthly' ? 'Pick day' : 'Pick date';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${x.name}, ${set ? `${x.cycle === 'monthly' ? `every ${setLabel(x)}` : setLabel(x)}. ${subLine(x)}` : `no date yet. ${ask}`}`}
      accessibilityHint={set ? 'Change the day' : undefined}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}
    >
      {first ? null : <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} />}
      <LogoTile id={x.id} size={40} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="bodyStrong" numberOfLines={1} color={p.cardFg}>
          {x.name}
        </Txt>
        <Txt v="sub" tone="mute" num numberOfLines={1}>
          {subLine(x)}
        </Txt>
      </View>
      {set ? (
        <View style={{ minWidth: 56, height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center' }}>
          <Txt v="moneyS" num color={brand.ink} style={{ fontFamily: F.wideHeavy }}>
            {setLabel(x)}
          </Txt>
        </View>
      ) : (
        <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1.5, borderColor: p.fg, alignItems: 'center', justifyContent: 'center' }}>
          <Txt v="label" color={p.fg}>
            {ask}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}

export default function Dates() {
  const p = usePalette();
  const f = useFrame({ colH: 1040 });
  const { setDate, clearDate } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [dayFor, setDayFor] = useState<string | null>(null);
  const [footerH, setFooterH] = useState(120);
  const set = list.filter(pickHasDate).length;
  const dayPick = dayFor ? (list.find((x) => x.id === dayFor) ?? null) : null;
  // After Save (or "I'm not sure"), go straight to the next one without a date, further
  // down the list; close after the last. Many picks used to mean opening a sheet for each.
  const nextUndated = (from: string | null): string | null => {
    // Forward only, so skipping with "I'm not sure" never loops back round.
    const i = sorted.findIndex((x) => x.id === from);
    return sorted.slice(i + 1).find((x) => !pickHasDate(x))?.id ?? null;
  };

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top, paddingHorizontal: f.edge }}>
        <StepHeader step={3} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: footerH + 8 }}>
          <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
            {'Which day does each one\u00A0charge?'}
          </Txt>
          <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
            It’s on your bank app or the receipt email. Skip any you’re not sure of.
          </Txt>
          <View style={{ marginTop: f.small ? 16 : 20, backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 16 }}>
            {sorted.map((x, i) => (
              <DateRow key={x.id} x={x} first={i === 0} onPress={() => setDayFor(x.id)} />
            ))}
          </View>
        </ScrollView>
      </View>
      <View pointerEvents="box-none" onLayout={(e) => setFooterH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <LinearGradient pointerEvents="none" colors={[p.bg + '00', p.bg]} style={{ height: 24 }} />
        <View style={{ backgroundColor: p.bg, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginHorizontal: 2 }}>
            <Txt v="label" num accessibilityLabel={`${set} of ${list.length} set`}>
              {`${set} of ${list.length} set`}
            </Txt>
            {set < list.length ? (
              <Txt v="sub" tone="mute">
                {set === 0 ? 'No reminders without a date' : 'You can add the rest later'}
              </Txt>
            ) : null}
          </View>
          <Button label="Continue" onPress={() => router.push('/onboarding/reminders')} />
        </View>
      </View>
      <DaySheet
        pick={dayPick}
        progress={dayPick ? `${sorted.findIndex((x) => x.id === dayPick.id) + 1} of ${sorted.length}` : undefined}
        visible={!!dayPick}
        onClose={() => setDayFor(null)}
        onNotSure={() => {
          if (dayFor) clearDate(dayFor);
          setDayFor(nextUndated(dayFor));
        }}
        onDone={(anchor) => {
          if (dayFor) setDate(dayFor, anchor, 'next');
          setDayFor(nextUndated(dayFor));
        }}
      />
    </OnbRoot>
  );
}

