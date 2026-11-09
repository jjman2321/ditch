// 8 · You're set: ends onboarding on the first real reminder.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Platform, Text, View } from 'react-native';

import { addDays, nextChargeDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { AppLogo } from '@/ui/ditch';
import { Btn, C, Card, Confetti, Display, E, F, Float, Glow, Label, Raccoon, Rise, Row, Screen, Small, tap } from '@/ui/kit';

export default function Done() {
  const list = usePickedList();
  const { reminderPicks } = useOnboarding();
  const [on, setOn] = useState<boolean | null>(Platform.OS === 'web' ? true : null);
  const today = toDateOnly();
  useEffect(() => {
    tap('success');
    if (Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then((r) => setOn(r.granted))
      .catch(() => setOn(false));
  }, []);

  const watched = list.filter((x) => (list.length <= 3 ? true : reminderPicks.includes(x.id)));
  const first = watched
    .filter((x) => x.anchorDate)
    .map((x) => ({ x, charge: nextChargeDate(x.anchorDate!, x.cycle, today) }))
    .sort((a, b) => (a.charge < b.charge ? -1 : 1))[0];
  const ping = first ? [addDays(first.charge, -3), addDays(first.charge, -1)].find((d) => d >= today) ?? null : null;

  return (
    <Screen scroll={false} footer={<Btn label="Go to my list" onPress={() => router.replace('/(tabs)')} />}>
      <Confetti />
      <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
        <View style={{ alignItems: 'center', gap: 14 }}>
          <View style={{ width: 300, height: 210, alignItems: 'center', justifyContent: 'center' }}>
            <Glow color={C.kiwi} size={280} opacity={0.22} />
            <Float amp={5} style={{ position: 'absolute', left: 26, top: 30 }}>
              <E name="bell" size={56} />
            </Float>
            <Float amp={7} style={{ position: 'absolute', right: 28, top: 44 }}>
              <E name="spiralCal" size={50} />
            </Float>
            <Raccoon size={140} pose="happy" move="hop" />
          </View>
          <Display center>You&apos;re set</Display>
        </View>
        <Rise i={1}>
          <Card outline gap={14}>
            {first && ping ? (
              <Row gap={12}>
                <AppLogo id={first.x.id} color={first.x.color} ink={first.x.ink} mono={first.x.mono} size={42} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.bold, fontSize: 12, letterSpacing: 1, color: C.kiwiInk }}>FIRST HEADS-UP</Text>
                  <Label>{weekdayDate(ping)} at 9:00</Label>
                  <Small>
                    {first.x.name} · {formatMoney(first.x.amountMinor, first.x.currency)} on {weekdayDate(first.charge)}
                  </Small>
                </View>
              </Row>
            ) : (
              <Small>Add charge dates on Home and I&apos;ll start warning you.</Small>
            )}
            <View style={{ height: 1.5, backgroundColor: C.line }} />
            <Line label="Tracking" value={`${list.length} ${list.length === 1 ? 'subscription' : 'subscriptions'}`} />
            <Line label="Reminders" value={`${watched.length} of ${list.length}`} />
            <Line label="Notifications" value={on === false ? 'Off' : 'On'} warn={on === false} />
            {on === false ? <Btn label="Turn on in Settings" kind="secondary" small onPress={() => Linking.openSettings()} /> : null}
          </Card>
        </Rise>
      </View>
    </Screen>
  );
}

function Line({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Small>{label}</Small>
      <Label style={{ fontSize: 15, color: warn ? C.bad : C.ink }}>{value}</Label>
    </Row>
  );
}
