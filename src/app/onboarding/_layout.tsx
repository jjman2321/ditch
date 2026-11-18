import { Redirect, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { useApp } from '@/state/app';
import { useOnboarding } from '@/state/onboarding';
import { OnboardingHeader, brand } from '@/ui/sunflower';

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
    <View style={{ flex: 1, backgroundColor: dark ? brand.night : brand.cream }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: reduce ? 'fade' : 'slide_from_right',
          contentStyle: { backgroundColor: dark ? brand.night : brand.cream },
        }}
      >
        {/* Welcome → slides: a quick cross-fade, not a push. The primary button sits in the same
            spot on both, so it stays put while the picture and words change around it. */}
        <Stack.Screen name="how" options={{ animation: 'fade', animationDuration: 260 }} />
      </Stack>
      {/* Steps 1–4: one header that stays still while each step slides in under it. */}
      <OnboardingHeader path={path} />
    </View>
  );
}
