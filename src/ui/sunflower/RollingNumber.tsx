// The one digit-roll in the app: onboarding's yearly total (MOTION.md §1).
// It counts up like a mechanical counter: every digit starts at 0 and they all land on the real
// value together, decelerating hard at the end so the last moments read clearly. The low digits
// spin a turn or two more than the high ones (like a real count-up, where the ones change fastest).
// Never overshoots, never passes the real value. Tabular figures keep the width fixed while it rolls.
// Reduce Motion (or seen before): the final number, at once.
// `go` holds the count at zero until the screen has slid in (motion doc fix 6);
// it then starts ROLL.start ms later.

import { useEffect, useState } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { tabular } from './type';

// Fast off the mark, then a long, soft landing.
const EASE = Easing.bezier(0.12, 0.75, 0.2, 1);
export const ROLL = { start: 80, count: 1000 } as const;
// Extra full turns by place, from the ones up: ones 2, tens 1, the rest none.
const TURNS = [2, 1];

/** When the number lands, in ms from the roll's go (mount, if `go` is never held back). */
export function rollDuration(text: string) {
  return /\d/.test(text) ? ROLL.start + ROLL.count : 0;
}

function Digit({ value, place, style, lineHeight, play, go }: { value: number; place: number; style: TextStyle; lineHeight: number; play: boolean; go: boolean }) {
  const travel = value + 10 * (TURNS[place] ?? 0);
  // y is how many glyphs the strip has moved; the strip is 0–9 repeated, ending on `value`.
  const y = useSharedValue(play ? 0 : travel);
  useEffect(() => {
    // Not playing (or the size changed to fit): sit on the final digit.
    if (!play) {
      y.set(travel);
      return;
    }
    // Playing but not yet allowed to start: wait on 0.
    if (!go) return;
    y.set(withDelay(ROLL.start, withTiming(travel, { duration: ROLL.count, easing: EASE })));
  }, [play, go, travel, y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: -y.get() * lineHeight }] }));
  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View style={anim}>
        {Array.from({ length: travel + 1 }, (_, d) => (
          <Text key={d} allowFontScaling={false} style={[style, tabular, { lineHeight, height: lineHeight }]}>
            {d % 10}
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
  go = true,
  accessibilityLabel,
}: {
  /** The formatted value, e.g. "$1,091". */
  text: string;
  style: TextStyle;
  lineHeight: number;
  /** False shows the final number at once (already seen, or Reduce Motion). */
  play: boolean;
  /** False holds the roll at zero (e.g. while the screen is still sliding in). */
  go?: boolean;
  accessibilityLabel?: string;
}) {
  const chars = text.split('');
  const digits = chars.filter((c) => /\d/.test(c)).length;
  let seen = 0;
  return (
    <View accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? text} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {chars.map((ch, i) => {
        if (/\d/.test(ch)) {
          const place = digits - 1 - seen++;
          return <Digit key={i} value={Number(ch)} place={place} style={style} lineHeight={lineHeight} play={play} go={go} />;
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
 * Invisible copy of a RollingNumber at `style`'s size, laid out exactly the
 * same way (one Text per character), so the width it reports is the width
 * that will really be drawn. Measuring the number as one string comes out
 * narrower on iPhone, which pushed "$3,126" past the screen edge.
 */
export function RollingMeasure({ text, style, onWidth }: { text: string; style: TextStyle; onWidth: (w: number) => void }) {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ position: 'absolute', opacity: 0, left: 0, top: 0, width: 4000, flexDirection: 'row', alignItems: 'flex-start' }}
    >
      <View style={{ flexDirection: 'row' }} onLayout={(e) => onWidth(e.nativeEvent.layout.width)}>
        {text.split('').map((ch, i) => (
          <Text key={i} allowFontScaling={false} style={[style, tabular]}>
            {/\d/.test(ch) ? '0' : ch}
          </Text>
        ))}
      </View>
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
