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
// Trade AI on Mobbin/AppKittie, the plans, button, price line and links sit at the bottom and look
// the same on every phone. When everything fits (iPhone 12 to Pro Max at the normal text size) it's
// one picture scaled to the phone's width. On a short phone (SE) or with big text, only the hero and
// the Free vs Pro table get smaller or scroll; the bottom part never shrinks below its width-fit size,
// so Restore, Terms and the renewal line are always on screen and readable.

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';

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
import { Button, Card, Check, Close, Duck, F, PlanCard, ProLockup, Txt, brand, haptic, useFrame, useIsDark, usePalette } from '@/ui/sunflower';

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
  // Owner, Nov 18: "way too much text". One short name per row, no second line. Only real, working features.
  return [
    // The headline feature once it ships (DECISIONS #64, trial-gated). Test builds only until then. Provider never named.
    ...(showBankScan() ? [{ label: 'Scan your bank', free: 'no', pro: 'yes' }] : []),
    // Personal: "All 6" when they track more than the free 3.
    { label: 'Reminders', free: '3', pro: n > 3 ? `All ${n}` : 'Unlimited' },
    // Price watch (DECISIONS #60).
    { label: 'Price hike alerts', free: 'no', pro: 'yes' },
    // The 30-day warning before yearly charges (DECISIONS #60).
    { label: 'Yearly bill warnings', free: 'no', pro: 'yes' },
    // Free can change the time of day; Pro picks the days before.
    { label: 'Pick your reminder days', free: 'no', pro: 'yes' },
    ...(WIDGET_READY ? [{ label: `Lock${NB}Screen widget`, free: 'no', pro: 'yes' }] : []),
    // The first import is free (DECISIONS #34), so Free says "Once".
    ...(showImport() ? [{ label: 'Screenshot import', free: 'Once', pro: 'yes' }] : []),
  ];
}

/** 320pt wide: the same rows in fewer words, so each stays on one line. */
const SHORT: Record<string, string> = {
  'Pick your reminder days': 'Pick the days',
};

// The fixed paywall canvas (see the scaling note in Paywall).
const CANVAS_W = 440;
/** Gap between the raised Pro column and the table's right edge. */
const PRO_INSET = 10;
const HERO_H = 190;
const EDGE_W = 24;
/** Everything on the canvas except the table rows (hero, table header, plans, button, price line, links). */
const CANVAS_BASE = 600;
/** Table row height range: 52pt (SE) to 66pt (fewer rows get more air). Each row has a label and a line under it. */
const ROW_MIN = 40;
const ROW_MAX = 50;
/** Short phone or big text: the hero and table shrink to fit, but never below this (labels stay ≥ 11pt). Under it they scroll. */
const TOP_MIN_SCALE = 0.8;
/** Space between the table and the plans when the bottom part is pinned on its own (fits the Pro column's 8pt overhang). */
const TOP_GAP = 18;
/** Space above the first plan card when the bottom part is pinned on its own. */
const BOTTOM_PAD = 12;
/** First guess of the bottom part's height (pad + plans + gap + button + price line + links), before it's measured. */
const BOTTOM_EST = BOTTOM_PAD + 3 * 58 + 2 * 10 + 14 + 60 + 44 + 44;
/** Smallest real tap target, in points (Apple HIG). */
const MIN_TAP = 44;

