// Design tokens. Every colour has a light and a dark value.
// Calm, readable base; the lime accent is used sparingly.

import { useColorScheme } from 'react-native';

const light = {
  bg: '#F6F5F0', // warm paper
  surface: '#FFFFFF',
  surfaceSunken: '#EFEEE7',
  text: '#1C2420',
  textSecondary: '#5B655F',
  textTertiary: '#8A928D',
  separator: '#E4E2D9',
  primary: '#224332', // pine: main buttons
  onPrimary: '#FFFFFF',
  accent: '#B6E97A', // lime: ticks, highlights
  onAccent: '#18301F',
  accentSoft: '#E7F6D3',
  selected: '#224332',
  selectedSoft: '#E5ECE7',
  warning: '#B4530A',
  shadow: 'rgba(28, 36, 32, 0.08)',
  scrim: 'rgba(246, 245, 240, 0.92)',
};

const dark: typeof light = {
  bg: '#0E1310',
  surface: '#171E1A',
  surfaceSunken: '#121814',
  text: '#F1F0EA',
  textSecondary: '#A7AFA9',
  textTertiary: '#737C76',
  separator: '#26302A',
  primary: '#B6E97A', // pine is too dark on dark; lime leads instead
  onPrimary: '#13240F',
  accent: '#B6E97A',
  onAccent: '#13240F',
  accentSoft: '#22311B',
  selected: '#B6E97A',
  selectedSoft: '#1E2A20',
  warning: '#F0A35E',
  shadow: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(14, 19, 16, 0.92)',
};

export type Palette = typeof light;

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

// iOS text styles (Dynamic Type scales these automatically).
export const type = {
  hero: { fontSize: 56, lineHeight: 62, fontWeight: '800' as const, letterSpacing: -1.5 },
  largeTitle: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -0.6 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.4 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.2 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 23, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
} as const;

/** Money figures line up when they change. */
export const tabular = { fontVariant: ['tabular-nums' as const] };
