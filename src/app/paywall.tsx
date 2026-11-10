// 6 · Paywall (design/v12 render 06, v10 structure). Honest by design
// (CLAUDE.md rule 4): the × is visible from the first frame and is the way
// to the free app (DECISIONS #29: no "Continue free" button); Restore;
// the trial line has real dates; no weekly plan, no countdowns, no fake
// discounts, no trial toggle. The billed price is always the biggest price.
// Fits without scrolling on iPhone 12 (390×844) and SE (375×667).

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Text, View } from 'react-native';

import { DEV_TOOLS } from '@/dev/flags';
import { addDays, weekdayDate } from '@/domain/dates';
import { balanceLines } from '@/domain/copy';
import { formatWholeMoney } from '@/domain/money';
import { perMonthFromYearly, yearlyBadge } from '@/domain/pricing';
import { listedUserSubs } from '@/domain/subs';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { PURCHASES_LIVE, billedLabel, planById, purchase, restorePurchases, type PlanId } from '@/services/purchases';
import { onboardingToday, useOnboarding, usePickedList } from '@/state/onboarding';
import { useApp } from '@/state/app';
import { Button, Card, Check, Close, Duck, F, IconButton, PlanCard, ProLockup, Txt, brand, haptic, useFrame, useIsDark, usePalette } from '@/ui/sunflower';

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

type Cell = 'yes' | 'no' | string;
type Row = { label: string; free: Cell; pro: Cell };

// DECISIONS #26, #27, #30. Only Pro features that work at launch.
const ROWS: Row[] = [
  { label: 'Subscriptions with reminders', free: '3', pro: 'Unlimited' },
  { label: 'Pick reminder times', free: 'no', pro: 'yes' },
  { label: 'Nudge if you miss one', free: 'no', pro: 'yes' },
  { label: `Lock${NB}Screen widget`, free: 'no', pro: 'yes' },
  // The first import (onboarding) is free, so "anytime" keeps this row true (DECISIONS #34).
  { label: 'Import anytime', free: 'no', pro: 'yes' },
];

const CELL_TEXT = { fontFamily: F.semi, fontSize: 14, lineHeight: 20 } as const;
const LABEL_TEXT = { fontFamily: F.medium, fontSize: 14, letterSpacing: -0.1 } as const;

