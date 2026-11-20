// "Adding up": the yearly amount you're no longer paying, one step per
// confirmed cancel. Still: no animation near the numbers.

import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { MONTH_SHORT, parseDate, type DateOnly } from '@/domain/dates';
import { useAppMoney } from '@/state/app';
import { F, Txt, brand, usePalette } from '@/ui/sunflower';

type Step = { date: DateOnly; totalMinor: number; name: string };

const LABEL_W = 72;

export function StepChart({ steps, currency }: { steps: Step[]; currency: string }) {
  const p = usePalette();
  const money = useAppMoney();
  const [w, setW] = useState(0);
  const H = 92;
  const pad = 6;
  const max = steps[steps.length - 1]?.totalMinor ?? 1;
  const n = steps.length;
  // Even spacing: each cancel gets its own step, oldest on the left.
  const xAt = (i: number) => pad + ((w - pad * 2) * (i + 0.35)) / (n + 0.15);
  const yAt = (v: number) => H - 8 - ((H - 20) * v) / max;
  let line = `M${pad},${H - 8}`;
  steps.forEach((s, i) => {
    line += ` H${xAt(i)} V${yAt(s.totalMinor)}`;
  });
  line += ` H${w - pad}`;
  const area = `${line} V${H - 8} H${xAt(0)} Z`;
  const ink = p.dark ? brand.sunflower : brand.ink;
  // Each label sits under its own dot (clamped to the card), month over the amount in whole dollars.
  // The last one always shows; the one before it and the first only when they don't bump into a neighbour.
  const clampX = (i: number) => Math.min(Math.max(xAt(i) - LABEL_W / 2, 0), Math.max(0, w - LABEL_W));
  const shown: number[] = [];
  for (const i of [n - 1, n - 2, 0]) {
    if (i < 0 || shown.includes(i)) continue;
    if (shown.every((j) => Math.abs(clampX(j) - clampX(i)) >= LABEL_W + 4)) shown.push(i);
  }
  return (
    <View
      accessible
      accessibilityLabel={`Adding up: ${steps.map((s) => `after ${s.name}, ${money(s.totalMinor, currency, { whole: true })} a year`).join('; ')}`}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      {w ? (
        <Svg width={w} height={H}>
          <Path d={area} fill={p.dark ? 'rgba(255,204,46,0.2)' : '#FFE9A3'} />
          <Path d={line} stroke={ink} strokeWidth={3} fill="none" strokeLinejoin="round" />
          {steps.map((s, i) => (
            <Circle key={i} cx={xAt(i)} cy={yAt(s.totalMinor)} r={4.5} fill={ink} />
          ))}
        </Svg>
      ) : (
        <View style={{ height: H }} />
      )}
      <View style={{ height: 40, marginTop: 4 }}>
        {w
          ? shown.map((i) => {
              const left = clampX(i);
              // Centred under the dot, unless the card's edge pushed it over: then it lines up with that edge.
              const align = left <= 0 ? 'left' : left >= w - LABEL_W ? 'right' : 'center';
              const strong = i === n - 1;
              return (
                <View key={i} style={{ position: 'absolute', left, width: LABEL_W }}>
                  <Txt v="sub" tone="mute" style={{ fontSize: 12.5, lineHeight: 16, textAlign: align }} maxFontSizeMultiplier={1.2}>
                    {MONTH_SHORT[parseDate(steps[i].date).m - 1]}
                  </Txt>
                  <Txt v="sub" num tone={strong ? 'fg' : 'mute'} style={{ fontSize: 14, lineHeight: 19, textAlign: align, fontFamily: strong ? F.bold : F.regular }} maxFontSizeMultiplier={1.2}>
                    {money(steps[i].totalMinor, currency, { whole: true })}
                  </Txt>
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
}
