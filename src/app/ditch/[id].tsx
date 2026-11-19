// 10 / 10b / 10-se · Ditched. Same moment as the website (owner, Nov 15; DECISIONS #58): the row's
// "Ditched" tag appears with a firm buzz, the logo dims, the duck pops up over the row, then
// "$X a year you won't pay, once you cancel." fades in. No stamp. Ditching doesn't cancel
// anything: the user still has to cancel with the service, so the one
// last check reminder stays, and "I already cancelled" is what confirms it.

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { AppState, Linking, Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { shortDate, toDateOnly, weekdayDate } from '@/domain/dates';
import { CYCLE_WORDS, yearlyMinor } from '@/domain/money';
import { shortTimeLabel } from '@/domain/settings';
import { chargeOfSub, confirmedSavings, isPending, isPricedSub, isProTrial } from '@/domain/subs';
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
  // The logo dims as the tag lands, like the website's grey logo.
  const logoStyle = useAnimatedStyle(() => ({ opacity: 1 - 0.55 * tag.get() }));
  const amountStyle = useAnimatedStyle(() => ({ opacity: amount.get() }));
  // Opacity only: nothing slides under the buttons (CLAUDE.md rule 8).
  const restStyle = useAnimatedStyle(() => ({ opacity: rest.get() }));

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
  // "Cancel by" only for a date the user set; otherwise it's just when it charges.
  const cancelBy = sub.cancelBy && sub.cancelBy >= app.today ? sub.cancelBy : null;
  const charge = chargeOfSub(sub, app.today);
  const yearly = isPricedSub(sub) ? yearlyMinor(sub.amountMinor, sub.cycle) : null;
  const priceLine = isPricedSub(sub) ? `${money(sub.amountMinor, sub.currency)} ${CYCLE_WORDS[sub.cycle]}` : null;
  const already = confirmedSavings(app.subs, app.settings.currency).find((s) => s.currency === sub.currency);
  const help1 = helpFor(sub);
  const blocked = app.notif === 'denied' || app.notif === 'undetermined';

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
      ? { title: 'Reminders are off', line: 'Turn them on in iPhone Settings so the last check can reach\u00A0you.' }
      : { title: 'Reminders aren’t on yet', line: 'Tap to turn them on, so the last check can reach\u00A0you.' }
    : lastCheck
      ? {
          title: `One last check: ${(tiny ? shortDate : weekdayDate)(toDateOnly(lastCheck.fireAt))} · ${shortTimeLabel(app.settings.reminderTime)}`,
          line: `“${lastCheck.body}”`.replace(/ (\S+)$/, '\u00A0$1'),
        }
      : charge
        ? { title: `It charges ${weekdayDate(charge)}`, line: 'Too close for a last check. Cancel now to be safe.' }
        : cancelBy
          ? { title: `Cancel by ${weekdayDate(cancelBy)}`, line: 'No last check on this one. Cancel before then to be safe.' }
          : { title: 'No date on this one', line: 'So there’s no last check. Cancel it before it renews.' };

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

          <Animated.View style={[{ marginTop: tiny ? 22 : compact ? 62 : 86 }, cardStyle]}>
            <Duck width={tiny ? 68 : compact ? 84 : 114} left={20} sink={2} delay={animate ? DUCK_MS : 0} />
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: compact ? 11 : 14 }}>
              <Animated.View style={logoStyle}>
                <SubLogo sub={sub} size={compact ? 36 : 40} />
              </Animated.View>
              <View style={{ flex: 1 }}>
                {trial ? (
                  <ProLockup size={17} suffix="trial" color={p.cardFg} />
                ) : (
                  <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
                    {sub.name}
                  </Txt>
                )}
                <Txt v="body" tone="mute" num style={{ fontSize: compact ? 13.5 : 14, marginTop: 2 }} numberOfLines={2}>
                  {cancelBy ? `Cancel by ${(tiny ? shortDate : weekdayDate)(cancelBy)}` : charge ? `Charges ${(tiny ? shortDate : weekdayDate)(charge)}` : 'Cancel before it renews'}
                  {priceLine ? ` · ${priceLine}` : ''}
                </Txt>
              </View>
              <Animated.View style={tagStyle} accessible accessibilityLabel="Ditched">
                <DitchedTag />
              </Animated.View>
            </Card>
          </Animated.View>

          {/* What the cancel page will ask for (DECISIONS #60). */}
          {sub.paidWith || sub.accountEmail ? (
            <Txt v="sub" tone="fg2" center num style={{ marginTop: 10 }} numberOfLines={2}>
              {[sub.paidWith ? `Paid with ${sub.paidWith}` : null, sub.accountEmail ? `Account:\u00A0${sub.accountEmail}` : null].filter(Boolean).join(' · ')}
            </Txt>
          ) : null}

          <Animated.View style={[{ alignItems: 'center', marginTop: tiny ? 10 : compact ? 28 : 40 }, amountStyle]}>
            {yearly !== null && sub.currency ? (
              <>
                <Txt
                  v="displayXL"
                  num
                  center
                  color={p.dark ? brand.sunflower : brand.ink}
                  style={{ fontSize: tiny ? 44 : compact ? 54 : 66, lineHeight: tiny ? 48 : compact ? 58 : 70 }}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {money(yearly, sub.currency)}
                </Txt>
                <Txt v="title" center style={{ fontSize: tiny ? 18 : compact ? 20 : 24, lineHeight: tiny ? 21 : compact ? 23 : 28, marginTop: 2 }}>
                  {'a year you won’t pay,\nonce you cancel.'}
                </Txt>
              </>
            ) : (
              <Txt v="title" center style={{ fontSize: 24, lineHeight: 28 }}>
                {'Now cancel it, and\nthat’s one less charge.'}
              </Txt>
            )}
            {compact ? null : trial ? (
              <Txt v="leadS" tone="fg2" center style={{ marginTop: 12, fontSize: 15, marginHorizontal: -12 }}>
                You keep your whole list. Reminders drop back to 3.
              </Txt>
            ) : already && yearly !== null ? (
              <Txt v="leadS" tone="fg2" center num style={{ marginTop: 12 }}>
                With the ones you’ve cancelled, that’s {money(already.yearlyMinor + yearly, sub.currency!, { whole: true })} a year you won’t pay.
              </Txt>
            ) : null}
          </Animated.View>

          {/* Capped, so on big phones the amount and the reminder card stay together. */}
          <View style={wide ? { height: 40 } : { flex: 1, minHeight: compact ? 10 : 14, maxHeight: 56 }} />

          <Animated.View style={restStyle}>
            {isPending(sub) ? (
              <Pressable
                accessible
                accessibilityRole={blocked ? 'button' : 'text'}
                accessibilityLabel={`${check.title}. ${check.line}`}
                disabled={!blocked}
                accessibilityHint={app.notif === 'denied' ? 'Opens iPhone Settings' : 'Shows the iPhone permission prompt'}
                onPress={() => (app.notif === 'denied' ? Linking.openSettings().catch(() => {}) : void app.askNotif())}
              >
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 12 : 14, paddingHorizontal: compact ? 14 : 16, paddingVertical: tiny ? 8 : compact ? 10 : 13 }}>
                  <View
                    style={{
                      width: compact ? 32 : 36,
                      height: compact ? 32 : 36,
                      borderRadius: 18,
                      backgroundColor: brand.sunflower,
                      borderWidth: p.dark ? 0 : 2,
                      borderColor: brand.ink,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bell color={brand.ink} fill={brand.ink} size={16} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt v="label" num color={p.cardFg} style={{ fontFamily: F.bold, fontSize: compact ? 14.5 : 15.5 }}>
                      {check.title}
                    </Txt>
                    <Txt v="body" tone="mute" style={{ fontSize: compact ? 14 : 14.5, marginTop: 1 }}>
                      {check.line}
                    </Txt>
                  </View>
                </Card>
              </Pressable>
            ) : null}
            <Button
              label={help1.label}
              hint={help1.kind === 'steps' ? 'Shows the steps' : 'Opens outside Ditch'}
              onPress={() => {
                if (help1.kind !== 'steps') away.current = { name: sub.name, done: () => void cancelled() };
                help.go(sub);
              }}
              right={help1.kind === 'steps' ? undefined : <External color={p.dark ? brand.ink : brand.sunflower} size={19} />}
              style={[{ marginTop: compact ? 10 : 12 }, compact && { minHeight: 50, borderRadius: 25 }]}
            />
            <Button kind="secondary" label="I already cancelled" onPress={cancelled} style={[{ marginTop: 8 }, compact && { minHeight: 46, borderRadius: 23 }]} />
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={trial ? 'Open Apple subscriptions to cancel Ditch Pro' : 'Billed by Apple? Open Apple subscriptions'}
              hitSlop={{ top: 7, bottom: 7 }}
              onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)}
              style={{ minHeight: compact ? 30 : 36, justifyContent: 'center', marginTop: 2 }}
            >
              {trial ? (
                <Txt v="body" tone="fg2" center style={{ fontSize: 14 }}>
                  Settings → your name → Subscriptions → Ditch.
                </Txt>
              ) : (
                <Txt v="body" tone="fg2" center style={{ fontSize: 14 }}>
                  {'Billed by Apple? '}
                  <Txt v="body" tone="fg2" style={{ fontSize: 14, fontFamily: F.semi, textDecorationLine: 'underline' }}>
                    Open Apple subscriptions
                  </Txt>
                </Txt>
              )}
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
