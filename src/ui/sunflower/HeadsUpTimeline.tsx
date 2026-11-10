// Heads-up timeline: real dates from today (or the heads-ups) to the charge.
// At accessibility text sizes it turns into a vertical list so nothing
// is cut off (design/v10/NOTES.md, "Paywall timeline at large Dynamic Type").

import { useWindowDimensions, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { Bell, CardIcon, Check } from './icons';
import { brand, usePalette } from './tokens';
import { Txt } from './type';

export type StopKind = 'done' | 'bell' | 'bellSun' | 'charge' | 'end';
export type Stop = { kind: StopKind; title: string; sub: string };

function Dot({ kind, line, behind }: { kind: StopKind; line: string; behind: string }) {
  const p = usePalette();
  const base = { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' } as const;
  switch (kind) {
    case 'done':
      return (
        <View style={[base, { backgroundColor: line }]}>
          <Check color={behind} size={13} />
        </View>
      );
    case 'bell':
      return (
        <View style={[base, { backgroundColor: p.dark ? brand.sunflower : line }]}>
          <Bell color={p.dark ? behind : brand.sunflower} size={13} />
        </View>
      );
    case 'bellSun':
      return (
        <View style={[base, { backgroundColor: brand.sunflower, borderWidth: 2, borderColor: brand.ink }]}>
          <Bell color={brand.ink} size={13} />
        </View>
      );
    case 'charge':
      return (
        <View style={[base, { backgroundColor: behind, borderWidth: 2, borderColor: line }]}>
          <CardIcon color={line} size={13} />
        </View>
      );
    default:
      return <View style={[base, { backgroundColor: behind, borderWidth: 2, borderColor: line }]} />;
  }
}

/** A VoiceOver sentence for the whole timeline. */
function spoken(stops: Stop[]) {
  return stops.map((s) => `${s.title}: ${s.sub}`).join('. ');
}

export function HeadsUpTimeline({
  stops,
  behind,
  small,
}: {
  stops: Stop[];
  /** The colour behind the timeline (dots punch through to it). */
  behind: string;
  small?: boolean;
}) {
  const p = usePalette();
  const { fontScale } = useWindowDimensions();
  const line = p.fg === p.cardFg ? p.fg : p.cardFg;
  const subColor = p.dark ? p.mute : behind === brand.sunflower ? p.fg2 : p.mute;
  const t = small ? 12.5 : 14;
  const s = small ? 11.5 : 13;

  if (fontScale >= 1.3) {
    return (
      <View accessible accessibilityLabel={spoken(stops)} style={{ gap: 10 }}>
        {stops.map((st, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Dot kind={st.kind} line={line} behind={behind} />
            <View style={{ flex: 1 }}>
              <Txt v="label" color={line}>
                {st.title}
              </Txt>
              <Txt v="sub" color={subColor}>
                {st.sub}
              </Txt>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View accessible accessibilityLabel={spoken(stops)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ position: 'absolute', left: 12, right: 12, top: 11, height: 2 }}>
        <Svg width="100%" height={2}>
          <Line x1="0" y1="1" x2="100%" y2="1" stroke={line} strokeWidth={2} strokeDasharray="4 4" />
        </Svg>
      </View>
      {stops.map((st, i) => {
        const align = i === 0 ? 'flex-start' : i === stops.length - 1 ? 'flex-end' : 'center';
        const textAlign = i === 0 ? 'left' : i === stops.length - 1 ? 'right' : 'center';
        return (
          <View key={i} style={{ alignItems: align }}>
            <Dot kind={st.kind} line={line} behind={behind} />
            <Txt v="label" color={line} numberOfLines={1} style={{ fontFamily: 'Inter_600SemiBold', fontSize: t, lineHeight: small ? 17 : 20, marginTop: 8, textAlign }} maxFontSizeMultiplier={1.25}>
              {st.title}
            </Txt>
            <Txt v="sub" color={subColor} numberOfLines={1} style={{ fontSize: s, lineHeight: small ? 17 : 16, textAlign }} maxFontSizeMultiplier={1.25}>
              {st.sub}
            </Txt>
          </View>
        );
      })}
    </View>
  );
}
