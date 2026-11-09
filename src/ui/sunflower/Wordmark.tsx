// "ditch" wordmark and the "ditch [Pro]" lockup (wordmark + sunflower pill).

import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { brand, usePalette } from './tokens';
import { F } from './type';

export function Wordmark({ size = 24, color }: { size?: number; color?: string }) {
  const p = usePalette();
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Ditch"
      maxFontSizeMultiplier={1.2}
      style={{ fontFamily: F.wordmark, fontSize: size, lineHeight: size * 1.1, letterSpacing: -0.033 * size, color: color ?? p.fg }}
    >
      ditch
    </Text>
  );
}

/** "ditch Pro", optionally followed by a word like "trial". */
export function ProLockup({
  size = 24,
  suffix,
  color,
  style,
}: {
  size?: number;
  suffix?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const fg = color ?? p.fg;
  const pill = Math.max(10, size * 0.5);
  return (
    <View
      accessible
      accessibilityLabel={`Ditch Pro${suffix ? ` ${suffix}` : ''}`}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: Math.max(5, size * 0.3) }, style]}
    >
      <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: F.wordmark, fontSize: size, lineHeight: size * 1.1, letterSpacing: -0.033 * size, color: fg }}>
        ditch
      </Text>
      <View
        style={{
          backgroundColor: brand.sunflower,
          borderRadius: 999,
          paddingHorizontal: 7,
          paddingVertical: 3,
          borderWidth: p.dark ? 0 : 1.5,
          borderColor: brand.ink,
        }}
      >
        <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: F.heavy, fontSize: pill, lineHeight: pill * 1.15, letterSpacing: 0.02 * pill, color: brand.ink }}>
          Pro
        </Text>
      </View>
      {suffix ? (
        <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: F.semi, fontSize: Math.round(size * 0.94), letterSpacing: -0.2, color: fg }}>
          {suffix}
        </Text>
      ) : null}
    </View>
  );
}
