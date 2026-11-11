import { Redirect, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { useApp } from '@/state/app';
import { useOnboarding } from '@/state/onboarding';
import { brand } from '@/ui/sunflower';

export default function OnboardingLayout() {
  const reduce = useReducedMotion();
  const dark = useColorScheme() === 'dark';
  // Onboarding runs once. Once it's done, any link into it lands on Home instead.
  const { ready, settings } = useApp();
  // Remember the step, so a relaunch resumes here (src/services/onboardingDraft.ts).
  const path = usePathname();
  const { setStep } = useOnboarding();
  useEffect(() => {
    if (path.startsWith('/onboarding')) setStep(path);
  }, [path, setStep]);
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
