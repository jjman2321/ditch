// 3 · "That's $X a year."

import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { Btn, LogoTile, Mascot, Screen, TopBar } from '@/components/kit';
import { useCountUp } from '@/components/onboarding';
import { haptic } from '@/components/ui';
import { formatMoney, monthlyMinorExact, totalsByCurrency, yearlyMinor } from '@/domain/money';
import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

export default function Reveal() {
  const list = usePickedList();
  const yearly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const monthly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: monthlyMinorExact(x.amountMinor, x.cycle) })));
  const main = yearly[0] ?? { currency: 'USD', amountMinor: 0 };
  const counted = useCountUp(main.amountMinor, 1000, 500);
  const reduce = useReducedMotion();
  const biggest = [...list].sort(byYearlyDesc).slice(0, 3);
  const n = list.length;

  useEffect(() => {
    const t = setTimeout(() => haptic.success(), reduce ? 0 : 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <Screen>
      <TopBar progress={0.42} />
      <ScrollView contentContainerStyle={styles.content}>
        <Mascot pose="shock" size={190} style={{ alignSelf: 'center' }} />
        <View style={{ alignItems: 'center' }} accessible accessibilityLabel={`That's about ${formatMoney(main.amountMinor, main.currency)} a year.`}>
          <Text style={[text.title, { color: ink.textSoft }]}>That&apos;s about</Text>
          <Text style={[text.hero, num, { color: ink.teal }]} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.2}>
            {formatMoney(counted, main.currency, { trimWhole: true }).replace(/\.\d+$/, '')}
          </Text>
          {yearly.slice(1).map((t) => (
            <Text key={t.currency} style={[text.title, num]}>
              + {formatMoney(t.amountMinor, t.currency, { trimWhole: true })}
            </Text>
          ))}
          <Text style={text.display}>a year. Ditch it.</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(1500).duration(320)}>
          <Text style={[text.body, num, { textAlign: 'center' }]}>
            {monthly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' + ')} a month across {n} {n === 1 ? 'subscription' : 'subscriptions'}.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1650).duration(320)} style={styles.card}>
          <Text style={[text.small, { fontFamily: font.heavy, letterSpacing: 0.6 }]}>BIGGEST ONES</Text>
          {biggest.map((x) => (
            <View key={x.id} style={styles.bigRow}>
              <LogoTile id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={36} />
              <Text style={[text.bodyStrong, { flex: 1 }]} numberOfLines={1}>
                {x.name}
              </Text>
              <Text style={[text.bodyStrong, num]}>{formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)}/yr</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1800).duration(320)}>
          <Text style={[text.small, { textAlign: 'center' }]}>In a 2022 survey, people guessed $86 a month. It was really $219. (C+R Research)</Text>
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <Btn label="Let's fix that" onPress={() => router.push('/onboarding/dates')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingBottom: 24, gap: 18 },
  card: { borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, borderRadius: 18, padding: 16, gap: 12 },
  bigRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8, borderTopWidth: 2, borderTopColor: ink.line },
});
