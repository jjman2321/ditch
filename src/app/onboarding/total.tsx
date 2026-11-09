// 03 · Your total. The one number that rolls (MOTION.md §1): the yearly
// total from the user's own picks, then the month/day split and where it goes.

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { yearlyMinor } from '@/domain/money';
import { PriceSheet } from '@/onboarding/PriceSheet';
import { byYearlyDesc, isPriced, totalsFor, useCountry, useMoney, useOnboarding, usePickedList, type Picked, type PricedPick } from '@/state/onboarding';
import { Button, Card, EDGE, F, LogoTile, RollingNumber, Screen, StepHeader, Txt, haptic, rollDuration, tabular, usePalette, useFitSize } from '@/ui/sunflower';

const HERO = 118;
const HERO_LH = 108;

/** Fades content up 6pt, `delay` ms after mount (instant when not playing). */
function useReveal(play: boolean, delay: number, duration = 200) {
  const t = useSharedValue(play ? 0 : 1);
  useEffect(() => {
    if (play) t.set(withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) })));
  }, [play, delay, duration, t]);
  return useAnimatedStyle(() => ({ opacity: t.get(), transform: [{ translateY: (1 - t.get()) * 6 }] }));
}

function Bar({ pct, play, delay }: { pct: number; play: boolean; delay: number }) {
  const p = usePalette();
  const w = useSharedValue(play ? 0 : pct);
  useEffect(() => {
    if (play) w.set(withDelay(delay, withTiming(pct, { duration: 500, easing: Easing.out(Easing.cubic) })));
    else w.set(pct);
  }, [play, delay, pct, w]);
  const anim = useAnimatedStyle(() => ({ width: `${w.get() * 100}%` }));
  return (
    <View style={{ height: 5, borderRadius: 3, backgroundColor: p.barTrack, marginTop: 6, width: '100%', maxWidth: 150 }}>
      <Animated.View style={[{ height: 5, borderRadius: 3, backgroundColor: p.barFill }, anim]} />
    </View>
  );
}

function WhereItGoes({ items, play, delay }: { items: PricedPick[]; play: boolean; delay: number }) {
  const p = usePalette();
  const money = useMoney();
  // Bars compare within a currency only.
  const max = (c: string) => Math.max(...items.filter((x) => x.currency === c).map((x) => yearlyMinor(x.amountMinor, x.cycle)), 1);
  return (
    <Card style={{ marginTop: 18, paddingHorizontal: 16, paddingVertical: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 4 }}>
        <Txt v="eyebrow" tone="mute">
          Where it goes
        </Txt>
        <Txt v="eyebrow" tone="mute">
          Per year
        </Txt>
      </View>
      {items.map((x, i) => {
        const y = yearlyMinor(x.amountMinor, x.cycle);
        const amount = money(y, x.currency);
        return (
          <View
            key={x.id}
            accessible
            accessibilityLabel={`${x.name}, ${amount} a year`}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 51, paddingVertical: 6, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}
          >
            <LogoTile id={x.id} size={30} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt v="label" color={p.cardFg} numberOfLines={1}>
                {x.name}
              </Txt>
              <Bar pct={y / max(x.currency)} play={play} delay={delay + i * 40} />
            </View>
            <Txt v="moneyS" num color={p.cardFg}>
              {amount}
            </Txt>
          </View>
        );
      })}
    </Card>
  );
}

/** Picks we have no local price for: ask for them here, in a short list. */
function NoPriceYet({ items }: { items: Picked[] }) {
  const p = usePalette();
  const { setPrice } = useOnboarding();
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const sub = items.find((x) => x.id === editing) ?? null;
  return (
    <Card style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
      <View style={{ paddingTop: 10, paddingBottom: 4 }}>
        <Txt v="eyebrow" tone="mute">
          No price yet
        </Txt>
      </View>
      {items.map((x, i) => (
        <Pressable
          key={x.id}
          accessibilityRole="button"
          accessibilityLabel={`Add your price for ${x.name}`}
          onPress={() => {
            setEditing(x.id);
            setOpen(true);
          }}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair, opacity: pressed ? 0.6 : 1 })}
        >
          <LogoTile id={x.id} size={30} />
          <Txt v="label" color={p.cardFg} style={{ flex: 1 }} numberOfLines={1}>
            {x.name}
          </Txt>
          <Txt v="label" color={p.cardFg} style={{ textDecorationLine: 'underline', fontSize: 14 }}>
            Add your price
          </Txt>
        </Pressable>
      ))}
      <PriceSheet
        sub={sub}
        visible={open}
        onClose={() => setOpen(false)}
        onSave={(amount, currency, cycle) => {
          if (sub) setPrice(sub.id, amount, currency, cycle);
          setOpen(false);
        }}
      />
    </Card>
  );
}

