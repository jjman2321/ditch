// 6 · Paywall (design/v12 render 06, v10 structure). Honest by design
// (CLAUDE.md rule 4): the × is visible from the first frame and is the way
// to the free app (DECISIONS #29: no "Continue free" button); Restore;
// the trial line has real dates; no countdowns, no fake discounts, no trial
// toggle. The billed price is always the biggest price.
// Plans (DECISIONS #66, owner Nov 18): Yearly with 7 days free (pre-selected,
// "$0.97 a week", saving vs Weekly), Lifetime ("Pay once. No subscription.")
// for people tired of subscriptions, Weekly with no trial. No monthly.
// Layout (design/v17 A, owner Nov 18): like the top paywalls on Mobbin (Cal AI, Buddy,
// ABY Journal), the plans, button and links are pinned to the bottom and look the same
// on every phone; the top shows the reminders Pro sends about their own subscriptions.
// A taller phone shows more of them and the last one slides under the plans: never a gap.

import { router } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Linking, Platform, Pressable, View } from 'react-native';

import { DEV_TOOLS } from '@/dev/flags';
import { stillUsingIt } from '@/domain/copy';
import { addDays, shortDate, weekdayName, weekdayShort, type DateOnly } from '@/domain/dates';
import { formatWholeMoney } from '@/domain/money';
import { perWeekFromYearly, yearlyBadgeVsWeekly } from '@/domain/pricing';
import { chargeOfSub, listedUserSubs } from '@/domain/subs';
import { OnbRoot } from '@/onboarding/Parts';
import { PURCHASES_LIVE, billedLabel, planById, purchase, restorePurchases, type PlanId } from '@/services/purchases';
import { chargeOf, onboardingToday, useMoney, useOnboarding, usePickedList } from '@/state/onboarding';
import { useApp, useAppMoney } from '@/state/app';
import { Button, Close, Duck, F, IconButton, NotificationPreview, PlanCard, ProLockup, Txt, brand, haptic, useFrame, useIsDark, usePalette } from '@/ui/sunflower';

const NB = ' ';

