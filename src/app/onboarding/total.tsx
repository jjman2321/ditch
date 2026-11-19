// 3 · Your total (design/v12 render 03). The one number that rolls
// (MOTION.md §1): the yearly total of the user's own picks, then the month,
// one fact, the biggest charges first, and a nudge to ditch what they don't use.
// One total per currency, never added together, never converted.
// The reveal (once per session, after the screen has slid in): the total counts up and
// decelerates onto the real value while the list below builds one row at a time, biggest
// first; a success haptic as it lands. After that nothing on the screen moves.

import { router } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

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
  POP,
  ROLL,
  RollingMeasure,
  RollingNumber,
  STEP_HEADER_H,
  Txt,
  haptic,
  paletteFor,
  rollDuration,
  useFitSize,
  useFrame,
  useIsDark,
  usePalette,
  useScreenArrived,
  SurfaceContext,
} from '@/ui/sunflower';

const NB = ' ';

/** Fades content in, `delay` ms after `go` (instant when not playing). Fade only: these lines hold prices (CLAUDE.md rule 8). */
function useReveal(play: boolean, go: boolean, delay: number, duration = 200) {
  const t = useSharedValue(play ? 0 : 1);
  useEffect(() => {
    if (!play) t.set(1);
    else if (go) t.set(withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) })));
  }, [play, go, delay, duration, t]);
  return useAnimatedStyle(() => ({ opacity: t.get() }));
}

// The list builds while the total counts: one row every 110 ms, biggest first, starting just after the count does.
const ROW = { first: ROLL.start + 120, gap: 110 } as const;

/**
 * One row of the list, building in: its logo pops in on a spring (the one thing that moves),
 * then the name and the yearly amount fade in beside it. The amount never slides (rule 8).
 */
