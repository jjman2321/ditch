// Onboarding progress: a back chevron and four segments (design/v12).
// The current step's segment fills from the left once the screen has slid in
// (motion.tsx `settle`), so each step reads as "one closer". Reduce Motion: already full.

import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { IconButton } from './Button';
import { ChevronLeft } from './icons';
import { SETTLE, useScreenArrived } from './motion';
import { usePalette } from './tokens';

/** The segment for the step you're on: track underneath, the fill grows from the left over it. */
function Filling({ track, fill }: { track: string; fill: string }) {
  const reduce = useReducedMotion();
  const arrived = useScreenArrived();
  const k = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) k.set(1);
    else if (arrived) k.set(withDelay(60, withSpring(1, SETTLE)));
  }, [reduce, arrived, k]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scaleX: k.get() }] }));
  return (
    <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={[{ flex: 1, borderRadius: 2, backgroundColor: fill, transformOrigin: 'left' }, anim]} />
    </View>
  );
}

export function ProgressBar({ step, of = 4 }: { step: number; of?: number }) {
  const p = usePalette();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${step} of ${of}`}
      accessibilityValue={{ min: 0, max: of, now: step }}
      style={{ flex: 1, flexDirection: 'row', gap: 4 }}
    >
      {Array.from({ length: of }, (_, i) =>
        i === step - 1 ? <Filling key={i} track={p.track} fill={p.fg} /> : <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? p.fg : p.track }} />,
      )}
    </View>
  );
}

// Resumed straight onto a step (after a relaunch) there's no history: Back goes to the step before.
const PREVIOUS: Record<number, '/onboarding' | '/onboarding/services' | '/onboarding/total' | '/onboarding/dates'> = {
  1: '/onboarding',
  2: '/onboarding/services',
  3: '/onboarding/total',
  4: '/onboarding/dates',
};

export function StepHeader({ step, of = 4, onBack }: { step: number; of?: number; onBack?: () => void }) {
  const p = usePalette();
  return (
    <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton label="Back" onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace(PREVIOUS[step] ?? '/onboarding')))} style={{ marginLeft: -12 }}>
        <ChevronLeft color={p.fg} />
      </IconButton>
      <ProgressBar step={step} of={of} />
    </View>
  );
}
