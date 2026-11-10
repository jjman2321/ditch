// Ditch the duck, peeking over a card's top edge.
// One image, so it only moves as a whole: it rises 12pt from behind the card
// and fades in, easing to a stop. No spring, no overshoot, no tilt, no loop:
// it never travels past its resting spot, so it can't get clipped.
// Reduce Motion: shown at rest.

import { Image } from 'expo-image';
import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { DUCK_DARK, DUCK_H, DUCK_INK, DUCK_LIGHT, DUCK_PAD, DUCK_W } from './duckAsset';
import { useIsDark } from './tokens';

const RISE = 12;
const EASE = { duration: 420, easing: Easing.out(Easing.cubic) };

/**
 * `width` is how wide the duck itself looks. The image box is a little
 * bigger (the file has air around the head) and is offset so the duck
 * lands exactly where `right`/`left` say.
 * Place it inside a wrapper that holds the card; `sink` is how far its
 * bottom tucks behind the card.
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
  const boxW = width / DUCK_INK;
  const boxH = (boxW * DUCK_H) / DUCK_W;
  const air = (boxW * DUCK_PAD) / DUCK_W;
  const rise = useSharedValue(reduce ? 0 : RISE);
  const fade = useSharedValue(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) return;
    rise.set(withDelay(delay, withTiming(0, EASE)));
    fade.set(withDelay(delay, withTiming(1, EASE)));
  }, [reduce, delay, rise, fade]);

  const anim = useAnimatedStyle(() => ({
    opacity: fade.get(),
    transform: [{ translateY: rise.get() }],
  }));

  const pos: ViewStyle = bottom !== undefined ? { bottom } : { top: -(boxH - sink) };
  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: boxW,
          height: boxH,
          right: right === undefined ? undefined : right - air,
          left: left === undefined ? undefined : left - air,
          // Clips only the bottom while he rises from behind the card;
          // the art has air on the other three sides.
          overflow: 'hidden',
        },
        pos,
        style,
      ]}
    >
      <Animated.View style={[{ width: boxW, height: boxH }, anim]}>
        <Image source={dark ? DUCK_DARK : DUCK_LIGHT} style={{ width: boxW, height: boxH }} contentFit="contain" transition={0} />
      </Animated.View>
    </Animated.View>
  );
}
