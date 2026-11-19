// 1 · Welcome (design/v29, Nov 19). Built from Mobbin's best welcome screens (Headway,
// Perplexity Health, Apple Health, Alan): one centred picture, one calm headline, one button.
// The picture: the Ditch icon on a soft sunflower glow, real service logos fanned around it
// (CLAUDE.md rule 8: real logos are the illustration). The headline: "Know what renews next."
// with "renews" in a sunflower pill with a bell, because reminders are the product.
// Audit notes: design/v29/AUDIT.md.

import { router, useIsFocused } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { FREE_LINE, FitScroll, OnbRoot } from '@/onboarding/Parts';
import { Button, F, Txt, brand, tileRadius, useFrame, useIsDark, usePalette, useScreenArrived } from '@/ui/sunflower';

const LOGO = {
  'youtube-premium': require('../../../assets/welcome/youtube-premium.png'),
  netflix: require('../../../assets/welcome/netflix.png'),
  spotify: require('../../../assets/welcome/spotify.png'),
  'chatgpt-plus': require('../../../assets/welcome/chatgpt-plus.png'),
  'disney-plus': require('../../../assets/welcome/disney-plus.png'),
  hulu: require('../../../assets/welcome/hulu.png'),
  'adobe-cc': require('../../../assets/welcome/adobe-cc.png'),
  'canva-pro': require('../../../assets/welcome/canva-pro.png'),
  duolingo: require('../../../assets/welcome/duolingo.png'),
  dropbox: require('../../../assets/welcome/dropbox.png'),
} as const;
const ICON = require('../../../assets/welcome/app-icon.png');
type LogoId = keyof typeof LOGO;

// The picture is drawn on a 342 × 320 canvas (centre 171, 160) and scaled to the phone.
const W = 342;
const H = 320;
const CX = 171;
const CY = 160;
// Six main logos around the duck (x, y from the centre; tilt; size), then four faded ones in the corners.
const INNER: { id: LogoId; x: number; y: number; r: number; s: number }[] = [
  { id: 'youtube-premium', x: 0, y: -122, r: 3, s: 56 },
  { id: 'netflix', x: -114, y: -54, r: -5, s: 66 },
  { id: 'spotify', x: 114, y: -54, r: 5, s: 64 },
  { id: 'chatgpt-plus', x: -102, y: 72, r: 4, s: 60 },
  { id: 'disney-plus', x: 104, y: 72, r: -4, s: 60 },
  { id: 'hulu', x: 0, y: 124, r: -2, s: 50 },
];
const OUTER: { id: LogoId; x: number; y: number; s: number; o: number }[] = [
  { id: 'adobe-cc', x: -140, y: -132, s: 32, o: 0.5 },
  { id: 'canva-pro', x: 140, y: -132, s: 32, o: 0.5 },
  { id: 'duolingo', x: -140, y: 136, s: 32, o: 0.45 },
  { id: 'dropbox', x: 140, y: 136, s: 32, o: 0.45 },
];
const DUCK = 110;

// The entrance (ms after the screen is up). Headline and button are there from the first frame;
// only the picture builds: the duck icon pops (0), the logos fan out from behind it (120 + 45 each),
// the faded corners fade in (380), the pill slides in (420) and its bell rings once (760).
// Then only the slow float runs. Every moving tile has a solid background, so iOS draws its shadow
// from the rounded shape once instead of re-tracing the image every frame (the old welcome's shadows
// were re-traced 60 times a second, which is what heated phones up).
const T = { duck: 0, logo: 120, gap: 45, outer: 380, pill: 420, bell: 760 } as const;
// One slow clock drives every logo's float (one animation on the UI thread, paused when you leave the screen).
const DRIFT_MS = 12000;
const TAU = Math.PI * 2;
const continuous = Platform.OS === 'ios' ? ({ borderCurve: 'continuous' } as const) : null;

