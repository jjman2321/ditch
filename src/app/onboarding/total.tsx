// 3 · Your total (design/v12 render 03). The one number that rolls
// (MOTION.md §1): the yearly total of the user's own picks, then the month,
// one fact, the biggest charges first, and a nudge to ditch what they don't use.
// One total per currency, never added together, never converted.

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { approxLine } from '@/domain/copy';
import { yearlyMinor } from '@/domain/money';
import { FitScroll, OnbRoot, TextLink } from '@/onboarding/Parts';
import { PriceSheet } from '@/onboarding/PriceSheet';
import { useCombinedTotal } from '@/services/fx';
import { byYearlyDesc, isPriced, totalsFor, useCountry, useMoney, useOnboarding, usePickedList } from '@/state/onboarding';
import {
  Button,
  ChevronDown,
  F,
  LogoTile,
  RollingMeasure,
  RollingNumber,
  StepHeader,
  Txt,
  haptic,
  paletteFor,
  rollDuration,
  useFitSize,
  useFrame,
  useIsDark,
  usePalette,
} from '@/ui/sunflower';

const NB = ' ';

/** Fades content up 6pt, `delay` ms after mount (instant when not playing). */
function useReveal(play: boolean, delay: number, duration = 200) {
  const t = useSharedValue(play ? 0 : 1);
  useEffect(() => {
    if (play) t.set(withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) })));
  }, [play, delay, duration, t]);
  return useAnimatedStyle(() => ({ opacity: t.get(), transform: [{ translateY: (1 - t.get()) * 6 }] }));
}

