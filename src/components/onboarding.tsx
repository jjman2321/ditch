// Pieces used only in onboarding and the paywall.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { BackIcon, CheckIcon } from '@/components/icons';
import { haptic, ServiceTile, T } from '@/components/ui';
import { radius, space, tabular, type, usePalette } from '@/theme/tokens';


const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

// ---------- top bar: back · progress · skip ----------
export function OnboardingTopBar({
  step,
  total = 4,
  onSkip,
  skipLabel = 'Skip',
  showBack = true,
}: {
  step: number;
  total?: number;
  onSkip?: () => void;
  skipLabel?: string;
  showBack?: boolean;
}) {
  const p = usePalette();
  const w = useSharedValue(0);
  useEffect(() => {
    w.set(withTiming(step / total, { duration: 300, easing: easeOut }));
  }, [step, total, w]);
  // scaleX instead of width: transforms don't trigger layout.
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: w.get() }] }));

  return (
    <View style={styles.topBar}>
      <View style={styles.topSide}>
        {showBack && router.canGoBack() ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <BackIcon color={p.text} />
          </Pressable>
        ) : null}
      </View>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Step ${Math.ceil(step)} of ${total}`}
        style={[styles.track, { backgroundColor: p.separator }]}
      >
        <Animated.View style={[styles.trackFill, { backgroundColor: p.primary }, fill]} />
      </View>
      <View style={[styles.topSide, { alignItems: 'flex-end' }]}>
        {onSkip ? (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onSkip} style={styles.skip}>
            <Text style={[type.subhead, { color: p.textSecondary, fontWeight: '500' }]}>{skipLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ---------- animated tick circle ----------
export function TickCircle({ on, size = 28 }: { on: boolean; size?: number }) {
  const p = usePalette();
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    // Ticks happen dozens of times here: quick and quiet, no bounce.
    v.set(withTiming(on ? 1 : 0, { duration: on ? 160 : 120, easing: easeOut }));
  }, [on, v]);
  const fill = useAnimatedStyle(() => ({
    opacity: v.get(),
    transform: [{ scale: interpolate(v.get(), [0, 1], [0.85, 1]) }],
  }));
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: on ? p.selected : p.separator,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: size / 2, backgroundColor: p.selected, alignItems: 'center', justifyContent: 'center', margin: -2 },
          fill,
        ]}
      >
        <CheckIcon size={size * 0.6} color={p.onPrimary} />
      </Animated.View>
    </View>
  );
}

// ---------- count-up number ----------
export function useCountUp(target: number, duration = 900, delay = 150) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let start = 0;
    const from = 0;
    const timer = setTimeout(() => {
      const step = (t: number) => {
        if (!start) start = t;
        const k = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        setValue(from + (target - from) * eased);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, reduce]);
  return reduce ? target : value;
}

// ---------- welcome hero: a card gets flicked into the bin ----------
const HERO_CARDS = [
  { name: 'Netflix', price: '$17.99', color: '#E50914', mono: 'N' },
  { name: 'Spotify', price: '$11.99', color: '#1DB954', ink: '#0B2A17', mono: 'S' },
  { name: 'ChatGPT', price: '$20.00', color: '#10A37F', mono: 'G' },
];

export function FlickScene() {
  const p = usePalette();
  const reduce = useReducedMotion();
  const flick = useSharedValue(0); // 0 → resting, 1 → in the bin
  const chip = useSharedValue(0);

  useEffect(() => {
    if (reduce) {
      flick.set(1);
      chip.set(1);
      return;
    }
    // Plays once. No idle loop: slow repeating motion is tiring to look at.
    flick.set(withDelay(900, withTiming(1, { duration: 700, easing: easeInOut })));
    chip.set(withDelay(1560, withSpring(1, { duration: 400, dampingRatio: 0.8 })));
    const t = setTimeout(() => haptic.light(), 1560);
    return () => clearTimeout(t);
  }, [reduce, flick, chip]);

  // The flicked card travels on an arc to the bin, spins and shrinks.
  const flickStyle = useAnimatedStyle(() => {
    const k = flick.get();
    const x = interpolate(k, [0, 1], [0, 92]);
    const y = interpolate(k, [0, 0.35, 1], [0, -46, 118]);
    return {
      opacity: interpolate(k, [0, 0.85, 1], [1, 1, 0]),
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${interpolate(k, [0, 1], [-4, 190])}deg` },
        { scale: interpolate(k, [0, 1], [1, 0.32]) },
      ],
    };
  });
  const floatA = { transform: [{ rotate: '3deg' }] };
  const floatB = { transform: [{ rotate: '-2deg' }] };
  const binStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(chip.get(), [0, 0.5, 1], [0, -5, 0])}deg` }],
  }));
  const chipStyle = useAnimatedStyle(() => ({
    opacity: chip.get(),
    transform: [{ translateY: interpolate(chip.get(), [0, 1], [10, 0]) }, { scale: interpolate(chip.get(), [0, 1], [0.94, 1]) }],
  }));

  const card = (c: (typeof HERO_CARDS)[number]) => (
    <View style={[styles.heroCard, { backgroundColor: p.surface, shadowColor: '#000' }]}>
      <ServiceTile color={c.color} ink={c.ink} mono={c.mono} size={34} />
      <View style={{ flex: 1 }}>
        <Text allowFontScaling={false} style={[type.subhead, { color: p.text, fontWeight: '600' }]}>
          {c.name}
        </Text>
        <Text allowFontScaling={false} style={[type.caption, tabular, { color: p.textTertiary }]}>
          {c.price}/mo
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={styles.hero}
      accessible
      accessibilityLabel="Illustration: a subscription card gets flicked into a bin"
    >
      <View style={[styles.heroCardPos, { top: 8, left: 6 }, floatA]}>{card(HERO_CARDS[1])}</View>
      <View style={[styles.heroCardPos, { top: 92, left: 40 }, floatB]}>{card(HERO_CARDS[2])}</View>
      <Animated.View style={[styles.heroCardPos, { top: 44, left: 96 }, flickStyle]}>{card(HERO_CARDS[0])}</Animated.View>

      {/* bin */}
      <Animated.View style={[styles.binWrap, binStyle]}>
        <View style={[styles.binLid, { backgroundColor: p.primary }]} />
        <View style={[styles.bin, { backgroundColor: p.primary }]}>
          <View style={[styles.binRib, { backgroundColor: p.bg, opacity: 0.18 }]} />
          <View style={[styles.binRib, { backgroundColor: p.bg, opacity: 0.18 }]} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.savedChip, { backgroundColor: p.accent }, chipStyle]}>
        <Text allowFontScaling={false} style={[type.footnote, tabular, { color: p.onAccent, fontWeight: '700' }]}>
          −$215.88/yr
        </Text>
      </Animated.View>
    </View>
  );
}

// ---------- fake lock screen with real notifications ----------
export function NotificationPreview({
  items,
}: {
  items: { title: string; body: string; color: string; ink?: string; mono: string; when: string }[];
}) {
  const p = usePalette();
  return (
    <View
      style={[styles.phone, { backgroundColor: p.surfaceSunken, borderColor: p.separator }]}
      accessible
      accessibilityLabel={`Example reminders: ${items.map((i) => `${i.title}, ${i.body}`).join('. ')}`}
    >
      <Text allowFontScaling={false} style={[styles.phoneTime, { color: p.text }]}>
        9:00
      </Text>
      <Text allowFontScaling={false} style={[type.footnote, { color: p.textSecondary, textAlign: 'center', marginBottom: space.lg }]}>
        Thursday
      </Text>
      {items.map((it, i) => (
        <Animated.View
          key={it.title + i}
          entering={FadeInDown.delay(300 + i * 400).springify().duration(400).dampingRatio(0.85)}
          style={[styles.notif, { backgroundColor: p.surface, shadowColor: '#000' }]}
        >
          <View style={[styles.notifIcon, { backgroundColor: p.primary }]}>
            <Text allowFontScaling={false} style={{ color: p.onPrimary, fontWeight: '800', fontSize: 13 }}>
              D
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text allowFontScaling={false} style={[type.footnote, { color: p.text, fontWeight: '600' }]}>
                Ditch
              </Text>
              <Text allowFontScaling={false} style={[type.caption, { color: p.textTertiary }]}>
                {it.when}
              </Text>
            </View>
            <Text allowFontScaling={false} style={[type.subhead, { color: p.text, fontWeight: '600' }]}>
              {it.title}
            </Text>
            <Text allowFontScaling={false} style={[type.footnote, { color: p.textSecondary }]}>
              {it.body}
            </Text>
          </View>
          <ServiceTile color={it.color} ink={it.ink} mono={it.mono} size={30} />
        </Animated.View>
      ))}
    </View>
  );
}

// ---------- trial timeline ----------
export function TrialTimeline({
  rows,
}: {
  rows: {
    icon: React.ReactNode;
    when: string;
    title: string;
    body: string;
    action?: { label: string; onPress: () => void };
  }[];
}) {
  const p = usePalette();
  return (
    <View>
      {rows.map((r, i) => (
        <View key={r.when} style={{ flexDirection: 'row', gap: space.md }}>
          <View style={{ alignItems: 'center', width: 36 }}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: i === 0 ? p.primary : p.surface, borderColor: i === 0 ? p.primary : p.separator },
              ]}
            >
              {r.icon}
            </View>
            {i < rows.length - 1 ? <View style={[styles.timelineLine, { backgroundColor: p.separator }]} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: i < rows.length - 1 ? space.lg : 0, paddingTop: 2 }}>
            <T v="caption" tone="tertiary" style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {r.when}
            </T>
            <T v="headline">{r.title}</T>
            <T v="subhead" tone="secondary">
              {r.body}
            </T>
            {r.action ? (
              <Pressable accessibilityRole="button" onPress={r.action.onPress} style={{ minHeight: 44, justifyContent: 'center' }}>
                <T v="subhead" tone="accent" style={{ fontWeight: '600' }}>
                  {r.action.label}
                </T>
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.sm,
    height: 52,
  },
  topSide: { width: 72, justifyContent: 'center' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  skip: { minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: space.sm },
  track: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  trackFill: { height: 4, width: '100%', borderRadius: 2, transformOrigin: 'left' },

  hero: { width: 300, height: 290, alignSelf: 'center' },
  heroCardPos: { position: 'absolute' },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 176,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  binWrap: { position: 'absolute', right: 34, bottom: 6, alignItems: 'center' },
  binLid: { width: 92, height: 12, borderRadius: 6, marginBottom: 4 },
  bin: {
    width: 78,
    height: 86,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  binRib: { width: 5, borderRadius: 3 },
  savedChip: {
    position: 'absolute',
    right: 6,
    bottom: 128,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },

  phone: {
    borderRadius: 36,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: space.xl,
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    gap: space.sm,
  },
  phoneTime: { fontSize: 54, fontWeight: '600', textAlign: 'center', letterSpacing: -1, lineHeight: 60 },
  notif: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.lg,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  notifIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: { width: 2, flex: 1, marginVertical: 2, borderRadius: 1 },
});
