// Calendar: placeholder until Phase 2.

import { Screen, Txt } from '@/ui/sunflower';

export default function Calendar() {
  return (
    <Screen>
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
        Calendar
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        Every charge on a month view. Coming in the next build.
      </Txt>
    </Screen>
  );
}
