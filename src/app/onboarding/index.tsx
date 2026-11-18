// 1 · Welcome (design/v12 render 01, cleaned Nov 18). Like the top finance apps
// on Mobbin and AppKittie (Monarch, Rocket Money, One, bunq): one picture, one
// headline, one button. The picture is the product: a real reminder, the duck behind it.

import { router, useIsFocused } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { catalogPrice } from "@/catalog/prices";
import { SERVICE_BY_ID } from "@/catalog/services";
import { headsUpDates } from "@/domain/charges";
import { stillUsingIt } from "@/domain/copy";
import { addDays, weekdayName, weekdayShort } from "@/domain/dates";
import { FREE_LINE, FitScroll, OnbRoot } from "@/onboarding/Parts";
import { onboardingToday, useMoney, useOnboarding } from "@/state/onboarding";
import {
  Button,
  Duck,
  LAND,
  LogoTile,
  NotificationPreview,
  Txt,
  Wordmark,
  brand,
  paletteFor,
  useFrame,
  useIsDark,
  useScreenArrived,
} from "@/ui/sunflower";

// Real service logos as the picture (CLAUDE.md rule 8), scattered like stickers around the duck.
// x and y are shares of the free space above the reminder; "row" 2 only shows when there's room.
// z is depth: closer stickers are bigger, cast a deeper shadow, sit on top and drift and follow
// your finger more, so the picture reads as layers, not a flat collage.
const STICKERS = [
  { id: "netflix", mono: "N", x: 0.02, y: 0.06, z: 1.15, rot: -9, row: 1 },
  { id: "spotify", mono: "S", x: 0.6, y: 0.0, z: 1.02, rot: 8, row: 1 },
  { id: "disney-plus", mono: "D", x: 0.35, y: 0.32, z: 0.8, rot: 5, row: 1 },
  { id: "chatgpt-plus", mono: "C", x: 0.84, y: 0.36, z: 0.86, rot: -7, row: 2 },
  {
    id: "youtube-premium",
    mono: "Y",
    x: 0.08,
    y: 0.62,
    z: 0.95,
    rot: 6,
    row: 2,
  },
] as const;
const BASE = 52;

// The entrance, in ms once the screen is up. The headline and the button are there from the
// first frame (you can tap straight away); only the picture builds:
// stickers spring in back to front (0–200) · the reminder drops in like a banner (180) ·
// the one under it (250) · the duck peeks up behind it (400). All at rest by ~750 ms.
const T = {
  sticker: 0,
  stickerGap: 50,
  note: 180,
  under: 250,
  duck: 400,
} as const;
// One slow clock drives every sticker's drift (one animation, on the UI thread).
const DRIFT_MS = 14000;
const TAU = Math.PI * 2;

/**
 * One sticker. Springs in (from 55% with a little give; far ones first), then drifts on its own
 * slow loop, a few points at most, scaled by its depth. A drag anywhere on the picture shifts
 * every sticker by its depth (parallax) and springs back on release.
 * Reduce Motion: shown at rest, no drift, no parallax.
 */
