// Filter chips and the segmented control.

import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptic } from './haptics';
import { radius, usePalette } from './tokens';
import { Txt } from './type';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={({ pressed }) => ({
        height: 36,
        paddingHorizontal: 14,
        borderRadius: radius.chip,
        justifyContent: 'center',
        backgroundColor: selected ? p.chipOnBg : p.chipBg,
        borderWidth: selected ? 0 : 1.5,
        borderColor: p.chipBorder,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Txt v="label" color={selected ? p.chipOnFg : p.fg} style={{ fontSize: 14.5 }} maxFontSizeMultiplier={1.3}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  height = 40,
  fontSize = 14.5,
  style,
  label,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  height?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  label: string;
}) {
  const p = usePalette();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[{ flexDirection: 'row', backgroundColor: p.segBg, borderRadius: 12, padding: 3, height }, style]}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            hitSlop={{ top: 6, bottom: 6 }}
            onPress={() => {
              if (!on) {
                haptic.select();
                onChange(o.value);
              }
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9,
              backgroundColor: on ? p.segOn : 'transparent',
              ...(on && !p.dark ? { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } } : null),
            }}
          >
            <Txt v="label" color={on ? p.fg : p.segFg} style={{ fontSize }} numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
