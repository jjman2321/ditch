// 08 / 08b · You're set. When the first heads-ups come, from the user's
// own picks. 08b is the same screen once a Pro trial has started.

import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { addDays, toDateOnly, weekdayDate } from '@/domain/dates';
import { buildSetSummary } from '@/onboarding/summary';
import { planById } from '@/services/purchases';
import { chargeOf, useOnboarding, usePickedList, useRemindedIds } from '@/state/onboarding';
import { Button, Card, Duck, DuckIcon, LogoTile, ProLockup, Screen, Txt, usePalette } from '@/ui/sunflower';

export default function Done() {
  const p = usePalette();
  const { pro, notifications } = useOnboarding();
  const list = usePickedList();
  const remindedIds = useRemindedIds();
  const today = toDateOnly();
  const n = list.length;
  const trial = pro === 'yearly' ? addDays(today, planById('yearly').trialDays) : null;

  const s = useMemo(
    () =>
      buildSetSummary({
        subs: list.map((x) => ({ id: x.id, name: x.name, charge: chargeOf(x, today), guess: x.dateSource === 'guess' })),
        remindedIds,
        trialCharge: trial,
        pro: !!pro,
        today,
        nowHour: new Date().getHours(),
        notificationsOn: notifications === 'granted',
      }),
    [list, remindedIds, trial, pro, today, notifications],
  );

  const lead =
    n === 0
      ? 'Add what you pay for from your list and we’ll give you a heads-up before each charge.'
      : pro
        ? `All ${n} get a heads-up${trial ? ', and so does your trial' : ''}. Here’s when you’ll hear from us first.`
        : `All ${n} ${n === 1 ? 'is' : 'are'} on your list. ${s.withHeadsUps} ${s.withHeadsUps === '1' ? 'gets' : 'get'} a heads-up. Here’s when you’ll hear from us first.`;

  return (
    <Screen surface="sun" scroll footer={<Button label="Go to my list" onPress={() => router.replace('/(tabs)')} />}>
      <Txt v="displayL" accessibilityRole="header" style={{ marginTop: 40 }}>
        {'You’re\nset.'}
      </Txt>
      <Txt v="lead" tone="fg2" style={{ marginTop: 12 }}>
        {lead}
      </Txt>

      {n > 0 ? (
        <>
          <View style={{ flex: 1, minHeight: 76 }} />
          {s.rows.length ? (
            <View>
              <Duck width={128} right={22} sink={4} />
              <Card style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 8 }}>
                <Txt v="eyebrow" tone="mute" accessibilityRole="header">
                  First heads-ups
                </Txt>
                <View style={{ marginTop: 4 }}>
                  {s.rows.map((r, i) => (
                    <View
                      key={r.id}
                      accessible
                      accessibilityLabel={`${r.trial ? 'Ditch Pro trial' : r.name}, ${r.guess ? 'around ' : ''}${weekdayDate(r.date)}`}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}
                    >
                      {r.trial ? <DuckIcon size={32} /> : <LogoTile id={r.id} size={32} />}
                      <View style={{ flex: 1 }}>
                        {r.trial ? (
                          <ProLockup size={15} suffix="trial" color={p.cardFg} />
                        ) : (
                          <Txt v="label" color={p.cardFg} style={{ fontSize: 15.5 }} numberOfLines={1}>
                            {r.name}
                          </Txt>
                        )}
                      </View>
                      <Txt v="body" num color={p.cardFg}>
                        {r.guess ? <Txt v="body" tone="mute">around </Txt> : null}
                        {weekdayDate(r.date)}
                      </Txt>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          ) : null}
          <Txt v="body" tone="fg2" style={{ marginTop: 12, marginHorizontal: 4, fontSize: 14.5 }}>
            {s.note}
          </Txt>
          <View style={{ flexDirection: 'row', marginTop: 16, borderTopWidth: 2, borderTopColor: p.dark ? p.rule : p.fg }}>
            {[
              [String(s.tracked), 'tracked'],
              [s.withHeadsUps, 'with heads-ups'],
              [String(s.datesToCheck), s.datesToCheck === 1 ? 'date to check' : 'dates to check'],
            ].map(([v, l], i) => (
              <View
                key={l}
                accessible
                accessibilityLabel={`${v} ${l}`}
                style={{ flex: 1, paddingTop: 10, paddingLeft: i ? 16 : 0, borderLeftWidth: i ? 1 : 0, borderLeftColor: p.rule }}
              >
                <Txt v="moneyL" tone="money" num>
                  {v}
                </Txt>
                <Txt v="body" tone="fg2" style={{ fontSize: 14 }} numberOfLines={1}>
                  {l}
                </Txt>
              </View>
            ))}
          </View>
          <View style={{ height: 16 }} />
        </>
      ) : null}
    </Screen>
  );
}
