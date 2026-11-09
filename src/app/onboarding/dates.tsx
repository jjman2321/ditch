// 4 · When does each one charge? One tap per subscription.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

import { anchorForDayOfMonth, anchorForMonthDay, daysInMonth, MONTH_SHORT, nextChargeDate, nextForWeekday, toDateOnly, WEEKDAY_SHORT, weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { AppLogo, FlowHeader } from '@/ui/ditch';
import { Icon } from '@/ui/icons';
import { Btn, C, F, Label, Press, RaccoonSays, Row, Screen, Small, tap } from '@/ui/kit';

export default function Dates() {
  const { setAnchor } = useOnboarding();
  const list = usePickedList();
  const queue = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [i, setI] = useState(0);
  const [month, setMonth] = useState<number | null>(null);
  const [w, setW] = useState(0);
  const today = toDateOnly();
  const cur = queue[i];
  const finish = () => router.push('/onboarding/reminders');
  const save = (anchor: string | null) => {
    if (!cur) return;
    tap();
    setAnchor(cur.id, anchor);
    setTimeout(() => {
      setMonth(null);
      if (i + 1 >= queue.length) finish();
      else setI(i + 1);
    }, 140);
  };
  if (!cur) return null;

  const yearlyDay = cur.cycle === 'yearly' && month !== null;
  const cell = w ? Math.floor((w - 6 * 8) / 7) : 40;
  const wide = w ? Math.floor((w - 3 * 8) / 4) : 70;
  const prev = i > 0 ? queue[i - 1] : null;
  const prevNext = prev?.anchorDate ? nextChargeDate(prev.anchorDate, prev.cycle, today) : null;

  return (
    <Screen footer={<Btn label="Not sure" kind="secondary" onPress={() => save(null)} />}>
      <FlowHeader
        section={1}
        fill={(i + 1) / queue.length}
        right={
          <Pressable accessibilityRole="button" onPress={finish} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.semi, fontSize: 15, color: C.ink2 }}>Later</Text>
          </Pressable>
        }
      />
      <RaccoonSays text={`When does ${cur.name} charge you?`} />

      <Animated.View key={cur.id + (month ?? '')} entering={FadeInRight.duration(260)} style={{ gap: 14 }}>
        <Row gap={12}>
          <AppLogo id={cur.id} color={cur.color} ink={cur.ink} mono={cur.mono} size={48} />
          <View style={{ flex: 1 }}>
            <Label>{cur.name}</Label>
            <Small>
              {formatMoney(cur.amountMinor, cur.currency)}
              {CYCLE_SHORT[cur.cycle]}
            </Small>
          </View>
          <Small style={{ fontFamily: F.bold }}>
            {i + 1} of {queue.length}
          </Small>
        </Row>
        <Small style={{ color: C.ink }}>
          {cur.cycle === 'weekly' ? 'Which day of the week?' : cur.cycle === 'yearly' && !yearlyDay ? 'Which month does it renew?' : yearlyDay ? `${MONTH_SHORT[month! - 1]}, which day?` : 'Which day of the month?'}
        </Small>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
          {cur.cycle === 'weekly'
            ? WEEKDAY_SHORT.map((d, k) => <Key key={d} label={d} width={wide} onPress={() => save(nextForWeekday(k, today))} />)
            : cur.cycle === 'yearly' && !yearlyDay
              ? MONTH_SHORT.map((m, k) => <Key key={m} label={m} width={wide} onPress={() => (tap(), setMonth(k + 1))} />)
              : Array.from({ length: yearlyDay ? daysInMonth(2028, month!) : 31 }, (_, k) => k + 1).map((d) => (
                  <Key key={d} label={String(d)} width={cell} square onPress={() => save(yearlyDay ? anchorForMonthDay(month!, d, today) : anchorForDayOfMonth(d, today))} />
                ))}
        </View>
      </Animated.View>

      {prev && prevNext ? (
        <Animated.View key={prev.id} entering={FadeIn.duration(250)}>
          <Row gap={6} style={{ justifyContent: 'center' }}>
            <Icon name="check" size={16} color={C.kiwi} weight={3} />
            <Small style={{ color: C.kiwiInk, fontFamily: F.semi }}>
              {prev.name}: next charge {weekdayDate(prevNext)}
            </Small>
          </Row>
        </Animated.View>
      ) : null}
    </Screen>
  );
}

function Key({ label, onPress, width, square }: { label: string; onPress: () => void; width: number; square?: boolean }) {
  return (
    <Press label={label} onPress={onPress} face={C.card} lip={C.line} border={C.line} bw={1.5} radius={14} haptic={false} inner={{ width, height: square ? Math.max(44, width) : 50, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: F.bold, fontSize: 16, color: C.ink }}>{label}</Text>
    </Press>
  );
}
