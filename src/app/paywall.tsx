// 6 · Paywall. Honest by design (docs/design/CONVERSION-RESEARCH.md §2.6):
// close + restore visible from the first frame, a real "Continue free"
// button, the price at least as visible as the trial, and a timeline with
// real dates. No timers, no strike-throughs, no trial toggle.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BellIcon, CardIcon, CloseIcon, CloudIcon, ImportIcon, LockOpenIcon, WidgetIcon } from '@/components/icons';
import { TrialTimeline } from '@/components/onboarding';
import { Button, haptic, Screen, ServiceTile, Squish, T } from '@/components/ui';
import { addDays, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { PLANS, PURCHASES_LIVE, type PlanId } from '@/services/purchases';
import { byYearlyDesc, usePickedList } from '@/state/onboarding';
import { radius, space, tabular, usePalette } from '@/theme/tokens';

const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

export default function Paywall() {
  const p = usePalette();
  const insets = useSafeAreaInsets();
  const list = usePickedList();
  const n = list.length;
  const [planId, setPlanId] = useState<PlanId>('yearly');
  const [remindersOn, setRemindersOn] = useState(true);
  const plan = PLANS.find((x) => x.id === planId)!;
  const yearly = PLANS.find((x) => x.id === 'yearly')!;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then((r) => setRemindersOn(r.granted))
      .catch(() => setRemindersOn(false));
  }, []);

  const today = toDateOnly();
  const remindDay = addDays(today, yearly.trialDays - 2);
  const chargeDay = addDays(today, yearly.trialDays);
  const sorted = [...list].sort(byYearlyDesc);

  const leaveFree = () => {
    if (n > 3) router.replace('/onboarding/pick');
    else router.replace('/(tabs)');
  };

  const buy = () => {
    if (!PURCHASES_LIVE) {
      Alert.alert('Not yet', 'Purchases arrive in the next build. For now, carry on free.', [{ text: 'OK', onPress: leaveFree }]);
    }
  };

  const trial = plan.id === 'yearly' && plan.trialDays > 0;
  const cta = trial
    ? `Start ${plan.trialDays}-day free trial`
    : plan.id === 'yearly'
      ? `Subscribe for ${plan.priceString} a year`
      : plan.id === 'monthly'
        ? `Subscribe for ${plan.priceString} a month`
        : `Buy lifetime for ${plan.priceString}`;
  const under1 = trial
    ? `Then ${plan.priceString} a year from ${weekdayDate(chargeDay)}.`
    : plan.id === 'lifetime'
      ? 'One payment. No renewal.'
      : `Renews ${plan.period === 'year' ? 'yearly' : 'monthly'}. Cancel anytime.`;
  const under2 = trial && remindersOn ? `No need to cancel today. We'll remind you ${weekdayDate(remindDay)}.` : null;

  return (
    <Screen edges={['top']}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={6}
          onPress={leaveFree}
          style={[styles.close, { backgroundColor: p.surfaceSunken }]}
        >
          <CloseIcon color={p.text} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          hitSlop={6}
          onPress={() => Alert.alert('Restore', 'Nothing to restore yet. Purchases arrive in the next build.')}
          style={styles.restore}
        >
          <T v="subhead" tone="secondary" style={{ fontWeight: '500' }}>
            Restore
          </T>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 220 + insets.bottom }]}>
        <Animated.View entering={FadeInDown.duration(320).easing(easeOut)} style={{ gap: space.md }}>
          <T v="title1" accessibilityRole="header">
            {n > 3 ? `Get a heads-up before all ${n} renewals.` : 'Add the rest from a screenshot.'}
          </T>

          {n > 3 ? (
            <View
              style={styles.logoRow}
              accessible
              accessibilityLabel={`Free reminds you about ${sorted
                .slice(0, 3)
                .map((x) => x.name)
                .join(', ')}. Pro adds ${sorted
                .slice(3)
                .map((x) => x.name)
                .join(', ')}.`}
            >
              {sorted.slice(0, 8).map((x, i) => (
                <View key={x.id} style={{ alignItems: 'center', gap: 4 }}>
                  <ServiceTile color={x.color} ink={x.ink} mono={x.mono} size={34} />
                  <T v="caption" style={{ color: i < 3 ? p.textTertiary : p.primary, fontWeight: '700' }}>
                    {i < 3 ? 'Free' : 'Pro'}
                  </T>
                </View>
              ))}
              {n > 8 ? (
                <T v="footnote" tone="tertiary" style={{ alignSelf: 'center', marginBottom: 18 }}>
                  +{n - 8}
                </T>
              ) : null}
            </View>
          ) : (
            <T v="body" tone="secondary">
              Free reminds you about 3. Pro covers every one, and fills your list from a screenshot.
            </T>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(320).easing(easeOut)} style={styles.benefits}>
          <Benefit icon={<BellIcon size={18} color={p.text} />} text="Reminders on every sub, your timing" />
          <Benefit icon={<ImportIcon size={18} color={p.text} />} text="Import from a screenshot or statement" />
          <Benefit icon={<WidgetIcon size={18} color={p.text} />} text="Home-screen widget" />
          <Benefit icon={<CloudIcon size={18} color={p.text} />} text="Backup to your own iCloud" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(320).easing(easeOut)} style={{ gap: space.sm }} accessibilityRole="radiogroup">
          {PLANS.map((pl) => (
            <PlanRow key={pl.id} planId={pl.id} selected={pl.id === planId} onSelect={() => setPlanId(pl.id)} />
          ))}
          <T v="footnote" tone={planId === 'lifetime' ? 'secondary' : 'tertiary'}>
            Lifetime: everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every
            month.
          </T>
        </Animated.View>

        {trial ? (
          <Animated.View entering={FadeIn.duration(220)} style={[styles.timelineCard, { backgroundColor: p.surface }]}>
            <T v="headline" style={{ marginBottom: space.md }}>
              How your free week works
            </T>
            <TrialTimeline
              rows={[
                {
                  icon: <LockOpenIcon color={p.onPrimary} />,
                  when: `Today · ${weekdayDate(today)}`,
                  title: 'Pro unlocks. $0 today.',
                  body: 'Every subscription gets reminders.',
                },
                remindersOn
                  ? {
                      icon: <BellIcon size={18} color={p.text} />,
                      when: weekdayDate(remindDay),
                      title: 'We remind you',
                      body: '“Ditch Pro trial” is already in your list, like any other sub.',
                    }
                  : {
                      icon: <BellIcon size={18} color={p.text} />,
                      when: weekdayDate(remindDay),
                      title: 'Turn on reminders so we can warn you',
                      body: 'They’re off right now. The trial still shows in your list.',
                      action: { label: 'Open Settings', onPress: () => Linking.openSettings() },
                    },
                {
                  icon: <CardIcon color={p.text} />,
                  when: weekdayDate(chargeDay),
                  title: `${yearly.priceString} charged`,
                  body: 'Unless you cancel before.',
                },
              ]}
            />
            <T v="caption" tone="tertiary" style={{ marginTop: space.md }}>
              Cancel at least 24 hours before to avoid the charge, in iPhone Settings → Apple ID → Subscriptions.
            </T>
          </Animated.View>
        ) : null}

        <View style={styles.links}>
          <LinkText label="Terms" onPress={() => {}} />
          <T v="caption" tone="tertiary">
            ·
          </T>
          <LinkText label="Privacy" onPress={() => {}} />
        </View>
      </ScrollView>

      {/* pinned purchase area */}
      <View
        style={[
          styles.footer,
          { backgroundColor: p.scrim, borderTopColor: p.separator, paddingBottom: Math.max(insets.bottom, space.md) },
        ]}
      >
        <Button label={cta} onPress={buy} />
        <View accessible style={{ gap: 2 }}>
          <T v="subhead" style={[tabular, styles.center]}>
            {under1}
          </T>
          {under2 ? (
            <T v="subhead" tone="secondary" style={[tabular, styles.center]}>
              {under2}
            </T>
          ) : null}
        </View>
        <Button
          label={n > 3 ? 'Continue free: reminders for 3' : 'Continue free'}
          kind="secondary"
          onPress={leaveFree}
          style={{ minHeight: 48 }}
        />
      </View>
    </Screen>
  );
}

