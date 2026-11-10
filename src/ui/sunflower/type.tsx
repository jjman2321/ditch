// Type scale. Archivo (expanded, heavy) for display and money; Inter for body.
// Display sizes cap how far Dynamic Type grows them, so a 70pt headline
// never breaks the layout; body text grows freely.

import { Text, type TextProps, type TextStyle } from 'react-native';

import { usePalette } from './tokens';

export const F = {
  wordmark: 'ArchivoDitch-Wordmark', // wdth 125, wght 900
  display: 'ArchivoDitch-Display', // wdth 118, wght 900
  title: 'ArchivoDitch-Title', // wdth 115, wght 900
  wideHeavy: 'ArchivoDitch-WideHeavy', // wdth 110, wght 800
  wideBold: 'ArchivoDitch-WideBold', // wdth 110, wght 700
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heavy: 'Inter_800ExtraBold',
} as const;

/** Money lines up while it changes. */
export const tabular: TextStyle = { fontVariant: ['tabular-nums', 'lining-nums'] };

type Style = TextStyle & { max?: number };

export const type = {
  displayXL: { fontFamily: F.display, fontSize: 70, lineHeight: 64, letterSpacing: -2.8, max: 1 },
  displayL: { fontFamily: F.display, fontSize: 64, lineHeight: 60, letterSpacing: -2.4, max: 1 },
  displayM: { fontFamily: F.display, fontSize: 31, lineHeight: 33, letterSpacing: -1, max: 1.2 },
  displayS: { fontFamily: F.display, fontSize: 30, lineHeight: 34, letterSpacing: -0.8, max: 1.2 },
  // design/v12 scale: line heights sit on the 4pt grid.
  title: { fontFamily: F.title, fontSize: 30, lineHeight: 36, letterSpacing: -1, max: 1.2 },
  moneyL: { fontFamily: F.wideHeavy, fontSize: 22, lineHeight: 28, letterSpacing: -0.4, max: 1.4 },
  moneyM: { fontFamily: F.wideHeavy, fontSize: 18, lineHeight: 24, letterSpacing: -0.3, max: 1.4 },
  moneyS: { fontFamily: F.wideBold, fontSize: 16, lineHeight: 20, letterSpacing: -0.2, max: 1.4 },
  heading: { fontFamily: F.wideHeavy, fontSize: 20, lineHeight: 28, letterSpacing: -0.4, max: 1.4 },
  lead: { fontFamily: F.regular, fontSize: 17, lineHeight: 24, letterSpacing: -0.2, max: 1.6 },
  leadS: { fontFamily: F.regular, fontSize: 16, lineHeight: 24, letterSpacing: -0.2, max: 1.6 },
  /** 16/24 semibold: sentences that matter ("Ditch just one…", checklist lines). */
  strong: { fontFamily: F.semi, fontSize: 16, lineHeight: 24, letterSpacing: -0.2, max: 1.6 },
  bodyStrong: { fontFamily: F.semi, fontSize: 16, lineHeight: 20, letterSpacing: -0.2, max: 1.6 },
  body: { fontFamily: F.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.2, max: 1.6 },
  label: { fontFamily: F.semi, fontSize: 15, lineHeight: 20, letterSpacing: -0.2, max: 1.6 },
  sub: { fontFamily: F.regular, fontSize: 14, lineHeight: 20, letterSpacing: -0.1, max: 1.6 },
  eyebrow: { fontFamily: F.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase', max: 1.4 },
  fine: { fontFamily: F.regular, fontSize: 13, lineHeight: 16, letterSpacing: -0.1, max: 1.5 },
  button: { fontFamily: F.semi, fontSize: 17, lineHeight: 24, letterSpacing: -0.3, max: 1.4 },
} satisfies Record<string, Style>;

export type TypeVariant = keyof typeof type;

type Tone = 'fg' | 'fg2' | 'mute' | 'money' | 'cardFg' | 'noteFg' | 'noteMute';

export function Txt({
  v = 'body',
  tone = 'fg',
  color,
  num,
  center,
  style,
  maxFontSizeMultiplier,
  ...rest
}: TextProps & { v?: TypeVariant; tone?: Tone; color?: string; num?: boolean; center?: boolean }) {
  const p = usePalette();
  const { max, ...t } = type[v] as Style;
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? max}
      {...rest}
      style={[t, { color: color ?? p[tone] }, num && tabular, center && { textAlign: 'center' }, style]}
    />
  );
}
