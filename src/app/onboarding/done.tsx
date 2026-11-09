// 8 · You're set. Ends onboarding on the first real reminder.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Btn, LogoTile, Mascot, Screen } from '@/components/kit';
import { haptic } from '@/components/ui';
import { addDays, nextChargeDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

export default function Done() {
  const list = usePickedList();
  const { reminderPicks } = useOnboarding();
  const [on, setOn] = useState<boolean | null>(Platform.OS === 'web' ? true : null);
  const today = toDateOnly();

  useEffect(() => {
    haptic.success();
    if (Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then((r) => setOn(r.granted))
      .catch(() => setOn(false));
  }, []);

  // Subs that will get reminders: the 3 picks on free (or all, if 3 or fewer).
  const watched = list.filter((x) => (list.length <= 3 ? true : reminderPicks.includes(x.id)));
  const next = watched
    .filter((x) => x.anchorDate)
    .map((x) => ({ x, charge: nextChargeDate(x.anchorDate!, x.cycle, today) }))
    .sort((a, b) => (a.charge < b.charge ? -1 : 1))[0];
  const ping = next ? (addDays(next.charge, -3) >= today ? addDays(next.charge, -3) : addDays(next.charge, -1) >= today ? addDays(next.charge, -1) : null) : null;

  return (
    <Screen>
      <View style={styles.body}>
        <Mascot pose="cheer" size={210} />
        <Text style={[text.display, { textAlign: 'center' }]} accessibilityRole="header">
          You&apos;re set.
        </Text>

        <Animated.View entering={FadeInDown.delay(300).duration(320)} style={styles.card}>
          {next && ping ? (
            <View style={styles.row}>
              <LogoTile id={next.x.id} color={next.x.color} ink={next.x.ink} mono={next.x.mono} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={[text.small, { fontFamily: font.heavy, color: ink.teal }]}>FIRST HEADS-UP</Text>
                <Text style={text.bodyStrong}>
                  {weekdayDate(ping)} at 9:00
                </Text>
                <Text style={[text.label, num]}>
                  {next.x.name} · {formatMoney(next.x.amountMinor, next.x.currency)} on {weekdayDate(next.charge)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={text.label}>Add charge dates on Home and I&apos;ll start warning you.</Text>
          )}
          <View style={styles.divider} />
          <Line label="Tracking" value={`${list.length} ${list.length === 1 ? 'subscription' : 'subscriptions'}`} />
          <Line label="Reminders" value={`${watched.length} of ${list.length}`} />
          <Line label="Notifications" value={on === false ? 'Off' : 'On'} warn={on === false} />
          {on === false ? <Btn label="Turn on in Settings" kind="secondary" onPress={() => Linking.openSettings()} /> : null}
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Btn label="Go to my list" onPress={() => router.replace('/(tabs)')} />
      </View>
    </Screen>
  );
}

function Line({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={text.label}>{label}</Text>
      <Text style={[text.bodyStrong, num, warn && { color: '#C2410C' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 22, justifyContent: 'center', gap: 16 },
  card: { borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, borderRadius: 20, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 2, backgroundColor: ink.line, borderRadius: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8, borderTopWidth: 2, borderTopColor: ink.line },
});
