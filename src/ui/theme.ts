
// Ditch, built on the Kiwi v5 system (owner-approved): clean and premium, modelled on Brilliant, Brainly, Blinkist, Mimo and Nibble.
// White / light-grey canvas, true-black bold type, glossy 3D objects as the only illustrations,
// graphite tactile buttons with a hard bottom lip, colour only for topics, feedback and rewards.

export const C = {
  bg: '#FFFFFF', // lessons, onboarding, hero moments
  canvas: '#F4F5F7', // tab screens (white cards sit on it)
  card: '#FFFFFF',
  sunken: '#F2F3F5', // stat boxes, unselected tiles, tracks
  pressed: '#EBECEF', // active tab pill, secondary buttons
  line: '#E7E8EC', // 1.5pt borders and card lips
  ink: '#121318', // titles, true black-ish
  ink2: '#5F636E', // body / subtitles
  ink3: '#9EA2AC', // hints, inactive
  graphite: '#2E3036', graphiteLip: '#0B0C0E', // primary button

  // brand + states
  kiwi: '#1FA392', kiwiLip: '#147C6F', kiwiSoft: '#E1F4F0', kiwiInk: '#0E6B5F', // Ditch teal: brand, progress
  lime: '#A6D85B', limeSoft: '#F0F8E2', limeInk: '#4B6B14', // the raccoon's bandana: savings and good news
  good: '#2BCD5B', goodLip: '#17A845', goodSheet: '#DDF7E5', goodInk: '#137A33',
  warn: '#F9C93A', warnLip: '#D9A513', warnSheet: '#FDEFC2', warnInk: '#7A5600', // "not quite" (no red shame)
  bad: '#F0524D', badSoft: '#FFECEB',
  select: '#1FA392', selectSoft: '#E1F4F0', selectLip: '#147C6F', // selection uses Ditch teal
  streak: '#FF8A1F', streakSoft: '#FFF1E2', streakInk: '#B65300',
  xp: '#F5B400', xpInk: '#8A6400',
  violet: '#8B5CF6', violetSoft: '#F1EBFF', violetInk: '#5B33C7',
  scrim: 'rgba(12,13,16,0.42)',
};



export const F = {
  // one modern grotesk for the whole interface, a book serif only for reading
  display: 'PlusJakartaSans_800ExtraBold',
  bold: 'PlusJakartaSans_700Bold',
  semi: 'PlusJakartaSans_600SemiBold',
  medium: 'PlusJakartaSans_500Medium',
  serif: 'Newsreader_400Regular',
  serifSemi: 'Newsreader_600SemiBold',
  serifItalic: 'Newsreader_400Regular_Italic',
};

export const R = { card: 24, tile: 16, button: 28, sheet: 28 };
export const LIP = 4;
export const PAD = 20;

export const PRICES = { monthly: 4.99, yearly: 29.99, trialDays: 7, remindDay: 5 };
