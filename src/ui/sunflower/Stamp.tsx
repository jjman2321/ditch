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
  const steps = 9;
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
  const specks = Array.from({ length: 90 }, () => ({ cx: 8 + rand() * (W - 16), cy: 6 + rand() * (H - 12), r: 0.5 + rand() * 1.3 }));
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Ditched stamp, ${MONTH_SHORT[m - 1]} ${d}, ${y}`}
      style={{ width, height: (width * H) / W, transform: [{ rotate: '-6deg' }] }}
    >
      <Svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
        <Path d={wobblyRect(5, 5, W - 10, H - 10, 12, 1.6, rand)} stroke={ink} strokeWidth={7} fill="none" strokeLinejoin="round" />
        <Path d={wobblyRect(17, 17, W - 34, H - 34, 7, 1.1, rand)} stroke={ink} strokeWidth={3.2} fill="none" strokeLinejoin="round" />
        <SvgText x={W / 2} y={71} textAnchor="middle" fontFamily={F.display} fontSize={43} letterSpacing={-0.5} fill={ink}>
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

// 's': list rows (Home, Ditched tab), quieter than the name next to it. 'm': the card on the Ditched screen,
// where the tag is the thing that lands. iOS adds the letter spacing after the last letter too, so the right
// padding is the left one minus the tracking: the word sits optically centred in its box (owner, Nov 19).
const TAG_SIZES = {
  s: { fontSize: 10, lineHeight: 13, letterSpacing: 0.8, padLeft: 4, padRight: 8, padV: 3, tick: 13, gap: 4 },
  m: { fontSize: 12, lineHeight: 16, letterSpacing: 1, padLeft: 5, padRight: 11, padV: 5, tick: 17, gap: 6 },
} as const;

/**
 * The "DITCHED" tag, same as the website's (web/src/app/globals.css .dd-tag): a filled ink pill with
 * sunflower letters and a tangerine tick, so it reads as done. Straight, not tilted (owner, Nov 19).
 * Dark mode flips it: sunflower pill, ink letters.
 */
export function DitchedTag({ size = 's' }: { size?: 's' | 'm' }) {
  const p = usePalette();
  const t = TAG_SIZES[size];
  const bg = p.dark ? brand.sunflower : brand.ink;
  const fg = p.dark ? brand.ink : brand.sunflower;
  return (
    <View
      accessible={false}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.gap,
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingLeft: t.padLeft,
        paddingRight: t.padRight - t.letterSpacing,
        paddingVertical: t.padV,
        backgroundColor: bg,
      }}
    >
      <Svg width={t.tick} height={t.tick} viewBox="0 0 16 16">
        <Circle cx={8} cy={8} r={8} fill={brand.bill} />
        <Path d="M4.6 8.3l2.2 2.2 4.6-4.8" stroke={brand.white} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
      <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: F.wideHeavy, fontSize: t.fontSize, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing, color: fg }}>
        DITCHED
      </Text>
    </View>
  );
}
