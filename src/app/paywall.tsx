// 6 · Paywall (design/v12 render 06, v10 structure). Honest by design
// (CLAUDE.md rule 4): the × is visible from the first frame and is the way
// to the free app (DECISIONS #29: no "Continue free" button); Restore;
// the trial line has real dates; no countdowns, no fake discounts, no trial
// toggle. The billed price is always the biggest price.
// Order (owner, Nov 18): Weekly / Yearly / Lifetime, cheapest first, so Yearly sits in the middle,
// pre-selected (the "compromise" pick, right under the weekly price it beats by 86%).
// Plans (DECISIONS #66, owner Nov 18): Yearly with 7 days free (pre-selected,
// "$0.96 a week", saving vs Weekly), Lifetime ("Pay once.")
// for people tired of subscriptions, Weekly with no trial. No monthly.
// Layout (owner, Nov 18: "always fits, any screen"): like AllTrails, Smart Receipts, Quizlet and
// Trade AI on Mobbin/AppKittie, the plans, button, price line and links are pinned to the bottom
// and look the same on every phone. Above them scrolls the hero, the Free vs Pro table and "How
// the free week works". That part is always taller than the space, so a bigger phone shows more
// of it and a small one scrolls: never an empty gap.

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Text, View } from 'react-native';

import { WIDGET_READY, showBankScan, showImport } from '@/config/features';
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
type Row = { label: string; free: Cell; pro: Cell; /** One plain line under the label: what it means for you. */ sub?: string };

// DECISIONS #26, #27, #30. Only Pro features that work in this build (App Review 2.1, 3.1.2):
// a row appears when its feature does. The Lock Screen widget is v1.1 (#27).
// Only rows where Pro is different, in Ditch's own words (owner, Nov 18: the table sells; "track every
// subscription" is free on both sides, so it said nothing). Only features that work in this build (App Review 2.1).
function rowsFor(n: number): Row[] {
  // Wording B (owner, Nov 18): short, dry, on your side. Only real, working features; nothing overclaims.
  return [
    // The headline feature once it ships (DECISIONS #64, trial-gated). Test builds only until then. Provider never named.
    ...(showBankScan() ? [{ label: 'Find the forgotten ones', sub: 'Your bank, scanned in a minute', free: 'no', pro: 'yes' }] : []),
    // Personal: "All 6" when they track more than the free 3.
    { label: 'Reminders', sub: 'A heads-up before each charge', free: '3', pro: n > 3 ? `All ${n}` : 'Unlimited' },
    // Price watch (DECISIONS #60): our checked price for their plan went up.
    { label: 'Price hikes', sub: 'We flag it when a price goes up', free: 'no', pro: 'yes' },
    // The 30-day warning before yearly charges (DECISIONS #60).
    { label: 'Yearly bills', sub: 'A month’s notice to bail', free: 'no', pro: 'yes' },
    // Free can change the time of day; Pro picks the days before.
    { label: 'Your call', sub: 'Remind me 1, 3 or 7 days before', free: 'no', pro: 'yes' },
    ...(WIDGET_READY ? [{ label: `Lock${NB}Screen widget`, free: 'no', pro: 'yes' }] : []),
    // The first import is free (DECISIONS #34), so Free says "Once" and Pro is any time.
    ...(showImport() ? [{ label: 'Screenshot import', sub: 'Snap your Apple list, done', free: 'Once', pro: 'yes' }] : []),
  ];
}

/** 320pt wide: the same rows in fewer words, so each stays on one line. */
const SHORT: Record<string, string> = {
  'Find the forgotten ones': 'Forgotten ones',
};

