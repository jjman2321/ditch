import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { useApp } from '@/state/app';
import { brand } from '@/ui/sunflower';

export default function OnboardingLayout() {
  const reduce = useReducedMotion();
  const dark = useColorScheme() === 'dark';
  // Onboarding runs once. Once it's done, any link into it lands on Home instead.
  const { ready, settings } = useApp();
  if (ready && settings.onboardingDone) return <Redirect href="/(tabs)" />;
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