function Sticker({
  i,
  order,
  z,
  show,
  clock,
  dragX,
  dragY,
  style,
  children,
}: {
  i: number;
  order: number;
  z: number;
  show: boolean;
  clock: SharedValue<number>;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  style: object;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const pop = useSharedValue(reduce ? 1 : 0);
  const fade = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      pop.set(1);
      fade.set(1);
      return;
    }
    if (!show) return;
    const at = T.sticker + order * T.stickerGap;
    pop.set(
      withDelay(at, withSpring(1, { duration: 480, dampingRatio: 0.72 })),
    );
    fade.set(
      withDelay(
        at,
        withTiming(1, { duration: 140, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [reduce, show, order, pop, fade]);
  // Whole-number frequencies, so the loop joins up seamlessly when the clock wraps.
  const fx = 1 + (i % 2);
  const fy = 1 + ((i + 1) % 2);
  const ph = i * 0.37;
  const anim = useAnimatedStyle(() => {
    if (reduce)
      return {
        opacity: 1,
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { scale: 1 },
          { rotate: "0deg" },
        ],
      };
    const t = clock.get();
    const amp = 4.5 * z;
    return {
      opacity: fade.get(),
      transform: [
        { translateX: Math.sin(TAU * (t * fx + ph)) * amp + dragX.get() * z },
        {
          translateY:
            Math.cos(TAU * (t * fy + ph)) * amp * 0.8 +
            dragY.get() * z +
            (1 - pop.get()) * 10 * z,
        },
        { scale: 0.55 + 0.45 * pop.get() },
        { rotate: `${Math.sin(TAU * (t + ph)) * 2 * z}deg` },
      ],
    };
  });
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

function Stickers({
  width,
  height,
  show,
}: {
  width: number;
  height: number;
  show: boolean;
}) {
  const reduce = useReducedMotion();
  const focused = useIsFocused();
  const clock = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  useEffect(() => {
    // The drift only runs while the screen is showing, and never with Reduce Motion.
    if (reduce || !show || !focused) {
      cancelAnimation(clock);
      return;
    }
    clock.set(
      withRepeat(
        withTiming(clock.get() + 1, {
          duration: DRIFT_MS,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(clock);
  }, [reduce, show, focused, clock]);
  // A drag on the picture: the stickers lean with your finger, closer ones more, then spring home.
  const pan = usePanGesture({
    enabled: !reduce,
    minDistance: 2,
    onUpdate: (e) => {
      dragX.set(Math.max(-14, Math.min(14, e.translationX * 0.08)));
      dragY.set(Math.max(-14, Math.min(14, e.translationY * 0.08)));
    },
    onFinalize: () => {
      dragX.set(withSpring(0, LAND));
      dragY.set(withSpring(0, LAND));
    },
  });
  if (height < 70) return null;
  const rows = height >= 170 ? 2 : 1;
  // Tall phones: the stickers stay one cluster (at most 240pt tall), sitting a little above the middle.
  const box = Math.min(height, 240);
  const off = Math.round((height - box) * 0.45);
  const list = STICKERS.filter((x) => x.row <= rows);
  // Far ones arrive first, so the picture builds from the back.
  const byDepth = [...list].sort((a, b) => a.z - b.z).map((x) => x.id);
  return (
    <GestureDetector gesture={pan}>
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{ position: "absolute", left: 0, right: 0, top: 0, height }}
      >
        {list.map((x, i) => {
          const size = Math.round(BASE * x.z * (rows === 1 ? 0.85 : 1));
          return (
            <View
              key={x.id}
              pointerEvents="none"
              style={{
                position: "absolute",
                zIndex: Math.round(x.z * 10),
                left: Math.min(x.x * width, width - size - 6),
                top:
                  off +
                  (rows === 1
                    ? Math.min(x.y * box, box - size - 8)
                    : x.y * (box - size)),
                transform: [{ rotate: `${x.rot}deg` }],
              }}
            >
              <Sticker
                i={i}
                order={byDepth.indexOf(x.id)}
                z={x.z}
                show={show}
                clock={clock}
                dragX={dragX}
                dragY={dragY}
                style={{
                  borderRadius: size * 0.28,
                  borderWidth: 3,
                  borderColor: "#FFFFFF",
                  shadowColor: "#3A2A00",
                  // Closer = a deeper, softer shadow.
                  shadowOpacity: 0.08 + 0.12 * x.z,
                  shadowRadius: 4 + 8 * x.z,
                  shadowOffset: { width: 0, height: 2 + 5 * x.z },
                }}
              >
                <LogoTile id={x.id} size={size} mono={x.mono} />
              </Sticker>
            </View>
          );
        })}
      </View>
    </GestureDetector>
  );
}

/** The reminder lands like an iOS banner: it drops from just above and settles on a spring. The price inside never moves on its own (CLAUDE.md rule 8). */
function useBanner(show: boolean, delay: number, from: number) {
  const reduce = useReducedMotion();
  const y = useSharedValue(reduce ? 0 : from);
  const k = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce || !show) return;
    y.set(withDelay(delay, withSpring(0, LAND)));
    k.set(
      withDelay(
        delay,
        withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [reduce, show, delay, from, y, k]);
  return useAnimatedStyle(() => ({
    opacity: k.get(),
    transform: [{ translateY: y.get() }, { scale: 0.96 + 0.04 * k.get() }],
  }));
}

export default function Welcome() {
  const dark = useIsDark();
  const p = paletteFor("sun", dark);
  const f = useFrame({ maxContent: 480, colH: 840 });
  const today = onboardingToday();
  // A charge next week, so the first reminder ("renews Thursday") is 3 days before it.
  const charge = addDays(today, 9);
  const [early] = headsUpDates(charge, today);
  const money = useMoney();
  const { country } = useOnboarding();
  const local = catalogPrice("netflix", country);
  const price = local ? money(local.amountMinor, local.currency) : null;

  // 70/64 on phones (60/56 on SE, 88/80 on iPad), never wider than the column:
  // "before it" is the longest line, 342pt wide at 70pt.
  const base = f.tablet ? 88 : f.tiny ? 50 : f.small ? 60 : 70;
  const fs = Math.min(base, Math.floor((70 * f.content) / 342));
  const [art, setArt] = useState({ w: 0, h: 0 });
  const head = {
    fontSize: fs,
    lineHeight: Math.round((fs * 64) / 70 / 4) * 4,
    letterSpacing: -0.04 * fs,
  };
  // The picture builds once the screen is up (at once with Reduce Motion: everything shown at rest).
  // It's the first screen, often with no push before it, so it waits at most 200 ms for one.
  const arrived = useScreenArrived(200);
  const note = useBanner(arrived, T.note, -28);
  const under = useBanner(arrived, T.under, -14);

  return (
    <OnbRoot surface="sun">
      <FitScroll
        style={{
          paddingTop: f.top,
          paddingHorizontal: f.edge,
          paddingBottom: f.bottom,
        }}
      >
        <View style={{ height: 28, marginTop: 16, justifyContent: "center" }}>
          <Wordmark size={24} />
        </View>
        {/* The headline is there from the first frame: you read it while the picture builds. VoiceOver reads it as one header. */}
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="Ditch it before it renews."
          style={{ marginTop: f.tiny ? 14 : f.small ? 24 : 32 }}
        >
          {["Ditch it", "before it", "renews."].map((line, i) => (
            <Txt
              key={line}
              v="displayXL"
              color={i === 2 ? (dark ? brand.sunflower : p.fg) : undefined}
              style={head}
            >
              {line}
            </Txt>
          ))}
        </View>
        {/* The picture fills the space under the headline (like One, bunq, Monarch): logos up top, the reminder below. */}
        <View
          style={{
            flex: 1,
            minHeight: f.tiny ? 16 : 24,
            marginTop: f.small ? 12 : 20,
          }}
          onLayout={(e) =>
            setArt({
              w: e.nativeEvent.layout.width,
              h: e.nativeEvent.layout.height,
            })
          }
        >
          <Stickers
            width={art.w}
            height={art.h - (f.small ? 8 : f.tablet ? 120 : 96)}
            show={arrived}
          />
        </View>

        <View>
          {f.small ? null : (
            <Duck
              width={f.tablet ? 160 : 136}
              right={16}
              sink={6}
              play={arrived}
              delay={T.duck}
              spring
            />
          )}
          {/* The one stacked underneath, like the lock screen: it lands just after the top one, from behind it. */}
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 12,
                right: 12,
                bottom: 0,
                height: 28,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor: dark ? "#1C1A16" : "rgba(255,255,255,0.6)",
                borderWidth: dark ? 1 : 0,
                borderTopWidth: 0,
                borderColor: "#2C2924",
                zIndex: 1,
              },
              under,
            ]}
          />
          {/* The reminder (with its price) lands as one card, then stays still (CLAUDE.md rule 8). */}
          <Animated.View style={[{ zIndex: 2, marginBottom: 12 }, note]}>
            <NotificationPreview
              time={`${weekdayShort(early)} 9 AM`}
              message={`Netflix renews ${weekdayName(charge)}.${price ? ` ${price}.` : ""} ${stillUsingIt(SERVICE_BY_ID["netflix"].category).replace(" ", "\u00A0")}`}
            />
          </Animated.View>
        </View>

        <View style={{ height: f.tiny ? 14 : f.small ? 20 : 28 }} />
        {/* There and tappable from the first frame. The slides' button sits in exactly this spot, so it stays put as you go on. */}
        <Button
          label="Find my subscriptions"
          tapHaptic
          onPress={() => router.push("/onboarding/how")}
        />
        {/* The deal, before any work (review research: ~155 "told me after I typed it all"). */}
        <Txt v="sub" tone="fg2" center style={{ marginTop: 12 }}>
          {FREE_LINE}
        </Txt>
      </FitScroll>
    </OnbRoot>
  );
}
