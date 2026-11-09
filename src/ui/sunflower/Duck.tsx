// Ditch the duck, peeking over a card's top edge (design/v10/MOTION.md §4).
// One image, so it only moves as a whole: it rises 14pt into place with a
// 3° tilt that settles to 0. No blink, no idle loop. Reduce Motion: shown at rest.

import { Image } from 'expo-image';
import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { useIsDark } from './tokens';

const LIGHT = require('../../../assets/brand/duck.png'); // 600×357
const DARK = require('../../../assets/brand/duck-dark.png'); // 620×367

/** How tall the peeking duck is for a given width. */
export function duckHeight(width: number, dark: boolean) {
  return Math.round(width * (dark ? 367 / 620 : 357 / 600));
}

/**
 * Place it inside a `position: relative` wrapper that holds the card.
 * `sink` is how far its bottom tucks behind the card.
 */
export function Duck({
  width,
  right,
  left,
  sink = 4,
  delay = 200,
  bottom,
  style,
}: {
  width: number;
  right?: number;
  left?: number;
  sink?: number;
  delay?: number;
  /** Anchor to the bottom instead of peeking over a top edge. */
  bottom?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const dark = useIsDark();
  const reduce = useReducedMotion();
  const h = duckHeight(width, dark);
  const rise = useSharedValue(reduce ? 0 : 14);
  const tilt = useSharedValue(reduce ? 0 : 3);

  useEffect(() => {
    if (reduce) return;
    rise.set(withDelay(delay, withSpring(0, { damping: 16, stiffness: 180 })));
    tilt.set(withDelay(delay, withSpring(0, { damping: 16, stiffness: 180 })));
  }, [reduce, delay, rise, tilt]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: rise.get() }, { rotate: `${tilt.get()}deg` }],
  }));

  const pos: ViewStyle = bottom !== undefined ? { bottom } : { top: -(h - sink) };
  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[{ position: 'absolute', width, height: h, right, left, overflow: 'hidden' }, pos, style]}
    >
      <Animated.View style={[{ width, height: h, transformOrigin: 'bottom' }, anim]}>
        <Image source={dark ? DARK : LIGHT} style={{ width, height: h }} contentFit="contain" transition={0} />
      </Animated.View>
    </Animated.View>
  );
}
