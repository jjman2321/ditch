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
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { FREE_LINE, OnbRoot } from '@/onboarding/Parts';
import { Button, DitchedTag, EASE_OUT, F, LAND, LogoTile, NotificationPreview, POP, Txt, brand, haptic, useFrame, usePalette, useScreenArrived } from '@/ui/sunflower';

const NB = ' ';

type Slide = {
  key: string;
  title: string;
  body: string;
  big?: string;
  art: 'statement' | 'notes' | 'ditch';
};

const SLIDES: Slide[] = [
  {
    key: 'pay',
    big: '$2,628',
    title: 'a year on subscriptions.',
    body: `That’s what the average person pays. Most guess less than half. Let’s${NB}find${NB}yours.`,
    art: 'statement',
  },
  {
    key: 'remind',
    title: 'A heads-up before every charge.',
    body: `3 days and 1 day before, at 9 AM. Free trials and price${NB}rises${NB}too.`,
    art: 'notes',
  },
  {
    key: 'ditch',
    title: 'Ditch what you don’t use.',
    body: `Hold to ditch. We show you exactly how to cancel${NB}it.`,
    art: 'ditch',
  },
];

// How the slides move (motion pass 2, Nov 18). Everything here follows the scroll offset `x`,
// frame by frame on the UI thread, so it moves exactly with your finger and stops when you stop:
//   · the picture lags behind its page (parallax), shrinks a little and fades as it leaves;
//   · the words move with the page, a touch faster than the picture, and cross-fade;
//   · the dots stretch with the offset.
// Each picture's little "play" (markers, notifications, the mini ditch) starts once its slide has
// settled, and quietly resets once it's fully off screen, so swiping back plays it again.
// Reduce Motion: plain paging, every picture shown finished.

/** The share of a page the picture lags behind (0 = moves with the page). */
const ART_LAG = 0.42;

/**
 * 1 once slide `i` has settled in the middle (and the screen has arrived), 0 once it's fully off
 * screen; in between it keeps its last value, so a half swipe that comes back doesn't replay.
 */
function useSlideCue(i: number, x: SharedValue<number>, width: number, arrived: SharedValue<number>, reduce: boolean) {
  const cue = useSharedValue(reduce ? 1 : 0);
  useAnimatedReaction(
    () => {
      if (reduce) return 1;
      if (!arrived.get() || width <= 0) return -1;
      const d = Math.abs(x.get() - i * width);
      return d < 1.5 ? 1 : d >= width * 0.98 ? 0 : -1;
    },
    (now, prev) => {
      if (now === -1 || now === prev) return;
      cue.set(now);
    },
    [i, width, reduce],
  );
  return cue;
}

/** Runs `play` when the cue turns on and `reset` when it turns off (both worklets, on the UI thread). */
function useOnCue(cue: SharedValue<number>, play: () => void, reset: () => void) {
  useAnimatedReaction(
    () => cue.get(),
    (now, prev) => {
      if (now === prev) return;
      if (now === 1) play();
      else reset();
    },
  );
}

const MARK_GROW = { duration: 300, dampingRatio: 1 } as const;
const SCAN_MS = 460;

/** One statement line. A subscription gets its yellow marker, swept in left to right behind the text (the amount itself never moves). */
function StatementRow({ d, m, a, sub, mark }: { d: string; m: string; a: string; sub: boolean; mark?: SharedValue<number> }) {
  const p = usePalette();
  const style = useAnimatedStyle(() => {
    const k = mark ? mark.get() : 1;
    return { opacity: Math.min(1, k * 2), transform: [{ scaleX: 0.04 + 0.96 * k }] };
  });
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
      {sub ? <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 9, backgroundColor: p.dark ? '#3A3220' : '#FFF1BC', transformOrigin: 'left' }, style]} /> : null}
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

const STATEMENT: [string, string, string, boolean][] = [
  ['DEC 08', 'PLANET FITNESS', '24.99', true],
  ['DEC 07', 'SHELL OIL 5741', '48.22', false],
  ['DEC 05', 'APPLE.COM/BILL', '27.97', true],
  ['DEC 03', 'SPOTIFY USA', '11.99', true],
  ['DEC 02', 'TRADER JOE’S #552', '64.10', false],
  ['DEC 01', 'NETFLIX.COM', '17.99', true],
];

