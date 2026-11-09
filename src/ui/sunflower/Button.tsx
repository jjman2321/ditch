// Buttons. Primary: ink (sunflower in dark), 56pt. Secondary: outline, 52pt.
// Text: 44pt. Every one has a VoiceOver label (its text) and a 44pt+ target.

import { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { TAP, usePalette } from './tokens';
import { Txt } from './type';

type Kind = 'primary' | 'secondary' | 'text';

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
  hint,
  style,
  right,
}: {
  label: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  hint?: string;
  style?: StyleProp<ViewStyle>;
  right?: ReactNode;
}) {
  const p = usePalette();
  const h = kind === 'primary' ? 56 : kind === 'secondary' ? 52 : TAP;
  const bg = kind === 'primary' ? p.cta : 'transparent';
  const fg = kind === 'primary' ? p.ctaFg : p.fg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: h,
          borderRadius: h / 2,
          backgroundColor: bg,
          borderWidth: kind === 'secondary' ? 1.5 : 0,
          borderColor: p.secBorder,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 20,
          opacity: disabled ? 0.4 : pressed ? 0.86 : 1,
          transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      <Txt v="button" color={fg} center style={kind === 'secondary' ? { fontSize: 16 } : kind === 'text' ? { fontSize: 16 } : null}>
        {label}
      </Txt>
      {right}
    </Pressable>
  );
}

/** A round icon button with a 44pt target (close ×, back, month arrows). */
export function IconButton({
  label,
  onPress,
  children,
  size = TAP,
  bg,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
  size?: number;
  bg?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={Math.max(0, (TAP - size) / 2)}
      onPress={onPress}
      style={({ pressed }) => [
        { width: TAP, height: TAP, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.3 : pressed ? 0.6 : 1 },
        style,
      ]}
    >
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </Pressable>
  );
}
