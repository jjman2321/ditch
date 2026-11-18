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

/** Settings. The standard rounded 8-tooth gear (Lucide "settings", ISC licence), not a sun. */
export function Gear({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.9} />
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

/** A bank: roof, four columns, base (Find: "My bank"). */
export function Bank({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3.5 9.2L12 4l8.5 5.2H3.5z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M6.5 12.5v4.5M10.5 12.5v4.5M13.5 12.5v4.5M17.5 12.5v4.5M3.5 20h17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** A phone showing a list (Find: the Apple subscriptions screenshot). */
export function PhoneList({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={2.5} width={12} height={19} rx={2.8} stroke={color} strokeWidth={2} />
      <Circle cx={9.4} cy={8.5} r={1} fill={color} />
      <Circle cx={9.4} cy={12} r={1} fill={color} />
      <Circle cx={9.4} cy={15.5} r={1} fill={color} />
      <Path d="M11.6 8.5h3M11.6 12h3M11.6 15.5h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** A page with a folded corner and lines (Find: a bank statement). */
export function StatementIcon({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 3H7.2A1.2 1.2 0 006 4.2v15.6A1.2 1.2 0 007.2 21h9.6a1.2 1.2 0 001.2-1.2V7l-4-4z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M14 3v4h4" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M9 11.5h6M9 14.5h6M9 17.5h3.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** A checklist: two ticked rows and an empty one (Find: "Pick them myself"). */
export function ListCheck({ color, size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3.8 6.6l1.7 1.7 3-3.1M3.8 12.6l1.7 1.7 3-3.1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={4} y={17.2} width={4} height={4} rx={1.2} stroke={color} strokeWidth={1.8} />
      <Path d="M11.5 7h8.5M11.5 13h8.5M11.5 19.2h8.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
