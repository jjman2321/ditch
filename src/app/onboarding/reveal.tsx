// 3 · "That's $X a year. Ditch it."

import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { OnboardingTopBar, useCountUp } from '@/components/onboarding';
import { Button, Card, Divider, haptic, Screen, ServiceTile, T } from '@/components/ui';
import { formatMoney, monthlyMinorExact, totalsByCurrency, yearlyMinor } from '@/domain/money';
import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { space, tabular, type, usePalette } from '@/theme/tokens';

const EASE = Easing.bezier(0.23, 1, 0.32, 1);

export default function Reveal() {
  const p = usePalette();
  const list = usePickedList();
  const yearly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const monthly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: monthlyMinorExact(x.amountMinor, x.cycle) })));
  const main = yearly[0] ?? { currency: 'USD', amountMinor: 0 };
  const counted = useCountUp(main.amountMinor, 1000, 250);
  const reduce = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(() => haptic.success(), reduce ? 0 : 1250);
    return () => clearTimeout(t);
  }, [reduce]);
  const anyEstimate = list.some((x) => x.amountIsEstimate);
  const biggest = [...list].sort(byYearlyDesc).slice(0, 3);
  const n = list.length;

  return (
    <Screen>
      <OnboardingTopBar step={2} />
      <ScrollView contentContainerStyle={styles.content}>
        <View accessible accessibilityLabel={`That's ${yearly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' plus ')} a year. Ditch it.`}>
          <T v="title2" tone="secondary">
            That&apos;s{anyEstimate ? ' about' : ''}
          </T>
          <Text
            style={[type.hero, tabular, { color: p.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.3}
          >
            {formatMoney(counted, main.currency, { trimWhole: true }).replace(/\.\d+$/, '')}
          </Text>
          {yearly.slice(1).map((t) => (
            <T key={t.currency} v="title1" style={tabular}>
              + {formatMoney(t.amountMinor, t.currency, { trimWhole: true })}
            </T>
          ))}
          <Text style={[type.title1, { color: p.text }]}>
            a year. <Text style={{ color: p.primary }}>Ditch it.</Text>
          </Text>
        </View>

        <Animated.View entering={FadeInDown.delay(1250).duration(300).easing(EASE)}>
          <T v="body" tone="secondary" style={tabular}>
            That&apos;s {monthly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' + ')} a month across {n}{' '}
            {n === 1 ? 'subscription' : 'subscriptions'}.
          </T>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1330).duration(300).easing(EASE)}>
          <Card style={{ paddingVertical: space.xs }}>
            <T v="caption" tone="tertiary" style={styles.cardLabel}>
              BIGGEST ONES
            </T>
            {biggest.map((x, i) => (
              <Animated.View key={x.id} entering={FadeInDown.delay(1400 + i * 80).duration(260).easing(EASE)}>
                {i > 0 ? <Divider inset={space.lg + 36 + space.md} /> : null}
                <View style={styles.bigRow}>
                  <ServiceTile color={x.color} ink={x.ink} mono={x.mono} size={36} />
                  <T v="headline" style={{ flex: 1 }} numberOfLines={1}>
                    {x.name}
                  </T>
                  <T v="body" style={tabular}>
                    {formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)}
                    <T v="footnote" tone="tertiary">
                      /yr
                    </T>
                  </T>
                </View>
              </Animated.View>
            ))}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1600).duration(300).easing(EASE)}>
          <T v="footnote" tone="tertiary">
            You&apos;re not alone: in a 2022 survey, people guessed they spent $86 a month on subscriptions. It was really
            $219 (C+R Research).
          </T>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(1250).duration(300).easing(EASE)} style={styles.footer}>
        <Button label="Let's fix that" onPress={() => router.push('/onboarding/dates')} />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xl, gap: space.xl },
  cardLabel: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xs, letterSpacing: 0.6 },
  bigRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.md },
});
