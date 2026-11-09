// Brand look for onboarding and the paywall. Duolingo-style energy for a
// money app: bright white, one bold teal, chunky rounded type, fat 3D
// buttons, lime for good news. The raccoon guides every step.

export const ink = {
  bg: '#FFFFFF',
  soft: '#F7F7F5',
  text: '#2B2F2E',
  textSoft: '#6B7270',
  textFaint: '#A3A9A7',
  line: '#E5E7E6',
  lineDark: '#CFD3D1',
  teal: '#14B39B',
  tealEdge: '#0E8A77',
  tealSoft: '#DDF7F1',
  tealInk: '#0B6A5C',
  lime: '#9BDD4C',
  limeEdge: '#78B52F',
  limeSoft: '#EEF9E0',
  gold: '#FFC94A',
  white: '#FFFFFF',
} as const;

export const font = {
  black: 'Nunito_900Black',
  heavy: 'Nunito_800ExtraBold',
  bold: 'Nunito_700Bold',
  regular: 'Nunito_600SemiBold',
} as const;

export const text = {
  hero: { fontFamily: font.black, fontSize: 60, lineHeight: 64, letterSpacing: -1.5, color: ink.text },
  display: { fontFamily: font.black, fontSize: 32, lineHeight: 37, letterSpacing: -0.6, color: ink.text },
  title: { fontFamily: font.heavy, fontSize: 24, lineHeight: 30, letterSpacing: -0.3, color: ink.text },
  bubble: { fontFamily: font.bold, fontSize: 18, lineHeight: 24, color: ink.text },
  heading: { fontFamily: font.heavy, fontSize: 18, lineHeight: 23, color: ink.text },
  body: { fontFamily: font.regular, fontSize: 16, lineHeight: 23, color: ink.textSoft },
  bodyStrong: { fontFamily: font.heavy, fontSize: 16, lineHeight: 21, color: ink.text },
  label: { fontFamily: font.bold, fontSize: 14, lineHeight: 19, color: ink.textSoft },
  small: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: ink.textFaint },
  button: { fontFamily: font.heavy, fontSize: 16, lineHeight: 20, letterSpacing: 0.8, textTransform: 'uppercase' as const },
} as const;

export const num = { fontVariant: ['tabular-nums' as const] };
