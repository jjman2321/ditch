// 7 · Pick 3 for reminders (free plan, more than 3 subs).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TickCircle } from '@/components/onboarding';
import { Button, haptic, Screen, ServiceTile, Squish, T } from '@/components/ui';
import { formatMoney, yearlyMinor } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { radius, space, tabular, usePalette } from '@/theme/tokens';

export default function Pick() {
  const p = usePalette();
  const insets = useSafeAreaInsets();
  const { setReminderPicks } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [sel, setSel] = useState<string[]>(() => sorted.slice(0, 3).map((x) => x.id));
  const [nudge, setNudge] = useState(false);

  const toggle = (id: string) => {
    if (sel.includes(id)) {
      haptic.tap();
      setSel(sel.filter((x) => x !== id));
      setNudge(false);
    } else if (sel.length < 3) {
      haptic.tap();
      setSel([...sel, id]);
      setNudge(false);
    } else {
      haptic.warning();
      setNudge(true);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 140 + insets.bottom }]}>
        <View style={{ gap: space.sm }}>
          <T v="title1" accessibilityRole="header">
            Pick 3 for reminders
          </T>
          <T v="body" tone="secondary">
            We picked your 3 biggest. Swap any, anytime. Free. Everything stays on your list either way.
          </T>
        </View>

        <View style={{ gap: space.sm }}>
          {sorted.map((x) => {
            const on = sel.includes(x.id);
            return (
              <Squish
                key={x.id}
                scaleTo={0.985}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${x.name}, ${formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)} a year`}
                onPress={() => toggle(x.id)}
                style={[styles.row, { backgroundColor: on ? p.selectedSoft : p.surface }]}
              >
                <ServiceTile color={x.color} ink={x.ink} mono={x.mono} size={40} />
                <View style={{ flex: 1 }}>
                  <T v="headline" numberOfLines={1}>
                    {x.name}
                  </T>
                  <T v="subhead" tone="tertiary" style={tabular}>
                    {formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)}/yr
                  </T>
                </View>
                <TickCircle on={on} />
              </Squish>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: p.scrim, borderTopColor: p.separator, paddingBottom: Math.max(insets.bottom, space.md) }]}>
        <T v="footnote" tone={nudge ? 'primary' : 'tertiary'} style={[tabular, { textAlign: 'center' }]} accessibilityLiveRegion="polite">
          {nudge ? 'That’s 3. Untick one to swap.' : `${sel.length} of 3 picked`}
        </T>
        <Button
          label="Done"
          disabled={sel.length === 0}
          onPress={() => {
            haptic.success();
            setReminderPicks(sel);
            router.replace('/(tabs)');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, gap: space.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, minHeight: 68 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
