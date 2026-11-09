// 6 · Paywall. Honest by design: close + restore from the first frame,
// a real "Continue free" button, the price at least as visible as the
// trial, and a timeline with real dates. No timers, no fake discounts.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/icons';
import { Btn, LogoTile, Mascot, Option, Screen } from '@/components/kit';
import { Timeline } from '@/components/pieces';
import { addDays, toDateOnly, weekdayDate } from '@/domain/dates';
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
  const plan = PLANS.find((p) => p.id === planId)!;
  const yearly = PLANS.find((p) => p.id === 'yearly')!;
  const today = toDateOnly();
  const remindDay = addDays(today, yearly.trialDays - 2);
  const chargeDay = addDays(today, yearly.trialDays);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then((r) => setRemindersOn(r.granted))
      .catch(() => setRemindersOn(false));
  }, []);

  const leaveFree = () => router.replace(n > 3 ? '/onboarding/pick' : '/(tabs)');
  const buy = () => {
    if (!PURCHASES_LIVE) Alert.alert('Not yet', 'Purchases arrive in the next build. For now, carry on free.', [{ text: 'OK', onPress: leaveFree }]);
  };
  const trial = plan.id === 'yearly' && plan.trialDays > 0;
  const cta = trial
    ? `Start ${plan.trialDays}-day free trial`
    : plan.id === 'monthly'
      ? `Subscribe for ${plan.priceString}/mo`
      : plan.id === 'lifetime'
        ? `Buy lifetime for ${plan.priceString}`
        : `Subscribe for ${plan.priceString}/yr`;
  const under = trial
    ? `Then ${plan.priceString} a year from ${weekdayDate(chargeDay)}.${remindersOn ? ` No need to cancel today, I'll remind you ${weekdayDate(remindDay)}.` : ''}`
    : plan.id === 'lifetime'
      ? 'One payment. No renewal.'
      : `Renews ${plan.period === 'year' ? 'yearly' : 'monthly'}. Cancel anytime.`;

  return (
    <Screen edges={['top']}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={leaveFree} style={styles.close} hitSlop={6}>
          <CloseIcon color={ink.textSoft} size={22} strokeWidth={2.8} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Restore', 'Nothing to restore yet. Purchases arrive in the next build.')} style={styles.restore}>
          <Text style={[text.label, { fontFamily: font.heavy, color: ink.textFaint, letterSpacing: 0.6 }]}>RESTORE</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 220 + insets.bottom, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Mascot pose="cheer" size={150} />
          <Text style={[text.display, { textAlign: 'center' }]} accessibilityRole="header">
            {n > 3 ? `Get a heads-up before all ${n} renewals.` : 'Add the rest from a screenshot.'}
          </Text>
        </View>

        {n > 3 ? (
          <View style={styles.logoRow} accessible accessibilityLabel={`Free covers ${sorted.slice(0, 3).map((x) => x.name).join(', ')}. Pro covers the rest.`}>
            {sorted.slice(0, 7).map((x, i) => (
              <View key={x.id} style={{ alignItems: 'center', gap: 4 }}>
                <LogoTile id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={36} />
                <Text style={[text.small, { fontFamily: font.black, fontSize: 11, color: i < 3 ? ink.textFaint : ink.teal }]}>{i < 3 ? 'FREE' : 'PRO'}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ gap: 10 }}>
          {PERKS.map((p) => (
            <View key={p} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.perkDot}>
                <Text style={{ color: ink.white, fontFamily: font.black, fontSize: 13 }}>✓</Text>
              </View>
              <Text style={[text.bodyStrong, { flex: 1 }]}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 10 }}>
          {PLANS.map((p) => {
            const on = p.id === planId;
            return (
              <Option key={p.id} selected={on} onPress={() => setPlanId(p.id)} label={`${p.title}, ${p.priceString}`} style={p.id === 'yearly' ? { minHeight: 82 } : { minHeight: 60 }}>
                <View style={[styles.radio, on && { borderColor: ink.teal }]}>{on ? <View style={styles.radioDot} /> : null}</View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={text.bodyStrong}>{p.title}</Text>
                    {p.id === 'yearly' ? (
                      <View style={styles.badge}>
                        <Text style={{ fontFamily: font.black, fontSize: 11, color: '#1F3A0A', letterSpacing: 0.4 }}>SAVE 50%</Text>
                      </View>
                    ) : null}
                  </View>
                  {p.id === 'yearly' ? (
                    <Text style={[text.small, num]}>
                      {p.trialDays} days free first · {formatMoney(p.priceMinor / 12, p.currency)}/mo
                    </Text>
                  ) : null}
                </View>
                <Text style={[text.heading, num]}>
                  {p.priceString}
                  <Text style={text.small}>{p.period === 'once' ? ' once' : p.period === 'year' ? '/yr' : '/mo'}</Text>
                </Text>
              </Option>
            );
          })}
          <Text style={text.small}>Lifetime: everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month.</Text>
        </View>

        {trial ? (
          <View style={styles.card}>
            <Text style={[text.heading, { marginBottom: 12 }]}>How your free week works</Text>
            <Timeline
              rows={[
                { emoji: '🔓', hot: true, when: `Today · ${weekdayDate(today)}`, title: 'Pro unlocks. $0 today.', body: 'Every subscription gets reminders.' },
                remindersOn
                  ? { emoji: '🔔', when: weekdayDate(remindDay), title: 'I remind you', body: '“Ditch Pro trial” is already in your list.' }
                  : { emoji: '🔕', when: weekdayDate(remindDay), title: 'Turn on reminders so I can warn you', body: 'They’re off right now.', action: { label: 'Open Settings', onPress: () => Linking.openSettings() } },
                { emoji: '💳', when: weekdayDate(chargeDay), title: `${yearly.priceString} charged`, body: 'Unless you cancel before.' },
              ]}
            />
            <Text style={[text.small, { marginTop: 12 }]}>Cancel at least 24 hours before, in iPhone Settings → Apple ID → Subscriptions.</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
          <Text style={[text.small, { textDecorationLine: 'underline' }]}>Terms</Text>
          <Text style={[text.small, { textDecorationLine: 'underline' }]}>Privacy</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Btn label={cta} onPress={buy} />
        <Text style={[text.label, num, { textAlign: 'center' }]}>{under}</Text>
        <Btn label={n > 3 ? 'Continue free: 3 reminders' : 'Continue free'} kind="secondary" onPress={leaveFree} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, height: 52 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  restore: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  logoRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
  perkDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: ink.teal, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: ink.lineDark, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: ink.teal },
  badge: { backgroundColor: ink.lime, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  card: { borderWidth: 2, borderBottomWidth: 4, borderColor: ink.line, borderRadius: 20, padding: 16 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, gap: 8, backgroundColor: ink.bg, borderTopWidth: 2, borderTopColor: ink.line },
});
