// "Adding up": the yearly amount you're no longer paying, one step per
// confirmed cancel. Still: no animation near the numbers.

import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { MONTH_SHORT, parseDate, type DateOnly } from '@/domain/dates';
import { useAppMoney } from '@/state/app';
import { F, Txt, brand, usePalette } from '@/ui/sunflower';

type Step = { date: DateOnly; totalMinor: number; name: string };

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
  const shown = n <= 3 ? steps.map((s, i) => ({ s, i })) : [0, n - 2, n - 1].map((i) => ({ s: steps[i], i }));
  const label = (s: Step) => `${MONTH_SHORT[parseDate(s.date).m - 1]} · ${money(s.totalMinor, currency)}`;
  return (
    <View
      accessible
      accessibilityLabel={`Adding up: ${steps.map((s) => `after ${s.name}, ${money(s.totalMinor, currency)} a year`).join('; ')}`}
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, gap: 8 }}>
        {shown.map(({ s, i }) => (
          <Txt key={i} v="sub" num tone={i === n - 1 ? 'fg' : 'mute'} style={{ fontSize: 13.5, fontFamily: i === n - 1 ? F.bold : F.regular }}>
            {label(s)}
          </Txt>
        ))}
      </View>
    </View>
  );
}
