// Home: a plain list of what was picked in onboarding, until the Home
// design (Phase 2) lands. Totals are per currency, never mixed.

import { ScrollView, View } from 'react-native';

import { weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { chargeOf, totalsFor, useCountry, useMoney, usePickedList, usePickPrice } from '@/state/onboarding';
import { Card, GuessTag, LogoTile, RowDivider, Screen, Txt, Wordmark } from '@/ui/sunflower';

export default function Home() {
  const list = usePickedList();
  const money = useMoney();
  const priceOf = usePickPrice();
  const totals = totalsFor(list, useCountry()?.currency);
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 48, justifyContent: 'center' }}>
          <Wordmark />
        </View>
        <Txt v="displayM" tone="money" num style={{ marginTop: 12 }}>
          {totals.map((t) => money(t.monthlyMinor, t.currency)).join(' + ') || formatMoney(0, 'USD')} a month
        </Txt>
        <Txt v="leadS" tone="fg2" num style={{ marginTop: 4 }}>
          {totals.map((t) => money(t.yearlyMinor, t.currency)).join(' + ') || formatMoney(0, 'USD')} a year · Home design comes next
        </Txt>
        <Card style={{ marginTop: 18, paddingVertical: 2 }}>
          {list.length === 0 ? (
            <Txt v="leadS" tone="fg2" style={{ padding: 16 }}>
              Nothing here yet.
            </Txt>
          ) : (
            list.map((x, i) => (
              <View key={x.id}>
                {i ? <RowDivider inset={62} /> : null}
                <View style={{ minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14 }}>
                  <LogoTile id={x.id} size={36} />
                  <View style={{ flex: 1 }}>
                    <Txt v="bodyStrong">{x.name}</Txt>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Txt v="sub" tone="mute" num>
                        {weekdayDate(chargeOf(x))}
                      </Txt>
                      {x.dateSource === 'guess' ? <GuessTag /> : null}
                    </View>
                  </View>
                  <Txt v="moneyS" num>
                    {priceOf(x, 'amount') ?? 'No price'}
                  </Txt>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
