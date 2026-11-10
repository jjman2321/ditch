import { Redirect } from 'expo-router';

import { useApp } from '@/state/app';

// First launch (or after "Delete all data") goes to onboarding; after that, Home.
export default function Index() {
  const { ready, settings } = useApp();
  if (!ready) return null;
  return <Redirect href={settings.onboardingDone ? '/(tabs)' : '/onboarding'} />;
}
