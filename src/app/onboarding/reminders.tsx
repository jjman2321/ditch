// 5 · Reminders pre-ask. A real-feeling lock screen (design/v10 render 05):
// the lock, the day and 9:00, the duck as the wallpaper, the flashlight and
// camera buttons. The user's own first reminders arrive like real ones: the
// older one lands, then the newest drops in on top and the older one fades
// back, exactly like iOS. "Turn on reminders" shows the real iOS prompt;
// "Maybe later" doesn't ask. Reduce Motion: everything already in place.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition, useReducedMotion } from 'react-native-reanimated';

import { catalogPrice } from '@/catalog/prices';
import { addDays, longDate, weekdayDate, weekdayName, type DateOnly } from '@/domain/dates';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { useFirstReminders } from '@/onboarding/useFirstReminders';
import { getNotifStatus, requestNotifPermission, type NotifStatus } from '@/services/notifications';
import { isPriced as isPricedPick } from '@/state/picks';
import { byYearlyDesc, onboardingToday, useMoney, useOnboarding, usePickedList } from '@/state/onboarding';
import { Bell, Button, Camera, Duck, F, Flashlight, ForceLightContext, Lock, NotificationPreview, StepHeader, Txt, brand, useFrame, usePalette } from '@/ui/sunflower';

const NB = ' ';

/** Keep the last two words together, so a line never ends on one word. */
const noOrphan = (s: string) => s.replace(/ (\S+)$/, `${NB}$1`);

type Shown = { key: string; day: DateOnly; body: string };

function LockButton({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(22,20,15,0.14)', alignItems: 'center', justifyContent: 'center' }}>{children}</View>
  );
}

