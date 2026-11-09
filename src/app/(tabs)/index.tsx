// Home: placeholder until the Home design is approved.

import { ScrollView, View } from 'react-native';

import { Card, Divider, Screen, ServiceTile, T } from '@/components/ui';
import { formatMoney, monthlyMinorExact, totalsByCurrency, yearlyMinor } from '@/domain/money';
import { nextDateFor, usePickedList } from '@/state/onboarding';
import { weekdayDate } from '@/domain/dates';
import { space, tabular } from '@/theme/tokens';

export default function Home() {
  const list = usePickedList();
  const monthly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: monthlyMinorExact(x.amountMinor, x.cycle) })));
  const yearly = totalsByCurrency(list.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: space.xl, gap: space.xl }}>
        <View style={{ gap: space.xs }}>
          <T v="footnote" tone="tertiary">
            HOME (draft, design comes next)
          </T>
          <T v="largeTitle" style={tabular}>
            {monthly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' + ') || '$0'}/mo
          </T>
          <T v="body" tone="secondary" style={tabular}>
            {yearly.map((t) => formatMoney(t.amountMinor, t.currency)).join(' + ') || '$0'} a year
          </T>
        </View>
        <Card>
          {list.map((x, i) => {
            const next = nextDateFor(x);
            return (
              <View key={x.id}>
                {i > 0 ? <Divider inset={68} /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg }}>
                  <ServiceTile color={x.color} ink={x.ink} mono={x.mono} size={36} />
                  <View style={{ flex: 1 }}>
                    <T v="headline">{x.name}</T>
                    <T v="footnote" tone="tertiary">
                      {next ? `Next: ${weekdayDate(next)}` : 'Add a date'}
                    </T>
                  </View>
                  <T v="body" style={tabular}>
                    {formatMoney(x.amountMinor, x.currency)}
                  </T>
                </View>
              </View>
            );
          })}
          {list.length === 0 ? (
            <T v="body" tone="secondary" style={{ padding: space.lg }}>
              Nothing yet.
            </T>
          ) : null}
        </Card>
      </ScrollView>
    </Screen>
  );
}
