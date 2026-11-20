// Payday (DECISIONS #60, free): just the day of the month, never an amount.
// Home then shows what still leaves your account before it.
// The rule (tested day by day in src/domain/__tests__/payday.test.ts): a local
// calendar date, no timestamps; 29–31 use the last day of shorter months; the
// next payday is the first one after today (on payday, it's next month's);
// "before payday" is today up to the day before it, so a charge on payday
// counts after it. The day turns at local midnight (clockToday).

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ordinal } from '@/domain/copy';
import { SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { F, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function PaydayPage() {
  const p = usePalette();
  const app = useApp();
  const current = app.settings.payday;
  // As many 44pt+ circles as fit, at most 6 a row, so it never reads as a 7-day week.
  // Always round (height = width), and never bigger than 56pt: on wide screens the grid
  // stays a tidy block on the left instead of giant circles (audit, Nov 20).
  const [w, setW] = useState(0);
  const GAP = 8;
  const MAX_CELL = 56;
  const cols = w ? Math.min(6, Math.max(5, Math.floor((w + GAP) / (44 + GAP)))) : 6;
  const cell = w ? Math.min(MAX_CELL, Math.floor((w - (cols - 1) * GAP) / cols)) : 44;
  const gridWidth = cols * cell + (cols - 1) * GAP;
  const pick = async (day: number | null) => {
    haptic.select();
    await app.updateSettings({ payday: day });
    router.back();
  };
  return (
    <SettingsPage title="Payday" intro="The day you get paid. Home shows what’s due before then. We never ask how much.">
      {/* Measured on the full-width wrapper; the grid inside is exactly `cols` circles wide, on the left. */}
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ marginTop: 18 }}>
        <View accessibilityRole="radiogroup" accessibilityLabel="Payday" style={{ width: gridWidth, alignSelf: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
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
                  height: cell,
                  borderRadius: cell / 2,
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
      </View>
      <Txt v="sub" tone="mute" style={{ marginTop: 10 }}>
        Paid at month end? Pick 31.
      </Txt>
      {/* A quiet text link, not a card: it isn't a setting, it's the way out. */}
      {current ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Turn off payday"
          onPress={() => void pick(null)}
          style={({ pressed }) => ({ marginTop: 14, minHeight: 44, minWidth: 44, alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 12, opacity: pressed ? 0.6 : 1 })}
        >
          <Txt v="label" tone="mute" center>
            Turn off payday
          </Txt>
        </Pressable>
      ) : null}
    </SettingsPage>
  );
}
