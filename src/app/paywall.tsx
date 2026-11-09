// 6 · Paywall in the Kiwi style, honest by design:
// × and Restore from the first frame, billed amount is the biggest price,
// savings proven on screen, real trial dates, the user picks the reminder
// day, and "Continue free" is a real choice.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { addDays, shortDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { PLANS, PURCHASES_LIVE, type PlanId } from '@/services/purchases';
import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { AppLogo } from '@/ui/ditch';
import type { Emoji } from '@/ui/emoji';
import { Icon } from '@/ui/icons';
import { Btn, C, CircleBtn, E, F, Float, Glow, Label, Press, Raccoon, Rise, Row, Small, Tag, Tiny, tap } from '@/ui/kit';

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const list = usePickedList();
  const n = list.length;
  const sorted = [...list].sort(byYearlyDesc);
  const [planId, setPlanId] = useState<PlanId>('yearly');
  const [lead, setLead] = useState<2 | 3>(2);
  const [remindersOn, setRemindersOn] = useState(true);
  const yearly = PLANS.find((p) => p.id === 'yearly')!;
  const monthly = PLANS.find((p) => p.id === 'monthly')!;
  const lifetime = PLANS.find((p) => p.id === 'lifetime')!;
  const today = toDateOnly();
  const charge = addDays(today, yearly.trialDays);
  const remind = addDays(charge, -lead);
  const trial = planId === 'yearly';

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then((r) => setRemindersOn(r.granted))
      .catch(() => setRemindersOn(false));
  }, []);

  const leaveFree = () => router.replace(n > 3 ? '/onboarding/pick' : '/onboarding/done');
  const buy = () => {
    if (!PURCHASES_LIVE) Alert.alert('Not yet', 'Purchases arrive in the next build. For now, carry on free.', [{ text: 'OK', onPress: leaveFree }]);
  };

  const steps: { e: Emoji; when: string; what: string }[] = [
    { e: 'unlocked', when: `Today · ${shortDate(today)}`, what: 'Pro is on. Every subscription gets reminders. $0 today.' },
    remindersOn
      ? { e: 'bell', when: `${weekdayDate(remind)}`, what: 'I remind you before anything is charged.' }
      : { e: 'bell', when: `${weekdayDate(remind)}`, what: 'Turn on reminders so I can warn you.' },
    { e: 'card', when: `${weekdayDate(charge)}`, what: `${yearly.priceString} charged, unless you cancel before.` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Glow color="#8FE3D6" size={420} opacity={0.35} style={{ left: -210, top: -180 }} />
      <Glow color="#D9F2A6" size={380} opacity={0.35} style={{ right: -190, top: -140 }} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: 24, gap: 22 }} showsVerticalScrollIndicator={false}>
        <Row style={{ justifyContent: 'space-between' }}>
          <CircleBtn name="close" label="Close" size={38} onPress={leaveFree} />
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => Alert.alert('Restore', 'Nothing to restore yet. Purchases arrive in the next build.')}>
            <Text style={{ fontFamily: F.semi, fontSize: 15, color: C.ink2 }}>Restore</Text>
          </Pressable>
        </Row>

        <View style={{ height: 170, alignItems: 'center', justifyContent: 'center', marginTop: -26 }}>
          <Float amp={4} style={{ position: 'absolute', left: 34, top: 22 }}>
            <E name="bell" size={60} />
          </Float>
          <Float amp={6} style={{ position: 'absolute', right: 36, top: 8 }}>
            <E name="coin" size={52} />
          </Float>
          <Float amp={5} style={{ position: 'absolute', right: 56, bottom: 0 }}>
            <E name="spiralCal" size={48} />
          </Float>
          <Raccoon size={112} pose="happy" style={{ marginTop: 30 }} />
        </View>

        <Rise i={0} style={{ gap: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: F.serifSemi, fontSize: 33, lineHeight: 39, color: C.ink, textAlign: 'center' }}>
            {n > 3 ? (
              <>
                A heads-up before <Text style={{ color: C.kiwi }}>all {n} renewals</Text>
              </>
            ) : (
              <>
                Every renewal, <Text style={{ color: C.kiwi }}>covered</Text>
              </>
            )}
          </Text>
          <Small center style={{ fontSize: 15.5 }}>
            {n > 3 ? `Free covers 3 of your ${n}. Pro covers every one, plus import, widget and iCloud backup.` : 'Reminders on everything, import from a screenshot, a widget and iCloud backup.'}
          </Small>
          {n > 3 ? (
            <Row gap={8} style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              {sorted.slice(0, 7).map((x, k) => (
                <View key={x.id} style={{ alignItems: 'center', gap: 4 }}>
                  <AppLogo id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={34} />
                  <Text style={{ fontFamily: F.bold, fontSize: 10, letterSpacing: 0.5, color: k < 3 ? C.ink3 : C.kiwiInk }}>{k < 3 ? 'FREE' : 'PRO'}</Text>
                </View>
              ))}
            </Row>
          ) : null}
        </Rise>

        <Rise i={1} style={{ gap: 14, marginTop: 2 }}>
          <PlanCard on={planId === 'yearly'} onPress={() => setPlanId('yearly')} tag="7 days free" title="Yearly" sub={`About ${formatMoney(yearly.priceMinor / 12, yearly.currency)} a month`} price={yearly.priceString} per="/year" save="Save 50%" />
          <PlanCard on={planId === 'monthly'} onPress={() => setPlanId('monthly')} title="Monthly" sub={`${formatMoney(monthly.priceMinor * 12, monthly.currency)} a year · no trial`} price={monthly.priceString} per="/month" />
          <PlanCard on={planId === 'lifetime'} onPress={() => setPlanId('lifetime')} title="Lifetime" sub="Billed once · no trial" price={lifetime.priceString} per="once" />
        </Rise>

        {trial ? (
          <Rise i={2}>
            <View style={{ backgroundColor: C.sunken, borderRadius: 22, padding: 18 }}>
              <Label style={{ marginBottom: 14 }}>How your free week works</Label>
              {steps.map((s, k) => (
                <Row key={k} gap={14} align="flex-start">
                  <View style={{ alignItems: 'center', width: 36 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' }}>
                      <E name={s.e} size={22} />
                    </View>
                    {k < 2 ? <View style={{ width: 3, flex: 1, minHeight: 28, borderRadius: 2, backgroundColor: k === 0 ? C.kiwi : '#D9DBE1', marginVertical: 3 }} /> : null}
                  </View>
                  <View style={{ flex: 1, paddingTop: 1, paddingBottom: k < 2 ? 12 : 0, gap: 2 }}>
                    <Label style={{ fontSize: 15 }}>{s.when}</Label>
                    <Small>{s.what}</Small>
                    {k === 1 && remindersOn ? (
                      <>
                        <Row gap={8} style={{ marginTop: 8 }}>
                          {([3, 2] as const).map((d) => (
                            <Pressable
                              key={d}
                              accessibilityRole="radio"
                              accessibilityState={{ selected: lead === d }}
                              onPress={() => (tap(), setLead(d))}
                              style={{ paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', borderRadius: 18, backgroundColor: lead === d ? C.kiwiSoft : C.card, borderWidth: 1.5, borderColor: lead === d ? C.kiwi : C.line }}
                            >
                              <Text style={{ fontFamily: F.bold, fontSize: 13, color: lead === d ? C.kiwiInk : C.ink2 }}>
                                {d} days before · {shortDate(addDays(charge, -d))}
                              </Text>
                            </Pressable>
                          ))}
                        </Row>
                        <Row gap={10} style={{ marginTop: 10, backgroundColor: C.card, borderRadius: 14, padding: 10 }}>
                          <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: C.kiwiSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <Raccoon size={28} pose="idle" move="none" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.ink }}>Ditch Pro trial</Text>
                            <Tiny style={{ color: C.ink2 }}>Goes in your list like any other sub</Tiny>
                          </View>
                          <Tiny style={{ color: C.ink }}>
                            {yearly.priceString} · {shortDate(charge)}
                          </Tiny>
                        </Row>
                      </>
                    ) : null}
                    {k === 1 && !remindersOn ? (
                      <Pressable accessibilityRole="button" onPress={() => Linking.openSettings()} style={{ minHeight: 40, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.kiwiInk }}>Open Settings</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </Row>
              ))}
            </View>
          </Rise>
        ) : null}

        <Tiny center style={{ lineHeight: 17, color: C.ink2 }}>
          {planId === 'yearly'
            ? `Free for 7 days, then ${yearly.priceString} a year, billed on ${shortDate(charge)} and yearly after that unless you cancel at least 24 hours before.`
            : planId === 'monthly'
              ? `${monthly.priceString} a month, billed today and monthly until you cancel.`
              : `${lifetime.priceString} once. Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month.`}{' '}
          Manage or cancel in Settings → your name → Subscriptions.
        </Tiny>
        <Row gap={18} style={{ justifyContent: 'center' }}>
          {['Terms', 'Privacy'].map((l) => (
            <Pressable key={l} accessibilityRole="link" hitSlop={8}>
              <Text style={{ fontFamily: F.semi, fontSize: 13, color: C.ink2, textDecorationLine: 'underline' }}>{l}</Text>
            </Pressable>
          ))}
        </Row>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 10, gap: 8, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line }}>
        <Row gap={6} style={{ justifyContent: 'center' }}>
          <Icon name="check" size={16} color={C.kiwi} weight={3} />
          <Text style={{ fontFamily: F.semi, fontSize: 14, color: C.ink }}>
            {trial ? `$0 today. Then ${yearly.priceString} a year from ${shortDate(charge)}.` : planId === 'monthly' ? `${monthly.priceString} today. Cancel anytime.` : `${lifetime.priceString} once. No renewal.`}
          </Text>
        </Row>
        <Btn label={trial ? 'Start my free week' : planId === 'monthly' ? `Subscribe for ${monthly.priceString}/month` : `Buy once for ${lifetime.priceString}`} onPress={buy} />
        <Btn label={n > 3 ? 'Continue free: 3 reminders' : 'Continue free'} kind="ghost" small onPress={leaveFree} />
      </View>
    </View>
  );
}