export default function Reminders() {
  const p = usePalette();
  const f = useFrame({ colH: 800 });
  const { setNotifications, country } = useOnboarding();
  const n = usePickedList().length;
  // Already answered the iPhone prompt (e.g. after Delete all): no prompt will show, so say what happens.
  const [status, setStatus] = useState<NotifStatus | null>(null);
  useEffect(() => {
    // The web preview has no real permission: always show the first-run version.
    if (Platform.OS !== 'web') getNotifStatus().then(setStatus).catch(() => {});
  }, []);
  const decided = status === 'granted' || status === 'quiet' || status === 'denied';
  const money = useMoney();
  const { reminders } = useFirstReminders(f.small ? 1 : 2);
  const today = onboardingToday();
  const reduce = useReducedMotion();

  // Soonest first. Nothing with a date yet: an example from their own biggest pick
  // (or Netflix if nothing's picked), clearly called an example.
  const list = usePickedList();
  const example = reminders.length === 0;
  const shown: Shown[] = !example
    ? reminders.map((r) => ({ key: r.id, day: r.reminder, body: r.body }))
    : (() => {
        const biggest = [...list].sort(byYearlyDesc)[0];
        const charge = addDays(today, 9);
        if (biggest) {
          const price = isPricedPick(biggest) ? ` ${money(biggest.amountMinor, biggest.currency)}.` : '';
          return [{ key: 'example', day: addDays(charge, -3), body: `${biggest.name} renews ${weekdayName(charge)}.${price} Still using it?` }];
        }
        const local = catalogPrice('netflix', country);
        const price = local ? ` ${money(local.amountMinor, local.currency)}.` : '';
        return [{ key: 'example', day: addDays(charge, -3), body: `Netflix renews ${weekdayName(charge)}.${price} Still watching?` }];
      })();
  // The lock screen shows the moment the newest one arrives.
  const newest = shown[shown.length - 1];

  // The older one lands first, then the newest drops in on top.
  const count = shown.length;
  const [arrived, setArrived] = useState(reduce ? count : 0);
  useEffect(() => {
    if (reduce) return;
    const timers = Array.from({ length: count }, (_, i) => setTimeout(() => setArrived((a) => Math.max(a, i + 1)), 400 + i * 900));
    return () => timers.forEach(clearTimeout);
  }, [reduce, count]);
  const stack = (reduce ? shown : shown.slice(0, arrived)).slice().reverse();
  // Space for the whole stack from the start, so nothing jumps while they arrive.
  const [stackH, setStackH] = useState(0);

  const card = (s: Shown, top: boolean) => (
    <NotificationPreview faded={!top} time={top ? 'now' : weekdayDate(s.day)} message={noOrphan(s.body)} />
  );

  const go = () => router.push(n > 0 ? '/paywall' : '/onboarding/done');
  const turnOn = async () => {
    const status = await requestNotifPermission();
    setNotifications(status === 'granted' || status === 'quiet' ? 'granted' : 'denied');
    go();
  };

  return (
    <OnbRoot surface="cream">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <StepHeader step={4} />
        {/* SE: the paywall's smaller title size, so no word sits alone on a line. */}
        <Txt v="title" accessibilityRole="header" style={[{ marginTop: 16 }, f.small ? { fontSize: 26, lineHeight: 32, letterSpacing: -0.8 } : null]}>
          {f.small ? `Get a reminder before\neach${NB}charge.` : `Get a reminder before each${NB}charge.`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          {'3 days and 1 day before, at 9:00 AM.\nOnly about your subscriptions.'}
        </Txt>

        {/* A picture of the lock screen, always in the sunflower look (dark mode too). */}
        <ForceLightContext.Provider value>
          <View
            accessible
            accessibilityLabel={`${example ? 'An example reminder' : 'Your first reminders'}: ${shown.map((s) => `${weekdayDate(s.day)}, 9 AM: ${s.body}`).join('. ')}`}
            style={{
              marginTop: 20,
              flex: 1,
              minHeight: f.small ? 238 : 390,
              borderRadius: 34,
              backgroundColor: brand.sunflower,
              overflow: 'hidden',
              paddingTop: f.small ? 14 : 20,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            }}
          >
            <View style={{ alignItems: 'center' }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              <Lock color={brand.ink} />
              <Txt v="label" color={brand.ink} style={{ marginTop: 6 }} maxFontSizeMultiplier={1.2}>
                {longDate(newest.day)}
              </Txt>
              <Txt v="label" color={brand.ink} num style={{ fontFamily: F.wideHeavy, fontSize: f.small ? 48 : 72, lineHeight: f.small ? 52 : 76, letterSpacing: -2 }} maxFontSizeMultiplier={1}>
                9:00
              </Txt>
            </View>

            {/* Invisible copy of the full stack, to hold its height. */}
            <View pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ position: 'absolute', left: 12, right: 12, opacity: 0 }}>
              <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ gap: 8 }}>
                {shown.map((s, i) => (
                  <View key={s.key}>{card(s, i === shown.length - 1)}</View>
                ))}
              </View>
            </View>

            <View importantForAccessibility="no-hide-descendants" style={{ zIndex: 2, marginTop: 14, minHeight: stackH, gap: 8 }}>
              {stack.map((s, i) => (
                <Animated.View key={s.key} entering={reduce ? undefined : FadeInDown.springify().damping(18)} layout={reduce ? undefined : LinearTransition.springify().damping(20)}>
                  {card(s, i === 0)}
                </Animated.View>
              ))}
            </View>

            {/* The wallpaper: Ditch, rising once the reminders are in. SE: no room, so no duck. */}
            {f.small ? null : (
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -4, alignItems: 'center' }}>
                <Duck width={128} bottom={0} delay={reduce ? 0 : 400 + count * 900} style={{ position: 'relative' }} />
              </View>
            )}
            <View pointerEvents="none" style={{ position: 'absolute', left: 16, bottom: 16 }}>
              <LockButton>
                <Flashlight color={brand.ink} />
              </LockButton>
            </View>
            <View pointerEvents="none" style={{ position: 'absolute', right: 16, bottom: 16 }}>
              <LockButton>
                <Camera color={brand.ink} />
              </LockButton>
            </View>
          </View>
        </ForceLightContext.Provider>

        {status === 'denied' ? (
          <Button label="Open iPhone Settings" hint="Turn on notifications for Ditch there" left={<Bell color={p.ctaFg} size={20} />} onPress={() => (setNotifications('denied'), Linking.openSettings().catch(() => {}), go())} style={{ marginTop: 16 }} />
        ) : (
          <Button label={decided ? 'Continue' : 'Turn on reminders'} hint={decided ? undefined : 'Shows the iPhone permission prompt'} left={decided ? undefined : <Bell color={p.ctaFg} size={20} />} onPress={turnOn} style={{ marginTop: 16 }} />
        )}
        <Txt v="sub" tone="mute" center style={{ marginTop: 8 }}>
          {status === 'denied' ? 'Notifications for Ditch are off on this iPhone.' : decided ? 'Reminders are already on.' : 'Tap “Allow” on the next screen.'}
        </Txt>
        {status === 'granted' || status === 'quiet' ? null : (
          <Button
            kind="text"
            label="Maybe later"
            onPress={() => {
              setNotifications('later');
              go();
            }}
            style={{ marginTop: 4 }}
          />
        )}
      </FitScroll>
    </OnbRoot>
  );
}
