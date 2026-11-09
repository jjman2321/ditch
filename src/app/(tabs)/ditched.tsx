// Ditched: placeholder until Phase 2.

import { Screen, Txt } from '@/ui/sunflower';

export default function Ditched() {
  return (
    <Screen>
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
        Ditched
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        What you’ve cancelled and what it adds up to. Coming in the next build.
      </Txt>
    </Screen>
  );
}