function PlanCard({ on, onPress, tag, title, sub, price, per, save }: { on: boolean; onPress: () => void; tag?: string; title: string; sub: string; price: string; per: string; save?: string }) {
  return (
    <View>
      <Press
        role="radio"
        selected={on}
        label={`${title}, ${price} ${per}, ${sub}`}
        onPress={onPress}
        face={on ? '#F5FCFA' : C.card}
        lip={on ? C.kiwi : C.line}
        border={on ? C.kiwi : C.line}
        bw={2}
        radius={20}
        inner={{ minHeight: 76, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}
      >
        <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: on ? 0 : 2, borderColor: '#D3D5DB', backgroundColor: on ? C.kiwi : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {on ? <Icon name="check" size={14} color="#FFFFFF" weight={3.4} /> : null}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Row gap={8}>
            <Text style={{ fontFamily: F.display, fontSize: 18, color: C.ink }}>{title}</Text>
            {save ? <Tag text={save} bg={C.limeSoft} color={C.limeInk} /> : null}
          </Row>
          <Small>{sub}</Small>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: F.display, fontSize: 21, color: C.ink }}>{price}</Text>
          <Tiny>{per}</Tiny>
        </View>
      </Press>
      {tag ? <Tag text={tag} bg={on ? C.kiwi : C.ink3} color="#FFFFFF" style={{ position: 'absolute', top: -10, left: 18 }} /> : null}
    </View>
  );
}
