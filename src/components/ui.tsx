// Shared building blocks: text, buttons, screen frame, service tile, tick.

import * as Haptics from 'expo-haptics';
import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { radius, space, type, usePalette } from '@/theme/tokens';


const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// ---------- haptics (no-ops where unsupported) ----------
export const haptic = {
  tap: () => Platform.OS === 'ios' && Haptics.selectionAsync().catch(() => {}),
  light: () => Platform.OS === 'ios' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  success: () =>
    Platform.OS === 'ios' && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  warning: () =>
    Platform.OS === 'ios' && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};

// ---------- text ----------
type Variant = keyof typeof type;
type Tone = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent';

export function T({
  v = 'body',
  tone = 'primary',
  style,
  ...rest
}: TextProps & { v?: Variant; tone?: Tone; style?: StyleProp<TextStyle> }) {
  const p = usePalette();
  const color =
    tone === 'secondary'
      ? p.textSecondary
      : tone === 'tertiary'
        ? p.textTertiary
        : tone === 'inverse'
          ? p.onPrimary
          : tone === 'accent'
            ? p.primary
            : p.text;
  return <Text {...rest} style={[type[v], { color }, style]} />;
}

// ---------- screen ----------
export function Screen({
  children,
  edges = ['top', 'bottom'],
  style,
}: {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: p.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

// ---------- pressable with a soft scale ----------
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Squish({
  children,
  style,
  scaleTo = 0.97,
  ...rest
}: PressableProps & { children: ReactNode; style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        s.set(withTiming(scaleTo, { duration: 120, easing: easeOut }));
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.set(withTiming(1, { duration: 160, easing: easeOut }));
        rest.onPressOut?.(e);
      }}
      style={[anim, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ---------- buttons ----------
export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
  accessibilityHint,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'plain';
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const bg = kind === 'primary' ? p.primary : kind === 'secondary' ? p.surface : 'transparent';
  const fg = kind === 'primary' ? p.onPrimary : kind === 'secondary' ? p.text : p.textSecondary;
  return (
    <Squish
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        haptic.light();
        onPress();
      }}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.4 : 1,
          borderWidth: kind === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderColor: p.separator,
          minHeight: kind === 'plain' ? 44 : 56,
        },
        style,
      ]}
    >
      <Text
        style={[type.headline, { color: fg, textAlign: 'center' }, kind === 'plain' && { fontWeight: '500' }]}
        maxFontSizeMultiplier={1.6}
      >
        {label}
      </Text>
    </Squish>
  );
}

// ---------- service tile (brand-colour monogram) ----------
export function ServiceTile({
  color,
  ink = '#FFFFFF',
  mono,
  size = 40,
}: {
  color: string;
  ink?: string;
  mono: string;
  size?: number;
}) {
  const fontSize = mono.length > 2 ? size * 0.3 : mono.length === 2 ? size * 0.36 : size * 0.48;
  return (
    <View
      accessible={false}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        allowFontScaling={false}
        style={{ color: ink, fontSize, fontWeight: '800', letterSpacing: -0.5 }}
      >
        {mono}
      </Text>
    </View>
  );
}

// ---------- divider ----------
export function Divider({ inset = 0 }: { inset?: number }) {
  const p = usePalette();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: p.separator, marginLeft: inset }} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const p = usePalette();
  return <View style={[{ backgroundColor: p.surface, borderRadius: radius.lg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