/** A logo tile that springs out from the centre, then floats a couple of points on a slow loop. */
function Tile({
  id,
  x,
  y,
  r,
  s,
  o = 1,
  i,
  delay,
  show,
  clock,
  far,
}: {
  id: LogoId;
  x: number;
  y: number;
  r: number;
  s: number;
  o?: number;
  i: number;
  delay: number;
  show: boolean;
  clock: SharedValue<number>;
  far?: boolean;
}) {
  const reduce = useReducedMotion();
  const dark = useIsDark();
  const k = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      k.set(1);
      return;
    }
    if (!show) return;
    k.set(withDelay(delay, far ? withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }) : withSpring(1, { duration: 560, dampingRatio: 0.7 })));
  }, [reduce, show, delay, far, k]);
  const ph = i * 0.37;
  const fx = 1 + (i % 2);
  const fy = 1 + ((i + 1) % 2);
  const anim = useAnimatedStyle(() => {
    const p = k.get();
    const t = reduce || far ? 0 : clock.get();
    const amp = reduce || far ? 0 : 2.2;
    return {
      opacity: far ? p * o : Math.min(1, p * 1.6),
      transform: [
        { translateX: -x * (1 - p) * 0.55 + Math.sin(TAU * (t * fx + ph)) * amp },
        { translateY: -y * (1 - p) * 0.55 + Math.cos(TAU * (t * fy + ph)) * amp },
        { scale: far ? 1 : 0.6 + 0.4 * p },
        { rotate: `${r}deg` },
      ],
    };
  });
  const rad = tileRadius(s);
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: CX + x - s / 2,
          top: CY + y - s / 2,
          width: s,
          height: s,
          borderRadius: rad,
          // Solid, so iOS draws the shadow from the rounded shape (cheap), not by re-tracing the image every frame.
          backgroundColor: '#FFFFFF',
        },
        far
          ? null
          : {
              shadowColor: dark ? '#000000' : '#3A2A00',
              shadowOpacity: dark ? 0.45 : 0.13,
              shadowRadius: 9,
              shadowOffset: { width: 0, height: 6 },
            },
        continuous,
        anim,
      ]}
    >
      <View style={[{ width: s, height: s, borderRadius: rad, overflow: 'hidden' }, continuous]}>
        <Image source={LOGO[id]} style={{ width: s, height: s }} contentFit="cover" transition={0} />
        <View
          pointerEvents="none"
          style={[
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: rad, borderWidth: 0.5, borderColor: dark ? 'rgba(255,255,255,0.10)' : 'rgba(22,20,15,0.10)' },
            continuous,
          ]}
        />
      </View>
    </Animated.View>
  );
}

/** The whole picture, drawn at 342 × 320 and scaled. Decorative: hidden from VoiceOver. */
function Picture({ scale, show }: { scale: number; show: boolean }) {
  const reduce = useReducedMotion();
  const dark = useIsDark();
  const focused = useIsFocused();
  const clock = useSharedValue(0);
  useEffect(() => {
    // The float runs only while this screen is showing, and never with Reduce Motion.
    if (reduce || !show || !focused) {
      cancelAnimation(clock);
      return;
    }
    clock.set(withRepeat(withTiming(clock.get() + 1, { duration: DRIFT_MS, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(clock);
  }, [reduce, show, focused, clock]);
  const duck = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce || !show) return;
    duck.set(withDelay(T.duck, withSpring(1, { duration: 520, dampingRatio: 0.62 })));
  }, [reduce, show, duck]);
  const duckStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, duck.get() * 2), transform: [{ scale: 0.7 + 0.3 * duck.get() }] }));
  const r = tileRadius(DUCK);
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" pointerEvents="none" style={{ height: H * scale, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: W, height: H, transform: [{ scale }] }}>
        <Svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <RadialGradient id="glow" cx={CX} cy={CY} r={140} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={dark ? brand.sunflower : '#FFE18A'} stopOpacity={dark ? 0.3 : 1} />
              <Stop offset="0.68" stopColor={dark ? brand.sunflower : '#FFE18A'} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#glow)" />
        </Svg>
        {OUTER.map((t, i) => (
          <Tile key={t.id} {...t} r={0} i={i} clock={clock} delay={T.outer + i * 40} show={show} far />
        ))}
        {INNER.map((t, i) => (
          <Tile key={t.id} {...t} i={i} clock={clock} delay={T.logo + i * T.gap} show={show} />
        ))}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: CX - DUCK / 2,
              top: CY - DUCK / 2,
              width: DUCK,
              height: DUCK,
              borderRadius: r,
              backgroundColor: brand.sunflower,
              shadowColor: dark ? '#000000' : '#3A2A00',
              shadowOpacity: dark ? 0.5 : 0.24,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 14 },
            },
            continuous,
            duckStyle,
          ]}
        >
          <View style={[{ width: DUCK, height: DUCK, borderRadius: r, overflow: 'hidden', backgroundColor: brand.sunflower }, continuous]}>
            <Image source={ICON} style={{ width: DUCK, height: DUCK }} contentFit="cover" transition={0} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

