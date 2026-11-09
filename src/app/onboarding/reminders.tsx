// 5 · Reminders: pre-ask with a preview of their own future reminders.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { formatMoney } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { AppLogo, FlowHeader } from '@/ui/ditch';
import { Btn, C, F, Raccoon, RaccoonSays, Row, Screen, Small, Tiny, shadow, tap } from '@/ui/kit';

const EXAMPLE = [
  { id: 'netflix', name: 'Netflix', amountMinor: 1799, currency: 'USD', color: '#E50914', mono: 'N' },
  { id: 'spotify', name: 'Spotify', amountMinor: 1199, currency: 'USD', color: '#1DB954', mono: 'S' },
];

export default function Reminders() {
  const { setNotificationsAsked } = useOnboarding();
  const list = usePickedList();
  const top = list.length ? [...list].sort(byYearlyDesc).slice(0, 2) : EXAMPLE;
  const next = () => {
    setNotificationsAsked();
    router.push(list.length ? '/paywall' : '/onboarding/done');
  };
  const enable = async () => {
    try {
      if (Platform.OS !== 'web') {
        const r = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: false, allowSound: true } });
        if (r.granted) tap('success');
      }
    } catch {}
    next();
  };

  return (
    <Screen
      scroll={false}
      footer={
        <>
          <Btn label="Turn on reminders" onPress={enable} />
          <Btn label="Not now" kind="ghost" small onPress={next} />
        </>
      }
    >
      <FlowHeader section={2} fill={0.4} />
      <RaccoonSays text="I'll ping you 3 days and 1 day before a renewal. That's all I'll ever send." />
      <View style={{ gap: 10, marginTop: 6 }}>
        {top.map((x, k) => (
          <Animated.View key={x.id} entering={FadeInDown.delay(300 + k * 380).springify().damping(18)}>
            <Row gap={12} align="flex-start" style={[{ backgroundColor: C.sunken, borderRadius: 22, padding: 14 }, shadow(2, 8, 0.03)]}>
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Raccoon size={34} pose="idle" move="none" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: F.bold, fontSize: 15, color: C.ink }}>Ditch</Text>
                  <Tiny>{k === 0 ? 'now' : '9:00'}</Tiny>
                </Row>
                <Text style={{ fontFamily: F.semi, fontSize: 15, color: C.ink }}>
                  {x.name} renews {k === 0 ? 'in 3 days' : 'tomorrow'}
                </Text>
                <Small style={{ fontSize: 14 }}>{formatMoney(x.amountMinor, x.currency)}. Keep it or ditch it?</Small>
              </View>
              <AppLogo id={x.id} color={x.color} mono={(x as { mono: string }).mono} size={34} />
            </Row>
          </Animated.View>
        ))}
        {list.length === 0 ? <Tiny center>Example</Tiny> : null}
      </View>
    </Screen>
  );
}
