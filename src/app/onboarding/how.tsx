// 2 · What Ditch does (design/v16 1b–1d): three swipeable slides, like
// Orbit, Feenko and Subpilot open with. One idea each, one picture each:
//   1. what people pay (the hook), with a statement where Ditch marks the subs,
//   2. reminders before every charge, as the real notifications,
//   3. the Ditched moment: hold, DITCHED, then the money you won't pay.
// Skip goes straight to "Where should we look?". No sources on screen (owner, Nov 18).

import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { OnbRoot } from '@/onboarding/Parts';
import { useOnboarding } from '@/state/onboarding';
import { Button, DitchedTag, EASE_OUT, F, LogoTile, NotificationPreview, Stage, Txt, brand, haptic, useFrame, usePalette, useScreenArrived } from '@/ui/sunflower';

const NB = ' ';

type Slide = {
  key: string;
  title: string;
  body: string;
  big?: string;
  art: 'statement' | 'notes' | 'ditch';
};

// Slide 1's fact: C+R Research (via CNBC, 2022), US adults: they guessed $86 a month, they paid $219
// ($2,628 a year). It's a US dollar figure, so only US phones see it; everyone else gets the guess
// fact without a currency (never a converted amount).
function slidesFor(us: boolean): Slide[] {
  return [
    us
      ? {
          key: 'pay',
          big: '$2,628',
          title: 'a year on subscriptions.',
          body: `That’s what people pay on average, and they guess less than half. Let’s${NB}find${NB}yours.`,
          art: 'statement',
        }
      : {
          key: 'pay',
          big: 'Less than half',
          title: `of what people really pay is what they${NB}guess.`,
          body: `That’s on average. Let’s${NB}find${NB}yours.`,
          art: 'statement',
        },
    {
      key: 'remind',
      title: `A reminder before it${NB}charges.`,
      body: `3 days and 1 day before, at 9 AM. Free trials${NB}too.`,
      art: 'notes',
    },
    {
      key: 'ditch',
      title: 'Ditch what you don’t use.',
      body: `Hold to ditch. We show you how to cancel${NB}it.`,
      art: 'ditch',
    },
  ];
}
const SLIDE_COUNT = 3;

/** Fades 0 → 1 after `delay` ms once `play` is true; at rest from the start with Reduce Motion. */
function useFadeIn(play: boolean, delay: number, duration = 220) {
  const reduce = useReducedMotion();
  const t = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) t.set(1);
    else if (play) t.set(withDelay(delay, withTiming(1, { duration, easing: EASE_OUT })));
  }, [reduce, play, delay, duration, t]);
  return t;
}

/** One statement line. A subscription gets its yellow marker, faded in (the amount itself never moves). */
function StatementRow({ d, m, a, sub, play, delay }: { d: string; m: string; a: string; sub: boolean; play: boolean; delay: number }) {
  const p = usePalette();
  const t = useFadeIn(play && sub, delay);
  const mark = useAnimatedStyle(() => ({ opacity: t.get() }));
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 9,
        marginVertical: 1,
      }}
    >
      {sub ? <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 9, backgroundColor: p.dark ? '#3A3220' : '#FFF1BC' }, mark]} /> : null}
      <Txt v="fine" tone="mute" num numberOfLines={1} style={{ width: 54, fontFamily: F.semi }}>
        {d}
      </Txt>
      <Txt
        v="fine"
        color={sub ? p.cardFg : p.mute}
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: sub ? F.semi : F.regular,
          letterSpacing: 0.2,
        }}
      >
        {m}
      </Txt>
      <Txt v="fine" num color={sub ? p.cardFg : p.mute} style={{ fontFamily: sub ? F.semi : F.regular }}>
        {a}
      </Txt>
    </View>
  );
}

/** Slide 1: a statement where Ditch marks the subscriptions, one after another, top to bottom. */
function Statement({ play }: { play: boolean }) {
  const p = usePalette();
  const rows: [string, string, string, boolean][] = [
    ['DEC 08', 'PLANET FITNESS', '24.99', true],
    ['DEC 07', 'SHELL OIL 5741', '48.22', false],
    ['DEC 05', 'APPLE.COM/BILL', '27.97', true],
    ['DEC 03', 'SPOTIFY USA', '11.99', true],
    ['DEC 02', 'TRADER JOE’S #552', '64.10', false],
    ['DEC 01', 'NETFLIX.COM', '17.99', true],
  ];
  let k = 0;
  return (
    <View
      accessible
      accessibilityLabel="A bank statement with the subscriptions marked"
      style={{
        backgroundColor: p.card,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: p.dark ? 1 : 0,
        borderColor: p.cardBorder,
      }}
    >
      {rows.map(([d, m, a, sub]) => (
        <StatementRow key={m} d={d} m={m} a={a} sub={sub} play={play} delay={sub ? 120 + k++ * 120 : 0} />
      ))}
    </View>
  );
}

