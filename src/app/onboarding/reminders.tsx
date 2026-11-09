// 5 · Reminder permission, with a preview built from the user's own subs.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NotificationPreview, OnboardingTopBar } from '@/components/onboarding';
import { Button, haptic, Screen, T } from '@/components/ui';
import { formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { space } from '@/theme/tokens';

const EXAMPLE = [
  { title: 'Netflix renews in 3 days', body: '$17.99 on Thursday', color: '#E50914', mono: 'N', when: 'now' },
  { title: 'Spotify renews tomorrow', body: '$11.99. Still listening?', color: '#1DB954', ink: '#0B2A17', mono: 'S', when: '9:00' },
];

export default function Reminders() {
  const { setNotificationsAsked } = useOnboarding();
  const list = usePickedList();

  const top = [...list].sort(byYearlyDesc).slice(0, 2);
  const items =
    top.length > 0
      ? top.map((x, i) => ({
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
        const res = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: false, allowSound: true },
        });
        if (res.granted) haptic.success();
      }
    } catch {
      // The app keeps working without notifications; Home will say so.
    }
    setNotificationsAsked();
    goNext();
  };

  return (
    <Screen>
      <OnboardingTopBar step={4} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ gap: space.sm }}>
          <T v="title1" accessibilityRole="header">
            We&apos;ll warn you before it charges
          </T>
          <T v="body" tone="secondary">
            3 days and 1 day before, at 9am. Change it anytime.
          </T>
        </View>
        <NotificationPreview items={items} />
        {top.length === 0 ? (
          <T v="footnote" tone="tertiary" style={{ textAlign: 'center' }}>
            Example
          </T>
        ) : null}
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.footer}>
        <Button label="Turn on reminders" onPress={enable} />
        <Button
          label="Maybe later"
          kind="plain"
          onPress={() => {
            setNotificationsAsked();
            goNext();
          }}
        />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.xl, gap: space.xl },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.sm, gap: space.xs },
});
