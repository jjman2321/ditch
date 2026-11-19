// 10 / 10b / 10-se · Ditched. Same moment as the website (owner, Nov 15; DECISIONS #58): the row's
// "Ditched" tag appears with a firm buzz, the logo dims, the duck pops up over the row, then
// "You won't pay $X a year, once you cancel." fades in (left-aligned, Nov 19). No stamp. Ditching doesn't cancel
// anything: the user still has to cancel with the service, so the one
// last check reminder stays, and "I cancelled it" is what confirms it.

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { AppState, Linking, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { chargeDay } from '@/domain/copy';
import { shortDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { CYCLE_WORDS, yearlyMinor } from '@/domain/money';
import { shortTimeLabel } from '@/domain/settings';
import { chargeOfSub, isPending, isPricedSub, isProTrial } from '@/domain/subs';
import { helpFor, openUrl, useCancelHelp } from '@/ditch/CancelHelp';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { ask } from '@/ui/alert';
import { Bell, Button, Card, DitchedTag, Duck, EDGE, External, F, ProLockup, SurfaceContext, Txt, brand, haptic, paletteFor, useInsets, useIsDark, usePageEdge } from '@/ui/sunflower';

// The website's timing: tag at 0.35 s (with the buzz), duck at 0.5 s, the number at 0.75 s, the rest after.
const TAG_MS = 350;
const DUCK_MS = 500;

export default function Ditched() {
  const { id, fresh, preview } = useLocalSearchParams<{ id: string; fresh?: string; preview?: string }>();
  const app = useApp();
  const money = useAppMoney();
  const insets = useInsets();
  const edge = usePageEdge();
  const { height, width } = useWindowDimensions();
  const reduce = useReducedMotion();
  const compact = height < 720;
  // 320pt wide (SE with Display Zoom): tighter still, so the buttons sit on the first screen.
  const tiny = width < 350;
  // iPad and the open Duo: keep the card, the amount and the buttons together, centred, not split by a gap.
  const wide = Math.min(width, height) >= 600;
  const sub = app.subs.find((s) => s.id === id) ?? null;
  const help = useCancelHelp();
  const p = paletteFor('sun', useIsDark());

  // Web preview / screenshots only: ditch it on open.
  useEffect(() => {
    if (Platform.OS === 'web' && preview && sub?.status === 'active') app.ditch(sub.id);
  }, [preview, sub, app]);

  // The landing plays when the user just ditched it; reopening shows it at rest.
  const animate = !!fresh || !!preview;
  const card = useSharedValue(animate && !reduce ? 0 : 1);
  const tag = useSharedValue(animate ? 0 : 1);
  const amount = useSharedValue(animate ? 0 : 1);
  const rest = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) return;
    if (reduce) {
      // Reduce Motion: everything at once with a short crossfade; the firm buzz stays.
      [tag, amount, rest].forEach((v) => v.set(withTiming(1, { duration: 200 })));
      const h = setTimeout(haptic.heavy, 200);
      return () => clearTimeout(h);
    }
    card.set(withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }));
    tag.set(withDelay(TAG_MS, withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) })));
    amount.set(withDelay(750, withTiming(1, { duration: 240 })));
    rest.set(withDelay(950, withTiming(1, { duration: 220 })));
    const h = setTimeout(haptic.heavy, TAG_MS);
    return () => clearTimeout(h);
  }, [animate, reduce, card, tag, amount, rest]);

  // Fade only: the card shows the price, and nothing moves next to a price (CLAUDE.md rule 8).
  const cardStyle = useAnimatedStyle(() => ({ opacity: card.get() }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tag.get() }));
  // The colour logo fades out as the tag lands, leaving the same grey logo as Home and the Ditched tab.
  const logoStyle = useAnimatedStyle(() => ({ opacity: 1 - tag.get() }));
  const amountStyle = useAnimatedStyle(() => ({ opacity: amount.get() }));
  // Opacity only: nothing slides under the buttons (CLAUDE.md rule 8).
  const restStyle = useAnimatedStyle(() => ({ opacity: rest.get() }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: rest.get() }));

  const lastCheck = useMemo(() => app.plan.find((r) => r.subId === id && r.kind === 'last-check') ?? null, [app.plan, id]);

  // Back from the service's cancel page: ask once whether it went through, so "ditched" can become "cancelled".
  const away = useRef<{ name: string; done: () => void } | null>(null);
  useEffect(() => {
    const s = AppState.addEventListener('change', (state) => {
      const left = away.current;
      if (state !== 'active' || !left) return;
      away.current = null;
      setTimeout(
        () =>
          ask('Did it go through?', `Did you finish cancelling ${left.name}?`, [
            { text: 'Not yet', style: 'cancel' },
            { text: 'Yes, cancelled', onPress: left.done },
          ]),
        400,
      );
    });
    return () => s.remove();
  }, []);

  if (!sub) return <Gone />;

  const trial = isProTrial(sub);
  // "Cancel by" only for a date the user set (ditching never fills one in); otherwise it's just when it charges.
  const cancelBy = sub.cancelBy && sub.cancelBy >= app.today ? sub.cancelBy : null;
  const charge = chargeOfSub(sub, app.today);
  const yearly = isPricedSub(sub) ? yearlyMinor(sub.amountMinor, sub.cycle) : null;
  const priceLine = isPricedSub(sub) ? `${money(sub.amountMinor, sub.currency)} ${CYCLE_WORDS[sub.cycle]}` : null;
  const help1 = helpFor(sub);
  const blocked = app.notif === 'denied' || app.notif === 'undetermined';
  // "You won't pay … a year, once you cancel." is one sentence: both ends in the same style, only the amount is big.
  const amountWords = { fontSize: tiny ? 17 : 20, lineHeight: tiny ? 22 : 25, fontFamily: F.semi };

  const undo = async () => {
    haptic.light();
    await app.reactivate(sub.id);
    router.back();
  };
  const putBack = () =>
    ask(`Still paying for ${sub.name}?`, 'It goes back on your list with its reminders.', [
      { text: 'Keep it ditched', style: 'cancel' },
      { text: 'Put it back', onPress: () => void undo() },
    ]);
  const cancelled = async () => {
    await app.confirmCancelled(sub.id);
    haptic.success();
    router.dismissTo('/ditched');
    // A win: offer the rating once the Ditched tab has settled.
    setTimeout(() => app.maybeAskReview('cancelled').catch(() => {}), 1500);
  };

  const check = blocked
    ? app.notif === 'denied'
      ? { title: 'Reminders are off', line: 'Turn them on in iPhone Settings so the last reminder can reach you.' }
      : { title: 'Reminders aren’t on', line: 'Tap to turn them on, so the last reminder can reach you.' }
    : lastCheck
      ? {
          title: `Last reminder ${(tiny ? shortDate : weekdayDate)(toDateOnly(lastCheck.fireAt))} at ${shortTimeLabel(app.settings.reminderTime)}`,
          line: `“${lastCheck.body}”`.replace(/ (\S+)$/, '\u00A0$1'),
        }
      : cancelBy
        ? { title: `Cancel by ${chargeDay(cancelBy, app.today)}`, line: 'Cancel before then to stop it.' }
        : charge
          ? // Too soon for a last check: say when it charges, in plain words.
            { title: `Charges ${chargeDay(charge, app.today)}`, line: 'Cancel before then to stop it.' }
          : { title: 'Cancel it before it renews', line: 'No date on this one, so no last reminder.' };

  return (
    <SurfaceContext.Provider value="sun">
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: wide ? 'center' : undefined, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: edge }}
          showsVerticalScrollIndicator={false}
        >
          {/* Done leaves it ditched (cancel later, the last check still comes). Undo only right
              after ditching; reopened, it's "Put it back", which asks first. */}
          <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={animate ? `Undo, keep ${sub.name}` : `Put ${sub.name} back on your list`}
              onPress={animate ? undo : putBack}
              hitSlop={12}
              style={{ minHeight: 44, justifyContent: 'center', paddingRight: 16 }}
            >
              <Txt v="label" style={{ fontSize: 17 }}>
                {animate ? 'Undo' : 'Put it back'}
              </Txt>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              accessibilityHint="Keeps it ditched"
              onPress={() => router.back()}
              hitSlop={12}
              style={{ minHeight: 44, justifyContent: 'center', paddingLeft: 16 }}
            >
              <Txt v="label" style={{ fontSize: 17, fontFamily: F.bold }}>
                Done
              </Txt>
            </Pressable>
          </View>

          {/* Left-aligned and short (owner, Nov 19: "too much on the screen", centred text read like a template).
              Like Splitwise, Cleo and Coinbase's cancel screens: what it is, what it's worth, one line on when,
              then the buttons. The card, the account details and running totals live elsewhere. */}
          {/* Centred between the header and the buttons, so there's no empty band above the buttons. */}
          <View style={wide ? null : { flex: 1, justifyContent: 'center', paddingBottom: 24 }}>
            <Animated.View style={[{ marginTop: tiny ? 22 : compact ? 52 : 72 }, cardStyle]}>
              <Duck width={tiny ? 68 : compact ? 84 : 104} left={20} sink={2} delay={animate ? DUCK_MS : 0} />
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: compact ? 11 : 14 }}>
                <View style={{ width: compact ? 36 : 40, height: compact ? 36 : 40 }}>
                  <SubLogo sub={sub} size={compact ? 36 : 40} ditched />
                  <Animated.View style={[StyleSheet.absoluteFill, logoStyle]}>
                    <SubLogo sub={sub} size={compact ? 36 : 40} />
                  </Animated.View>
                </View>
                <View style={{ flex: 1 }}>
                  {trial ? (
                    <ProLockup size={17} suffix="trial" color={p.cardFg} />
                  ) : (
                    <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
                      {sub.name}
                    </Txt>
                  )}
                  {priceLine ? (
                    <Txt v="body" tone="mute" num style={{ fontSize: 14, marginTop: 2 }} numberOfLines={1}>
                      {priceLine}
                    </Txt>
                  ) : null}
                </View>
                <Animated.View style={tagStyle} accessible accessibilityLabel="Ditched">
                  <DitchedTag size="m" />
                </Animated.View>
              </Card>
            </Animated.View>

            <Animated.View style={[{ marginTop: tiny ? 18 : compact ? 28 : 40 }, amountStyle]}>
              {yearly !== null && sub.currency ? (
                <>
                  <Txt v="label" style={amountWords}>
                    You won’t pay
                  </Txt>
                  <Txt
                    v="displayXL"
                    num
                    color={p.dark ? brand.sunflower : brand.ink}
                    style={{ fontSize: tiny ? 46 : compact ? 54 : 64, lineHeight: tiny ? 52 : compact ? 60 : 72, marginTop: 2, marginLeft: -2 }}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {money(yearly, sub.currency)}
                  </Txt>
                  <Txt v="label" style={amountWords}>
                    a year, once you cancel.
                  </Txt>
                </>
              ) : (
                <Txt v="title" style={{ fontSize: 24, lineHeight: 29 }}>
                  {'Now cancel it, and that’s one less\u00A0charge.'}
                </Txt>
              )}
              {trial ? (
                <Txt v="leadS" tone="fg2" style={{ marginTop: 10, fontSize: 15 }}>
                  You keep your whole list. Reminders drop back to 3.
                </Txt>
              ) : null}
            </Animated.View>

            {/* One line on when: the last check, or when it charges. Reminders off: tap to turn them on. */}
            <Animated.View style={[{ marginTop: tiny ? 14 : 22 }, restStyle]}>
              {isPending(sub) ? (
                <Pressable
                  accessible
                  accessibilityRole={blocked ? 'button' : 'text'}
                  accessibilityLabel={`${check.title}. ${check.line}`}
                  disabled={!blocked}
                  accessibilityHint={app.notif === 'denied' ? 'Opens iPhone Settings' : 'Shows the iPhone permission prompt'}
                  onPress={() => (app.notif === 'denied' ? Linking.openSettings().catch(() => {}) : void app.askNotif())}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 }}
                >
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.dark ? '#2A2721' : 'rgba(22,20,15,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell color={p.dark ? brand.sunflower : brand.ink} size={15} />
                  </View>
                  <Txt v="body" num style={{ flex: 1, fontSize: 15.5, fontFamily: F.semi }}>
                    {check.title}
                    {blocked ? <Txt v="body" style={{ fontSize: 15.5, fontFamily: F.semi, textDecorationLine: 'underline' }}>{' · Turn on'}</Txt> : null}
                  </Txt>
                </Pressable>
              ) : null}
            </Animated.View>
            {wide ? <View style={{ height: 32 }} /> : null}
          </View>

          <Animated.View style={actionsStyle}>
            <Button
              label={help1.label}
              hint={help1.kind === 'steps' ? 'Shows the steps' : 'Opens outside Ditch'}
              onPress={() => {
                if (help1.kind !== 'steps') away.current = { name: sub.name, done: () => void cancelled() };
                help.go(sub);
              }}
              right={help1.kind === 'steps' ? undefined : <External color={p.dark ? brand.ink : brand.sunflower} size={19} />}
              style={[{ marginTop: wide ? 12 : 0 }, compact && { minHeight: 50, borderRadius: 25 }]}
            />
            <Button kind="secondary" label="I cancelled it" onPress={cancelled} style={[{ marginTop: 8 }, compact && { minHeight: 46, borderRadius: 23 }]} />
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={trial ? 'Open Apple subscriptions to cancel Ditch Pro' : 'Billed by Apple? Open Apple subscriptions'}
              hitSlop={{ top: 7, bottom: 7 }}
              onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)}
              style={{ minHeight: compact ? 30 : 36, justifyContent: 'center', marginTop: 2 }}
            >
              <Txt v="body" tone="fg2" center style={{ fontSize: 14 }}>
                {trial ? 'Billed by Apple. ' : 'Billed by Apple? '}
                <Txt v="body" tone="fg2" style={{ fontSize: 14, fontFamily: F.semi, textDecorationLine: 'underline' }}>
                  Open Apple subscriptions
                </Txt>
              </Txt>
            </Pressable>
          </Animated.View>
        </ScrollView>
        {help.sheet}
      </View>
    </SurfaceContext.Provider>
  );
}

function Gone() {
  const insets = useInsets();
  return (
    <View style={{ flex: 1, padding: EDGE, paddingTop: insets.top + 40 }}>
      <Txt v="title">It’s gone from your list.</Txt>
      <Button label="Back" onPress={() => router.back()} style={{ marginTop: 24 }} />
    </View>
  );
}