/** Slide 1: a statement. Once the slide settles, a scan line runs down it and marks each subscription as it passes. */
function Statement({ cue, reduce }: { cue: SharedValue<number>; reduce: boolean }) {
  const p = usePalette();
  const [h, setH] = useState(0);
  const scan = useSharedValue(0);
  const m0 = useSharedValue(reduce ? 1 : 0);
  const m1 = useSharedValue(reduce ? 1 : 0);
  const m2 = useSharedValue(reduce ? 1 : 0);
  const m3 = useSharedValue(reduce ? 1 : 0);
  const marks = [m0, m1, m2, m3];
  // Where each subscription sits, as a share of the way down: the marker lands as the line passes it.
  const at = STATEMENT.map((r, i) => (r[3] ? (i + 0.5) / STATEMENT.length : -1)).filter((v) => v >= 0);
  useOnCue(
    cue,
    () => {
      'worklet';
      if (reduce) return;
      scan.set(0);
      scan.set(withTiming(1, { duration: SCAN_MS, easing: Easing.inOut(Easing.quad) }));
      [m0, m1, m2, m3].forEach((m, k) => m.set(withDelay(at[k] * SCAN_MS * 0.9, withSpring(1, MARK_GROW))));
    },
    () => {
      'worklet';
      if (reduce) return;
      [scan, m0, m1, m2, m3].forEach((v) => {
        cancelAnimation(v);
        v.set(0);
      });
    },
  );
  const line = useAnimatedStyle(() => {
    const k = scan.get();
    return { opacity: k <= 0 || k >= 1 ? 0 : Math.sin(Math.PI * k), transform: [{ translateY: 8 + k * Math.max(0, h - 16) }] };
  });
  let n = 0;
  return (
    <View
      accessible
      accessibilityLabel="A bank statement with the subscriptions marked"
      onLayout={(e) => setH(e.nativeEvent.layout.height)}
      style={{
        backgroundColor: p.card,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: p.dark ? 1 : 0,
        borderColor: p.cardBorder,
        overflow: 'hidden',
      }}
    >
      {STATEMENT.map(([d, m, a, sub]) => (
        <StatementRow key={m} d={d} m={m} a={a} sub={sub} mark={sub ? marks[n++] : undefined} />
      ))}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, backgroundColor: brand.sunflower, shadowColor: brand.sunflower, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }, line]} />
    </View>
  );
}

const NOTES = [
  { time: 'Sat 9 AM', message: 'Netflix renews Tuesday. $17.99. Still watching?' },
  { time: 'Mon 9 AM', message: 'Your ChatGPT trial ends Friday. Then $20.00 a month.' },
  { time: 'Wed 9 AM', message: 'Spotify went up to $12.99. You were paying $11.99.', faded: true },
];

