// Sunflower design tokens (design/v10). Every colour has a light and a dark value.
// Two light surfaces: "sun" (sunflower brand moments) and "cream" (everyday
// screens). In dark mode both become "night".

import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

export const brand = {
  sunflower: '#FFCC2E',
  ink: '#16140F',
  cream: '#FBF7EE',
  white: '#FFFFFF',
  bill: '#FF6C2C', // the duck's tangerine bill
  night: '#12110E',
};

export type Surface = 'sun' | 'cream';

const cream = {
  dark: false,
  bg: brand.cream,
  fg: brand.ink,
  fg2: '#5A544A',
  card: brand.white,
  cardFg: brand.ink,
  mute: '#6B6559',
  rule: '#E6DFD0',
  hair: '#EEE7D8',
  cta: brand.ink,
  ctaFg: brand.white,
  money: brand.ink,
  note: brand.white,
  noteFg: '#1C1B19',
  noteMute: '#6E6A62',
  track: '#E6DFD0',
  barTrack: '#F1EBDD',
  barFill: brand.ink,
  secBorder: brand.ink,
  chipBg: brand.white,
  chipBorder: '#E3DBCA',
  chipOnBg: brand.ink,
  chipOnFg: brand.white,
  controlBorder: '#D9D0BD',
  radioBorder: '#B9B09D',
  tickBorder: '#C4BBA8',
  guessBorder: '#CFC6B3',
  guessFg: '#6B6559',
  gtagBg: '#EFE8D9',
  gtagFg: '#5E584D',
  segBg: '#EFE8D9',
  segOn: brand.white,
  segFg: '#5A544A',
  logoHair: 'rgba(22,20,15,0.18)',
  scrim: 'rgba(22,20,15,0.42)',
  sheet: brand.cream,
  grabber: '#D6CDBB',
  cardBorder: 'transparent',
  iconBtn: 'rgba(22,20,15,0.12)',
  accent: brand.ink, // ticks, selected radios
  accentFg: brand.white,
  disabledFg: '#A39B8A',
  danger: '#B3361A',
  warn: brand.bill,
};

export type Palette = typeof cream;

const sun: Palette = {
  ...cream,
  bg: brand.sunflower,
  fg2: '#4B4220',
  rule: 'rgba(22,20,15,0.18)',
  hair: '#EFE8D9',
  ctaFg: brand.sunflower,
  note: 'rgba(255,255,255,0.97)',
  track: 'rgba(22,20,15,0.16)',
  secBorder: brand.ink,
};

const night: Palette = {
  ...cream,
  dark: true,
  bg: brand.night,
  fg: '#F6F0E3',
  fg2: '#BFB7A7',
  card: '#1E1C18',
  cardFg: '#F6F0E3',
  mute: '#A9A192',
  rule: '#33302A',
  hair: '#2B2823',
  cta: brand.sunflower,
  ctaFg: brand.ink,
  money: brand.sunflower,
  note: '#25231E',
  noteFg: '#F6F0E3',
  noteMute: '#A9A192',
  track: '#33302A',
  barTrack: '#2E2B25',
  barFill: brand.sunflower,
  secBorder: 'rgba(246,240,227,0.45)',
  chipBg: '#1E1C18',
  chipBorder: '#3A3630',
  chipOnBg: '#F6F0E3',
  chipOnFg: brand.ink,
  controlBorder: '#3A3630',
  radioBorder: '#5A554C',
  tickBorder: '#5A554C',
  guessBorder: '#4A463E',
  guessFg: '#BFB7A7',
  gtagBg: '#2E2B25',
  gtagFg: '#CFC7B6',
  segBg: '#2A2722',
  segOn: '#3A3630',
  segFg: '#BFB7A7',
  logoHair: 'rgba(246,240,227,0.18)',
  scrim: 'rgba(0,0,0,0.6)',
  sheet: '#1A1916',
  grabber: '#4A463E',
  cardBorder: '#2C2924',
  iconBtn: '#2A2722',
  accent: brand.sunflower,
  accentFg: brand.ink,
  disabledFg: '#6E685D',
  danger: '#FF8A65',
  warn: brand.bill,
};

export function paletteFor(surface: Surface, dark: boolean): Palette {
  if (dark) return night;
  return surface === 'sun' ? sun : cream;
}

/** Which surface the current screen uses (set by <Screen surface>). */
export const SurfaceContext = createContext<Surface>('cream');

/** Forces the light look inside an illustration (e.g. the sunflower lock screen). */
export const ForceLightContext = createContext(false);

/** True when the current spot renders in dark mode. */
export function useIsDark(): boolean {
  const forced = useContext(ForceLightContext);
  return useColorScheme() === 'dark' && !forced;
}

/** The palette for the current screen, in light or dark. */
export function usePalette(): Palette {
  const surface = useContext(SurfaceContext);
  return paletteFor(surface, useIsDark());
}

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
/** Screen edge: everything lines up 24pt from the side. */
export const EDGE = 24;
export const radius = { tag: 6, chip: 18, plan: 16, card: 20, sheet: 28, button: 28, phone: 34 } as const;
/** Logo and app-icon tiles: iOS-like 22.5% corners. */
export const tileRadius = (size: number) => Math.round(size * 0.225 * 10) / 10;
/** Minimum tap target. */
export const TAP = 44;