/** Slide 2: the reminders drop in one by one, like they do on the lock screen. Each card moves as a whole. */
function Notes({ play }: { play: boolean }) {
  const notes = [
    { time: 'Sat 9 AM', message: 'Netflix renews Tuesday. $17.99. Still watching?' },
    { time: 'Mon 9 AM', message: 'Your ChatGPT trial ends Friday. Then $20.00 a month.' },
    { time: 'Wed 9 AM', message: 'Spotify went up to $12.99. You were paying $11.99.', faded: true },
  ];
  return (
    <View style={{ gap: 10 }}>
      {notes.map((n, i) => (
        <Stage key={n.time} show={play} delay={100 + i * 150} rise={-12} spring>
          <NotificationPreview time={n.time} message={n.message} faded={n.faded} />
        </Stage>
      ))}
    </View>
  );
}

// Slide 3's mini Ditched moment, in ms after the slide shows: the row dims and the DITCHED tag lands
// (with the same firm haptic as the real one), then the money line fades in. Fade only: no price moves.
const DITCH = { tag: 280, amount: 620 } as const;

/** Slide 3: a mini Ditched moment on Planet Fitness. */
function DitchRows({ play }: { play: boolean }) {
  const p = usePalette();
  const reduce = useReducedMotion();
  const tag = useFadeIn(play, DITCH.tag, 200);
  const amount = useFadeIn(play, DITCH.amount, 260);
  useEffect(() => {
    if (!play || reduce) return;
    const h = setTimeout(haptic.heavy, DITCH.tag);
    return () => clearTimeout(h);
  }, [play, reduce]);
  // Like the real moment (ditch/[id].tsx): the logo dims as the tag lands.
  const logoStyle = useAnimatedStyle(() => ({ opacity: 1 - 0.55 * tag.get() }));
  const nameStyle = useAnimatedStyle(() => ({ opacity: 1 - tag.get() }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tag.get() }));
  const amountStyle = useAnimatedStyle(() => ({ opacity: amount.get() }));
  const rows: {
    id: string;
    name: string;
    sub: string;
    price: string;
    ditched?: boolean;
  }[] = [
    { id: 'netflix', name: 'Netflix', sub: 'Tue, Dec 16', price: '$17.99' },
    {
      id: 'planet-fitness',
      name: 'Planet Fitness',
      sub: '$24.99/mo',
      price: '',
      ditched: true,
    },
    { id: 'spotify', name: 'Spotify', sub: 'Mon, Dec 22', price: '$11.99' },
  ];
  return (
    <View>
      <View
        style={{
          backgroundColor: p.card,
          borderRadius: 20,
          paddingHorizontal: 14,
          borderWidth: p.dark ? 1 : 0,
          borderColor: p.cardBorder,
        }}
      >
        {rows.map((r, i) => (
          <View
            key={r.id}
            style={{
              minHeight: 62,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderTopWidth: i ? 1 : 0,
              borderTopColor: p.hair,
            }}
          >
            <Animated.View style={r.ditched ? logoStyle : null}>
              <LogoTile id={r.id} size={38} mono={r.name.slice(0, 1)} />
            </Animated.View>
            <View style={{ flex: 1 }}>
              <View>
                <Txt v="bodyStrong" color={r.ditched ? p.mute : p.cardFg}>
                  {r.name}
                </Txt>
                {/* The name in full ink on top, fading away as it's ditched. */}
                {r.ditched ? (
                  <Animated.View style={[StyleSheet.absoluteFill, nameStyle]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    <Txt v="bodyStrong" color={p.cardFg}>
                      {r.name}
                    </Txt>
                  </Animated.View>
                ) : null}
              </View>
              <Txt v="fine" tone="mute">
                {r.sub}
              </Txt>
            </View>
            {r.ditched ? (
              <Animated.View style={tagStyle}>
                <DitchedTag />
              </Animated.View>
            ) : (
              <Txt v="moneyS" num color={p.cardFg}>
                {r.price}
              </Txt>
            )}
          </View>
        ))}
      </View>
      <Animated.View style={amountStyle}>
        <Txt v="moneyL" num center color={p.fg} style={{ marginTop: 16 }} numberOfLines={1} adjustsFontSizeToFit>
          $299.88 a year you won’t pay
        </Txt>
      </Animated.View>
    </View>
  );
}