/** One reminder card. It drops in from just above and lands on a spring, as a whole (the price inside never moves on its own). */
function Note({ k, children }: { k: SharedValue<number>; children: ReactNode }) {
  const style = useAnimatedStyle(() => {
    const v = k.get();
    return { opacity: Math.min(1, v * 3), transform: [{ translateY: (1 - v) * -22 }, { scale: 0.95 + 0.05 * Math.min(1, v) }] };
  });
  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Slide 2: the first reminder is already there; once the slide settles the next two land one after another, like the lock screen. */
function Notes({ cue, reduce }: { cue: SharedValue<number>; reduce: boolean }) {
  const one = useSharedValue(1);
  const two = useSharedValue(reduce ? 1 : 0);
  const three = useSharedValue(reduce ? 1 : 0);
  useOnCue(
    cue,
    () => {
      'worklet';
      if (reduce) return;
      two.set(withDelay(60, withSpring(1, LAND)));
      three.set(withDelay(200, withSpring(1, LAND)));
    },
    () => {
      'worklet';
      if (reduce) return;
      [two, three].forEach((v) => {
        cancelAnimation(v);
        v.set(0);
      });
    },
  );
  const ks = [one, two, three];
  return (
    <View style={{ gap: 10 }}>
      {NOTES.map((n, i) => (
        <Note key={n.time} k={ks[i]}>
          <NotificationPreview time={n.time} message={n.message} faded={n.faded} />
        </Note>
      ))}
    </View>
  );
}

// Slide 3's mini Ditched moment, in ms after the slide settles. Like the real one (SubRow + ditch/[id]):
// the row lifts and turns sunflower while a ring fills around the logo (a hold), then the DITCHED tag
// lands with the same firm haptic, the logo dims, and the money line fades in. Fade only near prices.
const DITCH = { hold: 520, tag: 560, amount: 760 } as const;
const RING_R = 24.5;
const RING_BOX = 56;
const CIRC = 2 * Math.PI * RING_R;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Slide 3: a mini Ditched moment on Planet Fitness. */
function DitchRows({ cue, reduce }: { cue: SharedValue<number>; reduce: boolean }) {
  const p = usePalette();
  const hold = useSharedValue(0); // the ring, 0 → 1
  const lift = useSharedValue(0); // the row is held: logo up, row sunflower
  const tag = useSharedValue(reduce ? 1 : 0);
  const amount = useSharedValue(reduce ? 1 : 0);
  const buzz = useCallback(() => haptic.heavy(), []);
  useOnCue(
    cue,
    () => {
      'worklet';
      if (reduce) return;
      lift.set(withSpring(1, { duration: 260, dampingRatio: 1 }));
      hold.set(
        withTiming(1, { duration: DITCH.hold, easing: Easing.inOut(Easing.quad) }, (done) => {
          if (!done) return;
          // Let go: the tag lands, with the real moment's firm haptic.
          lift.set(withTiming(0, { duration: 180, easing: EASE_OUT }));
          scheduleOnRN(buzz);
        }),
      );
      tag.set(withDelay(DITCH.tag, withSpring(1, POP)));
      amount.set(withDelay(DITCH.amount, withTiming(1, { duration: 240, easing: EASE_OUT })));
    },
    () => {
      'worklet';
      if (reduce) return;
      [hold, lift, tag, amount].forEach((v) => {
        cancelAnimation(v);
        v.set(0);
      });
    },
  );
  const ring = useAnimatedProps(() => ({ strokeDashoffset: CIRC * (1 - hold.get()) }));
  const ringBox = useAnimatedStyle(() => ({ opacity: tag.get() > 0.05 ? Math.max(0, 1 - tag.get() * 2) : Math.min(1, hold.get() * 6) }));
  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(lift.get(), [0, 1], [p.dark ? 'rgba(255,204,46,0)' : 'rgba(255,204,46,0)', p.dark ? 'rgba(255,204,46,0.18)' : brand.sunflower]),
  }));
  // Like the real moment: the logo grows while held, then dims as the tag lands.
  const logoStyle = useAnimatedStyle(() => ({ opacity: 1 - 0.55 * Math.min(1, tag.get()), transform: [{ scale: 1 + 0.08 * lift.get() }] }));
  const nameStyle = useAnimatedStyle(() => ({ opacity: 1 - Math.min(1, tag.get()) }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, tag.get() * 2.5), transform: [{ scale: 1.35 - 0.35 * tag.get() }] }));
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
          paddingHorizontal: 6,
          borderWidth: p.dark ? 1 : 0,
          borderColor: p.cardBorder,
        }}
      >
        {rows.map((r, i) => (
          <Animated.View
            key={r.id}
            style={[
              {
                minHeight: 62,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 8,
                borderRadius: 16,
              },
              r.ditched ? rowStyle : null,
            ]}
          >
            {i ? <View style={{ position: 'absolute', top: 0, left: 8, right: 8, height: 1, backgroundColor: p.hair }} /> : null}
            <Animated.View style={r.ditched ? logoStyle : null}>
              <LogoTile id={r.id} size={38} mono={r.name.slice(0, 1)} />
              {r.ditched ? (
                <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: (38 - RING_BOX) / 2, top: (38 - RING_BOX) / 2 }, ringBox]}>
                  <Svg width={RING_BOX} height={RING_BOX}>
                    <AnimatedCircle
                      cx={RING_BOX / 2}
                      cy={RING_BOX / 2}
                      r={RING_R}
                      stroke={p.dark ? brand.sunflower : brand.ink}
                      strokeWidth={3}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${CIRC} ${CIRC}`}
                      animatedProps={ring}
                      transform={`rotate(-90 ${RING_BOX / 2} ${RING_BOX / 2})`}
                    />
                  </Svg>
                </Animated.View>
              ) : null}
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
          </Animated.View>
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

/** A slide's words ride the page, `ahead` (a share of a page) faster than it, and cross-fade by half a swipe. */
function Words({ x, i, width, reduce, ahead, children }: { x: SharedValue<number>; i: number; width: number; reduce: boolean; ahead: number; children: ReactNode }) {
  const style = useAnimatedStyle(() => {
    if (reduce || width <= 0) return {};
    const t = Math.max(-1, Math.min(1, (x.get() - i * width) / width));
    return {
      opacity: interpolate(Math.abs(t), [0, 0.55], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: -t * width * ahead }],
    };
  });
  return <Animated.View style={style}>{children}</Animated.View>;
}

/** One slide. Its picture and words follow the scroll offset; its picture plays once the slide settles. */
function SlidePage({
  s,
  i,
  x,
  width,
  arrived,
  reduce,
  f,
}: {
  s: Slide;
  i: number;
  x: SharedValue<number>;
  width: number;
  arrived: SharedValue<number>;
  reduce: boolean;
  f: ReturnType<typeof useFrame>;
}) {
  const p = usePalette();
  const cue = useSlideCue(i, x, width, arrived, reduce);
  // How far this slide is from the middle, in pages: 0 centred, -1 one page to the right (coming in), +1 gone left.
  const artStyle = useAnimatedStyle(() => {
    if (reduce || width <= 0) return {};
    const t = Math.max(-1, Math.min(1, (x.get() - i * width) / width));
    const a = Math.abs(t);
    return {
      opacity: interpolate(a, [0, 0.85], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: t * width * ART_LAG }, { scale: 1 - 0.1 * a }],
    };
  });
  return (
    <View style={{ width, paddingHorizontal: f.edge, flex: 1 }}>
      {/* Picture and words stay together, centred in the page: spare height splits evenly above and below. */}
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: f.small ? 8 : 16 }}>
        <Animated.View style={[{ marginBottom: f.small ? 20 : 36 }, artStyle]}>
          {s.art === 'statement' ? <Statement cue={cue} reduce={reduce} /> : s.art === 'notes' ? <Notes cue={cue} reduce={reduce} /> : <DitchRows cue={cue} reduce={reduce} />}
        </Animated.View>
        {s.big ? (
          <Words x={x} i={i} width={width} reduce={reduce} ahead={0}>
            <Txt v="displayL" num color={p.fg} accessibilityRole="header" style={f.small ? { fontSize: 52, lineHeight: 52 } : null}>
              {s.big}
            </Txt>
          </Words>
        ) : null}
        <Words x={x} i={i} width={width} reduce={reduce} ahead={0.06}>
          <Txt v="title" accessibilityRole={s.big ? undefined : 'header'} style={[{ marginTop: s.big ? 2 : 0 }, f.small && { fontSize: 26, lineHeight: 31 }]}>
            {s.title}
          </Txt>
        </Words>
        <Words x={x} i={i} width={width} reduce={reduce} ahead={0.14}>
          <Txt v="lead" tone="fg2" style={{ marginTop: 8 }}>
            {s.body}
          </Txt>
        </Words>
      </View>
    </View>
  );
}

/** A page dot: it stretches and darkens as its slide comes in, following your finger. Reduce Motion: it just switches. */
function Dot({ i, x, width, on, off, reduce }: { i: number; x: SharedValue<number>; width: number; on: string; off: string; reduce: boolean }) {
  const anim = useAnimatedStyle(() => {
    const raw = width > 0 ? x.get() / width : 0;
    const at = reduce ? Math.round(raw) : raw;
    const k = interpolate(at, [i - 1, i, i + 1], [0, 1, 0], Extrapolation.CLAMP);
    return { width: 6 + 14 * k, backgroundColor: interpolateColor(k, [0, 1], [off, on]) };
  });
  return <Animated.View style={[{ height: 6, borderRadius: 3 }, anim]} />;
}

export default function How() {
  const p = usePalette();
  const f = useFrame({ maxContent: 480, colH: 820 });
  const reduce = useReducedMotion();
  const scroller = useRef<{
    scrollTo: (o: { x: number; animated: boolean }) => void;
  } | null>(null);
  const [page, setPage] = useState(0);
  // The first slide's picture plays once the screen has faded in.
  const arrivedJS = useScreenArrived(320);
  const arrived = useSharedValue(0);
  useEffect(() => {
    arrived.set(arrivedJS ? 1 : 0);
  }, [arrivedJS, arrived]);
  const last = page === SLIDES.length - 1;
  const next = () => router.push('/onboarding/where');

  // The scroll position lives on the UI thread; everything on the slides follows it frame by frame.
  const x = useSharedValue(0);
  const shown = useSharedValue(0);
  const onPage = useCallback((i: number) => {
    haptic.select();
    setPage(i);
  }, []);
  const width = f.width;
  const count = SLIDES.length;
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
          {SLIDES.map((s, i) => (
            <SlidePage key={s.key} s={s} i={i} x={x} width={width} arrived={arrived} reduce={reduce} f={f} />
          ))}
        </Animated.ScrollView>

        {/* The footer matches Welcome's exactly (button, then a line-high slot), so the button
            doesn't move when you come here. The dots sit in the slot where Welcome has its small print. */}
        <View style={{ paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
          <Button label={last ? 'Find my subscriptions' : 'Next'} tapHaptic onPress={go} />
          <View style={{ marginTop: 12, justifyContent: 'center' }}>
            <Txt v="sub" center accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ opacity: 0 }}>
              {FREE_LINE}
            </Txt>
            <View
              accessible
              accessibilityLabel={`Slide ${page + 1} of ${SLIDES.length}`}
              style={[StyleSheet.absoluteFill, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }]}
            >
              {SLIDES.map((s, i) => (
                <Dot key={s.key} i={i} x={x} width={width} on={dotOn} off={dotOff} reduce={reduce} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </OnbRoot>
  );
}
