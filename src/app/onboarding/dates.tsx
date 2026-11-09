// 4 · When does each one charge? One tap per subscription.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { OnboardingTopBar } from '@/components/onboarding';
import { Button, haptic, Screen, ServiceTile, T } from '@/components/ui';
import {
  anchorForDayOfMonth,
  anchorForMonthDay,
  daysInMonth,
  MONTH_SHORT,
  nextChargeDate,
  nextForWeekday,
  toDateOnly,
  WEEKDAY_SHORT,
  weekdayDate,
} from '@/domain/dates';
import { CYCLE_SHORT, formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { radius, space, tabular, usePalette } from '@/theme/tokens';

export default function Dates() {
  const p = usePalette();
  const { setAnchor } = useOnboarding();
  const list = usePickedList();
  const queue = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [index, setIndex] = useState(0);
  const [month, setMonth] = useState<number | null>(null); // yearly: picked month
  const [gridW, setGridW] = useState(0);
  const cell7 = gridW ? Math.floor((gridW - 6 * 6) / 7) : 40;
  const cell4 = gridW ? Math.floor((gridW - 3 * 6) / 4) : 70;
  const today = toDateOnly();

  const current = queue[index];
  const finish = () => router.push('/onboarding/reminders');
  const advance = () => {
    setMonth(null);
    if (index + 1 >= queue.length) finish();
    else setIndex(index + 1);
  };
  const save = (anchor: string | null) => {
    if (!current) return;
    haptic.tap();
    setAnchor(current.id, anchor);
    setTimeout(advance, 160);
  };

  if (!current) {
    return null;
  }

  const lastSaved = index > 0 ? queue[index - 1] : null;
  const lastNext = lastSaved?.anchorDate ? nextChargeDate(lastSaved.anchorDate, lastSaved.cycle, today) : null;

  return (
    <Screen>
      <OnboardingTopBar step={2 + (index + 1) / queue.length} onSkip={finish} skipLabel="Finish later" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ gap: space.xs }}>
          <T v="title1" accessibilityRole="header">
            When does {current.name} charge?
          </T>
          <T v="subhead" tone="secondary">
            Check your bank app or the receipt email. Not sure? Skip it.
          </T>
        </View>

        <Animated.View
          key={current.id + (month ?? '')}
          entering={SlideInRight.springify().damping(18).stiffness(180)}
          exiting={SlideOutLeft.duration(160)}
          style={[styles.card, { backgroundColor: p.surface }]}
        >
          <View style={styles.cardHead}>
            <ServiceTile color={current.color} ink={current.ink} mono={current.mono} size={44} />
            <View style={{ flex: 1 }}>
              <T v="headline">{current.name}</T>
              <T v="subhead" tone="tertiary" style={tabular}>
                {formatMoney(current.amountMinor, current.currency)}
                {CYCLE_SHORT[current.cycle]}
              </T>
            </View>
            <T v="footnote" tone="tertiary" style={tabular}>
              {index + 1} of {queue.length}
            </T>
          </View>

          {current.cycle === 'weekly' ? (
            <>
              <T v="subhead" tone="secondary">
                Which day of the week?
              </T>
              <View style={styles.grid} onLayout={(e) => setGridW(e.nativeEvent.layout.width)}>
                {WEEKDAY_SHORT.map((w, i) => (
                  <DayCell key={w} label={w} size={cell4} onPress={() => save(nextForWeekday(i, today))} wide />
                ))}
              </View>
            </>
          ) : current.cycle === 'yearly' && month === null ? (
            <>
              <T v="subhead" tone="secondary">
                Which month does it renew?
              </T>
              <View style={styles.grid} onLayout={(e) => setGridW(e.nativeEvent.layout.width)}>
                {MONTH_SHORT.map((m, i) => (
                  <DayCell key={m} label={m} size={cell4} wide onPress={() => (haptic.tap(), setMonth(i + 1))} />
                ))}
              </View>
            </>
          ) : (
            <>
              <T v="subhead" tone="secondary">
                {current.cycle === 'yearly' && month ? `${MONTH_SHORT[month - 1]}, which day?` : 'Which day of the month?'}
              </T>
              <View style={styles.grid} onLayout={(e) => setGridW(e.nativeEvent.layout.width)}>
                {Array.from({ length: current.cycle === 'yearly' && month ? daysInMonth(2028, month) : 31 }, (_, i) => i + 1).map(
                  (d) => (
                    <DayCell
                      key={d}
                      label={String(d)}
                      size={cell7}
                      onPress={() =>
                        save(
                          current.cycle === 'yearly' && month
                            ? anchorForMonthDay(month, d, today)
                            : anchorForDayOfMonth(d, today),
                        )
                      }
                    />
                  ),
                )}
              </View>
            </>
          )}

          <Button label="Not sure" kind="plain" onPress={() => save(null)} />
        </Animated.View>

        {lastSaved && lastNext ? (
          <Animated.View key={lastSaved.id} entering={FadeIn.duration(250)}>
            <T v="footnote" tone="tertiary" style={{ textAlign: 'center' }}>
              ✓ {lastSaved.name}: next charge {weekdayDate(lastNext)}
            </T>
          </Animated.View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function DayCell({ label, onPress, wide, size }: { label: string; onPress: () => void; wide?: boolean; size: number }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        { width: size, height: wide ? 48 : Math.max(44, size) },
        { backgroundColor: pressed ? p.primary : p.surfaceSunken },
      ]}
    >
      {({ pressed }) => (
        <T v="callout" style={[tabular, { fontWeight: '600', color: pressed ? p.onPrimary : p.text }]}>
          {label}
        </T>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xxl, gap: space.xl },
  card: { borderRadius: radius.xl, padding: space.lg, gap: space.lg },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: { borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