export default function Total() {
  const p = usePalette();
  const dark = useIsDark();
  const cream = paletteFor('cream', dark);
  const reduce = useReducedMotion();
  const f = useFrame({ colH: 880 });
  const { totalShown, markTotalShown, setPrice } = useOnboarding();
  const list = usePickedList();
  const country = useCountry();
  const money = useMoney();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const totals = totalsFor(list, country?.currency);
  const main = totals[0];
  const others = totals.slice(1);
  // 2+ currencies: one rough line in their own currency, under the real totals.
  const combined = useCombinedTotal(totals, country?.currency);
  const approx = combined ? approxLine(money(combined.yearlyMinor, combined.currency, { whole: true }), 'a year', combined.date) : null;
  const [showAll, setShowAll] = useState(false);
  const [priceFor, setPriceFor] = useState<string | null>(null);

  // Play once per session; Reduce Motion gets a short fade instead.
  const [play] = useState(() => !totalShown && !reduce);
  const hero = main ? money(main.yearlyMinor, main.currency, { whole: true }) : '';
  const landed = play ? rollDuration(hero) : 0;
  useEffect(() => {
    markTotalShown();
    if (!play) return;
    const t = setTimeout(() => haptic.light(), landed);
    return () => clearTimeout(t);
  }, [play, landed, markTotalShown]);
  const yearStyle = useReveal(play, landed);
  const restStyle = useReveal(play, landed + 120, 220);

  // 104pt (80 on SE, 128 on iPad), shrunk only if a big total won't fit.
  const base = f.tablet ? 128 : f.small ? 80 : 104;
  // A little air on the right so the last digit never touches the edge.
  const [size, onMeasure] = useFitSize(base, f.content - 4);
  const lh = Math.round((size * 0.8) / 4) * 4;
  const heroStyle = { fontFamily: F.display, fontSize: size, letterSpacing: -0.045 * size, color: p.money };

  // How many rows fit before "N more · Show all": 4 on iPhone 12 and up, 3 on smaller, 2 on SE, all on iPad.
  const shown = showAll || f.tablet ? sorted.length : f.small ? 2 : f.height >= 800 ? 4 : 3;
  const rows = sorted.slice(0, shown);
  const rest = sorted.slice(shown);
  const rest1 = rest.length === 1 ? rest : [];
  const restMany = rest.length > 1 ? rest : [];
  const visible = [...rows, ...rest1];
  const priceSub = priceFor ? (list.find((x) => x.id === priceFor) ?? null) : null;

  const sheetPad = f.tablet ? { borderRadius: 28, padding: 24 } : { marginHorizontal: -f.edge, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: f.small ? 16 : 24, paddingHorizontal: f.edge, paddingBottom: 8 };

  return (
    <OnbRoot surface="sun">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.tablet ? f.bottom : 0 }}>
        <StepHeader step={2} />
        <Txt v="label" style={{ marginTop: f.small ? 8 : 24, fontSize: 17, lineHeight: 24 }}>
          {main ? 'You pay' : 'Add your prices to see your total'}
        </Txt>

        {/* Measures the total at full size, drawn the same way, so it can shrink to fit. */}
        <RollingMeasure text={hero} style={{ fontFamily: F.display, fontSize: base, letterSpacing: -0.045 * base }} onWidth={onMeasure} />

        {main ? (
          <>
            <Animated.View entering={reduce ? FadeIn.duration(150) : undefined} style={{ marginTop: 8, marginLeft: -4 }}>
              <RollingNumber text={hero} style={heroStyle} lineHeight={lh} play={play} accessibilityLabel={`${hero} a year`} />
            </Animated.View>
            <Animated.View style={yearStyle}>
              <Txt v="heading" importantForAccessibility="no" accessibilityElementsHidden style={{ fontSize: 22, marginTop: f.tablet ? 16 : 12 }}>
                a year.
              </Txt>
              {others.map((t) => (
                <Txt key={t.currency} v="label" tone="fg2" num style={{ marginTop: 4 }}>
                  {`+ ${money(t.yearlyMinor, t.currency, { whole: true })} a year`}
                </Txt>
              ))}
              {approx ? (
                <Txt v="sub" tone="fg2" num accessibilityLabel={approx.spoken} style={{ marginTop: 4 }}>
                  {approx.text}
                </Txt>
              ) : null}
            </Animated.View>
          </>
        ) : null}

        <Animated.View style={restStyle}>
          {main ? (
            <Txt v="lead" num style={{ marginTop: 16 }}>
              {'That’s '}
              <Txt v="lead" num style={{ fontFamily: F.semi }}>
                {money(main.monthlyMinor, main.currency)}
              </Txt>
              {' a month.'}
            </Txt>
          ) : null}
          <Txt v="body" tone="fg2" style={{ marginTop: 8, maxWidth: 340 }}>
            {`Most people think it’s way less. In one study, the real total was 2.5× what people${NB}thought.`}
          </Txt>
        </Animated.View>

        <View style={{ height: f.small ? 16 : 24 }} />

        <View style={[{ flex: 1, backgroundColor: cream.sheet }, sheetPad, dark && { borderTopWidth: 1, borderColor: '#2C2924' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 16 }}>
            <Txt v="eyebrow" color={cream.mute}>
              Biggest first
            </Txt>
            <Txt v="eyebrow" color={cream.mute}>
              Per year
            </Txt>
          </View>
          <View style={{ marginTop: 4 }}>
            {visible.map((x, i) => {
              const amount = isPriced(x) ? money(yearlyMinor(x.amountMinor, x.cycle), x.currency) : null;
              return (
                <View
                  key={x.id}
                  accessible={!!amount}
                  accessibilityLabel={amount ? `${x.name}, ${amount} a year` : undefined}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 }}
                >
                  {i ? <View style={{ position: 'absolute', top: 0, left: 44, right: 0, height: 1, backgroundColor: cream.hair }} /> : null}
                  <LogoTile id={x.id} size={32} />
                  <Txt v="label" color={cream.fg} numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
                    {x.name}
                  </Txt>
                  {amount ? (
                    <Txt v="moneyM" num color={cream.money}>
                      {amount}
                    </Txt>
                  ) : (
                    <TextLink label="Add your price" a11y={`Add your price for ${x.name}`} onPress={() => setPriceFor(x.id)} color={cream.fg} />
                  )}
                </View>
              );
            })}
            {restMany.length ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${restMany.length} more. Show all`}
                onPress={() => {
                  haptic.select();
                  setShowAll(true);
                }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, opacity: pressed ? 0.6 : 1 })}
              >
                <View style={{ position: 'absolute', top: 0, left: 44, right: 0, height: 1, backgroundColor: cream.hair }} />
                <View style={{ width: 32, flexDirection: 'row' }}>
                  {restMany.slice(0, 2).map((x, i) => (
                    <View key={x.id} style={{ marginLeft: i ? -8 : 0, borderRadius: 6, borderWidth: 2, borderColor: cream.sheet, margin: -2 }}>
                      <LogoTile id={x.id} size={20} />
                    </View>
                  ))}
                </View>
                <Txt v="label" color={cream.fg} style={{ flex: 1, fontSize: 16 }}>
                  {`${restMany.length} more`}
                </Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Txt v="label" color={cream.fg}>
                    Show all
                  </Txt>
                  <ChevronDown color={cream.fg} size={14} />
                </View>
              </Pressable>
            ) : null}
          </View>
          <Txt v="strong" color={cream.fg} style={{ marginTop: f.small ? 12 : 16 }}>
            {`Not using one? Ditch it before it${NB}renews.`}
          </Txt>
          {f.tablet ? (
            <>
              <View style={{ flex: 1, minHeight: 16 }} />
              <Button label="Set up reminders" onPress={() => router.push('/onboarding/dates')} />
            </>
          ) : null}
        </View>
      </FitScroll>
      {/* Pinned, so "Show all" can never push it off the screen. */}
      {f.tablet ? null : (
        <View style={{ backgroundColor: cream.sheet, paddingHorizontal: f.edge, paddingTop: 8, paddingBottom: f.insets.bottom + 16 }}>
          <Button label="Set up reminders" onPress={() => router.push('/onboarding/dates')} />
        </View>
      )}
      <PriceSheet
        sub={priceSub}
        visible={!!priceSub}
        onClose={() => setPriceFor(null)}
        onSave={(amount, currency, cycle) => {
          if (priceFor) setPrice(priceFor, amount, currency, cycle);
          setPriceFor(null);
        }}
      />
    </OnbRoot>
  );
}
