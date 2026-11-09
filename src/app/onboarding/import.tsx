// Placeholder for the free onboarding screenshot import (DECISIONS #16).
// The real screen reads a screenshot of Apple's Subscriptions page on the
// phone; it needs an EAS development build, so it comes in a later phase.

import { router } from 'expo-router';

import { Screen, StepHeader, Txt, Button } from '@/ui/sunflower';

export default function ImportPlaceholder() {
  return (
    <Screen footer={<Button label="Pick them by hand" onPress={() => router.back()} />}>
      <StepHeader step={1} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        Import from a screenshot
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        Soon you’ll share a screenshot of your Apple subscriptions and Ditch reads it right on your phone. It isn’t in this test build yet.
      </Txt>
    </Screen>
  );
}
