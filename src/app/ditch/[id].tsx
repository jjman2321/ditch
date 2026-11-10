// 10 / 10b / 10-se · Ditched. The stamp lands (MOTION.md §3), then
// "$X a year you won't pay, once you cancel." Ditching doesn't cancel
// anything: the user still has to cancel with the service, so the one
// last check reminder stays, and "I already cancelled" is what confirms it.

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { toDateOnly, weekdayDate } from '@/domain/dates';
import { CYCLE_WORDS, yearlyMinor } from '@/domain/money';
import { shortTimeLabel } from '@/domain/settings';
import { chargeOfSub, confirmedSavings, isPending, isPricedSub, isProTrial } from '@/domain/subs';
import { helpFor, openUrl, useCancelHelp } from '@/ditch/CancelHelp';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { Bell, Button, Card, Duck, EDGE, External, F, ProLockup, Stamp, SurfaceContext, Txt, brand, haptic, paletteFor, useInsets, useIsDark } from '@/ui/sunflower';

const IMPACT_MS = 420;

export default function Ditched() {
  const { id, fresh, preview } = useLocalSearchParams<{ id: string; fresh?: string; preview?: string }>();
  const app = useApp();
  const money = useAppMoney();
  const insets = useInsets();
  const { height } = useWindowDimensions();
  const reduce = useReducedMotion();
  const compact = height < 720;
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
  const stampScale = useSharedValue(animate && !reduce ? 1.4 : 1);
  const stampTurn = useSharedValue(animate && !reduce ? 4 : 0);
  const stampInk = useSharedValue(animate ? 0 : 1);
  const amount = useSharedValue(animate ? 0 : 1);
  const rest = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) return;
    if (reduce) {
      // Everything at once with a short crossfade; the heavy haptic stays.
      [stampInk, amount, rest].forEach((v) => v.set(withTiming(1, { duration: 200 })));
      const h = setTimeout(haptic.heavy, 200);
      return () => clearTimeout(h);
    }
    card.set(withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }));
    stampScale.set(withDelay(260, withTiming(1, { duration: 160, easing: Easing.bezier(0.5, 0, 0.9, 0.4) })));
    stampTurn.set(withDelay(260, withSpring(0, { damping: 14, stiffness: 220 })));
    stampInk.set(withDelay(IMPACT_MS, withSequence(withTiming(0.85, { duration: 0 }), withTiming(1, { duration: 120 }))));
    amount.set(withDelay(520, withTiming(1, { duration: 200 })));
    rest.set(withDelay(700, withTiming(1, { duration: 220 })));
    const h = setTimeout(haptic.heavy, IMPACT_MS);
    return () => clearTimeout(h);
  }, [animate, reduce, card, stampScale, stampTurn, stampInk, amount, rest]);

  const cardStyle = useAnimatedStyle(() => ({ opacity: card.get(), transform: [{ translateY: (1 - card.get()) * 40 }] }));
  const stampStyle = useAnimatedStyle(() => ({ opacity: stampInk.get(), transform: [{ scale: stampScale.get() }, { rotate: `${stampTurn.get()}deg` }] }));
  const amountStyle = useAnimatedStyle(() => ({ opacity: amount.get() }));
  const restStyle = useAnimatedStyle(() => ({ opacity: rest.get(), transform: [{ translateY: (1 - rest.get()) * 6 }] }));

  const lastCheck = useMemo(() => app.plan.find((r) => r.subId === id && r.kind === 'last-check') ?? null, [app.plan, id]);

  if (!sub) return <Gone />;

  const trial = isProTrial(sub);
  const charge = sub.cancelBy && sub.cancelBy >= app.today ? sub.cancelBy : chargeOfSub(sub, app.today);
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
  const cancelled = async () => {
    await app.confirmCancelled(sub.id);
    haptic.success();
    router.dismissTo('/ditched');
  };

  const check = blocked
    ? { title: 'Reminders are off', line: 'Turn them on in iPhone Settings so the last check can reach you.' }
    : lastCheck
      ? {
          title: `One last check: ${weekdayDate(toDateOnly(lastCheck.fireAt))} · ${shortTimeLabel(app.settings.reminderTime)}`,
          line: `“${lastCheck.body}”`,
        }
      : { title: `It charges ${weekdayDate(charge)}`, line: 'Too close for a last check. Cancel now to be safe.' };

  return (
    <SurfaceContext.Provider value="sun">
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: EDGE }} showsVerticalScrollIndicator={false}>
          <View style={{ height: 44, justifyContent: 'center', alignItems: 'flex-start' }}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Undo, keep ${sub.name}`} onPress={undo} hitSlop={12} style={{ minHeight: 44, justifyContent: 'center', paddingRight: 16 }}>
              <Txt v="label" style={{ fontSize: 17 }}>
                Undo
              </Txt>
            </Pressable>
          </View>

          <Animated.View style={[{ marginTop: compact ? 62 : 86 }, cardStyle]}>
            <Duck width={compact ? 84 : 114} left={20} sink={2} delay={animate ? 120 : 0} />
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: compact ? 11 : 14 }}>
              <SubLogo sub={sub} size={compact ? 36 : 40} />
              <View style={{ flex: 1 }}>
                {trial ? (
                  <ProLockup size={17} suffix="trial" color={p.cardFg} />
                ) : (
                  <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
                    {sub.name}
                  </Txt>
                )}
                <Txt v="body" tone="mute" num style={{ fontSize: compact ? 13.5 : 14, marginTop: 2 }} numberOfLines={2}>
                  {trial ? 'Charges' : 'Cancel by'} {weekdayDate(charge)}
                  {priceLine ? ` · ${priceLine}` : ''}
                </Txt>
              </View>
            </Card>
          </Animated.View>

          <View style={{ alignItems: 'center', marginTop: compact ? 8 : 14 }}>
            <Animated.View style={stampStyle}>
              <Stamp date={sub.ditchedOn ?? app.today} width={compact ? 222 : 270} />
            </Animated.View>
          </View>

          <Animated.View style={[{ alignItems: 'center', marginTop: compact ? 2 : 6 }, amountStyle]}>
            {yearly !== null && sub.currency ? (
              <>
                <Txt v="displayXL" num center color={p.dark ? brand.sunflower : brand.ink} style={{ fontSize: compact ? 54 : 66, lineHeight: compact ? 58 : 70 }} adjustsFontSizeToFit numberOfLines={1}>
                  {money(yearly, sub.currency)}
                </Txt>
                <Txt v="title" center style={{ fontSize: compact ? 20 : 24, lineHeight: compact ? 23 : 28, marginTop: 2 }}>
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
                Cancel it and you’ll be saving {money(already.yearlyMinor + yearly, sub.currency!, { whole: true })} a year.
              </Txt>
            ) : null}
          </Animated.View>

          <View style={{ flex: 1, minHeight: compact ? 10 : 14 }} />

          <Animated.View style={restStyle}>
            {isPending(sub) ? (
              <Pressable
                accessible
                accessibilityRole={blocked ? 'button' : 'text'}
                accessibilityLabel={`${check.title}. ${check.line}`}
                disabled={!blocked}
                onPress={() => router.push('/settings')}
              >
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 12 : 14, paddingHorizontal: compact ? 14 : 16, paddingVertical: compact ? 10 : 13 }}>
                  <View style={{ width: compact ? 32 : 36, height: compact ? 32 : 36, borderRadius: 18, backgroundColor: brand.sunflower, borderWidth: p.dark ? 0 : 2, borderColor: brand.ink, alignItems: 'center', justifyContent: 'center' }}>
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
              onPress={() => help.open(sub)}
              right={help1.kind === 'steps' ? undefined : <External color={p.dark ? brand.ink : brand.sunflower} size={19} />}
              style={[{ marginTop: compact ? 10 : 12 }, compact && { minHeight: 50, borderRadius: 25 }]}
            />
            <Button kind="secondary" label="I already cancelled" onPress={cancelled} style={[{ marginTop: 8 }, compact && { minHeight: 46, borderRadius: 23 }]} />
            <Pressable accessibilityRole="link" accessibilityLabel="Billed by Apple? Open Apple subscriptions" onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} style={{ minHeight: compact ? 30 : 36, justifyContent: 'center', marginTop: 2 }}>
              <Txt v="body" tone="fg2" center style={{ fontSize: 14 }}>
                {trial ? 'Settings → your name → Subscriptions → Ditch.' : 'Billed by Apple? Settings → Subscriptions.'}
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
