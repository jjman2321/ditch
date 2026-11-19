// Payday (DECISIONS #60, free): just the day of the month, never an amount.
// Home then shows what still leaves your account before it.

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ordinal } from '@/domain/copy';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { F, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function PaydayPage() {
  const p = usePalette();
  const app = useApp();
  const current = app.settings.payday;
  // Fill each row edge to edge: as many 44pt+ circles as fit, at most 6, so it never reads as a 7-day week.
  const [w, setW] = useState(0);
  const GAP = 8;
  const cols = w ? Math.min(6, Math.max(5, Math.floor((w + GAP) / (44 + GAP)))) : 6;
  const cell = w ? Math.floor((w - (cols - 1) * GAP) / cols) : 44;
  const pick = async (day: number | null) => {
    haptic.select();
    await app.updateSettings({ payday: day });
    router.back();
  };
  return (
    <SettingsPage title="Payday" intro="The day your pay usually lands. Home then shows what’s still due before it. Just the day, never an amount.">
      <View accessibilityRole="radiogroup" accessibilityLabel="Payday" onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
        {DAYS.map((d) => {
          const on = d === current;
          return (
            <Pressable
              key={d}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={d === 31 ? 'The 31st, or the last day of shorter months' : `The ${ordinal(d)}`}
              onPress={() => void pick(d)}
              style={({ pressed }) => ({
                width: cell,
                height: Math.min(cell, 52),
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? brand.sunflower : p.chipBg,
                borderWidth: 1.5,
                borderColor: on ? brand.ink : p.chipBorder,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Txt v="label" num color={on ? brand.ink : p.fg} style={{ fontFamily: on ? F.heavy : F.bold }}>
                {d}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <Txt v="sub" tone="mute" style={{ marginTop: 10 }}>
        Paid on the last day? Pick 31: shorter months use their last day.
      </Txt>
      {current ? (
        <Group style={{ marginTop: 18 }}>
          <Row label="Turn off payday" onPress={() => void pick(null)} chevron={false} />
        </Group>
      ) : null}
    </SettingsPage>
  );
}
