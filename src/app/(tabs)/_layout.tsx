// Tabs: Home · Calendar · Ditched (DECISIONS #8). Placeholders until Phase 2.

import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { F, paletteFor, useIsDark } from '@/ui/sunflower';

type IconProps = { color: ColorValue; focused: boolean };

function HomeIcon({ color, focused }: IconProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill={focused ? color : 'none'} stroke={color} strokeWidth={2} strokeLinejoin="round">
      <Path d="M3.5 10.2L12 3.5l8.5 6.7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" />
    </Svg>
  );
}

function CalendarIcon({ color, focused }: IconProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={5} width={17} height={15.5} rx={3} stroke={color} strokeWidth={2} fill={focused ? color : 'none'} />
      <Path d="M3.5 10h17" stroke={focused ? '#FBF7EE' : color} strokeWidth={2} />
      <Path d="M8 3v4M16 3v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function StampIcon({ color, focused }: IconProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill={focused ? color : 'none'} stroke={color} strokeWidth={2} strokeLinejoin="round">
      <Path d="M9.5 3h5a1 1 0 0 1 1 1v1.6a3 3 0 0 1-1.6 2.65V11.5H17a3 3 0 0 1 3 3V17H4v-2.5a3 3 0 0 1 3-3h3.1V8.25A3 3 0 0 1 8.5 5.6V4a1 1 0 0 1 1-1z" />
      <Path d="M5 20.5h14" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export default function TabsLayout() {
  const p = paletteFor('cream', useIsDark());
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: p.fg,
        tabBarInactiveTintColor: p.mute,
        tabBarStyle: { backgroundColor: p.bg, borderTopColor: p.rule },
        tabBarLabelStyle: { fontFamily: F.semi, fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: (x) => <HomeIcon {...x} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: (x) => <CalendarIcon {...x} /> }} />
      <Tabs.Screen name="ditched" options={{ title: 'Ditched', tabBarIcon: (x) => <StampIcon {...x} /> }} />
    </Tabs>
  );
}
