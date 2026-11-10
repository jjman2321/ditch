// Line icons drawn to match design/v10 (2–3pt strokes, round caps).
// Decorative: the control around an icon carries the VoiceOver label.

import Svg, { Circle, Path, Rect } from 'react-native-svg';

type P = { color: string; size?: number };

export function ChevronLeft({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRight({ color, size = 18 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDown({ color, size = 14 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Check({ color, size = 15 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Bell({ color, size = 17, fill }: P & { fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 16V11a6 6 0 1112 0v5l1.6 2.2H4.4L6 16z" stroke={color} strokeWidth={2} strokeLinejoin="round" fill={fill ?? 'none'} />
      <Path d="M10 20.5a2 2 0 004 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CardIcon({ color, size = 17 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={6} width={18} height={12.5} rx={2.5} stroke={color} strokeWidth={2} />
      <Path d="M3 10h18" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function Close({ color, size = 13 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M2 2l10 10M12 2L2 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function Search({ color, size = 18 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={2.2} />
      <Path d="M16 16l4 4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function Lock({ color, size = 14 }: P) {
  return (
    <Svg width={size} height={(size * 17) / 14} viewBox="0 0 14 17" fill="none">
      <Rect x={1} y={7} width={12} height={9} rx={2.2} fill={color} />
      <Path d="M3.8 7V5a3.2 3.2 0 016.4 0v2" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function Flashlight({ color }: { color: string }) {
  return (
    <Svg width={16} height={20} viewBox="0 0 16 20" fill="none">
      <Path d="M3 1.5h10v3.5l-2.2 3V18a.8.8 0 0 1-.8.8H6a.8.8 0 0 1-.8-.8V8L3 5V1.5zM3 5h10" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Circle cx={8} cy={12} r={1.3} fill={color} />
    </Svg>
  );
}

export function Camera({ color }: { color: string }) {
  return (
    <Svg width={20} height={17} viewBox="0 0 20 17" fill="none">
      <Path d="M2 5.5A1.5 1.5 0 013.5 4h2.3L7.3 2h5.4l1.5 2h2.3A1.5 1.5 0 0118 5.5v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 13.5v-8z" stroke={color} strokeWidth={1.7} />
      <Circle cx={10} cy={9.3} r={3} stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

export function Gear({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.3 3.2h3.4l.5 2.4 1.6.9 2.3-.8 1.7 2.9-1.8 1.6v1.9l1.8 1.6-1.7 2.9-2.3-.8-1.6.9-.5 2.4h-3.4l-.5-2.4-1.6-.9-2.3.8-1.7-2.9 1.8-1.6V11L3.1 9.4l1.7-2.9 2.3.8 1.6-.9z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3.1} stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

export function Plus({ color, size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v16M4 12h16" stroke={color} strokeWidth={2.8} strokeLinecap="round" />
    </Svg>
  );
}

/** Bell with a slash: reminders are off. */
export function BellOff({ color, size = 17 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 16V11a6 6 0 0110.2-4.3M18 11v5l1.6 2.2H7" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M10 20.5a2 2 0 004 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M4 3.5l16.5 17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Opens outside the app. */
export function External({ color, size = 18 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13.5 4.5H19.5V10.5M19.5 4.5L11 13" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 14v4.5a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 014 18.5v-10A1.5 1.5 0 015.5 7H10" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

/** "!" in a filled circle (warnings). */
export function Bang({ color, bg, size = 30 }: P & { bg: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Circle cx={15} cy={15} r={15} fill={bg} />
      <Path d="M15 8v9" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
      <Circle cx={15} cy={21.6} r={1.9} fill={color} />
    </Svg>
  );
}