/** A plain message box that also works in the web preview. */
function notice(title: string, message: string, buttons: { text: string; onPress?: () => void }[] = [{ text: 'OK' }]) {
  if (Platform.OS === 'web') {
    if (buttons.length > 1) {
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

type Mine = {
  name: string;
  category?: string;
  date: DateOnly | null;
  price: string | null;
};

/** The reminders Pro would send about their own subscriptions (or examples when they have fewer than 2). */
function reminderNotes(mine: Mine[]): { time: string; message: string }[] {
  const dated = mine.filter((x) => x.date).sort((a, b) => (a.date! < b.date! ? -1 : 1));
  const rest = mine.filter((x) => !x.date);
  const list = [...dated, ...rest].slice(0, 8);
  if (list.length < 2) {
    return [
      {
        time: 'Sat 9 AM',
        message: 'Netflix renews Tuesday. $17.99. Still watching?',
      },
      {
        time: 'Mon 9 AM',
        message: 'Your ChatGPT trial ends Friday. Then $20.00 a month.',
      },
      {
        time: 'Wed 9 AM',
        message: 'Spotify went up to $12.99. You were paying $11.99.',
      },
      { time: 'Fri 9 AM', message: 'Disney+ renews tomorrow. $15.99.' },
    ];
  }
  return list.map((x, i) => {
    if (!x.date)
      return {
        time: '9 AM',
        message: `${x.name} renews soon. You’ll hear from us 3 days before.`,
      };
    const price = x.price ? ` ${x.price}.` : '';
    const ask = i === 0 ? ` ${stillUsingIt(x.category)}` : '';
    return {
      time: `${weekdayShort(addDays(x.date, -3))} 9 AM`,
      message: `${x.name} renews ${weekdayName(x.date)}.${price}${ask}`,
    };
  });
}

function FootLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        height: 44,
        minWidth: 44,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Txt v="sub" tone="fg2" style={{ textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export default function Paywall() {
  const dark = useIsDark();
  const f = useFrame({ maxContent: 440, colH: 740, extraBottom: 0 });
  const { setPro: setOnboardingPro } = useOnboarding();
  const app = useApp();
  // After onboarding (Settings, a PRO tag, the editor) vs. during onboarding. Decided by
  // whether onboarding is done, never by the link, so no link can rerun onboarding.
  const inApp = app.settings.onboardingDone;
  const pickedList = usePickedList();
  const n = inApp ? listedUserSubs(app.subs).length : pickedList.length;
  const many = n > 3;
  const today = onboardingToday();
  const obMoney = useMoney();
  const appMoney = useAppMoney();
  // Their own subscriptions, soonest charge first: the reminders Pro would send.
  const theirs: Mine[] = inApp
    ? listedUserSubs(app.subs).map((x) => ({
        name: x.name,
        category: x.category ?? undefined,
        date: chargeOfSub(x, today),
        price: x.amountMinor !== null && x.currency ? appMoney(x.amountMinor, x.currency) : null,
      }))
    : pickedList.map((x) => ({
        name: x.name,
        category: x.category,
        date: chargeOf(x, today),
        price: x.amountMinor !== null && x.currency ? obMoney(x.amountMinor, x.currency) : null,
      }));
  const notes = reminderNotes(theirs);
  const [planId, setPlanId] = useState<PlanId>('yearly');

  const yearly = planById('yearly');
  const weekly = planById('weekly');
  const lifetime = planById('lifetime');
  const charge = addDays(today, yearly.trialDays);

  // × is the free path: no purchase, reminders on the 3 biggest (picked on You're set).
  const leaveFree = () => (inApp ? router.back() : router.replace('/onboarding/done'));
  const activate = async (id: PlanId) => {
    if (inApp) {
      await app.setPro(id, { startTrial: id === 'yearly' });
      router.back();
    } else {
      setOnboardingPro(id);
      router.replace('/onboarding/done');
    }
  };
  const select = (id: PlanId) => {
    if (id !== planId) haptic.select();
    setPlanId(id);
  };
  const buy = async () => {
    haptic.medium();
    const r = await purchase(planId);
    if (r.status === 'purchased') {
      await activate(planId);
      return;
    }
    if (!PURCHASES_LIVE) {
      const buttons: { text: string; onPress?: () => void }[] = [{ text: 'OK' }];
      // Test builds only: see the Pro version of the next screen. Never in the App Store build.
      if (DEV_TOOLS)
        buttons.push({
          text: 'Preview Pro',
          onPress: () => void activate(planId),
        });
      notice('Not switched on yet', 'Purchases arrive in the next build. Nothing was charged.', buttons);
    }
  };
  const restore = async () => {
    const r = await restorePurchases();
    notice(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };

  const cta = {
    yearly: `Start ${yearly.trialDays}-day free trial`,
    weekly: `Subscribe for ${weekly.priceString} a week`,
    lifetime: `Pay ${lifetime.priceString} once`,
  }[planId];
  const perWeek = perWeekFromYearly({
    amountMinor: yearly.priceMinor,
    currency: yearly.currency,
  });
  // A true comparison with the Weekly plan we sell: $6.99 × 52 = $363.48 vs $49.99 (rounded down).
  const badge = yearlyBadgeVsWeekly({ amountMinor: weekly.priceMinor, currency: weekly.currency }, { amountMinor: yearly.priceMinor, currency: yearly.currency }).toUpperCase();
  const cardH = f.tiny ? 44 : f.small ? 52 : 60;

  // Phones: a short title so the reminders get the room. iPad wraps by itself.
  const head = many ? `Get a reminder before all ${n}${NB}renewals.` : `Get a reminder before every${NB}renewal.`;
  const ink = dark ? '#F6F0E3' : brand.ink;
  const top = dark ? brand.night : brand.sunflower;
  const panel = dark ? '#1A1916' : brand.cream;

  return (
    <OnbRoot surface="sun">
      <View style={{ flex: 1, backgroundColor: top }}>
        {/* Top: grows with the phone. Their reminders fill it; the last one slides under the plans. */}
        <View
          style={{
            flex: 1,
            minHeight: 0,
            paddingTop: f.top,
            paddingHorizontal: f.edge,
          }}
        >
          <View
            style={{
              height: f.tiny ? 40 : 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ProLockup size={f.small ? 20 : 22} color={ink} />
            <IconButton label="Close, continue free" onPress={leaveFree} size={32} bg={dark ? '#3A3424' : 'rgba(22,20,15,0.12)'} style={{ marginRight: -6 }}>
              <Close color={ink} />
            </IconButton>
          </View>
          <Txt
            v="title"
            color={dark ? brand.sunflower : ink}
            accessibilityRole="header"
            style={[{ marginTop: f.tiny ? 2 : 6 }, f.tiny ? { fontSize: 22, lineHeight: 27 } : f.small ? { fontSize: 26, lineHeight: 31 } : null]}
          >
            {head}
          </Txt>
          <View
            style={{
              flex: 1,
              minHeight: 0,
              marginTop: f.small ? 10 : 16,
              marginBottom: -28,
              overflow: 'hidden',
            }}
          >
            <View style={{ gap: 8 }}>
              {notes.map((x, i) => (
                <NotificationPreview key={i} time={x.time} message={x.message} />
              ))}
            </View>
            <LinearGradient
              pointerEvents="none"
              colors={[top + '00', top]}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 72,
              }}
            />
            {f.tiny ? null : <Duck width={f.small ? 64 : 84} right={8} bottom={20} />}
          </View>
        </View>

        {/* Bottom: pinned, the same on every phone. */}
        <View
          style={{
            backgroundColor: panel,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: f.tiny ? 16 : 22,
            paddingHorizontal: f.edge,
            paddingBottom: f.tiny ? 4 : f.bottom,
            shadowColor: '#3A2A00',
            shadowOpacity: dark ? 0 : 0.12,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -6 },
          }}
        >
          <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: f.tiny ? 6 : 8 }}>
            <PlanCard
              title="Yearly"
              // 320pt wide: the tag would squeeze "Yearly" to "Y."; the button and the line under it say the trial.
              tag={f.tiny ? undefined : `${yearly.trialDays} days free`}
              badge={badge}
              price={billedLabel(yearly)}
              sub={`${perWeek} a week`}
              selected={planId === 'yearly'}
              onPress={() => select('yearly')}
              height={cardH}
              a11y={`Yearly, ${yearly.priceString} a year, ${perWeek} a week, ${yearly.trialDays} days free, ${badge.toLowerCase()}`}
            />
            <PlanCard
              title="Lifetime"
              note={f.tiny ? undefined : 'Pay once. No subscription.'}
              price={lifetime.priceString}
              sub="one time"
              selected={planId === 'lifetime'}
              onPress={() => select('lifetime')}
              height={cardH}
              a11y={`Lifetime, ${lifetime.priceString} one time. Pay once, no subscription.`}
            />
            <PlanCard
              title="Weekly"
              price={billedLabel(weekly)}
              sub="No free trial"
              selected={planId === 'weekly'}
              onPress={() => select('weekly')}
              height={cardH}
              a11y={`Weekly, ${weekly.priceString} a week, no free trial`}
            />
          </View>
          <View style={{ height: f.tiny ? 10 : 16 }} />
          <Button label={cta} onPress={buy} height={f.tiny ? 44 : f.small ? 48 : 56} />
          {/* A fixed slot, so the button never moves when the plan changes. Price and the real start date by the
              button (App Review); no reminder text (owner, Nov 10). */}
          <View
            style={{
              height: f.tiny ? 38 : 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: planId === 'yearly' ? 0 : 4,
            }}
          >
            <Txt v="fine" tone="fg2" num center accessibilityLiveRegion="polite">
              {planId === 'yearly' ? (
                <>
                  <Txt v="fine" num style={{ fontFamily: F.semi }}>
                    {`${formatWholeMoney(0, yearly.currency)} today`}
                  </Txt>
                  {` · ${yearly.priceString}/yr from ${shortDate(charge)}\nRenews yearly · Cancel${NB}anytime`}
                </>
              ) : planId === 'weekly' ? (
                `${weekly.priceString} today, then every week. Cancel${NB}anytime.`
              ) : (
                `${lifetime.priceString} once. Pro for good, nothing${NB}renews.`
              )}
            </Txt>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <FootLink label="Restore" onPress={restore} />
            <Txt v="sub" tone="fg2" importantForAccessibility="no">
              ·
            </Txt>
            <FootLink label="Terms" onPress={() => Linking.openURL('https://ditchsubs.app/terms')} />
            <Txt v="sub" tone="fg2" importantForAccessibility="no">
              ·
            </Txt>
            <FootLink label="Privacy" onPress={() => Linking.openURL('https://ditchsubs.app/privacy')} />
          </View>
        </View>
      </View>
    </OnbRoot>
  );
}
