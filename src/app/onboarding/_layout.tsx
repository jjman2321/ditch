import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { brand } from '@/ui/sunflower';

export default function OnboardingLayout() {
  const reduce = useReducedMotion();
  const dark = useColorScheme() === 'dark';
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: reduce ? 'fade' : 'slide_from_right',
        contentStyle: { backgroundColor: dark ? brand.night : brand.cream },
      }}
    />
  );
}
