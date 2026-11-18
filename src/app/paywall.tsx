// 6 · Paywall (design/v12 render 06, v10 structure). Honest by design
// (CLAUDE.md rule 4): the × is visible from the first frame and is the way
// to the free app (DECISIONS #29: no "Continue free" button); Restore;
// the trial line has real dates; no countdowns, no fake discounts, no trial
// toggle. The billed price is always the biggest price.
// Order (owner, Nov 18): Weekly / Yearly / Lifetime, cheapest first, so Yearly sits in the middle,
// pre-selected (the "compromise" pick, right under the weekly price it beats by 86%).
// Plans (DECISIONS #66, owner Nov 18): Yearly with 7 days free (pre-selected,
// "$0.97 a week", saving vs Weekly), Lifetime ("Pay once. No subscription.")
// for people tired of subscriptions, Weekly with no trial. No monthly.
// Layout (owner, Nov 18: "always fits, any screen"): like AllTrails, Smart Receipts, Quizlet and
// Trade AI on Mobbin/AppKittie, the plans, button, price line and links are pinned to the bottom
// and look the same on every phone. Above them scrolls the hero, the Free vs Pro table and "How
// the free week works". That part is always taller than the space, so a bigger phone shows more
// of it and a small one scrolls: never an empty gap.

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { WIDGET_READY, showImport } from '@/config/features';
import { DEV_TOOLS } from '@/dev/flags';
import { addDays, shortDate } from '@/domain/dates';
import { balanceLines } from '@/domain/copy';
import { formatWholeMoney } from '@/domain/money';
import { perWeekFromYearly, yearlyBadgeVsWeekly } from '@/domain/pricing';
import { listedUserSubs } from '@/domain/subs';
import { OnbRoot } from '@/onboarding/Parts';
import { PURCHASES_LIVE, billedLabel, planById, purchase, restorePurchases, type PlanId } from '@/services/purchases';
import { onboardingToday, useOnboarding, usePickedList } from '@/state/onboarding';
import { useApp } from '@/state/app';
import { BottomFade, Button, Card, Check, Close, Duck, F, IconButton, PlanCard, ProLockup, Txt, brand, haptic, useFrame, useIsDark, usePalette } from '@/ui/sunflower';

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

// DECISIONS #26, #27, #30. Only Pro features that work in this build (App Review 2.1, 3.1.2):
// a row appears when its feature does. The Lock Screen widget is v1.1 (#27).
// Owner, Nov 18 ("polish it, less cluttered"): the 6 strongest rows, each short enough for one line.
// Only features that work in this build (App Review 2.1, 3.1.2).
const ROWS: Row[] = [
  // From the approved deck (#26): says up front that tracking is free and unlimited.
  { label: 'Track every subscription', free: 'yes', pro: 'yes' },
  { label: 'Reminders', free: '3', pro: 'Unlimited' },
  // Free can change the time of day; Pro picks the days before (and up to 3 of them).
  { label: 'Pick your reminder days', free: 'no', pro: 'yes' },
  // Price watch (DECISIONS #60).
  { label: 'Price rise alerts', free: 'no', pro: 'yes' },
  // The 30-day warning before yearly charges (DECISIONS #60).
  { label: 'Heads-up before yearly charges', free: 'no', pro: 'yes' },
  ...(WIDGET_READY ? [{ label: `Lock${NB}Screen widget`, free: 'no', pro: 'yes' }] : []),
  // The first import (onboarding) is free, so "anytime" keeps this row true (DECISIONS #34).
  ...(showImport() ? [{ label: 'Import from a screenshot', free: 'no', pro: 'yes' }] : []),
];

/** 320pt wide: the same rows in fewer words, so each stays on one line. */
const SHORT: Record<string, string> = {
  'Track every subscription': 'Track every sub',
  'Pick your reminder days': 'Pick the days',
  'Heads-up before yearly charges': 'Yearly heads-up',
  'Import from a screenshot': 'Screenshot import',
};

const CELL_TEXT = { fontFamily: F.semi, fontSize: 14, lineHeight: 20 } as const;
const LABEL_TEXT = { fontFamily: F.medium, fontSize: 14, letterSpacing: -0.1 } as const;