function BuildRow({ play, go, delay, children, logo }: { play: boolean; go: boolean; delay: number; children: ReactNode; logo: ReactNode }) {
  const pop = useSharedValue(play ? 0 : 1);
  const fade = useSharedValue(play ? 0 : 1);
  useEffect(() => {
    if (!play) {
      pop.set(1);
      fade.set(1);
    } else if (go) {
      pop.set(withDelay(delay, withSpring(1, POP)));
      fade.set(withDelay(delay + 40, withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })));
    }
  }, [play, go, delay, pop, fade]);
  const logoStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, pop.get() * 3), transform: [{ scale: 0.5 + 0.5 * pop.get() }] }));
  const restStyle = useAnimatedStyle(() => ({ opacity: fade.get() }));
  return (
    <>
      <Animated.View style={logoStyle}>{logo}</Animated.View>
      <Animated.View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }, restStyle]}>{children}</Animated.View>
    </>
  );
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
  // The roll waits for the screen to finish sliding in, so it plays in front of still eyes (motion doc fix 6).
  const arrived = useScreenArrived();
  useEffect(() => {
    markTotalShown();
  }, [markTotalShown]);
  useEffect(() => {
    if (!play || !arrived) return;
    // Success, the moment the last digit lands.
    const t = setTimeout(() => haptic.success(), landed);
    return () => clearTimeout(t);
  }, [play, arrived, landed]);
  // "a year." arrives as the count settles; the month line and the rest just after it lands.
  const yearStyle = useReveal(play, arrived, landed - 220);
  const restStyle = useReveal(play, arrived, landed - 40, 220);
  // Rows added later (Show all) just appear: the build plays once.
  const build = play && !showAll;
  // "N more" and the nudge come in right after the last row. "N more" can't be tapped until it shows (rule 8).
  const lastRowAt = ROW.first + Math.min(sorted.length, 4) * ROW.gap;
  const moreStyle = useReveal(play, arrived, lastRowAt);
  const [moreLive, setMoreLive] = useState(!play);
  useEffect(() => {
    if (!play || !arrived) return;
    const t = setTimeout(() => setMoreLive(true), lastRowAt + 120);
    return () => clearTimeout(t);
  }, [play, arrived, lastRowAt]);

  // 104pt (80 on SE, 128 on iPad), shrunk only if a big total won't fit.
  const base = f.tablet ? 128 : f.tiny ? 56 : f.small ? 80 : 104;
  // A little air on the right so the last digit never touches the edge.
  const [size, onMeasure] = useFitSize(base, f.content - 4);
  // Archivo's own line is 1.09× the size (ascent 0.88, descent 0.21). A shorter line crops the tops of the
  // digits on iPhone (the "$2,64[0]" cut, Nov 19), and each digit sits in a clipped window while it rolls.
  // So the line is a little taller than the font's, and the empty band above the digits (~0.18×, the
  // gap between the font's ascent and the digit tops) and below them (the descent) is pulled back with
  // margins, which only overlap empty space.
  const lh = Math.ceil(size * 1.12);
  const pullTop = Math.round(size * 0.16);
  const pullBottom = Math.round(size * 0.18);
  const heroStyle = { fontFamily: F.display, fontSize: size, letterSpacing: -0.045 * size, color: p.money };

  // How many rows fit before "N more · Show all": 4 on iPhone 12 and up, 3 on smaller, 2 on SE, all on iPad.
  const shown = showAll || f.tablet ? sorted.length : f.tiny ? 1 : f.small ? 2 : f.height >= 800 ? 4 : 3;
  const rows = sorted.slice(0, shown);
  const rest = sorted.slice(shown);
  const rest1 = rest.length === 1 ? rest : [];
  const restMany = rest.length > 1 ? rest : [];
  const visible = [...rows, ...rest1];
  const priceSub = priceFor ? (list.find((x) => x.id === priceFor) ?? null) : null;

  const sheetPad = f.tablet
    ? { borderRadius: 28, padding: 24 }
    : { marginHorizontal: -f.edge, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: f.small ? 16 : 24, paddingHorizontal: f.edge, paddingBottom: 8 };

  return (
    <OnbRoot surface="sun">
      {/* The step header is drawn once by onboarding/_layout.tsx and stays still; this strip keeps its place, outside the scroll. */}
      <View style={{ height: f.top + STEP_HEADER_H }} />
      <FitScroll style={{ paddingHorizontal: f.edge, paddingBottom: f.tablet ? f.bottom : 0 }}>
        <Txt v="label" style={{ marginTop: f.tiny ? 4 : f.small ? 8 : 24, fontSize: 17, lineHeight: 24 }}>
          {main ? 'You pay' : 'Add your prices to see your total'}
        </Txt>

        {/* Measures the total at full size, drawn the same way, so it can shrink to fit. */}
        <RollingMeasure text={hero} style={{ fontFamily: F.display, fontSize: base, letterSpacing: -0.045 * base }} onWidth={onMeasure} />

        {main ? (
          <>
            <Animated.View entering={reduce ? FadeIn.duration(150) : undefined} style={{ marginTop: 8 - pullTop, marginBottom: -pullBottom, marginLeft: -4 }}>
              <RollingNumber text={hero} style={heroStyle} lineHeight={lh} play={play} go={arrived} accessibilityLabel={`${hero} a year`} />
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
              {/* Other currencies stay separate (CLAUDE.md rule 1), same as the yearly lines above. */}
              {others.length ? ` a month, plus ${others.map((t) => money(t.monthlyMinor, t.currency)).join(' and ')}.` : ' a month.'}
            </Txt>
          ) : null}
        </Animated.View>

        <View style={{ height: f.tiny ? 10 : f.small ? 16 : 24 }} />

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
                  <BuildRow play={build} go={arrived} delay={ROW.first + i * ROW.gap} logo={<LogoTile id={x.id} size={32} />}>
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
                  </BuildRow>
                </View>
              );
            })}
            {restMany.length ? (
              <Animated.View style={moreStyle} pointerEvents={moreLive ? 'auto' : 'none'}>
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
              </Animated.View>
            ) : null}
          </View>
          <Animated.View style={moreStyle}>
            <Txt v="strong" color={cream.fg} style={{ marginTop: f.small ? 12 : 16 }}>
              {f.tiny ? 'Not using one? Ditch it.' : `Not using one? Ditch it before it${NB}renews.`}
            </Txt>
          </Animated.View>
          {/* One fact in the spare room above the button on taller phones (C+R Research via CNBC, 2022: people guess
              $86 a month, they pay $219). Hidden on SE-size phones so the button never moves. */}
          {main && !f.small && !f.tablet ? (
            <>
              <View style={{ flex: 1, minHeight: 16 }} />
              <Animated.View style={moreStyle}>
                <Txt v="sub" color={cream.mute} style={{ marginBottom: 8 }}>
                  Most people guess less than half that.
                </Txt>
              </Animated.View>
            </>
          ) : null}
          {f.tablet ? (
            <>
              <View style={{ flex: 1, minHeight: 16 }} />
              <SurfaceContext.Provider value="cream">
                <Button label="Set up reminders" onPress={() => router.push('/onboarding/dates')} />
              </SurfaceContext.Provider>
            </>
          ) : null}
        </View>
      </FitScroll>
      {/* Pinned, so "Show all" can never push it off the screen. */}
      {f.tablet ? null : (
        <View style={{ backgroundColor: cream.sheet, paddingHorizontal: f.edge, paddingTop: 8, paddingBottom: f.insets.bottom + 16 }}>
          {/* It sits on the cream sheet, so it uses the cream button (white text), like every other cream screen. */}
          <SurfaceContext.Provider value="cream">
            <Button label="Set up reminders" onPress={() => router.push('/onboarding/dates')} />
          </SurfaceContext.Provider>
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