/** Extra touch area (in canvas units) so a `size`-tall target is at least 44pt on screen at this scale. */
function slopFor(size: number, scale: number, base = 0): number {
  return Math.max(base, Math.ceil((MIN_TAP / scale - size) / 2));
}

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
  const room = width - 16 - 8 - colF - colP - PRO_INSET;

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
    <Card style={{ marginTop: -overlap, overflow: 'visible', zIndex: 2 }}>
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
      {/* Pro gets its own raised, yellow-edged column with a PRO pill on top (owner's pick, Nov 18: "B"). */}
      <View
        style={{
          position: 'absolute',
          top: -14,
          bottom: -8,
          right: PRO_INSET,
          width: colP,
          borderRadius: 16,
          backgroundColor: dark ? '#332B12' : '#FFF1BC',
          borderWidth: 2,
          borderColor: brand.sunflower,
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }} importantForAccessibility="no-hide-descendants">
        <View style={{ flex: 1 }} />
        <Txt v="sub" tone="mute" center style={{ width: colF, fontFamily: F.semi }} maxFontSizeMultiplier={1.2}>
          Free
        </Txt>
        <View style={{ width: colP, marginRight: PRO_INSET, alignItems: 'center' }}>
          <View style={{ backgroundColor: dark ? brand.sunflower : brand.ink, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3 }}>
            <Txt v="fine" color={dark ? brand.ink : brand.sunflower} style={{ fontFamily: F.wideHeavy, fontSize: 12, lineHeight: 16, letterSpacing: 1 }} maxFontSizeMultiplier={1.2}>
              PRO
            </Txt>
          </View>
        </View>
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
            {i ? <View style={{ position: 'absolute', top: 0, left: 16, right: colP + PRO_INSET, height: 1, backgroundColor: p.hair }} /> : null}
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
            <View style={{ width: colP, marginRight: PRO_INSET, alignItems: 'center', justifyContent: 'center' }}>{cell(r.pro, true)}</View>
          </View>
        );
      })}
      <View style={{ height: 6 }} />
    </Card>
  );
}

