// Onboarding progress: a back chevron and four segments (design/v12).
// Drawn once, in onboarding/_layout.tsx, above the sliding screens (motion doc fix 4): it stays
// still while each step slides in under it, like Opal and Monarch. The fill follows one
// continuous value, so going forward fills the next segment with a spring and going back
// drains it: each step reads as "one closer". Each step screen keeps an empty
// STEP_HEADER_H strip where the header sits. Reduce Motion: segments snap, no glide.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';

import { IconButton } from './Button';
import { ChevronLeft } from './icons';
import { EASE_OUT, SETTLE } from './motion';
import { useFrame } from './Screen';
import { brand, paletteFor, useIsDark } from './tokens';

export const STEP_HEADER_H = 44;
const OF = 4;

type StepPath = '/onboarding/services' | '/onboarding/total' | '/onboarding/dates' | '/onboarding/reminders';
const STEPS: Record<StepPath, { n: number; colH: number }> = {
  // colH matches each screen's own useFrame, so on iPad the header sits right above its column.
  '/onboarding/services': { n: 1, colH: 880 },
  '/onboarding/total': { n: 2, colH: 880 },
  '/onboarding/dates': { n: 3, colH: 1040 },
  '/onboarding/reminders': { n: 4, colH: 800 },
};

/** Which step (1–4) a path is, or 0 when the header shouldn't show. */
export function stepOf(path: string): number {
  return STEPS[path as StepPath]?.n ?? 0;
}

// Resumed straight onto a step (after a relaunch) there's no history: Back goes to the step before.
const PREVIOUS: Record<number, '/onboarding/where' | '/onboarding/services' | '/onboarding/total' | '/onboarding/dates'> = {
  1: '/onboarding/where',
  2: '/onboarding/services',
  3: '/onboarding/total',
  4: '/onboarding/dates',
};

/** One segment: the fill grows from the left as `prog` passes through it (0 → 1 for segment i means prog i → i+1). */
function Segment({ i, prog, surf, dark }: { i: number; prog: SharedValue<number>; surf: SharedValue<number>; dark: boolean }) {
  const cream = paletteFor('cream', dark);
  const sun = paletteFor('sun', dark);
  const track = useAnimatedStyle(() => ({ backgroundColor: dark ? cream.track : interpolateColor(surf.get(), [0, 1], [cream.track, sun.track]) }));
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: interpolate(prog.get(), [i, i + 1], [0, 1], 'clamp') }] }));
  return (
    <Animated.View style={[{ flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' }, track]}>
      <Animated.View style={[{ flex: 1, borderRadius: 2, backgroundColor: dark ? cream.fg : brand.ink, transformOrigin: 'left' }, fill]} />
    </Animated.View>
  );
}

/** The fixed header. Render it once, after the Stack, in onboarding/_layout.tsx. */
export function OnboardingHeader({ path }: { path: string }) {
  const dark = useIsDark();
  const reduce = useReducedMotion();
  const step = stepOf(path);
  // Keep the last step's frame while it fades out, so it doesn't jump on its way out.
  const [last, setLast] = useState(step || 1);
  if (step && step !== last) setLast(step);
  const shownStep = step || last;
  const colH = Object.values(STEPS).find((s) => s.n === shownStep)?.colH ?? 880;
  const f = useFrame({ colH });

  const prog = useSharedValue(step);
  const vis = useSharedValue(step ? 1 : 0);
  const surf = useSharedValue(step === 2 ? 1 : 0);
  const top = useSharedValue(f.top);
  useEffect(() => {
    // Forward fills the next segment as the new step slides in; Back drains it. Leaving the steps
    // (back to "Where should we look?") empties it, out of sight, once the header has faded.
    if (step) prog.set(reduce ? step : withSpring(step, { duration: 520, dampingRatio: 1 }));
    else prog.set(reduce ? 0 : withTiming(0, { duration: 260, easing: EASE_OUT }));
    vis.set(reduce ? (step ? 1 : 0) : withTiming(step ? 1 : 0, { duration: 200, easing: EASE_OUT }));
    surf.set(reduce ? (step === 2 ? 1 : 0) : withTiming(step === 2 ? 1 : 0, { duration: 320, easing: EASE_OUT }));
  }, [step, reduce, prog, vis, surf]);
  useEffect(() => {
    // iPad: each step's column sits at its own height; the header glides to it.
    top.set(reduce ? f.top : withSpring(f.top, SETTLE));
  }, [f.top, reduce, top]);

  const wrap = useAnimatedStyle(() => ({ opacity: vis.get(), transform: [{ translateY: top.get() }] }));
  const chevron = dark ? paletteFor('cream', dark).fg : brand.ink;

  return (
    <Animated.View
      pointerEvents={step ? 'box-none' : 'none'}
      accessibilityElementsHidden={!step}
      importantForAccessibility={step ? 'auto' : 'no-hide-descendants'}
      style={[{ position: 'absolute', top: 0, left: f.edge, right: f.edge, height: STEP_HEADER_H, flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 }, wrap]}
    >
      <IconButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace(PREVIOUS[shownStep] ?? '/onboarding'))} style={{ marginLeft: -12 }}>
        <ChevronLeft color={chevron} />
      </IconButton>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Step ${shownStep} of ${OF}`}
        accessibilityValue={{ min: 0, max: OF, now: shownStep }}
        style={{ flex: 1, flexDirection: 'row', gap: 4 }}
      >
        {Array.from({ length: OF }, (_, i) => (
          <Segment key={i} i={i} prog={prog} surf={surf} dark={dark} />
        ))}
      </View>
    </Animated.View>
  );
}

/** The empty strip a step screen leaves at its top for the fixed header. */
export function StepHeaderSpace() {
  return <View style={{ height: STEP_HEADER_H }} />;
}
