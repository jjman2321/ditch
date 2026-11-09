// 7 · Pick 3 for reminders (free plan, more than 3 subs).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Btn, Check, LogoTile, Option, Say, Screen } from '@/components/kit';
import { haptic } from '@/components/ui';
import { formatMoney, yearlyMinor } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

export default function Pick() {
  const insets = useSafeAreaInsets();
  const { setReminderPicks } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [sel, setSel] = useState<string[]>(() => sorted.slice(0, 3).map((x) => x.id));
  const [nudge, setNudge] = useState(false);

  const toggle = (id: string) => {
    if (sel.includes(id)) {
      setSel(sel.filter((x) => x !== id));
      setNudge(false);
    } else if (sel.length < 3) {
      setSel([...sel, id]);
      setNudge(false);
    } else {
      haptic.warning();
      setNudge(true);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 140 + insets.bottom, gap: 10 }}>
        <Say pose="worried" size={96}>
          Free gets 3 reminders. I picked your biggest. Swap any time!
        </Say>
        <View style={{ height: 6 }} />
        {sorted.map((x) => (
          <Option key={x.id} selected={sel.includes(x.id)} onPress={() => toggle(x.id)} label={`${x.name}, ${formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)} a year`}>
            <LogoTile id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={text.bodyStrong}>{x.name}</Text>
              <Text style={[text.small, num]}>{formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)}/yr</Text>
            </View>
            <Check on={sel.includes(x.id)} />
          </Option>
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={[text.label, { textAlign: 'center', fontFamily: font.heavy, color: nudge ? ink.text : ink.textFaint }]} accessibilityLiveRegion="polite">
          {nudge ? 'That’s 3! Untick one to swap.' : `${sel.length} OF 3 PICKED`}
        </Text>
        <Btn
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
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, gap: 10, backgroundColor: ink.bg, borderTopWidth: 2, borderTopColor: ink.line },
});
