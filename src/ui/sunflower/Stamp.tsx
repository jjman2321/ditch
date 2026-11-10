// The DITCHED stamp. Drawn in code for now (wobbly double border, worn ink
// speckles); DECISIONS says it needs real hand-lettering before launch.
// Deterministic: the same date always gives the same stamp.

import { Text, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { MONTH_SHORT, parseDate, type DateOnly } from '@/domain/dates';

import { brand, usePalette } from './tokens';
import { F } from './type';

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9) >>> 0;
    return (s % 10_000) / 10_000;
  };
}

/** A rounded rectangle traced with small hand-drawn wobbles. */
function wobblyRect(x: number, y: number, w: number, h: number, r: number, amp: number, rand: () => number): string {
  const pts: [number, number][] = [];
  const steps = 18;
  const edge = (x1: number, y1: number, x2: number, y2: number) => {
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      pts.push([x1 + (x2 - x1) * t + (rand() - 0.5) * amp, y1 + (y2 - y1) * t + (rand() - 0.5) * amp]);
    }
  };
  edge(x + r, y, x + w - r, y);
  edge(x + w, y + r, x + w, y + h - r);
  edge(x + w - r, y + h, x + r, y + h);
  edge(x, y + h - r, x, y + r);
  return `M${pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L')} Z`;
}

/** The big stamp on the Ditched screen. `bg` is the surface it lands on (for the worn-ink gaps). */
export function Stamp({ date, width = 280, bg }: { date: DateOnly; width?: number; bg?: string }) {
  const p = usePalette();
  const ink = p.dark ? brand.sunflower : brand.ink;
  const paper = bg ?? (p.dark ? brand.night : brand.sunflower);
  const { y, m, d } = parseDate(date);
  const rand = rng(y * 400 + m * 31 + d);
  const W = 300;
  const H = 128;
  const specks = Array.from({ length: 70 }, () => ({ cx: 8 + rand() * (W - 16), cy: 6 + rand() * (H - 12), r: 0.6 + rand() * 1.6 }));
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Ditched stamp, ${MONTH_SHORT[m - 1]} ${d}, ${y}`}
      style={{ width, height: (width * H) / W, transform: [{ rotate: '-6deg' }] }}
    >
      <Svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
        <Path d={wobblyRect(5, 5, W - 10, H - 10, 12, 2.6, rand)} stroke={ink} strokeWidth={7} fill="none" strokeLinejoin="round" />
        <Path d={wobblyRect(17, 17, W - 34, H - 34, 7, 1.8, rand)} stroke={ink} strokeWidth={3.2} fill="none" strokeLinejoin="round" />
        <SvgText x={W / 2} y={72} textAnchor="middle" fontFamily={F.display} fontSize={50} letterSpacing={-1} fill={ink}>
          DITCHED
        </SvgText>
        <SvgText x={W / 2} y={98} textAnchor="middle" fontFamily={F.wideHeavy} fontSize={15} letterSpacing={3.5} fill={ink}>
          {`${MONTH_SHORT[m - 1].toUpperCase()} ${d} · ${y}`}
        </SvgText>
        {specks.map((s, i) => (
          <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={paper} opacity={0.9} />
        ))}
      </Svg>
    </View>
  );
}

/** The small "DITCHED" tag on a list row. */
export function DitchedTag() {
  const p = usePalette();
  const ink = p.dark ? brand.sunflower : brand.ink;
  return (
    <View
      accessible={false}
      style={{ borderWidth: 2, borderColor: ink, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1, transform: [{ rotate: '-3deg' }], backgroundColor: p.dark ? 'transparent' : brand.white }}
    >
      <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: F.wideHeavy, fontSize: 11.5, lineHeight: 15, letterSpacing: 1.2, color: ink }}>
        DITCHED
      </Text>
    </View>
  );
}
