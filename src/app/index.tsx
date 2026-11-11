import { Redirect } from 'expo-router';

import { useApp } from '@/state/app';
import { useOnboarding } from '@/state/onboarding';

// First launch (or after "Delete all data") goes to onboarding; after that, Home.
// Closed halfway through onboarding? Back to the step they were on.
export default function Index() {
  const { ready, settings } = useApp();
  const { draftReady, resumePath } = useOnboarding();
  if (!ready || (!settings.onboardingDone && !draftReady)) return null;
  if (settings.onboardingDone) return <Redirect href="/(tabs)" />;
  return <Redirect href={(resumePath ?? '/onboarding') as '/onboarding'} />;
}