function PlanRow({ planId, selected, onSelect }: { planId: PlanId; selected: boolean; onSelect: () => void }) {
  const p = usePalette();
  const pl = PLANS.find((x) => x.id === planId)!;
  const big = pl.id === 'yearly';
  const label = `${pl.title}, ${pl.priceString}${pl.period === 'once' ? ' once' : ` a ${pl.period}`}${pl.trialDays ? `, ${pl.trialDays} days free first` : ''}`;
  return (
    <Squish
      scaleTo={0.985}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.tap();
        onSelect();
      }}
      style={[
        styles.plan,
        big ? styles.planBig : styles.planSmall,
        { backgroundColor: p.surface, borderColor: selected ? p.selected : p.separator, borderWidth: selected ? 2 : 1 },
      ]}
    >
      <View style={[styles.radio, { borderColor: selected ? p.selected : p.separator }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: p.selected }]} /> : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
          <T v="headline">{pl.title}</T>
          {big ? (
            <View style={[styles.pill, { backgroundColor: p.accentSoft }]}>
              <T v="caption" style={{ color: p.text, fontWeight: '700' }}>
                Save 50%
              </T>
            </View>
          ) : null}
        </View>
        {big ? (
          <T v="footnote" tone="secondary" style={tabular}>
            {pl.trialDays} days free first · {formatMoney(pl.priceMinor / 12, pl.currency)}/mo
          </T>
        ) : null}
      </View>
      <T v="headline" style={[tabular, { textAlign: 'right' }]}>
        {pl.priceString}
        <T v="footnote" tone="secondary">
          {pl.period === 'once' ? ' once' : pl.period === 'year' ? '/yr' : '/mo'}
        </T>
      </T>
    </Squish>
  );
}

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  const p = usePalette();
  return (
    <View style={styles.benefit}>
      <View style={[styles.benefitIcon, { backgroundColor: p.surface }]}>{icon}</View>
      <T v="callout" style={{ flex: 1 }}>
        {text}
      </T>
    </View>
  );
}

function LinkText({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={12} style={{ minHeight: 28, justifyContent: 'center' }}>
      <T v="caption" tone="tertiary" style={{ textDecorationLine: 'underline' }}>
        {label}
      </T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingTop: space.xs,
  },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  restore: { minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: space.sm },
  content: { paddingHorizontal: space.xl, paddingTop: space.xs, gap: space.lg },
  logoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  benefits: { gap: space.sm },
  benefit: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  benefitIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderRadius: radius.lg },
  planBig: { padding: space.lg, minHeight: 78 },
  planSmall: { paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 56 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  timelineCard: { borderRadius: radius.xl, padding: space.lg },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  center: { textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: space.sm },
});
