// Onboarding + paywall kit, Duolingo-style: the raccoon talks in a speech
// bubble, one thick progress bar, fat 3D buttons and selectable cards.

import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import LOGOS from '@/catalog/logos.json';
import { BackIcon, CheckIcon } from '@/components/icons';
import { haptic } from '@/components/ui';
import { font, ink, text } from '@/theme/brand';

const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

export const MASCOT = {
  wave: require('../../assets/mascot/duo/wave.png'),
  flick: require('../../assets/mascot/duo/flick.png'),
  shock: require('../../assets/mascot/duo/shock.png'),
  bell: require('../../assets/mascot/duo/bell.png'),
  cheer: require('../../assets/mascot/duo/cheer.png'),
  worried: require('../../assets/mascot/duo/worried.png'),
} satisfies Record<string, ImageSourcePropType>;
export type Pose = keyof typeof MASCOT;

// ---------- screen ----------
export function Screen({ children, edges = ['top', 'bottom'] }: { children: ReactNode; edges?: Edge[] }) {
  return <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: ink.bg }}>{children}</SafeAreaView>;
}

// ---------- mascot ----------
export function Mascot({ pose, size, delay = 0, style }: { pose: Pose; size: number; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View
      entering={reduce ? FadeIn.duration(200) : ZoomIn.delay(delay).springify().duration(520).dampingRatio(0.62)}
      style={[{ width: size, height: size }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Ditch the raccoon"
    >
      <Image source={MASCOT[pose]} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}

// ---------- the raccoon talks (speech bubble) ----------
export function Say({ pose = 'wave', children, size = 96 }: { pose?: Pose; children: ReactNode; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <View style={styles.say}>
      <Mascot pose={pose} size={size} />
      <Animated.View entering={reduce ? FadeIn.duration(150) : FadeInLeft.delay(180).duration(300).easing(easeOut)} style={styles.bubbleWrap}>
        <View style={styles.bubbleTail} />
        <View style={styles.bubble}>
          <Text style={text.bubble}>{children}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ---------- top bar: back + one thick progress bar ----------
export function TopBar({ progress, onSkip, skipLabel = 'Skip' }: { progress: number; onSkip?: () => void; skipLabel?: string }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.set(withTiming(Math.max(0.04, Math.min(1, progress)), { duration: 420, easing: easeOut }));
  }, [progress, v]);
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: v.get() }] }));
  return (
    <View style={styles.top}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.canGoBack() && router.back()}
        hitSlop={6}
        style={styles.topBtn}
      >
        <BackIcon color={ink.textFaint} size={26} strokeWidth={2.6} />
      </Pressable>
      <View style={styles.track} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}>
        <Animated.View style={[styles.fill, fill]}>
          <View style={styles.fillShine} />
        </Animated.View>
      </View>
      <View style={[styles.topBtn, { width: 64, alignItems: 'flex-end' }]}>
        {onSkip ? (
          <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={[text.label, { fontFamily: font.heavy, color: ink.textFaint, letterSpacing: 0.6 }]}>{skipLabel.toUpperCase()}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ---------- fat 3D button ----------
type Kind = 'primary' | 'secondary' | 'ghost' | 'lime';
const KIND: Record<Kind, { face: string; edge: string; text: string; border?: string }> = {
  primary: { face: ink.teal, edge: ink.tealEdge, text: ink.white },
  lime: { face: ink.lime, edge: ink.limeEdge, text: '#1F3A0A' },
  secondary: { face: ink.white, edge: ink.lineDark, text: ink.teal, border: ink.line },
  ghost: { face: 'transparent', edge: 'transparent', text: ink.teal },
};

export function Btn({
  label,
  onPress,
  kind = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const k = disabled ? { face: ink.line, edge: ink.lineDark, text: ink.textFaint } : KIND[kind];
  const press = useSharedValue(0);
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: press.get() * 4 }] }));
  const ghost = kind === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => press.set(withTiming(1, { duration: 70 }))}
      onPressOut={() => press.set(withTiming(0, { duration: 120, easing: easeOut }))}
      onPress={() => {
        haptic.light();
        onPress();
      }}
      style={[{ borderRadius: 16, backgroundColor: k.edge, paddingBottom: ghost ? 0 : 4 }, style]}
    >
      <Animated.View
        style={[
          styles.btnFace,
          { backgroundColor: k.face },
          'border' in k && k.border ? { borderWidth: 2, borderColor: k.border } : null,
          face,
        ]}
      >
        <Text style={[text.button, { color: k.text }]} maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ---------- selectable card (Duolingo option style) ----------
export function Option({
  selected,
  onPress,
  children,
  label,
  style,
}: {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.tap();
        if (!selected) s.set(withSequence(withTiming(0.97, { duration: 70 }), withTiming(1, { duration: 140, easing: easeOut })));
        onPress();
      }}
    >
      <Animated.View
        style={[
          styles.option,
          selected ? { backgroundColor: ink.tealSoft, borderColor: ink.teal, borderBottomColor: ink.tealEdge } : null,
          anim,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ---------- brand logo tile ----------
const LOGO_PATHS = LOGOS as Record<string, string>;
export function LogoTile({ id, color, ink: glyph = '#FFFFFF', mono, size = 44 }: { id: string; color: string; ink?: string; mono: string; size?: number }) {
  const path = LOGO_PATHS[id];
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      {path ? (
        <Svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
          <Path d={path} fill={glyph} />
        </Svg>
      ) : (
        <Text allowFontScaling={false} style={{ color: glyph, fontFamily: font.black, fontSize: mono.length > 1 ? size * 0.34 : size * 0.48 }}>
          {mono}
        </Text>
      )}
    </View>
  );
}

// ---------- round check ----------
export function Check({ on }: { on: boolean }) {
  return (
    <View style={[styles.check, on ? { backgroundColor: ink.teal, borderColor: ink.teal } : null]}>
      {on ? (
        <Animated.View entering={ZoomIn.duration(150)}>
          <CheckIcon size={16} color={ink.white} strokeWidth={3.4} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  say: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bubbleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  bubbleTail: {
    width: 14,
    height: 14,
    backgroundColor: ink.white,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: ink.line,
    transform: [{ rotate: '45deg' }],
    marginRight: -8,
    zIndex: 1,
  },
  bubble: { flex: 1, borderWidth: 2, borderColor: ink.line, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: ink.white },
  top: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 10, gap: 6 },
  topBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 16, borderRadius: 8, backgroundColor: ink.line, overflow: 'hidden' },
  fill: { height: 16, width: '100%', borderRadius: 8, backgroundColor: ink.teal, transformOrigin: 'left' },
  fillShine: { position: 'absolute', top: 4, left: 10, right: 10, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  btnFace: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 68,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: ink.line,
    backgroundColor: ink.white,
  },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: ink.lineDark, alignItems: 'center', justifyContent: 'center' },
});
