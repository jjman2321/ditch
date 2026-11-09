// 3 · The reveal: "That's about $887 a year."

import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { formatMoney, monthlyMinorExact, totalsByCurrency, yearlyMinor } from '@/domain/money';
import { AppLogo, FlowHeader } from '@/ui/ditch';
import { Btn, C, Card, CountUp, E, F, Float, Glow, Label, Raccoon, Rise, Row, Screen, Small, tap } from '@/ui/kit';

export default function Reveal() {
  const list = usePickedList();
  const yearly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const monthly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: monthlyMinorExact(x.amountMinor, x.cycle) })));
  const main = yearly[0] ?? { currency: 'USD', amountMinor: 0 };
  const dollars = Math.round(main.amountMinor / 100);
  const biggest = [...list].sort(byYearlyDesc).slice(0, 3);
  const n = list.length;

  useEffect(() => {
    const t = setTimeout(() => tap('success'), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen footer={<Btn label="Set my dates" onPress={() => router.push('/onboarding/dates')} />}>
      <FlowHeader section={0} fill={1} />
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ width: 300, height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <Glow color={C.lime} size={260} opacity={0.3} />
          <Float amp={5} style={{ position: 'absolute', left: 22, top: 26 }}>
            <E name="moneyWings" size={58} />
          </Float>
          <Float amp={7} style={{ position: 'absolute', right: 26, top: 60 }}>
            <E name="receipt" size={52} />
          </Float>
          <Raccoon size={124} pose="oops" move="shake" />
        </View>
        <Small center style={{ fontSize: 17, color: C.ink2 }}>
          That&apos;s about
        </Small>
        <CountUp to={dollars} prefix="$" style={{ fontFamily: F.display, fontSize: 64, lineHeight: 70, letterSpacing: -2, color: C.ink }} />
        {yearly.slice(1).map((t) => (
          <Text key={t.currency} style={{ fontFamily: F.display, fontSize: 24, color: C.ink }}>
            + {formatMoney(t.amountMinor, t.currency, { trimWhole: true })}
          </Text>
        ))}
        <Text style={{ fontFamily: F.display, fontSize: 26, color: C.ink, letterSpacing: -0.5 }}>a year.</Text>
        <Small center style={{ fontSize: 16 }}>
          {monthly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' + ')} a month across {n} {n === 1 ? 'subscription' : 'subscriptions'}.
        </Small>
      </View>

      <Rise i={3}>
        <Card outline gap={14}>
          <Label style={{ color: C.ink2, fontSize: 14 }}>Your biggest ones</Label>
          {biggest.map((x) => (
            <Row key={x.id} gap={12}>
              <AppLogo id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={38} />
              <Label style={{ flex: 1 }}>{x.name}</Label>
              <Label>{formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)}</Label>
              <Small>/yr</Small>
            </Row>
          ))}
        </Card>
      </Rise>
      <Rise i={4}>
        <Small center style={{ fontSize: 13.5, color: C.ink3 }}>
          In a 2022 survey, people guessed $86 a month. It was really $219. (C+R Research)
        </Small>
      </Rise>
    </Screen>
  );
}