/** A slide's words: fully there when its slide is centred, faded out half a swipe away, so they cross-fade as you swipe. */
function SlideWords({ i, x, width, children }: { i: number; x: SharedValue<number>; width: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  const anim = useAnimatedStyle(() => {
    if (reduce || width <= 0) return { opacity: 1 };
    return { opacity: interpolate(x.get(), [(i - 0.6) * width, i * width, (i + 0.6) * width], [0, 1, 0], Extrapolation.CLAMP) };
  });
  return <Animated.View style={anim}>{children}</Animated.View>;
}

/** A page dot: it widens and darkens as its slide comes in, following your finger. */
function Dot({ i, x, width, on, off }: { i: number; x: SharedValue<number>; width: number; on: string; off: string }) {
  const anim = useAnimatedStyle(() => {
    const at = width > 0 ? x.get() / width : 0;
    const k = interpolate(at, [i - 1, i, i + 1], [0, 1, 0], Extrapolation.CLAMP);
    return { width: 6 + 14 * k, backgroundColor: interpolateColor(k, [0, 1], [off, on]) };
  });
  return <Animated.View style={[{ height: 6, borderRadius: 3 }, anim]} />;
}

export default function How() {
  const p = usePalette();
  const f = useFrame({ maxContent: 480, colH: 820 });
  const { country } = useOnboarding();
  const slides = slidesFor(country === 'US');
  const scroller = useRef<{
    scrollTo: (o: { x: number; animated: boolean }) => void;
  } | null>(null);
  const [page, setPage] = useState(0);
  // The furthest slide reached: its picture plays once, the first time it shows (after the screen has slid in).
  const [seen, setSeen] = useState(0);
  const arrived = useScreenArrived();
  const last = page === slides.length - 1;
  const next = () => router.push('/onboarding/where');

  // The scroll position lives on the UI thread; the dots and words follow it frame by frame.
  const x = useSharedValue(0);
  const shown = useSharedValue(0);
  const onPage = useCallback((i: number) => {
    haptic.select();
    setPage(i);
    setSeen((s) => Math.max(s, i));
  }, []);
  const width = f.width;
  const count = SLIDE_COUNT;
  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        x.set(e.contentOffset.x);
        // A new slide counts once it's past halfway, like the iPhone's own page dots.
        const i = Math.min(count - 1, Math.max(0, Math.round(e.contentOffset.x / width)));
        if (i !== shown.get()) {
          shown.set(i);
          scheduleOnRN(onPage, i);
        }
      },
    },
    [width, count, onPage],
  );

  const go = () => {
    if (last) return next();
    scroller.current?.scrollTo({ x: (page + 1) * f.width, animated: true });
  };

  const dotOn = p.dark ? brand.sunflower : brand.ink;
  const dotOff = p.dark ? '#3A3630' : '#D9D0BD';

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top }}>
        <View
          style={{
            height: 44,
            paddingHorizontal: f.edge,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip"
            onPress={next}
            hitSlop={10}
            style={({ pressed }) => ({
              minHeight: 44,
              minWidth: 44,
              alignItems: 'flex-end',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Txt v="label" tone="fg2">
              Skip
            </Txt>
          </Pressable>
        </View>

        <Animated.ScrollView ref={scroller as never} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1 }}>
          {slides.map((s, i) => {
            const play = arrived && seen >= i;
            return (
              <View key={s.key} style={{ width: f.width, paddingHorizontal: f.edge, flex: 1 }}>
                {/* Picture and words stay together, centred in the page: spare height splits evenly above and below. */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingBottom: f.small ? 8 : 16,
                  }}
                >
                  <View style={{ marginBottom: f.small ? 20 : 36 }}>{s.art === 'statement' ? <Statement play={play} /> : s.art === 'notes' ? <Notes play={play} /> : <DitchRows play={play} />}</View>
                  <SlideWords i={i} x={x} width={width}>
                    {s.big ? (
                      <Txt v="displayL" num color={p.fg} accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit style={f.small ? { fontSize: 52, lineHeight: 52 } : null}>
                        {s.big}
                      </Txt>
                    ) : null}
                    <Txt v="title" accessibilityRole={s.big ? undefined : 'header'} style={[{ marginTop: s.big ? 2 : 0 }, f.small && { fontSize: 26, lineHeight: 31 }]}>
                      {s.title}
                    </Txt>
                    <Txt v="lead" tone="fg2" style={{ marginTop: 8 }}>
                      {s.body}
                    </Txt>
                  </SlideWords>
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>

        <View style={{ paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
          <View
            accessible
            accessibilityLabel={`Slide ${page + 1} of ${slides.length}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
              marginBottom: f.small ? 14 : 20,
            }}
          >
            {slides.map((s, i) => (
              <Dot key={s.key} i={i} x={x} width={width} on={dotOn} off={dotOff} />
            ))}
          </View>
          <Button label={last ? 'Find my subscriptions' : 'Next'} onPress={go} />
        </View>
      </View>
    </OnbRoot>
  );
}