/** Free vs Pro. Fixed columns: Free 56pt; Pro fits "Unlimited" with 12pt either side. */
function Compare({ rows, width, overlap }: { rows: Row[]; width: number; overlap: number }) {
  const p = usePalette();
  const dark = p.dark;
  const ink = dark ? '#F6F0E3' : brand.ink;
  const [unlimitedW, setUnlimitedW] = useState(62);
  const [labelW, setLabelW] = useState<Record<string, number>>({});
  const colF = 56;
  const colP = Math.ceil(unlimitedW) + 24;
  const room = width - 16 - 8 - colF - colP;

  const cell = (v: Cell, pro: boolean) => {
    const c = pro && dark ? brand.sunflower : ink;
    if (v === 'yes') return <Check color={c} size={18} />;
    if (v === 'no') return <View accessibilityLabel="Not included" style={{ width: 12, height: 2.2, borderRadius: 1.1, backgroundColor: dark ? '#8E877A' : '#8C8576' }} />;
    return (
      <Txt v="label" num color={c} style={CELL_TEXT} maxFontSizeMultiplier={1.3}>
        {v}
      </Txt>
    );
  };
  const spoken = (v: Cell) => (v === 'yes' ? 'included' : v === 'no' ? 'not included' : v);

  return (
    <Card style={{ marginTop: -overlap, overflow: 'hidden', zIndex: 2 }}>
      {/* Hidden measurements: "Unlimited" sets the Pro column; labels wrap only when they must. */}
      <View pointerEvents="none" style={{ position: 'absolute', opacity: 0, left: 0, top: 0, width: 2000, alignItems: 'flex-start' }} importantForAccessibility="no-hide-descendants">
        <Text style={CELL_TEXT} onLayout={(e) => setUnlimitedW(e.nativeEvent.layout.width)} maxFontSizeMultiplier={1.3}>
          Unlimited
        </Text>
        {rows.map((r) => (
          <Text key={r.label} style={LABEL_TEXT} maxFontSizeMultiplier={1.4} onLayout={(e) => setLabelW((m) => (m[r.label] === e.nativeEvent.layout.width ? m : { ...m, [r.label]: e.nativeEvent.layout.width }))}>
            {r.label}
          </Text>
        ))}
      </View>
      <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: colP, backgroundColor: dark ? '#332B12' : '#FFF1BC' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 24, paddingTop: 4 }} importantForAccessibility="no-hide-descendants">
        <View style={{ flex: 1 }} />
        <Txt v="eyebrow" tone="mute" center style={{ width: colF }}>
          Free
        </Txt>
        <Txt v="eyebrow" color={ink} center style={{ width: colP }}>
          Pro
        </Txt>
      </View>
      {rows.map((r, i) => {
        const two = (labelW[r.label] ?? 0) > room;
        return (
          <View
            key={r.label}
            accessible
            accessibilityLabel={`${r.label}: Free, ${spoken(r.free)}. Pro, ${spoken(r.pro)}.`}
            style={{ flexDirection: 'row', alignItems: 'center', minHeight: two ? 42 : 32 }}
          >
            {i ? <View style={{ position: 'absolute', top: 0, left: 16, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
            <Txt v="sub" color={p.cardFg} style={[LABEL_TEXT, { flex: 1, paddingLeft: 16, paddingRight: 8, paddingVertical: two ? 4 : 6, lineHeight: two ? 17 : 20 }]} maxFontSizeMultiplier={1.4}>
              {two ? balanceLines(r.label) : r.label}
            </Txt>
            <View style={{ width: colF, alignItems: 'center', justifyContent: 'center' }}>{cell(r.free, false)}</View>
            <View style={{ width: colP, alignItems: 'center', justifyContent: 'center' }}>{cell(r.pro, true)}</View>
          </View>
        );
      })}
      <View style={{ height: 4 }} />
    </Card>
  );
}

function FootLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ height: 44, minWidth: 44, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
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
  // Opened from Settings or a PRO tag (after onboarding) vs. during onboarding.
  const inApp = useLocalSearchParams<{ from?: string }>().from === 'app';
  const picked = usePickedList().length;
  const n = inApp ? listedUserSubs(app.subs).length : picked;
  const many = n > 3;
  const [planId, setPlanId] = useState<PlanId>('yearly');

  const yearly = planById('yearly');
  const monthly = planById('monthly');
  const lifetime = planById('lifetime');
  const today = onboardingToday();
  const charge = addDays(today, yearly.trialDays);
  const reminder = addDays(charge, -3);

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
      if (DEV_TOOLS) buttons.push({ text: 'Preview Pro', onPress: () => void activate(planId) });
      notice('Not switched on yet', 'Purchases arrive in the next build. Nothing was charged.', buttons);
    }
  };
  const restore = async () => {
    const r = await restorePurchases();
    notice(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };

  const cta = { yearly: `Start ${yearly.trialDays}-day free trial`, monthly: `Subscribe for ${monthly.priceString} a month`, lifetime: `Pay ${lifetime.priceString} once` }[planId];
  const perMonth = perMonthFromYearly({ amountMinor: yearly.priceMinor, currency: yearly.currency });
  const badge = yearlyBadge({ amountMinor: monthly.priceMinor, currency: monthly.currency }, { amountMinor: yearly.priceMinor, currency: yearly.currency }).toUpperCase();

  // Phones: forced breaks so the last line is short and the duck sits beside it (v10). iPad wraps by itself.
  const what = many ? `all ${n}${NB}renewals.` : `every${NB}renewal.`;
  const head = f.tablet ? `Get a reminder before ${what}` : f.small ? `Get a reminder before\n${what}` : many ? `Get a reminder\nbefore all\n${n}${NB}renewals.` : `Get a reminder\nbefore every\nrenewal.`;
  const spokenHead = `Get a reminder before ${many ? `all ${n} renewals` : 'every renewal'}.`;
  // SE drops the last row so everything fits without scrolling (the widget row stays).
  const rows = f.small ? ROWS.slice(0, 4) : ROWS;
  const overlap = f.tablet ? 48 : 40;
  const duckW = f.small ? 68 : f.tablet ? 104 : 96;
  const ink = dark ? '#F6F0E3' : brand.ink;

  return (
    <OnbRoot surface="cream">
      <FitScroll style={{ paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <View style={{ flexGrow: 1, marginHorizontal: -f.edge, paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.tablet ? 80 : f.small ? 52 : 48, backgroundColor: dark ? '#2A2516' : brand.sunflower }}>
          <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProLockup size={f.small ? 20 : 22} color={ink} />
            <IconButton label="Close, continue free" onPress={leaveFree} size={32} bg={dark ? '#3A3424' : 'rgba(22,20,15,0.12)'} style={{ marginRight: -6 }}>
              <Close color={ink} />
            </IconButton>
          </View>
          {/* Spare height goes here, so the title sits lower instead of a gap under the plans. */}
          <View style={{ flexGrow: 1 }} />
          <Txt v="title" color={ink} accessibilityRole="header" accessibilityLabel={spokenHead} style={f.small ? { fontSize: 26, lineHeight: 32, letterSpacing: -0.8 } : null}>
            {head}
          </Txt>
          <Duck width={duckW} right={f.edge} bottom={overlap - 12} />
        </View>

        <Compare rows={rows} width={f.content} overlap={overlap} />

        <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: 8, marginTop: f.small ? 16 : 20 }}>
          <PlanCard
            title="Yearly"
            tag={`${yearly.trialDays} days free`}
            badge={badge}
            price={billedLabel(yearly)}
            sub={`${perMonth} a month`}
            selected={planId === 'yearly'}
            onPress={() => select('yearly')}
            height={f.small ? 48 : 56}
            a11y={`Yearly, ${yearly.priceString} a year, ${perMonth} a month, ${yearly.trialDays} days free, ${badge.toLowerCase()}`}
          />
          <PlanCard
            title="Monthly"
            price={billedLabel(monthly)}
            sub="No free trial"
            selected={planId === 'monthly'}
            onPress={() => select('monthly')}
            height={f.small ? 48 : 56}
            a11y={`Monthly, ${monthly.priceString} a month, no free trial`}
          />
          <PlanCard
            title="Lifetime"
            price={lifetime.priceString}
            sub="Pay once"
            selected={planId === 'lifetime'}
            onPress={() => select('lifetime')}
            height={f.small ? 48 : 56}
            a11y={`Lifetime, ${lifetime.priceString}, pay once`}
          />
        </View>

        <View style={{ height: f.small ? 12 : 20 }} />
        <Button label={cta} onPress={buy} height={f.small ? 48 : 56} />
        {/* A fixed slot, so the button never moves when the plan changes. */}
        <View style={{ height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: planId === 'yearly' ? 0 : 4 }}>
          <Txt v="fine" tone="fg2" num center accessibilityLiveRegion="polite">
            {planId === 'yearly' ? (
              <>
                <Txt v="fine" num style={{ fontFamily: F.semi }}>
                  {`${formatWholeMoney(0, yearly.currency)} today`}
                </Txt>
                {` · reminder ${weekdayDate(reminder)} · ${yearly.priceString} ${weekdayDate(charge)}`}
              </>
            ) : planId === 'monthly' ? (
              `${monthly.priceString} today, then every month. Cancel anytime.`
            ) : (
              `Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every${NB}month.`
            )}
          </Txt>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
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
      </FitScroll>
    </OnbRoot>
  );
}
