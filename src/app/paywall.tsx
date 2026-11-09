// 6 · Paywall. One page, honest by design (docs/design/PLAYBOOK.md):
// × and Restore from the first frame, a real "Continue free" button, the
// billed amount as the biggest price, savings proven on screen, real trial
// dates, and the user picks when Ditch reminds them about the trial.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/icons';
import { Btn, LogoTile, Mascot, Option, Screen } from '@/components/kit';
import { haptic } from '@/components/ui';
import { addDays, shortDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { PLANS, PURCHASES_LIVE, type PlanId } from '@/services/purchases';
import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

const PERKS = ['Reminders on every sub, your timing', 'Import from a screenshot or statement', 'Home-screen widget', 'Backup to your own iCloud'];

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const list = usePickedList();
  const n = list.length;
  const sorted = [...list].sort(byYearlyDesc);
  const [planId, setPlanId] = useState<PlanId>('yearly');
  const [remindersOn, setRemindersOn] = useState(true);
  const [lead, setLead] = useState<2 | 3>(2); // days before the trial charge
  const plan = PLANS.find((p) => p.id === planId)!;
  const yearly = PLANS.find((p) => p.id === 'yearly')!;
  const monthly = PLANS.find((p) => p.id === 'monthly')!;
  const today = toDateOnly();
  const chargeDay = addDays(today, yearly.trialDays);
  const remindDay = addDays(chargeDay, -lead);

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

  const trial = plan.id === 'yearly' && plan.trialDays > 0;
  const cta = trial ? `Start ${plan.trialDays}-day free trial` : plan.id === 'monthly' ? `Subscribe · ${plan.priceString} a month` : `Buy once · ${plan.priceString}`;
  const under = trial
    ? `$0 today. Then ${plan.priceString} a year from ${weekdayDate(chargeDay)}.`
    : plan.id === 'lifetime'
      ? 'One payment. No renewal.'
      : 'Renews monthly. Cancel anytime in Settings.';

  return (
    <Screen edges={['top']}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={leaveFree} style={styles.iconBtn} hitSlop={6}>
          <CloseIcon color={ink.textSoft} size={22} strokeWidth={2.8} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Restore', 'Nothing to restore yet. Purchases arrive in the next build.')} style={styles.restore}>
          <Text style={[text.label, { fontFamily: font.heavy, color: ink.textFaint, letterSpacing: 0.6 }]}>RESTORE</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 200 + insets.bottom, gap: 16 }}>
        {/* header: calm raccoon beside the headline */}
        <View style={styles.header}>
          <Mascot pose="bell" size={96} still />
          <Text style={[text.title, { flex: 1 }]} accessibilityRole="header">
            {n > 3 ? `Get a heads-up before all ${n} renewals.` : 'Add the rest from a screenshot.'}
          </Text>
        </View>

        {n > 3 ? (
          <View style={{ gap: 6 }}>
            <View style={styles.logoRow}>
              {sorted.slice(0, 8).map((x, i) => (
                <View key={x.id} style={{ alignItems: 'center', gap: 3 }}>
                  <LogoTile id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={34} />
                  <Text style={{ fontFamily: font.black, fontSize: 10, color: i < 3 ? ink.textFaint : ink.teal }}>{i < 3 ? 'FREE' : 'PRO'}</Text>
                </View>
              ))}
            </View>
            <Text style={[text.label, { textAlign: 'center' }]}>
              Free covers 3 of your {n}. Pro covers all {n}.
            </Text>
          </View>
        ) : null}

        {/* plans: billed amount is always the biggest price */}
        <View style={{ gap: 8 }} accessibilityRole="radiogroup">
          <Option selected={planId === 'yearly'} onPress={() => setPlanId('yearly')} label={`Yearly, ${yearly.priceString} a year, ${yearly.trialDays} days free`} style={{ minHeight: 78 }}>
            <Radio on={planId === 'yearly'} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={text.bodyStrong}>Yearly</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>SAVE 50%</Text>
                </View>
              </View>
              <Text style={[text.small, num]}>
                {yearly.trialDays} days free · about {formatMoney(yearly.priceMinor / 12, yearly.currency)} a month
              </Text>
            </View>
            <Price amount={yearly.priceString} per="/yr" />
          </Option>
          <Option selected={planId === 'monthly'} onPress={() => setPlanId('monthly')} label={`Monthly, ${monthly.priceString} a month`}>
            <Radio on={planId === 'monthly'} />
            <View style={{ flex: 1 }}>
              <Text style={text.bodyStrong}>Monthly</Text>
              <Text style={[text.small, num]}>{formatMoney(monthly.priceMinor * 12, monthly.currency)} a year</Text>
            </View>
            <Price amount={monthly.priceString} per="/mo" />
          </Option>
          <Option selected={planId === 'lifetime'} onPress={() => setPlanId('lifetime')} label={`Lifetime, ${PLANS[2].priceString} once`}>
            <Radio on={planId === 'lifetime'} />
            <View style={{ flex: 1 }}>
              <Text style={text.bodyStrong}>Lifetime</Text>
              <Text style={text.small}>Billed once · No trial</Text>
            </View>
            <Price amount={PLANS[2].priceString} per="" />
          </Option>
        </View>

        {/* trial timeline with a reminder-day picker */}
        {trial ? (
          <View style={styles.card}>
            <Text style={[text.heading, { marginBottom: 12 }]}>How your free week works</Text>
            <Step emoji="🔓" hot when={`Today · ${weekdayDate(today)}`} title="Pro is on. $0 today." />
            <Step emoji={remindersOn ? '🔔' : '🔕'} when={weekdayDate(remindDay)} title={remindersOn ? 'I remind you' : 'Turn on reminders so I can warn you'}>
              {remindersOn ? (
                <>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    {([3, 2] as const).map((d) => (
                      <Pressable
                        key={d}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: lead === d }}
                        onPress={() => {
                          haptic.tap();
                          setLead(d);
                        }}
                        style={[styles.chip, lead === d && styles.chipOn]}
                      >
                        <Text style={[text.small, { fontFamily: font.heavy, color: lead === d ? ink.tealInk : ink.textSoft }]}>
                          {d} days before · {shortDate(addDays(chargeDay, -d))}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.miniRow}>
                    <View style={styles.miniIcon}>
                      <Text style={{ color: ink.white, fontFamily: font.black, fontSize: 13 }}>D</Text>
                    </View>
                    <Text style={[text.label, { flex: 1, color: ink.text }]} numberOfLines={1}>
                      Ditch Pro trial
                    </Text>
                    <Text style={[text.small, num]}>
                      {yearly.priceString} · {shortDate(chargeDay)}
                    </Text>
                  </View>
                  <Text style={[text.small, { marginTop: 4 }]}>It goes in your list like any other sub.</Text>
                </>
              ) : (
                <Pressable accessibilityRole="button" onPress={() => Linking.openSettings()} style={{ minHeight: 40, justifyContent: 'center' }}>
                  <Text style={[text.label, { fontFamily: font.heavy, color: ink.teal }]}>Open Settings</Text>
                </Pressable>
              )}
            </Step>
            <Step emoji="💳" last when={weekdayDate(chargeDay)} title={`${yearly.priceString} charged, unless you cancel before.`} />
            <Text style={[text.small, { marginTop: 10 }]}>Cancel at least 24 hours before, in Settings → your name → Subscriptions.</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={[text.heading, { marginBottom: 10 }]}>What&apos;s in Pro</Text>
          <View style={{ gap: 8 }}>
            {PERKS.map((p) => (
              <View key={p} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.tick}>
                  <Text style={{ color: ink.white, fontFamily: font.black, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={[text.bodyStrong, { flex: 1, fontSize: 15 }]}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={text.small}>Lifetime: everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month.</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
          <Text style={[text.small, { textDecorationLine: 'underline' }]}>Terms</Text>
          <Text style={[text.small, { textDecorationLine: 'underline' }]}>Privacy</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Btn label={cta} onPress={buy} />
        <Text style={[text.bodyStrong, num, { textAlign: 'center', fontSize: 15 }]}>{under}</Text>
        <Btn label={n > 3 ? 'Continue free: 3 reminders' : 'Continue free'} kind="secondary" onPress={leaveFree} />
      </View>
    </Screen>
  );
}

function Radio({ on }: { on: boolean }) {
  return <View style={[styles.radio, on && { borderColor: ink.teal }]}>{on ? <View style={styles.radioDot} /> : null}</View>;
}

function Price({ amount, per }: { amount: string; per: string }) {
  return (
    <Text style={[text.heading, num, { fontSize: 19 }]}>
      {amount}
      <Text style={[text.small, { fontSize: 13 }]}>{per}</Text>
    </Text>
  );
}

function Step({ emoji, when, title, hot, last, children }: { emoji: string; when: string; title: string; hot?: boolean; last?: boolean; children?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ alignItems: 'center', width: 38 }}>
        <View style={[styles.dot, hot && { backgroundColor: ink.teal, borderColor: ink.tealEdge }]}>
          <Text allowFontScaling={false} style={{ fontSize: 17 }}>
            {emoji}
          </Text>
        </View>
        {!last ? <View style={styles.vline} /> : null}
      </View>
      <View style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
        <Text style={[text.small, { fontFamily: font.heavy, color: ink.teal, letterSpacing: 0.4 }]}>{when.toUpperCase()}</Text>
        <Text style={text.bodyStrong}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, height: 50 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  restore: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: ink.lineDark, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: ink.teal },
  badge: { backgroundColor: ink.lime, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 7 },
  badgeText: { fontFamily: font.black, fontSize: 10, color: '#1F3A0A', letterSpacing: 0.4 },
  card: { borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, borderRadius: 20, padding: 14 },
  dot: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, backgroundColor: ink.white, alignItems: 'center', justifyContent: 'center' },
  vline: { width: 3, flex: 1, backgroundColor: ink.line, borderRadius: 2, marginVertical: 2 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, minHeight: 36, justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderBottomWidth: 3, borderColor: ink.line },
  chipOn: { backgroundColor: ink.tealSoft, borderColor: ink.teal },
  miniRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, padding: 8, borderRadius: 12, backgroundColor: ink.soft },
  miniIcon: { width: 26, height: 26, borderRadius: 7, backgroundColor: ink.teal, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 22, height: 22, borderRadius: 11, backgroundColor: ink.teal, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 12, gap: 8, backgroundColor: ink.bg, borderTopWidth: 2, borderTopColor: ink.line },
});
