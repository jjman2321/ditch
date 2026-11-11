// Screen frame: background for the surface, safe areas, 24pt edges,
// an optional scrolling body and a footer that always stays on screen
// (the primary button is never below the fold).

import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { Platform, ScrollView, useColorScheme, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EDGE, SurfaceContext, paletteFor, type Surface } from './tokens';

// Read once at start-up, before the router rewrites the URL.
const PHONE_PARAM =
  Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search.includes('phone')
    ? (new URLSearchParams(window.location.search).get('phone') ?? '')
    : null;
/** Safe areas of real devices, for the web preview's screenshots. */
const FAKE_INSETS: Record<string, { top: number; bottom: number }> = {
  '': { top: 54, bottom: 34 }, // iPhone 15
  i12: { top: 47, bottom: 34 }, // iPhone 12/13/14, 390×844
  max: { top: 59, bottom: 34 }, // Pro Max, 430×932
  se: { top: 20, bottom: 0 }, // iPhone SE, 375×667
  ipad: { top: 24, bottom: 20 }, // iPad 11", 834×1194
  // The rest of scripts/shoot-v12.mjs's device list.
  mini: { top: 50, bottom: 34 },
  i16: { top: 59, bottom: 34 },
  i17: { top: 62, bottom: 34 },
  xr: { top: 48, bottom: 34 },
  air: { top: 68, bottom: 34 },
  pm12: { top: 47, bottom: 34 },
  pm17: { top: 62, bottom: 34 },
  duo: { top: 47, bottom: 20 },
  duoOpen: { top: 32, bottom: 20 },
  ipadMini: { top: 24, bottom: 20 },
  ipadAir: { top: 24, bottom: 20 },
  ipad13: { top: 24, bottom: 20 },
  ipadLand: { top: 24, bottom: 20 },
  ipadSplit: { top: 24, bottom: 20 },
  ipadSlide: { top: 24, bottom: 20 },
};

/**
 * Safe-area insets. On the web preview, `?phone` in the first URL fakes an
 * iPhone 15's insets (54 top, 34 bottom) so screenshots match the design;
 * `?phone=i12|max|se|ipad` fakes those devices.
 */
export function useInsets() {
  const insets = useSafeAreaInsets();
  if (PHONE_PARAM === null) return insets;
  return { ...insets, ...(FAKE_INSETS[PHONE_PARAM] ?? FAKE_INSETS['']) };
}

/**
 * Layout for one screen, the way design/v12 lays them out:
 * - phones: one 24pt edge, the safe areas on top and bottom;
 * - iPad (shortest side 600+): one centred column `maxContent` wide, and a
 *   column of at most `colH` tall centred top to bottom.
 * `small` is the SE class (under 700pt tall), which gets tighter spacing.
 */
export function useFrame({ maxContent = 512, colH = 880, extraBottom = 16 }: { maxContent?: number; colH?: number; extraBottom?: number } = {}) {
  const insets = useInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const tablet = Math.min(width, height) >= 600;
  const small = !tablet && height < 700;
  const edge = tablet ? Math.max(EDGE, Math.round((width - maxContent) / 2)) : EDGE;
  let top = insets.top;
  let bottom = insets.bottom + extraBottom;
  if (tablet) {
    const v = Math.round((height - colH) / 2 / 4) * 4;
    top = Math.max(top, v);
    bottom = Math.max(bottom, v);
  }
  return { width, height, fontScale, tablet, small, edge, top, bottom, insets, content: width - edge * 2 };
}

/**
 * Side padding for the app's own screens (Home, Calendar, Ditched, Settings):
 * 24pt on phones; on iPad and the open iPhone Duo the content sits in one
 * centred column at most `max` wide, so lines and rows never stretch across.
 */
export function usePageEdge(max = 600): number {
  const { width } = useWindowDimensions();
  return width >= 600 ? Math.max(EDGE, Math.round((width - max) / 2)) : EDGE;
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
    <View style={[{ flexGrow: 1, flex: scroll ? undefined : 1, paddingHorizontal: EDGE, paddingTop: insets.top + (topPad ?? 0), paddingBottom: footer ? 8 : bottom }, contentStyle]}>
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