function FootLink({ label, onPress, hitSlop = 0 }: { label: string; onPress: () => void; hitSlop?: number }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={hitSlop}
      style={({ pressed }) => ({ height: 44, minWidth: 44, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="sub" tone="fg2" style={{ textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** The ×: looks exactly like IconButton (32pt circle in a 44pt box), with a touch area that stays ≥ 44pt after the canvas is scaled. */
function CloseX({ label, onPress, scale, color, bg }: { label: string; onPress: () => void; scale: number; color: string; bg: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={slopFor(MIN_TAP, scale, 6)}
      onPress={onPress}
      style={({ pressed }) => ({ width: MIN_TAP, height: MIN_TAP, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1, marginRight: -6 })}
    >
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <Close color={color} />
      </View>
    </Pressable>
  );
}

export default function Paywall() {
  const dark = useIsDark();
  const f = useFrame({ maxContent: 440, colH: 740, extraBottom: 0 });
  const { setPro: setOnboardingPro } = useOnboarding();
  const app = useApp();
  // Where it was opened from: 'app' (Settings, a PRO tag, the editor), 'which' (a 4th bell), 'remind'
  // (custom reminder days), 'import'. Only changes words, never the flow.
  const { from } = useLocalSearchParams<{ from?: string }>();
  // After onboarding (Settings, a PRO tag, the editor) vs. during onboarding. Decided by
  // whether onboarding is done, never by the link, so no link can rerun onboarding.
  const inApp = app.settings.onboardingDone;
  const pickedList = usePickedList();
  const n = inApp ? listedUserSubs(app.subs).length : pickedList.length;
  const many = n > 3;
  const [planId, setPlanId] = useState<PlanId>('yearly');
  // Measured heights (canvas units) of the two halves, used only when they're laid out apart (short phone or big text).
  const [topH, setTopH] = useState(0);
  const [bottomH, setBottomH] = useState(BOTTOM_EST);

  const yearly = planById('yearly');
  const weekly = planById('weekly');
  const lifetime = planById('lifetime');
  const today = onboardingToday();
  const charge = addDays(today, yearly.trialDays);
  // Lifetime includes one bank scan a year (DECISIONS #65), so say so once the scan is on the table.
  const bank = showBankScan();

  // × is the free path: no purchase, reminders on the 3 biggest (picked on You're set).
  const leaveFree = () => (inApp ? router.back() : router.replace('/onboarding/done'));
  // Only onboarding's × leads on to the free app; anywhere else it just closes.
  const closeLabel = inApp || (from !== undefined && from !== 'import') ? 'Close' : 'Close, continue free';
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

  const cta = {
    yearly: yearly.trialDays === 7 ? 'Start my free week' : `Start my ${yearly.trialDays}-day free trial`,
    weekly: `Subscribe for ${weekly.priceString} a week`,
    lifetime: `Pay ${lifetime.priceString} once`,
  }[planId];
  const perWeek = perWeekFromYearly({ amountMinor: yearly.priceMinor, currency: yearly.currency });
  // A true comparison with the Weekly plan we sell: $6.99 × 52 = $363.48 vs $49.99 (rounded down).
  const badge = yearlyBadgeVsWeekly({ amountMinor: weekly.priceMinor, currency: weekly.currency }, { amountMinor: yearly.priceMinor, currency: yearly.currency }).toUpperCase();

  // The same headline from onboarding, a 4th bell (from=which) or custom days (from=remind): "all N" once they track more than 3.
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
  // height differences (40-50pt each).
  const byWidth = Math.min(1, f.width / CANVAS_W);
  const rowsMin = rows.length * ROW_MIN;
  const rowsMax = rows.length * ROW_MAX;
  const fitRows = Math.min(rowsMax, availH / byWidth - CANVAS_BASE);
  // Too short for the whole picture at width-fit (SE: 647pt tall), or big text (Dynamic Type): split it.
  // The bottom part (plans, button, price line, links) stays at width-fit size, pinned to the bottom; only
  // the hero and table shrink (down to TOP_MIN_SCALE) and scroll past that.
  const split = fitRows < rowsMin || f.fontScale > 1.15;
  const scale = byWidth;
  const rowsH = Math.max(rowsMin, Math.min(rowsMax, availH / scale - CANVAS_BASE));
  const CANVAS_H = CANVAS_BASE + rowsH;
  const rowGrow = Math.floor(rowsH / rows.length) - ROW_MIN;
  const canvasTop = f.insets.top + (availH - CANVAS_H * scale) / 2;
  const yellowTo = canvasTop + HERO_H * scale;

  // Split layout sizes (points on screen).
  const bottomOnScreen = bottomH * scale;
  const topRoom = availH - bottomOnScreen;
  const topScale = !split || !topH ? scale : f.fontScale > 1.15 ? scale : Math.min(scale, Math.max(TOP_MIN_SCALE, topRoom / topH));
  const topOnScreen = topH * topScale;

  const hero = (s: number) => (
    <View style={{ height: HERO_H, marginHorizontal: -EDGE_W, paddingHorizontal: EDGE_W }}>
      <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ProLockup size={22} color={ink} />
        <CloseX label={closeLabel} onPress={leaveFree} scale={s} color={ink} bg={dark ? '#3A3424' : 'rgba(22,20,15,0.12)'} />
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
      {/* He peeks out from behind the raised Pro column: the column hides his body, only his head shows. */}
      <Duck width={70} right={EDGE_W + PRO_INSET + 8} bottom={42} />
    </View>
  );

  // Plans, button, the renewal line and the links. Always drawn at the width-fit `scale`, never smaller.
  const linkSlop = slopFor(44, scale);
  const bottom = (
    <>
      <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: 10 }}>
        <PlanCard title="Weekly" price={billedLabel(weekly)} selected={planId === 'weekly'} onPress={() => select('weekly')} height={58} a11y={`Weekly, ${weekly.priceString} a week, no free trial`} />
        <PlanCard
          title="Yearly"
          note={`Free for ${yearly.trialDays} days`}
          noteStrong
          badge={badge}
          badgeBg={brand.sunflower}
          badgeFg={brand.ink}
          badgeRight
          price={billedLabel(yearly)}
          sub={`${perWeek} a week`}
          selected={planId === 'yearly'}
          onPress={() => select('yearly')}
          height={58}
          a11y={`Yearly, ${yearly.priceString} a year, ${perWeek} a week, ${yearly.trialDays} days free, ${badge.toLowerCase()}`}
        />
        <PlanCard
          title="Lifetime"
          note="Pay once. No subscription."
          price={lifetime.priceString}
          sub="one time"
          selected={planId === 'lifetime'}
          onPress={() => select('lifetime')}
          height={58}
          a11y={`Lifetime, ${lifetime.priceString} one time. Pay once, no subscription${bank ? ', bank sync for the first year' : ''}.`}
        />
      </View>

      <View style={{ height: 14 }} />
      <Button label={cta} sub={planId === 'yearly' ? `${formatWholeMoney(0, yearly.currency)} today · Cancel anytime` : undefined} onPress={buy} height={60} />
      {/* A fixed slot, so the button never moves when the plan changes. Price and the real start date by the
        button (App Review); no reminder text (owner, Nov 10). At least 13pt on screen at any scale. */}
      <View style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: planId === 'yearly' ? 0 : 4 }}>
        <Txt v="fine" tone="fg2" num center accessibilityLiveRegion="polite" style={{ fontSize: 13 / scale, lineHeight: 16 / scale }}>
          {planId === 'yearly'
            ? `Then ${yearly.priceString}/yr from ${shortDate(charge).replace(' ', NB)}.\nRenews yearly until you${NB}cancel.`
            : planId === 'weekly'
              ? `${weekly.priceString} today, then every week until you${NB}cancel.`
              : bank
                ? `${lifetime.priceString} once. Pro for good. Bank sync for the first year.`
                : `${lifetime.priceString} once. Pro for good, nothing${NB}renews.`}
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <FootLink label="Restore" onPress={restore} hitSlop={linkSlop} />
        <Txt v="sub" tone="fg2" importantForAccessibility="no">
          ·
        </Txt>
        <FootLink label="Terms" onPress={() => Linking.openURL('https://ditchsubs.app/terms')} hitSlop={linkSlop} />
        <Txt v="sub" tone="fg2" importantForAccessibility="no">
          ·
        </Txt>
        <FootLink label="Privacy" onPress={() => Linking.openURL('https://ditchsubs.app/privacy')} hitSlop={linkSlop} />
      </View>
    </>
  );

  if (split) {
    const yellow = dark ? brand.night : brand.sunflower;
    return (
      <OnbRoot surface="cream">
        <View style={{ flex: 1, backgroundColor: dark ? brand.night : brand.cream }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: f.insets.top }} alwaysBounceVertical={false} showsVerticalScrollIndicator>
            {/* The yellow band moves with the hero (and fills the top bounce). */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: -1000, height: 1000 + f.insets.top + HERO_H * topScale, backgroundColor: yellow }} />
            <View style={{ height: topOnScreen, opacity: topH ? 1 : 0 }}>
              <View
                onLayout={(e) => setTopH(e.nativeEvent.layout.height)}
                style={{
                  position: 'absolute',
                  width: CANVAS_W,
                  left: (f.width - CANVAS_W) / 2,
                  top: (topOnScreen - topH) / 2,
                  transform: [{ scale: topScale }],
                  paddingHorizontal: EDGE_W,
                  paddingBottom: TOP_GAP,
                }}
              >
                {hero(topScale)}
                <Compare rows={rows} width={CANVAS_W - EDGE_W * 2} overlap={40} />
              </View>
            </View>
          </ScrollView>
          <View style={{ height: bottomOnScreen, marginBottom: f.insets.bottom }}>
            <View
              onLayout={(e) => setBottomH(e.nativeEvent.layout.height)}
              style={{
                position: 'absolute',
                width: CANVAS_W,
                left: (f.width - CANVAS_W) / 2,
                top: (bottomOnScreen - bottomH) / 2,
                transform: [{ scale }],
                paddingHorizontal: EDGE_W,
                paddingTop: BOTTOM_PAD,
              }}
            >
              {bottom}
            </View>
          </View>
        </View>
      </OnbRoot>
    );
  }

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
          {hero(scale)}
          <Compare rows={rows} width={CANVAS_W - EDGE_W * 2} overlap={40} grow={rowGrow} />
          <View style={{ flex: 1 }} />
          {bottom}
        </View>
      </View>
    </OnbRoot>
  );
}
