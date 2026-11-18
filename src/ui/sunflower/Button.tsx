// Buttons. Primary: ink (sunflower in dark), 56pt. Secondary: outline, 52pt.
// Text: 44pt. Every one has a VoiceOver label (its text) and a 44pt+ target.

import { useEffect, useRef, type ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { haptic } from "./haptics";
import { EASE_OUT, PRESS, RELEASE } from "./motion";

import { TAP, usePalette } from "./tokens";
import { Txt } from "./type";

type Kind = "primary" | "secondary" | "text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  kind = "primary",
  disabled,
  hint,
  style,
  right,
  left,
  danger,
  height,
  tapHaptic,
}: {
  /** A light tap on press: for the main "go on" button of a step (onboarding), so moving forward feels physical. */
  tapHaptic?: boolean;
  /** Overrides the kind's height (the paywall's 48pt button on small phones). */
  height?: number;
  label: string;
  /** Red text, for destructive actions (Delete). */
  danger?: boolean;
  /** May return a promise: further taps are ignored until it settles. */
  onPress: () => unknown;
  kind?: Kind;
  disabled?: boolean;
  hint?: string;
  style?: StyleProp<ViewStyle>;
  right?: ReactNode;
  left?: ReactNode;
}) {
  const p = usePalette();
  // One press at a time: a quick double tap must never add twice or open a screen twice.
  const busy = useRef(false);
  // The `press` motion (motion.tsx): buttons scale to 0.97 in 80 ms and spring back on release. Text buttons dim instead.
  const down = useSharedValue(0);
  const pressIn = () =>
    down.set(withTiming(1, { duration: PRESS.in, easing: EASE_OUT }));
  const pressOut = () => down.set(withSpring(0, RELEASE));
  const text = kind === "text";
  // Turning on or off is a quick fade, not a jump (e.g. "See my total" waking up after the first tick).
  const off = useSharedValue(disabled ? 1 : 0);
  useEffect(() => {
    off.set(withTiming(disabled ? 1 : 0, { duration: 160, easing: EASE_OUT }));
  }, [disabled, off]);
  const pressStyle = useAnimatedStyle(() => {
    const o = 1 - 0.6 * off.get();
    return text
      ? { opacity: o * (1 - 0.4 * down.get()) }
      : {
          opacity: o,
          transform: [{ scale: 1 - (1 - PRESS.scale) * down.get() }],
        };
  });
  const press = () => {
    if (busy.current) return;
    busy.current = true;
    if (tapHaptic) haptic.light();
    let out: unknown;
    try {
      out = onPress();
    } catch (e) {
      busy.current = false;
      throw e;
    }
    const release = () => setTimeout(() => (busy.current = false), 450);
    if (out && typeof (out as Promise<unknown>).then === "function")
      (out as Promise<unknown>).then(release, release);
    else release();
  };
  const h =
    height ?? (kind === "primary" ? 56 : kind === "secondary" ? 52 : TAP);
  const bg = kind === "primary" ? p.cta : "transparent";
  const fg = kind === "primary" ? p.ctaFg : danger ? p.danger : p.fg;
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={press}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={[
        {
          minHeight: h,
          borderRadius: h / 2,
          backgroundColor: bg,
          borderWidth: kind === "secondary" ? 1.5 : 0,
          borderColor: p.secBorder,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 20,
        },
        style,
        pressStyle,
      ]}
    >
      {left}
      <Txt
        v="button"
        color={fg}
        center
        style={
          kind === "secondary"
            ? { fontSize: 16 }
            : kind === "text"
              ? { fontSize: 16 }
              : null
        }
      >
        {label}
      </Txt>
      {right}
    </AnimatedPressable>
  );
}

/** A round icon button with a 44pt target (close ×, back, month arrows). */
export function IconButton({
  label,
  onPress,
  children,
  size = TAP,
  bg,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
  size?: number;
  bg?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={Math.max(0, (TAP - size) / 2)}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: TAP,
          height: TAP,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.3 : pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}
