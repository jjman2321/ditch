// The motion system (docs/research/motion-flow-2026-11-18.md §1): four motions and nothing else.
//   press  · your finger is down: scale 0.97, in 80 ms, out 180 ms
//   quick  · a state flips: 160 ms ease-out
//   settle · something arrives: a spring with no bounce, looks done at ~300 ms
//   stage  · a first-run screen builds up: fade plus at most an 8pt rise, 60–100 ms apart, done within 900 ms
// Plus two springs for things that land (Nov 18, motion pass 2: "physics, not curves"):
//   land   · a card or banner arrives and comes to rest: barely any bounce (damping ratio 0.82)
//   pop    · a small thing you just touched answers back (tick, logo, tag): a touch livelier (0.7)
// And the rule that matters most: where a finger drives it (the slides), motion follows the
// finger frame by frame, not a timer.
// Reduce Motion: every one of these shows its end state (Reanimated skips them on its own).

import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const EASE_OUT = Easing.out(Easing.cubic);
export const PRESS = { scale: 0.97, in: 80, out: 180 } as const;
export const QUICK = { duration: 160, easing: EASE_OUT } as const;
export const SETTLE = { duration: 300, dampingRatio: 1 } as const;
export const STAGE = { rise: 8, gap: 80, fade: 320 } as const;
export const LAND = { duration: 420, dampingRatio: 0.82 } as const;
export const POP = { duration: 320, dampingRatio: 0.7 } as const;
/** Letting go of a press: springs back with the faintest give, like a real key. */
export const RELEASE = { duration: 260, dampingRatio: 0.75 } as const;

/**
 * True once this screen has finished sliding in (the native push's
 * `transitionEnd`), so a screen's stage plays in front of still eyes, not
 * while it's still moving (§1.4). True at once with Reduce Motion and on web;
 * `fallback` ms after mount if the event never comes (a relaunch straight onto
 * a step has no transition).
 */
export function useScreenArrived(fallback = 650): boolean {
  const reduce = useReducedMotion();
  const navigation = useNavigation();
  const instant = reduce || Platform.OS === "web";
  const [arrived, setArrived] = useState(instant);
  useEffect(() => {
    if (instant || arrived) return;
    const done = () => setArrived(true);
    const t = setTimeout(done, fallback);
    const nav = navigation as unknown as {
      addListener?: (
        type: "transitionEnd",
        cb: (e: { data?: { closing?: boolean } }) => void,
      ) => () => void;
    };
    const off = nav.addListener?.("transitionEnd", (e) => {
      if (!e.data?.closing) done();
    });
    return () => {
      clearTimeout(t);
      off?.();
    };
  }, [instant, arrived, fallback, navigation]);
  return arrived;
}

/** `press`: scale to 0.97 while the finger is down. Spread `handlers` on a Pressable, `style` on an Animated.View. */
export function usePressScale(disabled?: boolean) {
  const s = useSharedValue(1);
  const onPressIn = useCallback(() => {
    if (!disabled)
      s.set(withTiming(PRESS.scale, { duration: PRESS.in, easing: EASE_OUT }));
  }, [disabled, s]);
  const onPressOut = useCallback(() => {
    s.set(withSpring(1, RELEASE));
  }, [s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return { handlers: { onPressIn, onPressOut }, style };
}

/**
 * `stage`: fades in and rises (at most 8pt) once `show` is true, after `delay`
 * ms. Shown at rest with Reduce Motion. `rise` 0 = fade only (use it near a
 * price). `spring` uses `settle` for the rise instead of a timing curve.
 * With `action`, its contents can't be tapped (or reached by VoiceOver) until
 * they're visible: never invisible and tappable (CLAUDE.md rule 8).
 */
export function Stage({
  show,
  delay = 0,
  rise = STAGE.rise,
  duration = STAGE.fade,
  spring,
  action,
  style,
  children,
}: {
  show: boolean;
  delay?: number;
  rise?: number;
  duration?: number;
  spring?: boolean;
  action?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const t = useSharedValue(reduce ? 1 : 0);
  const y = useSharedValue(reduce ? 0 : rise);
  const [live, setLive] = useState(reduce || !action);
  useEffect(() => {
    if (reduce || !show) return;
    t.set(withDelay(delay, withTiming(1, { duration, easing: EASE_OUT })));
    y.set(
      withDelay(
        delay,
        spring
          ? withSpring(0, SETTLE)
          : withTiming(0, { duration, easing: EASE_OUT }),
      ),
    );
    if (!action) return;
    // A real timer, never the animation's end (§1.6). Tappable once it's mostly there.
    const h = setTimeout(() => setLive(true), delay + duration * 0.6);
    return () => clearTimeout(h);
  }, [reduce, show, delay, duration, spring, action, t, y]);
  const anim = useAnimatedStyle(() => ({
    opacity: t.get(),
    transform: [{ translateY: y.get() }],
  }));
  return (
    <Animated.View
      style={[style, anim]}
      pointerEvents={live ? "auto" : "none"}
      accessibilityElementsHidden={!live}
      importantForAccessibility={live ? "auto" : "no-hide-descendants"}
    >
      {children}
    </Animated.View>
  );
}
