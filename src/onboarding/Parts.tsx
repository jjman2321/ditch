// Small pieces every v12 onboarding screen shares: the surface root, the
// underlined text link with a 44pt tap area, and the round close button.

import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { Close, F, IconButton, SurfaceContext, Txt, paletteFor, useIsDark, usePalette, type Surface } from '@/ui/sunflower';

/** The screen's background, status bar and surface (sun or cream). */
export function OnbRoot({ surface, children, bg }: { surface: Surface; children: ReactNode; bg?: string }) {
  const dark = useIsDark();
  const p = paletteFor(surface, dark);
  return (
    <SurfaceContext.Provider value={surface}>
      <View style={{ flex: 1, backgroundColor: bg ?? p.bg }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        {children}
      </View>
    </SurfaceContext.Provider>
  );
}

/**
 * The body of a screen that fits at the default text size and scrolls
 * only when it can't (larger Dynamic Type, landscape iPad).
 */
export function FitScroll({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ flexGrow: 1 }, style]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

/**
 * "Change": underlined and semibold. Lay it out in a row next to the text
 * it belongs to; its tap area is padded out to 44pt (12pt above and below).
 */
export function TextLink({
  label,
  onPress,
  a11y,
  style,
  color,
}: {
  label: string;
  onPress: () => void;
  a11y?: string;
  style?: StyleProp<TextStyle>;
  color?: string;
}) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y ?? label} onPress={onPress} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Txt v="sub" style={[{ fontFamily: F.semi, color: color ?? p.fg, textDecorationLine: 'underline' }, style]}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** A standalone text link (not inside a sentence) with a 44pt target. */
export function LinkButton({ label, onPress, a11y, size = 14, color }: { label: string; onPress: () => void; a11y?: string; size?: number; color?: string }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y ?? label}
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      style={({ pressed }) => ({ minHeight: 20, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="sub" style={{ fontFamily: F.semi, fontSize: size, color: color ?? p.fg, textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** The round ×: a 32pt circle inside a 44pt target. */
export function CloseButton({ onPress, label = 'Close', bg, color }: { onPress: () => void; label?: string; bg?: string; color?: string }) {
  const p = usePalette();
  return (
    <IconButton label={label} onPress={onPress} size={32} bg={bg ?? (p.dark ? '#2A2722' : 'rgba(22,20,15,0.1)')} style={{ marginRight: -6 }}>
      <Close color={color ?? p.fg} size={12} />
    </IconButton>
  );
}
