import { Tabs } from 'expo-router';

import { usePalette } from '@/theme/tokens';

export default function TabsLayout() {
  const p = usePalette();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: p.primary,
        tabBarInactiveTintColor: p.textTertiary,
        tabBarStyle: { backgroundColor: p.bg, borderTopColor: p.separator },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="subs" options={{ title: 'Subs' }} />
      <Tabs.Screen name="ditched" options={{ title: 'Ditched' }} />
    </Tabs>
  );
}