export default function Total() {
  const p = usePalette();
  const reduce = useReducedMotion();
  const { totalShown, markTotalShown } = useOnboarding();
  const list = usePickedList();
  const country = useCountry();
  const money = useMoney();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const priced = sorted.filter(isPriced);
  const unpriced = sorted.filter((x) => !isPriced(x));
  const totals = totalsFor(list, country?.currency);
  const main = totals[0];
  const others = totals.slice(1);
  const n = priced.length;

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

  const { width } = useWindowDimensions();
  const [size, onMeasure] = useFitSize(HERO, width - EDGE * 2 + 4);
  const lh = Math.round((HERO_LH * size) / HERO);
  const heroStyle = { fontFamily: F.display, fontSize: size, letterSpacing: (-5 * size) / HERO, color: p.money };

  return (
    <Screen
      surface="sun"
      scroll
      footer={<Button label="Set my charge dates" onPress={() => router.push('/onboarding/dates')} />}
    >
      <StepHeader step={2} />
      <Txt v="label" style={{ fontSize: 17, marginTop: 16 }}>
        {!main
          ? 'Add your prices to see your total'
          : unpriced.length
            ? `${n} of your ${list.length} subscriptions cost`
            : `Your ${n} ${n === 1 ? 'subscription costs' : 'subscriptions cost'}`}
      </Txt>

      {/* Measures the total once at full size so it can shrink to fit. */}
      <View pointerEvents="none" style={{ position: 'absolute', opacity: 0, width: 2000, alignItems: 'flex-start' }}>
        <Text allowFontScaling={false} onLayout={(e) => onMeasure(e.nativeEvent.layout.width)} style={[{ fontFamily: F.display, fontSize: HERO, letterSpacing: -5 }, tabular]}>
          {hero}
        </Text>
      </View>

      {main ? (
        <>
          <Animated.View entering={reduce ? FadeIn.duration(150) : undefined} style={{ marginTop: 2, marginLeft: -4 }}>
            <RollingNumber text={hero} style={heroStyle} lineHeight={lh} play={play} accessibilityLabel={`${hero} a year`} />
          </Animated.View>
          <Animated.View style={yearStyle}>
            <Txt v="displayS" style={{ marginTop: 2 }} importantForAccessibility="no">
              a year.
            </Txt>
            {/* Other currencies get their own line. Never added, never converted. */}
            {others.map((t) => (
              <Txt key={t.currency} v="label" tone="fg2" num style={{ marginTop: 4 }}>
                + {money(t.yearlyMinor, t.currency, { whole: true })} a year
              </Txt>
            ))}
            {country?.code === 'US' ? (
              <Txt v="sub" tone="fg2" style={{ marginTop: 4 }}>
                US prices are before sales tax.
              </Txt>
            ) : null}
          </Animated.View>
        </>
      ) : null}

      <Animated.View style={restStyle}>
        {main ? (
          <View style={{ flexDirection: 'row', marginTop: 16, borderTopWidth: 2, borderTopColor: p.dark ? p.rule : p.fg }}>
            {[
              [money(main.monthlyMinor, main.currency), 'a month'],
              [money(main.dailyMinor, main.currency), 'a day'],
            ].map(([v, l], i) => (
              <View
                key={l}
                accessible
                accessibilityLabel={`${v} ${l}`}
                style={{ flex: 1, paddingTop: 10, paddingLeft: i ? 16 : 0, borderLeftWidth: i ? 1 : 0, borderLeftColor: p.rule }}
              >
                <Txt v="moneyL" tone="money" num>
                  {v}
                </Txt>
                <Txt v="body" tone="fg2" style={{ fontSize: 14 }}>
                  {l}
                </Txt>
              </View>
            ))}
          </View>
        ) : null}
        {priced.length ? <WhereItGoes items={priced} play={play} delay={landed + 120} /> : null}
        {unpriced.length ? <NoPriceYet items={unpriced} /> : null}
        <Txt v="leadS" tone="fg2" style={{ marginTop: 18 }}>
          Bigger than you guessed? It usually is. Let’s make sure none of it surprises you.
        </Txt>
      </Animated.View>
    </Screen>
  );
}
