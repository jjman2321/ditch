// 2 · What do you pay for? (Kiwi topic-picker tiles, with real app icons)

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CATEGORIES, SERVICES, type Category } from '@/catalog/services';
import { CYCLE_SHORT, formatMoney, totalsByCurrency, yearlyMinor } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { AppLogo, FlowHeader } from '@/ui/ditch';
import { Icon } from '@/ui/icons';
import { Btn, C, Chip, F, Press, RaccoonSays, Rise, Row, Screen, Small, Tiny } from '@/ui/kit';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];

export default function Tick() {
  const { picked, toggleService } = useOnboarding();
  const list = usePickedList();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const n = list.length;

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return SERVICES.filter((s) => s.name.toLowerCase().includes(q));
    return filter === 'Popular' ? SERVICES.filter((s) => s.popular) : SERVICES.filter((s) => s.category === filter);
  }, [filter, query]);

  const totals = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const total = totals.map((t) => formatMoney(t.amountMinor, t.currency, { trimWhole: true }).replace(/\.\d\d$/, '')).join(' + ');
  const say = n === 0 ? 'What do you pay for? Tap everything you can think of.' : n === 1 ? 'Nice. What else?' : n < 5 ? `${n} so far. Keep going!` : `Ooh, ${n}. Anything else?`;

  return (
    <Screen
      footer={
        <>
          {n > 0 ? (
            <Animated.View key={total} entering={FadeIn.duration(180)}>
              <Small center style={{ color: C.ink }}>
                <Text style={{ fontFamily: F.bold }}>{n} picked</Text> · about {total} a year
              </Small>
            </Animated.View>
          ) : null}
          <Btn label={n > 0 ? 'Continue' : 'None of these'} kind={n > 0 ? 'primary' : 'secondary'} onPress={() => router.push(n > 0 ? '/onboarding/reveal' : '/onboarding/reminders')} />
        </>
      }
    >
      <FlowHeader section={0} fill={0.35 + Math.min(n, 6) * 0.1} />
      <RaccoonSays text={say} />

      <Row gap={10} style={{ backgroundColor: C.sunken, borderRadius: 16, paddingHorizontal: 14, height: 50 }}>
        <Icon name="search" size={19} color={C.ink3} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${SERVICES.length} services`}
          placeholderTextColor={C.ink3}
          style={{ flex: 1, fontFamily: F.medium, fontSize: 16, color: C.ink }}
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Search services"
        />
      </Row>

      {!query ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} on={f === filter} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((s, k) => {
          const on = !!picked[s.id];
          return (
            <Rise key={s.id} i={k % 6} style={{ width: '47.8%' }}>
              <Press
                role="checkbox"
                selected={on}
                label={`${s.name}, about ${formatMoney(s.amountMinor, s.currency)}`}
                onPress={() => toggleService(s)}
                face={on ? C.kiwiSoft : C.sunken}
                lip={on ? C.kiwi : C.sunken}
                border={on ? C.kiwi : C.sunken}
                bw={2}
                depth={on ? 4 : 0}
                inner={{ height: 118, padding: 14, justifyContent: 'space-between' }}
              >
                <Row style={{ justifyContent: 'space-between' }} align="flex-start">
                  <AppLogo id={s.id} color={s.color} ink={s.ink} mono={s.mono} size={44} />
                  {on ? (
                    <Animated.View entering={FadeIn.duration(150)} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.kiwi, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={14} color="#FFFFFF" weight={3.4} />
                    </Animated.View>
                  ) : null}
                </Row>
                <View>
                  <Text numberOfLines={1} style={{ fontFamily: F.bold, fontSize: 16, color: C.ink }}>
                    {s.name}
                  </Text>
                  <Tiny style={{ color: C.ink2, fontSize: 13 }}>
                    ~{formatMoney(s.amountMinor, s.currency)}
                    {CYCLE_SHORT[s.cycle]}
                  </Tiny>
                </View>
              </Press>
            </Rise>
          );
        })}
      </View>
      {data.length === 0 ? <Small center>No match for “{query}”. You can add your own later.</Small> : null}
    </Screen>
  );
}
