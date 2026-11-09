// 4 · When does each one charge? One tap per subscription.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { Btn, LogoTile, Say, Screen, TopBar } from '@/components/kit';
import { haptic } from '@/components/ui';
import { anchorForDayOfMonth, anchorForMonthDay, daysInMonth, MONTH_SHORT, nextChargeDate, nextForWeekday, toDateOnly, WEEKDAY_SHORT, weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

export default function Dates() {
  const { setAnchor } = useOnboarding();
  const list = usePickedList();
  const queue = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [index, setIndex] = useState(0);
  const [month, setMonth] = useState<number | null>(null);
  const [w, setW] = useState(0);
  const today = toDateOnly();
  const current = queue[index];
  const finish = () => router.push('/onboarding/reminders');
  const save = (anchor: string | null) => {
    if (!current) return;
    haptic.tap();
    setAnchor(current.id, anchor);
    setTimeout(() => {
      setMonth(null);
      if (index + 1 >= queue.length) finish();
      else setIndex(index + 1);
    }, 140);
  };
  if (!current) return null;

  const cell7 = w ? Math.floor((w - 6 * 7) / 7) : 40;
  const cell4 = w ? Math.floor((w - 3 * 8) / 4) : 70;
  const prev = index > 0 ? queue[index - 1] : null;
  const prevNext = prev?.anchorDate ? nextChargeDate(prev.anchorDate, prev.cycle, today) : null;
  const yearlyMonth = current.cycle === 'yearly' && month !== null;

  return (
    <Screen>
      <TopBar progress={0.45 + (0.25 * (index + 1)) / queue.length} onSkip={finish} skipLabel="Later" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24, gap: 18 }}>
        <Say pose="wave" size={88}>
          When does {current.name} charge you?
        </Say>

        <Animated.View key={current.id + (month ?? '')} entering={SlideInRight.springify().duration(380).dampingRatio(0.85)} exiting={SlideOutLeft.duration(150)} style={styles.card}>
          <View style={styles.cardHead}>
            <LogoTile id={current.id} color={current.color} ink={current.ink} mono={current.mono} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={text.bodyStrong}>{current.name}</Text>
              <Text style={[text.small, num]}>
                {formatMoney(current.amountMinor, current.currency)}
                {CYCLE_SHORT[current.cycle]}
              </Text>
            </View>
            <Text style={[text.small, num, { fontFamily: font.heavy }]}>
              {index + 1}/{queue.length}
            </Text>
          </View>
          <Text style={text.label}>
            {current.cycle === 'weekly' ? 'Which day of the week?' : current.cycle === 'yearly' && !yearlyMonth ? 'Which month?' : yearlyMonth ? `${MONTH_SHORT[month! - 1]}, which day?` : 'Which day of the month?'}
          </Text>
          <View style={styles.grid} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
            {current.cycle === 'weekly'
              ? WEEKDAY_SHORT.map((d, i) => <Key key={d} label={d} width={cell4} onPress={() => save(nextForWeekday(i, today))} />)
              : current.cycle === 'yearly' && !yearlyMonth
                ? MONTH_SHORT.map((m, i) => <Key key={m} label={m} width={cell4} onPress={() => (haptic.tap(), setMonth(i + 1))} />)
                : Array.from({ length: yearlyMonth ? daysInMonth(2028, month!) : 31 }, (_, i) => i + 1).map((d) => (
                    <Key key={d} label={String(d)} width={cell7} square onPress={() => save(yearlyMonth ? anchorForMonthDay(month!, d, today) : anchorForDayOfMonth(d, today))} />
                  ))}
          </View>
          <Btn label="Not sure" kind="ghost" onPress={() => save(null)} />
        </Animated.View>

        {prev && prevNext ? (
          <Animated.View key={prev.id} entering={FadeIn.duration(250)}>
            <Text style={[text.label, { textAlign: 'center', color: ink.tealInk }]}>
              ✓ {prev.name}: next charge {weekdayDate(prevNext)}
            </Text>
          </Animated.View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Key({ label, onPress, width, square }: { label: string; onPress: () => void; width: number; square?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.key,
            { width, height: square ? Math.max(44, width) : 48 },
            pressed && { backgroundColor: ink.tealSoft, borderColor: ink.teal, borderBottomWidth: 2, marginTop: 2 },
          ]}
        >
          <Text style={[text.bodyStrong, num, pressed && { color: ink.tealInk }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, borderRadius: 22, padding: 16, gap: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  key: { borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, backgroundColor: ink.white, alignItems: 'center', justifyContent: 'center' },
});