/** The bell inside the pill. */
function Bell({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 1.05} viewBox="2 1 20 21">
      <Path d="M12 3a6 6 0 0 0-6 6v3.6L4.4 15.4c-.4.7.1 1.6.9 1.6h13.4c.8 0 1.3-.9.9-1.6L18 12.6V9a6 6 0 0 0-6-6z" fill={brand.ink} />
      <Path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" fill="none" stroke={brand.ink} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/** "renews" in a sunflower pill, tilted 2°, with a bell. Slides in, then the bell rings once. */
function Pill({ fs, lh, show }: { fs: number; lh: number; show: boolean }) {
  const reduce = useReducedMotion();
  const k = useSharedValue(reduce ? 1 : 0);
  const ring = useSharedValue(0);
  useEffect(() => {
    if (reduce || !show) return;
    k.set(withDelay(T.pill, withSpring(1, { duration: 480, dampingRatio: 0.75 })));
    ring.set(
      withDelay(
        T.bell,
        withSequence(
          withTiming(1, { duration: 90 }),
          withTiming(-1, { duration: 120 }),
          withTiming(0.6, { duration: 110 }),
          withTiming(-0.4, { duration: 100 }),
          withTiming(0, { duration: 140, easing: Easing.out(Easing.cubic) }),
        ),
      ),
    );
  }, [reduce, show, k, ring]);
  const pill = useAnimatedStyle(() => ({
    opacity: Math.min(1, k.get() * 1.5),
    transform: [{ translateX: -10 * (1 - k.get()) }, { rotate: '-2deg' }, { scale: 0.92 + 0.08 * k.get() }],
  }));
  const bell = useAnimatedStyle(() => ({ transform: [{ rotate: `${-14 + ring.get() * 16}deg` }] }));
  const b = Math.round(fs * 0.68);
  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: brand.sunflower,
          borderRadius: 999,
          height: lh + 2,
          paddingLeft: Math.round(fs * 0.3),
          paddingRight: Math.round(fs * 0.38),
          marginRight: Math.round(fs * 0.24),
        },
        pill,
      ]}
    >
      <Animated.View style={[{ marginRight: Math.round(fs * 0.12), marginTop: 2 }, bell]}>
        <Bell size={b} />
      </Animated.View>
      <Txt v="title" color={brand.ink} style={{ fontSize: fs, lineHeight: lh, letterSpacing: -0.03 * fs }} maxFontSizeMultiplier={1.3}>
        renews
      </Txt>
    </Animated.View>
  );
}

export default function Welcome() {
  const p = usePalette();
  const f = useFrame({ maxContent: 480, colH: 840 });
  const arrived = useScreenArrived(200);

  // Headline 34/38 on phones (30/34 on SE, 38/42 on big phones), never wider than the column:
  // the pill line ("renews next.") is about 300pt wide at 34pt.
  const big = f.width > 420;
  const base = f.tablet ? 42 : f.small ? 30 : big ? 38 : 34;
  const fs = Math.min(base, Math.floor((34 * f.content) / 304));
  const lh = Math.round(fs * 1.12);
  const head = { fontSize: fs, lineHeight: lh, letterSpacing: -0.03 * fs, textAlign: 'center' as const };
  // The picture: 0.78 on SE, 1.05 on regular phones, 1.18 on big ones, never wider than the column.
  const want = f.tablet ? 1.3 : f.small ? 0.78 : big ? 1.18 : 1.05;
  const scale = Math.min(want, (f.content + 32) / W);
  // At the largest text sizes the picture steps aside so the button never leaves the screen.
  const showPicture = f.fontScale < 1.35;

  return (
    <OnbRoot surface="cream">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <View style={{ flex: 0.8, minHeight: 8 }} />
        {showPicture ? <Picture scale={scale} show={arrived} /> : null}
        <View style={{ flex: 0.5, minHeight: f.small ? 14 : 20 }} />

        {/* VoiceOver reads the headline as one header; the bell is decoration. */}
        <View accessible accessibilityRole="header" accessibilityLabel="Know what renews next." style={{ alignItems: 'center' }}>
          <Txt v="title" style={head} maxFontSizeMultiplier={1.3}>
            Know what
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
            <Pill fs={fs} lh={lh} show={arrived} />
            <Txt v="title" style={head} maxFontSizeMultiplier={1.3}>
              next.
            </Txt>
          </View>
        </View>
        <Txt v={f.small ? 'leadS' : 'lead'} tone="fg2" center style={{ marginTop: f.small ? 8 : 12, color: p.fg2 }}>
          {'Every subscription in one place.\nReminders before you get charged.'}
        </Txt>

        <View style={{ flex: 0.45, minHeight: f.small ? 20 : 28 }} />
        <Button label="Get started" hint="Starts a short intro" tapHaptic onPress={() => router.push('/onboarding/how')} />
        <Txt v="fine" tone="fg2" center style={{ marginTop: 14, fontFamily: F.medium }}>
          {FREE_LINE}
        </Txt>
      </FitScroll>
    </OnbRoot>
  );
}
