// Card, section header, tags and the list-row separator.

import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { brand, radius, usePalette } from './tokens';
import { Txt } from './type';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const p = usePalette();
  return (
    <View
      style={[
        { backgroundColor: p.card, borderRadius: radius.card },
        p.dark
          ? { borderWidth: 1, borderColor: p.cardBorder }
          : { shadowColor: '#463200', shadowOpacity: 0.07, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** "NEXT CHARGE ............ 2 of 6 confirmed" */
export function SectionHeader({ title, right, style }: { title: string; right?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 4, minHeight: 18 }, style]}>
      <Txt v="eyebrow" tone="mute" accessibilityRole="header">
        {title}
      </Txt>
      {typeof right === 'string' ? (
        <Txt v="sub" tone="fg2" style={{ fontFamily: 'Inter_600SemiBold' }}>
          {right}
        </Txt>
      ) : (
        right
      )}
    </View>
  );
}

/** Grey "GUESS" tag for dates the user hasn't confirmed. */
export function GuessTag() {
  const p = usePalette();
  return (
    <View style={{ backgroundColor: p.gtagBg, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }}>
      <Txt v="eyebrow" color={p.gtagFg} style={{ fontSize: 10.5, lineHeight: 13, letterSpacing: 0.6 }}>
        Guess
      </Txt>
    </View>
  );
}

/** Sunflower tag, e.g. "7 days free". */
export function Tag({ label, style }: { label: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: brand.sunflower, borderRadius: radius.tag, paddingHorizontal: 7, paddingVertical: 3 }, style]}>
      <Txt v="sub" color={brand.ink} style={{ fontFamily: 'Inter_700Bold', fontSize: 11.5, lineHeight: 14 }}>
        {label}
      </Txt>
    </View>
  );
}

/** Hairline between list rows, inset past the logo. */
export function RowDivider({ inset = 64 }: { inset?: number }) {
  const p = usePalette();
  return <View style={{ height: 1, marginLeft: inset, backgroundColor: p.hair }} />;
}
