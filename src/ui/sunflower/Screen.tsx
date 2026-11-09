// Screen frame: background for the surface, safe areas, 24pt edges,
// an optional scrolling body and a footer that always stays on screen
// (the primary button is never below the fold).

import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { Platform, ScrollView, useColorScheme, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EDGE, SurfaceContext, paletteFor, type Surface } from './tokens';

/**
 * Safe-area insets. On the web preview, `?phone` in the URL fakes an
 * iPhone 15's insets (54 top, 34 bottom) so screenshots match the design.
 */
export function useInsets() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search.includes('phone')) {
    return { ...insets, top: 54, bottom: 34 };
  }
  return insets;
}

export function Screen({
  surface = 'cream',
  children,
  footer,
  scroll = false,
  background,
  contentStyle,
  footerStyle,
  topPad,
}: {
  surface?: Surface;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  /** Drawn behind everything (e.g. the paywall's sunflower band). */
  background?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  /** Override the space under the status bar. */
  topPad?: number;
}) {
  const dark = useColorScheme() === 'dark';
  const p = paletteFor(surface, dark);
  const insets = useInsets();
  const bottom = Math.max(insets.bottom, 16);
  const body = (
    <View style={[{ flexGrow: 1, paddingHorizontal: EDGE, paddingTop: insets.top + (topPad ?? 0), paddingBottom: footer ? 8 : bottom }, contentStyle]}>
      {children}
    </View>
  );
  return (
    <SurfaceContext.Provider value={surface}>
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        {background}
        {scroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {body}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{body}</View>
        )}
        {footer ? (
          <View style={[{ paddingHorizontal: EDGE, paddingBottom: bottom, paddingTop: 8, gap: 4 }, footerStyle]}>{footer}</View>
        ) : null}
      </View>
    </SurfaceContext.Provider>
  );
}