/** Free vs Pro. Fixed columns: Free 56pt; Pro fits "Unlimited" with 12pt either side. */
function Compare({ rows, width, overlap, tiny, grow = 0 }: { rows: Row[]; width: number; overlap: number; tiny?: boolean; grow?: number }) {
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
      <View
        pointerEvents="none"
        style={{ position: 'absolute', opacity: 0, left: 0, top: 0, width: 2000, alignItems: 'flex-start' }}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Text style={CELL_TEXT} onLayout={(e) => setUnlimitedW(e.nativeEvent.layout.width)} maxFontSizeMultiplier={1.3}>
          Unlimited
        </Text>
        {rows.map((r) => (
          <Text
            key={r.label}
            style={tiny ? [LABEL_TEXT, { fontSize: 13 }] : LABEL_TEXT}
            maxFontSizeMultiplier={1.4}
            onLayout={(e) => setLabelW((m) => (m[r.label] === e.nativeEvent.layout.width ? m : { ...m, [r.label]: e.nativeEvent.layout.width }))}
          >
            {tiny ? (SHORT[r.label] ?? r.label) : r.label}
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
            style={{ flexDirection: 'row', alignItems: 'center', minHeight: (two ? 42 : tiny ? 30 : 38) + grow }}
          >
            {i ? <View style={{ position: 'absolute', top: 0, left: 16, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
            <Txt
              v="sub"
              color={p.cardFg}
              style={[LABEL_TEXT, tiny && { fontSize: 13 }, { flex: 1, paddingLeft: 16, paddingRight: 8, paddingVertical: two ? 4 : 6, lineHeight: two ? 17 : 20 }]}
              maxFontSizeMultiplier={1.4}
            >
              {two ? balanceLines(tiny ? (SHORT[r.label] ?? r.label) : r.label) : tiny ? (SHORT[r.label] ?? r.label) : r.label}
            </Txt>
            <View style={{ width: colF, alignItems: 'center', justifyContent: 'center' }}>{cell(r.free, false)}</View>
            <View style={{ width: colP, alignItems: 'center', justifyContent: 'center' }}>{cell(r.pro, true)}</View>
          </View>
        );
      })}
      <View style={{ height: 6 }} />
    </Card>
  );
}

function FootLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ height: 44, minWidth: 44, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
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
  const [planId, setPlanId] = useState<PlanId>('yearly');

  const yearly = planById('yearly');
  const weekly = planById('weekly');
  const lifetime = planById('lifetime');
  const today = onboardingToday();
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
      if (DEV_TOOLS) buttons.push({ text: 'Preview Pro', onPress: () => void activate(planId) });
      notice('Not switched on yet', 'Purchases arrive in the next build. Nothing was charged.', buttons);
    }
  };
  const restore = async () => {
    const r = await restorePurchases();
    notice(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };

  const cta = { yearly: `Start ${yearly.trialDays}-day free trial`, weekly: `Subscribe for ${weekly.priceString} a week`, lifetime: `Pay ${lifetime.priceString} once` }[planId];
  const perWeek = perWeekFromYearly({ amountMinor: yearly.priceMinor, currency: yearly.currency });
  // A true comparison with the Weekly plan we sell: $6.99 × 52 = $363.48 vs $49.99 (rounded down).
  const badge = yearlyBadgeVsWeekly({ amountMinor: weekly.priceMinor, currency: weekly.currency }, { amountMinor: yearly.priceMinor, currency: yearly.currency }).toUpperCase();
  const cardH = f.tiny ? 44 : f.small ? 50 : 56;

  // Phones: forced breaks so the last line is short and the duck sits beside it (v10). iPad wraps by itself.
  const what = many ? `all ${n}${NB}renewals.` : `every${NB}renewal.`;
  // Two lines on every phone, so the table and plans get the room. iPad wraps by itself.
  const head = f.tablet || f.tiny ? `Get a reminder before ${what}` : `Get a reminder before\n${what}`;
  // Sized so "Get a reminder before" stays on one line: 30pt at 392pt wide (Pro Max), smaller on narrower phones.
  const headSize = f.tablet ? 30 : Math.min(30, Math.floor((30 * f.content) / 392));
  const spokenHead = `Get a reminder before ${many ? `all ${n} renewals` : 'every renewal'}.`;
  const rows = ROWS;
  // Taller phones: the table rows open up a little (up to 10pt each) instead of leaving a gap. Measured
  // from the scroll area vs its natural content; starts again when the window changes, so it never flickers.
  const sizeKey = `${f.width}x${f.height}x${f.fontScale}`;
  // `natural` is the content's height with no extra space added, so the result never feeds back on itself.
  const [fit, setFit] = useState({ key: sizeKey, view: 0, natural: 0 });
  const cur = fit.key === sizeKey ? fit : { key: sizeKey, view: 0, natural: 0 };
  const leftover = cur.view && cur.natural ? Math.max(0, cur.view - cur.natural) : 0;
  const grow = Math.min(14, Math.floor(leftover / rows.length));
  const lift = Math.min(160, leftover - grow * rows.length);
  // Functional updates: the two measurements can land in the same frame, so neither may overwrite the other.
  const base = (prev: typeof fit) => (prev.key === sizeKey ? prev : { key: sizeKey, view: 0, natural: 0 });
  const onView = (view: number) => setFit((prev) => (base(prev).view === view ? prev : { ...base(prev), view }));
  const onContent = (h: number) => {
    const natural = Math.round(h - grow * rows.length - lift);
    setFit((prev) => (Math.abs(base(prev).natural - natural) <= 1 ? prev : { ...base(prev), natural }));
  };
  const overlap = f.tablet ? 48 : 40;
  const duckW = f.small ? 60 : f.tablet ? 96 : 76;
  const ink = dark ? '#F6F0E3' : brand.ink;
  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: f.edge, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onLayout={(e) => onView(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => onContent(h)}
        >
          <View
            style={{
              marginHorizontal: -f.edge,
              paddingTop: f.top,
              paddingHorizontal: f.edge,
              paddingBottom: f.tablet ? 80 : f.tiny ? 46 : f.small ? 52 : 48,
              backgroundColor: dark ? brand.night : brand.sunflower,
            }}
          >
            <View style={{ height: f.tiny ? 40 : 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ProLockup size={f.small ? 20 : 22} color={ink} />
              <IconButton label="Close, continue free" onPress={leaveFree} size={32} bg={dark ? '#3A3424' : 'rgba(22,20,15,0.12)'} style={{ marginRight: -6 }}>
                <Close color={ink} />
              </IconButton>
            </View>
            {/* What's left after the rows open up sits here, above the headline (never a gap under the table). */}
            <View style={{ height: (f.small ? 8 : 16) + lift }} />
            {/* Dark mode: night like the other yellow screens (Almost set, Ditched), with a sunflower headline. */}
            <Txt
              v="title"
              color={dark ? brand.sunflower : ink}
              accessibilityRole="header"
              accessibilityLabel={spokenHead}
              style={{ fontSize: headSize, lineHeight: Math.round(headSize * 1.2), letterSpacing: -headSize / 30 }}
            >
              {head}
            </Txt>
            {/* Nudged left so his bill points at the Pro column, never over the title. Only the base of
              his neck tucks behind the table, so the whole bill shows on every size. */}
            {/* 320pt wide: no room beside the title, so he sits this one out. */}
            {f.tiny ? null : <Duck width={duckW} right={f.edge + (f.small ? 20 : f.tablet ? 48 : 36)} bottom={overlap - 4} />}
          </View>

          <Compare rows={rows} width={f.content} overlap={overlap} tiny={f.tiny} grow={grow} />
        </ScrollView>
        <BottomFade height={36} />
      </View>

      {/* Pinned: the same on every phone. */}
      <View
        style={{
          paddingHorizontal: f.edge,
          paddingTop: f.tiny ? 14 : 18,
          paddingBottom: f.tiny ? 4 : f.bottom,
          backgroundColor: dark ? brand.night : brand.cream,
          borderTopWidth: 1,
          borderTopColor: dark ? '#2B2823' : '#EEE7D8',
        }}
      >
        <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: f.tiny ? 6 : 8 }}>
          <PlanCard
            title="Weekly"
            price={billedLabel(weekly)}
            sub="No free trial"
            selected={planId === 'weekly'}
            onPress={() => select('weekly')}
            height={cardH}
            a11y={`Weekly, ${weekly.priceString} a week, no free trial`}
          />
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
        </View>

        <View style={{ height: f.tiny ? 10 : 14 }} />
        <Button label={cta} onPress={buy} height={f.tiny ? 44 : f.small ? 48 : 56} />
        {/* A fixed slot, so the button never moves when the plan changes. Price and the real start date by the
            button (App Review); no reminder text (owner, Nov 10). */}
        <View style={{ height: f.tiny ? 38 : 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: planId === 'yearly' ? 0 : 4 }}>
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
      </View>
    </OnbRoot>
  );
}
