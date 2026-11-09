import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Clean rounded stroke icons (24 grid). `fill` gives the solid version used for active tabs and states.
export type IconName =
  | 'close' | 'back' | 'check' | 'x' | 'chevron' | 'bookmark' | 'share' | 'speaker' | 'flame' | 'bolt' | 'target' | 'clock'
  | 'bell' | 'lock' | 'star' | 'key' | 'search' | 'today' | 'library' | 'review' | 'progress' | 'user' | 'gear' | 'trophy'
  | 'book' | 'sparkle' | 'cards' | 'brain' | 'history' | 'science' | 'space' | 'animals' | 'people' | 'places'
  | 'wheat' | 'bird' | 'helmet' | 'map' | 'chart' | 'pig' | 'music' | 'flag' | 'plus' | 'calendar' | 'shield' | 'aa'
  | 'heart' | 'gift' | 'crown' | 'globe' | 'sun' | 'moon' | 'quote' | 'headphones' | 'info' | 'medal' | 'arrow' | 'play' | 'eye' | 'snow' | 'mail' | 'trash' | 'refresh' | 'compass' | 'leaf' | 'pencil';

const o = (cx: number, cy: number, r: number) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 `;
const box = (x: number, y: number, w: number, h: number, r = 2.5) => `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z `;

// [path, solid?] — solid icons are filled shapes
const D: Record<IconName, [string, boolean?]> = {
  close: ['M6 6l12 12M18 6L6 18'],
  back: ['M15 5l-7 7 7 7'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  x: ['M7 7l10 10M17 7L7 17'],
  chevron: ['M9 5l7 7-7 7'],
  bookmark: ['M6.5 3.5h11v17l-5.5-3.8-5.5 3.8z'],
  share: ['M12 3.5v12M7.5 8l4.5-4.5L16.5 8M5 13v7h14v-7'],
  speaker: ['M4 9.5h3.5L12 5.5v13L7.5 14.5H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11'],
  flame: ['M12 2.5c1 4-3 6-3 9.8a3 3 0 0 0 6 0c0-1.5-.6-2.6-1.2-3.6 2.7 1.1 5.2 3.5 5.2 7a7 7 0 0 1-14 0c0-5.4 5-8 7-13.2z', true],
  bolt: ['M13.5 2L4.5 14h7l-1 8 9-12h-7z', true],
  target: [o(12, 12, 8.5) + o(12, 12, 4) + o(12, 12, 0.8)],
  clock: [o(12, 12, 8.5) + 'M12 7.5v5l3 2'],
  bell: ['M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2zM10 21h4'],
  lock: [box(5, 10.5, 14, 10) + 'M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5'],
  star: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.2 5.9-.9z'],
  key: [o(8, 14, 4) + 'M11 11.5l8-8M16 6.5l2.5 2.5M14 8.5l2 2'],
  search: [o(11, 11, 6.5) + 'M16 16l4 4'],
  today: ['M4 11l8-6.5 8 6.5v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z'],
  library: ['M5 4.5h4v15H5zM10.5 4.5h4v15h-4zM16 5.5l3.6-.9 3.2 13.6-3.6.9z'],
  review: ['M20 12a8 8 0 1 1-2.3-5.7M20 4.5V9h-4.5'],
  progress: ['M4 20V10M9.5 20V4M15 20v-7M20.5 20v-4'],
  user: [o(12, 8.5, 4) + 'M4.5 20.5a7.5 7.5 0 0 1 15 0'],
  gear: [o(12, 12, 3) + 'M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7'],
  trophy: ['M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20.5h7M10 17h4'],
  book: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5'],
  sparkle: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z'],
  cards: [box(6, 3.5, 12, 17) + 'M3.5 7v11M20.5 7v11'],
  brain: ['M12 5.5a3.2 3.2 0 0 0-6 .8A3.3 3.3 0 0 0 3.8 11a3.3 3.3 0 0 0 1 5.3A3.4 3.4 0 0 0 9 20a3 3 0 0 0 3-1.5zM12 5.5a3.2 3.2 0 0 1 6 .8 3.3 3.3 0 0 1 2.2 4.7 3.3 3.3 0 0 1-1 5.3A3.4 3.4 0 0 1 15 20a3 3 0 0 1-3-1.5M12 5.5v13'],
  history: ['M3.5 9L12 4l8.5 5zM5.5 9.5v8M9.5 9.5v8M14.5 9.5v8M18.5 9.5v8M3.5 20h17'],
  science: ['M9.5 3.5h5M10.5 3.5v6L5 18.5a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L13.5 9.5v-6M7.5 14.5h9'],
  space: [o(12, 12, 5.5) + 'M3 15.5c3.5 2.5 15-1.5 18-6.5'],
  animals: [o(7, 9, 1.8) + o(11, 6, 1.8) + o(15.5, 7, 1.8) + o(18.5, 11, 1.8) + 'M8.5 17.5c0-3 2-5.5 4.5-5.5s4 2 4 4.5-2 3.5-4.2 3.5-4.3 1-4.3-2.5z'],
  people: [o(9, 8, 3.2) + 'M3 20a6 6 0 0 1 12 0M16.5 5.2a3 3 0 0 1 0 5.6M18 14.2a6 6 0 0 1 3 5.3'],
  places: ['M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z' + o(12, 10, 2.4)],
  wheat: ['M12 21V8M12 8c-2-1-3-3-3-5 2 1 3 3 3 5zM12 8c2-1 3-3 3-5-2 1-3 3-3 5zM12 12.5c-2.2-.8-3.6-2.6-3.8-4.6 2.2.6 3.6 2.4 3.8 4.6zM12 12.5c2.2-.8 3.6-2.6 3.8-4.6-2.2.6-3.6 2.4-3.8 4.6z'],
  bird: ['M15 4.5c1.6 0 2.5 1.2 2.5 2.5L20 8l-2.6.8c-.3 4.5-2.4 8-6.4 8.7M17.5 7c-2.3 3.6-6.8 5-11 4.2 1 3.4 3.4 6 7 6.1M10 17.5l-1 3M13 17.3l1.2 3.2'],
  helmet: ['M4 15.5a8 8 0 0 1 16 0zM2.5 15.5h19v2.5h-19zM12 7.5V5'],
  map: ['M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2zM9 4.5v13M15 6.5v13'],
  chart: ['M4 20.5h16M6.5 17v-5M11 17V7M15.5 17v-8M20 17v-3'],
  pig: ['M5 13a6.5 5 0 0 1 12.8-1.4H20v3h-2.2A6.5 5 0 0 1 14 18.3V20h-2.5v-1.2a7.5 7.5 0 0 1-1.5 0V20H7.5v-2.2A5 5 0 0 1 5 13z' + o(14.5, 11.5, 0.6)],
  music: ['M9 18V5.5l11-2V16' + o(6.5, 18, 2.5) + o(17.5, 16, 2.5)],
  flag: ['M5 21V4M5 4.5h12l-2.5 4 2.5 4H5'],
  plus: ['M12 5v14M5 12h14'],
  calendar: [box(3.5, 5, 17, 15.5) + 'M3.5 10h17M8 3v4M16 3v4'],
  shield: ['M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z'],
  aa: ['M3 18l4.5-12L12 18M4.6 14h5.8M14 18l3-8 3 8M15 15.5h4'],
  heart: ['M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z'],
  gift: [box(4, 9, 16, 11.5, 2) + 'M3 9h18v3.5H3zM12 9v11.5M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9zM12 9c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9z'],
  crown: ['M4 17.5L3 7.5l5 4 4-6.5 4 6.5 5-4-1 10zM4.5 20.5h15'],
  globe: [o(12, 12, 8.5) + 'M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z'],
  sun: [o(12, 12, 4) + 'M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6'],
  moon: ['M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z'],
  quote: ['M4 18.5v-5.2C4 9 6.3 6.3 10 5.5l.7 1.8C8.6 8 7.6 9.5 7.5 11.5H10.5v7zM13.5 18.5v-5.2c0-4.3 2.3-7 6-7.8l.7 1.8c-2.1.7-3.1 2.2-3.2 4.2H20v7z', true],
  headphones: ['M4 17v-4a8 8 0 0 1 16 0v4M4 14.5h3v6H5.5A1.5 1.5 0 0 1 4 19zM20 14.5h-3v6h1.5A1.5 1.5 0 0 0 20 19z'],
  info: [o(12, 12, 8.5) + 'M12 11v5.5M12 7.8v.2'],
  medal: [o(12, 15, 5.5) + 'M8.5 10.5L5.5 3h4l2.5 5M15.5 10.5L18.5 3h-4L12 8'],
  arrow: ['M4.5 12h15M13.5 6l6 6-6 6'],
  play: ['M8 5.5v13l10.5-6.5z', true],
  eye: ['M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z' + o(12, 12, 3)],
  snow: ['M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5'],
  mail: [box(3, 5.5, 18, 13) + 'M3.5 7l8.5 6 8.5-6'],
  trash: ['M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13.5h9l1-13.5M10 10.5v6M14 10.5v6'],
  refresh: ['M20 12a8 8 0 1 1-2.3-5.7M20 4.5V9h-4.5'],
  compass: [o(12, 12, 8.5) + 'M15.5 8.5l-2 5-5 2 2-5z'],
  leaf: ['M5 19c0-8 5-13.5 14.5-14-.3 9.5-6 14.5-14 14zM5 19l7-7'],
  pencil: ['M4 20l1.2-4.5L16 4.7a2 2 0 0 1 2.8 0l.5.5a2 2 0 0 1 0 2.8L8.5 18.8zM14 6.7l3.3 3.3'],
};

export function Icon({ name, size = 24, color = '#121318', weight = 2, fill }: { name: IconName; size?: number; color?: string; weight?: number; fill?: string; crisp?: boolean; seed?: number }) {
  const [d, solid] = D[name];
  // wrapped in a View so it always paints above sibling backgrounds on web
  return (
    <View style={{ width: size, height: size }} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={solid ? color : fill ?? 'none'} stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round">
        <Path d={d} />
      </Svg>
    </View>
  );
}
