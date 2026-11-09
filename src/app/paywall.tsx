// 06 · Paywall. Honest by design (CLAUDE.md rule 4):
// × from the first frame, "Continue free" is a real choice, Restore,
// a trial timeline with real dates, no weekly plan, no countdowns, no fake
// discounts, no trial toggle. The billed price is always the biggest price.
// The first frame shows ×, the plans, the main button and the free option.

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, useWindowDimensions, View } from 'react-native';

import { headsUpDates } from '@/domain/charges';
import { addDays, shortDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { formatWholeMoney } from '@/domain/money';
import { perMonthFromYearly, yearlyBadge } from '@/domain/pricing';
import { PURCHASES_LIVE, billedLabel, planById, purchase, restorePurchases, type PlanId } from '@/services/purchases';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import {
  Button,
  Card,
  Check,
  Close,
  Duck,
  DuckIcon,
  HeadsUpTimeline,
  IconButton,
  PlanCard,
  ProLockup,
  Screen,
  Txt,
  brand,
  haptic,
  useInsets,
  useIsDark,
  usePalette,
} from '@/ui/sunflower';

/** A plain message box that also works in the web preview. */
function notice(title: string, message: string, buttons: { text: string; onPress?: () => void }[] = [{ text: 'OK' }]) {
  if (Platform.OS === 'web') {
    if (buttons.length > 1) {
      // Last button is the "yes" action, first is the plain OK.
      if (window.confirm(`${title}\n\n${message}`)) buttons[buttons.length - 1].onPress?.();
      else buttons[0].onPress?.();
    } else {
      window.alert(`${title}\n\n${message}`);
      buttons[0].onPress?.();
    }
    return;
  }
  Alert.alert(title, message, buttons);
}

function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} hitSlop={{ top: 14, bottom: 14, left: 6, right: 6 }}>
      <Txt v="fine" tone="fg2" style={{ textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export default function Paywall() {
  const p = usePalette();
  const dark = useIsDark();
  const insets = useInsets();
  const { height } = useWindowDimensions();
  const compact = height < 800;
  const { setPro } = useOnboarding();
  const n = usePickedList().length;
  const many = n > 3;
  const [planId, setPlanId] = useState<PlanId>('yearly');
  const [cardH, setCardH] = useState(0);

  const yearly = planById('yearly');
  const monthly = planById('monthly');
  const lifetime = planById('lifetime');
  const plan = planById(planId);
  const today = toDateOnly();
  const charge = addDays(today, yearly.trialDays);
  const [h1, h2] = headsUpDates(charge, today);

  const leaveFree = () => router.replace(many ? '/onboarding/which3' : '/onboarding/done');
  const select = (id: PlanId) => {
    if (id !== planId) haptic.select();
    setPlanId(id);
  };

  const buy = async () => {
    haptic.medium();
    const r = await purchase(planId);
    if (r.status === 'purchased') {
      setPro(planId);
      router.replace('/onboarding/done');
      return;
    }
    if (!PURCHASES_LIVE) {
      const buttons: { text: string; onPress?: () => void }[] = [{ text: 'Continue free', onPress: leaveFree }];
      // Test builds only: see the Pro version of the next screen. Never in the App Store build.
      if (__DEV__)
        buttons.push({
          text: 'Preview Pro',
          onPress: () => {
            setPro(planId);
            router.replace('/onboarding/done');
          },
        });
      notice('Not switched on yet', 'Purchases arrive in the next build. Nothing was charged.', buttons);
    }
  };

  const restore = async () => {
    const r = await restorePurchases();
    notice(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };

  const cta = planId === 'yearly' ? `Start ${yearly.trialDays}-day free trial` : `Get Pro for ${billedLabel(plan)}`;
  const fine =
    planId === 'yearly'
      ? `${formatWholeMoney(0, yearly.currency)} today, then ${billedLabel(yearly)} from ${shortDate(charge)}. Cancel anytime.`
      : planId === 'monthly'
        ? `${monthly.priceString} today, then every month. Cancel anytime.`
        : `${lifetime.priceString} once. No subscription.`;
  const perMonth = perMonthFromYearly({ amountMinor: yearly.priceMinor, currency: yearly.currency });
  const badge = yearlyBadge({ amountMinor: monthly.priceMinor, currency: monthly.currency }, { amountMinor: yearly.priceMinor, currency: yearly.currency });

  const band = dark ? null : (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + (compact ? 150 : 196), backgroundColor: brand.sunflower }} />
  );

  return (
    <Screen
      scroll
      background={band}
      topPad={-4}
      footer={
        <>
          <Button label={cta} onPress={buy} />
          <Button kind="secondary" label={many ? 'Continue free: reminders for 3' : 'Continue free'} onPress={leaveFree} style={{ marginTop: 4 }} />
          <Txt v="fine" tone="fg2" center num style={{ marginTop: 6 }}>
            {fine}
          </Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Link label="Restore" onPress={restore} />
            <Txt v="fine" tone="fg2">·</Txt>
            <Link label="Terms" onPress={() => Linking.openURL('https://ditchsubs.app/terms')} />
            <Txt v="fine" tone="fg2">·</Txt>
            <Link label="Privacy" onPress={() => Linking.openURL('https://ditchsubs.app/privacy')} />
          </View>
        </>
      }
    >
      <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ProLockup size={24} />
        <IconButton label="Close, continue free" onPress={leaveFree} size={32} bg={p.iconBtn} style={{ marginRight: -6 }}>
          <Close color={p.fg} />
        </IconButton>
      </View>
      <Txt v="displayM" accessibilityRole="header" style={[{ marginTop: 4, maxWidth: 330 }, compact && { fontSize: 26, lineHeight: 28 }]}>
        {many ? `Get a heads-up before all ${n} renewals.` : 'Get a heads-up before every renewal.'}
      </Txt>

      <View style={{ marginTop: compact ? 20 : 28 }}>
        {compact ? null : <Duck width={88} right={18} sink={0} />}
        <Card style={[{ padding: 14 }, cardH ? { minHeight: cardH } : null]}>
          <View
            onLayout={(e) => {
              if (planId === 'yearly' && !cardH) setCardH(e.nativeEvent.layout.height + 28);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DuckIcon size={40} />
              <View style={{ flex: 1 }}>
                <ProLockup size={16} suffix={planId === 'yearly' ? 'trial' : planId === 'lifetime' ? 'for life' : undefined} />
                <Txt v="sub" tone="mute" style={{ marginTop: 2 }}>
                  {planId === 'yearly'
                    ? 'We’ll remind you before we charge, too.'
                    : planId === 'monthly'
                      ? 'Billed every month. Cancel anytime in iPhone Settings.'
                      : 'Everything in Pro, forever. One payment.'}
                </Txt>
              </View>
            </View>
            {planId === 'yearly' ? (
              <View style={{ marginTop: 14 }}>
                <HeadsUpTimeline
                  small
                  behind={p.card}
                  stops={[
                    { kind: 'done', title: 'Today', sub: formatWholeMoney(0, yearly.currency) },
                    { kind: 'bellSun', title: weekdayDate(h1), sub: '9 AM heads-up' },
                    { kind: 'bellSun', title: weekdayDate(h2), sub: '9 AM heads-up' },
                    { kind: 'end', title: weekdayDate(charge), sub: yearly.priceString },
                  ]}
                />
              </View>
            ) : planId === 'lifetime' ? (
              <Txt v="sub" tone="mute" style={{ marginTop: 12 }}>
                Bank sync, if we add it, is a separate plan because it costs us money every month.
              </Txt>
            ) : (
              <Txt v="sub" tone="mute" style={{ marginTop: 12 }}>
                No free trial on monthly. You pay {monthly.priceString} today.
              </Txt>
            )}
          </View>
        </Card>
      </View>

      {compact ? null : (
        <View style={{ marginTop: 14, marginHorizontal: 2, gap: 6 }}>
          {[many ? `Heads-ups on all ${n}, with your own timing` : 'Heads-ups on everything, with your own timing', 'Import, widget and iCloud backup'].map((b) => (
            <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Check color={dark ? brand.sunflower : p.fg} size={17} />
              <Txt v="body" style={{ fontFamily: 'Inter_500Medium', flex: 1 }}>
                {b}
              </Txt>
            </View>
          ))}
        </View>
      )}

      <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: 8, marginTop: compact ? 22 : 24 }}>
        <PlanCard
          title="Yearly"
          tag={`${yearly.trialDays} days free`}
          badge={badge}
          price={billedLabel(yearly)}
          sub={`${perMonth} a month`}
          selected={planId === 'yearly'}
          onPress={() => select('yearly')}
          a11y={`Yearly, ${yearly.priceString} a year, ${perMonth} a month, ${yearly.trialDays} days free, ${badge}`}
        />
        <PlanCard
          title="Monthly"
          price={billedLabel(monthly)}
          sub="No free trial"
          selected={planId === 'monthly'}
          onPress={() => select('monthly')}
          a11y={`Monthly, ${monthly.priceString} a month, no free trial`}
        />
        <PlanCard
          title="Lifetime"
          price={lifetime.priceString}
          sub="Pay once"
          selected={planId === 'lifetime'}
          onPress={() => select('lifetime')}
          a11y={`Lifetime, ${lifetime.priceString}, pay once`}
        />
      </View>
      <View style={{ height: 6 }} />
    </Screen>
  );
}
