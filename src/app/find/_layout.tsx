import { Stack } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import { usePalette } from '@/ui/sunflower';

export default function SettingsLayout() {
  const p = usePalette();
  const reduce = useReducedMotion();
  return <Stack screenOptions={{ headerShown: false, animation: reduce ? 'fade' : 'slide_from_right', contentStyle: { backgroundColor: p.bg } }} />;
}
