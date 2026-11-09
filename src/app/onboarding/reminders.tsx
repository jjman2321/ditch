// 5 · Reminder permission, with a preview built from the user's own subs.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Btn, Say, Screen, TopBar } from '@/components/kit';
import { LockScreen } from '@/components/pieces';
import { haptic } from '@/components/ui';
import { formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { ink } from '@/theme/brand';

const EXAMPLE = [
  { id: 'netflix', title: 'Netflix renews in 3 days', body: '$17.99. Keep it or ditch it?', color: '#E50914', mono: 'N', when: 'now' },
  { id: 'spotify', title: 'Spotify renews tomorrow', body: '$11.99. Keep it or ditch it?', color: '#1DB954', ink: '#0B2A17', mono: 'S', when: '9:00' },
];

export default function Reminders() {
  const { setNotificationsAsked } = useOnboarding();
  const list = usePickedList();
  const top = [...list].sort(byYearlyDesc).slice(0, 2);
  const items = top.length
    ? top.map((x, i) => ({
        id: x.id,
        title: i === 0 ? `${x.name} renews in 3 days` : `${x.name} renews tomorrow`,
        body: `${formatMoney(x.amountMinor, x.currency)}. Keep it or ditch it?`,
        color: x.color,
        ink: x.ink,
        mono: x.mono,
        when: i === 0 ? 'now' : '9:00',
      }))
    : EXAMPLE;
  const goNext = () => router.push(list.length > 0 ? '/paywall' : '/(tabs)');

  const enable = async () => {
    try {
      if (Platform.OS !== 'web') {
        const r = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: false, allowSound: true } });
        if (r.granted) haptic.success();
      }
    } catch {}
    setNotificationsAsked();
    goNext();
  };

  return (
    <Screen>
      <TopBar progress={0.8} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20, gap: 20 }}>
        <Say pose="bell" size={96}>
          I&apos;ll ring you 3 days and 1 day before anything charges.
        </Say>
        <LockScreen items={items} />
      </ScrollView>
      <View style={styles.footer}>
        <Btn label="Turn on reminders" onPress={enable} />
        <Btn
          label="Maybe later"
          kind="ghost"
          onPress={() => {
            setNotificationsAsked();
            goNext();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4, gap: 4, borderTopWidth: 2, borderTopColor: ink.line },
});
