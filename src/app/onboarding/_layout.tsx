import { Stack } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import { ink } from '@/theme/brand';

// Onboarding always uses the bright brand look, in light and dark mode alike.
export default function OnboardingLayout() {
  const reduce = useReducedMotion();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: reduce ? 'fade' : 'slide_from_right',
        contentStyle: { backgroundColor: ink.bg },
      }}
    />
  );
}
