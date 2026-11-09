// Small line icons drawn with SVG so they look the same everywhere.

import Svg, { Circle, Path, Rect } from 'react-native-svg';

type P = { size?: number; color: string; strokeWidth?: number };

export function CheckIcon({ size = 16, color, strokeWidth = 2.6 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 18, color, strokeWidth = 2.2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon({ size = 22, color, strokeWidth = 2.2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 18, color, strokeWidth = 2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M16 16l4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color, strokeWidth = 1.9 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 16.5V11a6 6 0 1112 0v5.5l1.5 1.5h-15L6 16.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M10 20.5a2 2 0 004 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ImportIcon({ size = 20, color, strokeWidth = 1.9 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={3.5} width={16} height={17} rx={3} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 9h8M8 13h8M8 17h5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function WidgetIcon({ size = 20, color, strokeWidth = 1.9 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={3.5} width={7.5} height={7.5} rx={2} stroke={color} strokeWidth={strokeWidth} />
      <Rect x={13} y={3.5} width={7.5} height={7.5} rx={2} stroke={color} strokeWidth={strokeWidth} />
      <Rect x={3.5} y={13} width={17} height={7.5} rx={2} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function CloudIcon({ size = 20, color, strokeWidth = 1.9 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 18.5h10a4 4 0 00.6-7.96A5.5 5.5 0 007.3 9.6 4.5 4.5 0 007.5 18.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LockOpenIcon({ size = 18, color, strokeWidth = 2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={9.5} rx={2.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8.5 11V8a3.5 3.5 0 016.8-1.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CardIcon({ size = 18, color, strokeWidth = 2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={6} width={17} height={12.5} rx={2.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3.5 10.5h17" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function PlusIcon({ size = 18, color, strokeWidth = 2.2 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