// The fixed paywall canvas (see the scaling note in Paywall).
const CANVAS_W = 440;
const HERO_H = 190;
const EDGE_W = 24;
/** Everything on the canvas except the table rows (hero, table header, plans, button, price line, links). */
const CANVAS_BASE = 570;
/** Table row height range: 52pt (SE) to 66pt (fewer rows get more air). Each row has a label and a line under it. */
const ROW_MIN = 46;
const ROW_MAX = 58;

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
        <Txt v="eyebrow" color={dark ? brand.sunflower : ink} center style={{ width: colP }}>
          Pro
        </Txt>
      </View>
      {rows.map((r, i) => {
        const two = (labelW[r.label] ?? 0) > room;
        return (
          <View
            key={r.label}
            accessible
            accessibilityLabel={`${r.label}${r.sub ? `, ${r.sub}` : ''}: Free, ${spoken(r.free)}. Pro, ${spoken(r.pro)}.`}
            style={{ flexDirection: 'row', alignItems: 'center', minHeight: ROW_MIN + grow }}
          >
            {i ? <View style={{ position: 'absolute', top: 0, left: 16, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
            <View style={{ flex: 1, paddingLeft: 16, paddingRight: 8, paddingVertical: 6 }}>
              <Txt v="sub" color={p.cardFg} style={[LABEL_TEXT, { fontFamily: F.semi }, tiny && { fontSize: 13 }, { lineHeight: two ? 17 : 20 }]} maxFontSizeMultiplier={1.4}>
                {two ? balanceLines(tiny ? (SHORT[r.label] ?? r.label) : r.label) : tiny ? (SHORT[r.label] ?? r.label) : r.label}
              </Txt>
              {r.sub ? (
                <Txt v="fine" tone="fg2" style={{ marginTop: 1 }} maxFontSizeMultiplier={1.3}>
                  {r.sub}
                </Txt>
              ) : null}
            </View>
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

  const what = many ? `all ${n}${NB}renewals.` : `every${NB}renewal.`;
  const head = `Get a reminder before\n${what}`;
  const spokenHead = `Get a reminder before ${many ? `all ${n} renewals` : 'every renewal'}.`;
  const rows = rowsFor(n);
  const ink = dark ? '#F6F0E3' : brand.ink;
  // One fixed design, scaled to fit (owner, Nov 18: "how it looks on other devices"). The paywall is laid
  // out once on a 440 x 860 canvas (Pro Max proportions) and the whole canvas is shrunk to fit the
  // phone, so every iPhone shows exactly the same picture. Never scaled up, so text stays sharp. Any
  // spare edge just continues the yellow (top) and cream (bottom) backgrounds.
  const availH = f.height - f.insets.top - f.insets.bottom;
  // Width decides the size, so every iPhone gets the same proportions; the table rows take up the small
  // height differences (38-54pt each). Only a short, wide phone (SE) is shrunk a little more.
  const byWidth = Math.min(1, f.width / CANVAS_W);
  const rowsMin = rows.length * ROW_MIN;
  const rowsMax = rows.length * ROW_MAX;
  const fitRows = Math.min(rowsMax, availH / byWidth - CANVAS_BASE);
  const scale = fitRows < rowsMin ? Math.min(byWidth, availH / (CANVAS_BASE + rowsMin)) : byWidth;
  const rowsH = Math.max(rowsMin, Math.min(rowsMax, availH / scale - CANVAS_BASE));
  const CANVAS_H = CANVAS_BASE + rowsH;
  const rowGrow = Math.floor(rowsH / rows.length) - ROW_MIN;
  const canvasTop = f.insets.top + (availH - CANVAS_H * scale) / 2;
  const yellowTo = canvasTop + HERO_H * scale;
  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, backgroundColor: dark ? brand.night : brand.cream }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: yellowTo, backgroundColor: dark ? brand.night : brand.sunflower }} />
        <View
          style={{
            position: 'absolute',
            width: CANVAS_W,
            height: CANVAS_H,
            left: (f.width - CANVAS_W) / 2,
            top: f.insets.top + (availH - CANVAS_H) / 2,
            transform: [{ scale }],
            paddingHorizontal: EDGE_W,
          }}
        >
          <View style={{ height: HERO_H, marginHorizontal: -EDGE_W, paddingHorizontal: EDGE_W }}>
            <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ProLockup size={22} color={ink} />
              <IconButton label="Close, continue free" onPress={leaveFree} size={32} bg={dark ? '#3A3424' : 'rgba(22,20,15,0.12)'} style={{ marginRight: -6 }}>
                <Close color={ink} />
              </IconButton>
            </View>
            <View style={{ height: 14 }} />
            {/* Dark mode: night like the other yellow screens (Almost set, Ditched), with a sunflower headline. */}
            <Txt
              v="title"
              color={dark ? brand.sunflower : ink}
              accessibilityRole="header"
              accessibilityLabel={spokenHead}
              style={{ fontSize: 30, lineHeight: 36, letterSpacing: -1 }}
              maxFontSizeMultiplier={1}
            >
              {head}
            </Txt>
            {/* His bill points at the Pro column; only the base of his neck tucks behind the table. */}
            <Duck width={84} right={EDGE_W + 30} bottom={36} />
          </View>

          <Compare rows={rows} width={CANVAS_W - EDGE_W * 2} overlap={40} grow={rowGrow} />
          <View style={{ flex: 1 }} />

          <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: 10 }}>
            <PlanCard
              title="Weekly"
              price={billedLabel(weekly)}
              selected={planId === 'weekly'}
              onPress={() => select('weekly')}
              height={58}
              tint={dark ? '#2A2410' : '#FFF4C8'}
              a11y={`Weekly, ${weekly.priceString} a week, no free trial`}
            />
            <PlanCard
              title="Yearly"
              tag={`${yearly.trialDays} days free`}
              badge={badge}
              badgeBg={brand.sunflower}
              badgeFg={brand.ink}
              price={billedLabel(yearly)}
              sub={`${perWeek} a week`}
              selected={planId === 'yearly'}
              onPress={() => select('yearly')}
              height={58}
              tint={dark ? '#2A2410' : '#FFF4C8'}
              a11y={`Yearly, ${yearly.priceString} a year, ${perWeek} a week, ${yearly.trialDays} days free, ${badge.toLowerCase()}`}
            />
            <PlanCard
              title="Lifetime"
              note="Pay once."
              price={lifetime.priceString}
              sub="one time"
              selected={planId === 'lifetime'}
              onPress={() => select('lifetime')}
              height={58}
              tint={dark ? '#2A2410' : '#FFF4C8'}
              a11y={`Lifetime, ${lifetime.priceString} one time. Pay once.`}
            />
          </View>

          <View style={{ height: 14 }} />
          <Button label={cta} sub={planId === 'yearly' ? `${formatWholeMoney(0, yearly.currency)} today · Cancel anytime in Settings` : undefined} onPress={buy} height={60} />
          {/* A fixed slot, so the button never moves when the plan changes. Price and the real start date by the
            button (App Review); no reminder text (owner, Nov 10). */}
          <View style={{ height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: planId === 'yearly' ? 0 : 4 }}>
            <Txt v="fine" tone="fg2" num center accessibilityLiveRegion="polite">
              {planId === 'yearly'
                ? `We’ll remind you before your trial ends. Then ${yearly.priceString}/yr from ${shortDate(charge).replace(' ', NB)}. Renews${NB}yearly.`
                : planId === 'weekly'
                  ? `${weekly.priceString} today, then every week. Renews weekly. Cancel${NB}anytime.`
                  : `${lifetime.priceString} once. Pro for good, nothing${NB}renews.`}
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
      </View>
    </OnbRoot>
  );
}
