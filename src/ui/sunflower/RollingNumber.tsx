// The one digit-roll in the app: onboarding's yearly total (MOTION.md §1).
// It counts up like a mechanical counter: every digit starts at 0 and they all land on the real
// value together, decelerating hard at the end so the last moments read clearly. The low digits
// spin a turn or two more than the high ones (like a real count-up, where the ones change fastest).
// Never overshoots, never passes the real value. Tabular figures keep the width fixed while it rolls.
// Reduce Motion (or seen before): the final number, at once.
// `go` holds the count at zero until the screen has slid in (motion doc fix 6);
// it then starts ROLL.start ms later.

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';
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

function Digit({ value, place, style, lineHeight, play, go, done }: { value: number; place: number; style: TextStyle; lineHeight: number; play: boolean; go: boolean; done: boolean }) {
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
  // The window clips only up and down (it's what hides the other digits). Tight negative letter spacing would
  // also shave the right edge off wide digits (a "4" lost ~4pt at 104pt), so the glyph keeps its full advance
  // and the spacing becomes a margin outside the window: same width, nothing cut.
  const { letterSpacing = 0, ...glyph } = StyleSheet.flatten(style) ?? {};
  // Landed (or never rolling): the plain digit, with no clipping window at all, so nothing can be cut off
  // whatever the phone's text rendering does (the "$2,64[0]" top cut, Nov 19: the ones digit travels ~29
  // rows, so the tiniest per-row rounding on iPhone left it sitting a few points low in its window).
  // Same box and spacing as the window, so the swap doesn't move a pixel.
  if (done) {
    return (
      <View style={{ height: lineHeight, marginRight: letterSpacing }}>
        <Text allowFontScaling={false} style={[glyph, tabular, { letterSpacing: 0, lineHeight, height: lineHeight }]}>
          {value}
        </Text>
      </View>
    );
  }
  return (
    <View style={{ height: lineHeight, overflow: 'hidden', marginRight: letterSpacing }}>
      <Animated.View style={anim}>
        {Array.from({ length: travel + 1 }, (_, d) => (
          <Text key={d} allowFontScaling={false} style={[glyph, tabular, { letterSpacing: 0, lineHeight, height: lineHeight }]}>
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
  // The roll is over (or never ran): draw plain digits from then on.
  const [landedOn, setLandedOn] = useState<string | null>(null);
  const landed = !play || landedOn === text;
  useEffect(() => {
    if (!play || !go) return;
    const t = setTimeout(() => setLandedOn(text), ROLL.start + ROLL.count + 60);
    return () => clearTimeout(t);
  }, [play, go, text]);
  const chars = text.split('');
  const digits = chars.filter((c) => /\d/.test(c)).length;
  let seen = 0;
  return (
    <View accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? text} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {chars.map((ch, i) => {
        if (/\d/.test(ch)) {
          const place = digits - 1 - seen++;
          return <Digit key={i} value={Number(ch)} place={place} style={style} lineHeight={lineHeight} play={play} go={go} done={landed} />;
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
 * at `base` to feed it. Width scales with the size (letter spacing is set
 * per size too), so one measurement is enough. A 2% margin covers each
 * character's width rounding to the pixel at the smaller size.
 */
export function fitSize(base: number, maxWidth: number, measured: number | null): number {
  if (!measured || maxWidth <= 0 || measured <= maxWidth) return base;
  return Math.max(1, Math.floor((base * maxWidth * 0.98) / measured));
}

export function useFitSize(base: number, maxWidth: number) {
  const [measured, setMeasured] = useState<number | null>(null);
  return [fitSize(base, maxWidth, measured), setMeasured as (w: number) => void] as const;
}
