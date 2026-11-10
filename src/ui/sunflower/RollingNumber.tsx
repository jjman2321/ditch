// The one digit-roll in the app: onboarding's yearly total (MOTION.md §1).
// Each digit rolls up from 0 like an odometer and settles left to right,
// 40 ms apart, 700 ms each, ease-out. Never overshoots, never passes the
// real value. Tabular figures keep the width fixed while it rolls.
// Reduce Motion: the final number fades in over 150 ms.

import { useEffect, useState } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { tabular } from './type';

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
export const ROLL = { start: 250, stagger: 40, digit: 700 } as const;

/** When the last digit lands, in ms from mount. */
export function rollDuration(text: string) {
  const digits = text.replace(/\D/g, '').length;
  return ROLL.start + Math.max(0, digits - 1) * ROLL.stagger + ROLL.digit;
}

function Digit({ value, index, style, lineHeight, play }: { value: number; index: number; style: TextStyle; lineHeight: number; play: boolean }) {
  const y = useSharedValue(play ? 0 : -value * lineHeight);
  useEffect(() => {
    // Not playing (or the size changed to fit): sit on the final digit.
    if (!play) {
      y.set(-value * lineHeight);
      return;
    }
    y.set(withDelay(ROLL.start + index * ROLL.stagger, withTiming(-value * lineHeight, { duration: ROLL.digit, easing: EASE })));
  }, [play, value, index, lineHeight, y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View style={anim}>
        {Array.from({ length: value + 1 }, (_, d) => (
          <Text key={d} allowFontScaling={false} style={[style, tabular, { lineHeight, height: lineHeight }]}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

export function RollingNumber({
  text,
  style,
  lineHeight,
  play,
  accessibilityLabel,
}: {
  /** The formatted value, e.g. "$1,091". */
  text: string;
  style: TextStyle;
  lineHeight: number;
  /** False shows the final number at once (already seen, or Reduce Motion). */
  play: boolean;
  accessibilityLabel?: string;
}) {
  let digitIndex = 0;
  return (
    <View accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? text} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {text.split('').map((ch, i) => {
        if (/\d/.test(ch)) {
          const idx = digitIndex++;
          return <Digit key={i} value={Number(ch)} index={idx} style={style} lineHeight={lineHeight} play={play} />;
        }
        return (
          <Text key={i} allowFontScaling={false} style={[style, tabular, { lineHeight, height: lineHeight }]}>
            {ch}
          </Text>
        );
      })}
    </View>
  );
}

/**
 * Font size that fits `text` in `maxWidth`, measured once at a base size.
 * Returns [fontSize, onMeasure] — render a hidden <Text onLayout={onMeasure}>
 * at `base` to feed it.
 */
export function useFitSize(base: number, maxWidth: number) {
  const [measured, setMeasured] = useState<number | null>(null);
  const size = measured && maxWidth > 0 && measured > maxWidth ? Math.floor((base * maxWidth) / measured) : base;
  return [size, (w: number) => setMeasured(w)] as const;
}
