// 5 · Reminders pre-ask. A real-feeling lock screen (design/v10 render 05):
// the lock, the day and 9:00, the duck as the wallpaper, the flashlight and
// camera buttons. The user's own first reminders arrive like real ones: the
// older one lands in its place, then the newest lands above it and the older
// one fades back, like iOS. Every card's place is kept from the start and the
// next one only starts once the last has settled, so no two ever overlap
// (owner, Nov 19). "Turn on reminders" shows the real iOS prompt; "Maybe
// later" doesn't ask. Reduce Motion: everything already in place.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { catalogPrice } from '@/catalog/prices';
import { addDays, longDate, weekdayDate, weekdayName, type DateOnly } from '@/domain/dates';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { useFirstReminders } from '@/onboarding/useFirstReminders';
import { getNotifStatus, requestNotifPermission, type NotifStatus } from '@/services/notifications';
import { isPriced as isPricedPick } from '@/state/picks';
import { byYearlyDesc, onboardingToday, useMoney, useOnboarding, usePickedList } from '@/state/onboarding';
import { Bell, Button, Camera, Duck, F, Flashlight, ForceLightContext, Lock, NotificationPreview, STEP_HEADER_H, Txt, brand, useFrame, usePalette } from '@/ui/sunflower';

const NB = ' ';

/** Keep the last two words together, so a line never ends on one word. */
const noOrphan = (s: string) => s.replace(/ (\S+)$/, `${NB}$1`);

type Shown = { key: string; day: DateOnly; body: string };

function LockButton({ children }: { children: React.ReactNode }) {
  return <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(22,20,15,0.14)', alignItems: 'center', justifyContent: 'center' }}>{children}</View>;
}

// The cards land 600 ms apart (motion doc fix 11: 900 kept you waiting before the duck).
// Each one takes LAND ms, well inside the gap, so a card has settled before the next starts.
const GAP = 600;
const LAND = 320;
/** How far a card drops from. Less than the 8pt gap between cards, so it never reaches the one above. */
const DROP = 6;

/** One card in its own slot: invisible until it lands, then a short fade and drop. The slot never moves. */
function LandingCard({ landed, reduce, children }: { landed: boolean; reduce: boolean; children: React.ReactNode }) {
  const t = useSharedValue(landed || reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) t.set(1);
    else if (landed) t.set(withTiming(1, { duration: LAND, easing: Easing.out(Easing.cubic) }));
  }, [landed, reduce, t]);
  const style = useAnimatedStyle(() => ({ opacity: t.get(), transform: [{ translateY: (t.get() - 1) * DROP }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function Reminders() {
  const p = usePalette();
  const f = useFrame({ colH: 800 });
  const { setNotifications, country, pro } = useOnboarding();
  const n = usePickedList().length;
  // Already answered the iPhone prompt (e.g. after Delete all): no prompt will show, so say what happens.
  const [status, setStatus] = useState<NotifStatus | null>(null);
  useEffect(() => {
    // The web preview has no real permission: always show the first-run version.
    if (Platform.OS !== 'web')
      getNotifStatus()
        .then(setStatus)
        .catch(() => {});
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
  // Cards fill the stack top to bottom, one after the other (owner, Nov 19: "needs to be clean").
  // Nothing else changes while they land: the lock screen's date, which card is bright and every
  // time label are fixed from the first frame, so the only motion is each card arriving.
  const count = shown.length;
  const [arrived, setArrived] = useState(reduce ? count : 0);
  useEffect(() => {
    if (reduce) return;
    const timers = Array.from({ length: count }, (_, i) => setTimeout(() => setArrived((a) => Math.max(a, i + 1)), 400 + i * GAP));
    return () => timers.forEach(clearTimeout);
  }, [reduce, count]);
  const landed = reduce ? count : arrived;
  // Newest on top, like iOS. Every card is laid out from the start (invisible until it lands), so the
  // stack's height is fixed and no card ever moves or covers another.
  const stack = shown.map((s, i) => ({ s, i })).reverse();

  // The lock screen shows the newest reminder's day ("now"); an older card from the same day says "9:00 AM", like iOS.
  const lockDay = shown[count - 1].day;
  const card = (s: Shown, top: boolean) => <NotificationPreview faded={!top} time={top ? 'now' : s.day === lockDay ? '9:00 AM' : weekdayDate(s.day)} message={noOrphan(s.body)} />;
  // Clear room under the cards for the torch and camera buttons (16 from the edge, 44 tall) plus 12pt of air.
  // Taller phones also keep the duck's head below the cards, never under their words.
  // Room for the torch and camera buttons; small phones drop them (decoration) so the reminders fit.
  const lockBottom = f.small ? 16 : 16 + 44 + 8;

  // Already started Pro on the way to their bank (DECISIONS #70): no second paywall.
  const go = () => router.push(n > 0 && !pro ? '/paywall' : '/onboarding/done');
  const turnOn = async () => {
    const status = await requestNotifPermission();
    setNotifications(status === 'granted' || status === 'quiet' ? 'granted' : 'denied');
    go();
  };

  return (
    <OnbRoot surface="cream">
      {/* The step header is drawn once by onboarding/_layout.tsx and stays still; this strip keeps its place, outside the scroll. */}
      <View style={{ height: f.top + STEP_HEADER_H }} />
      <FitScroll style={{ paddingHorizontal: f.edge, paddingBottom: 4 }}>
        {/* SE: the paywall's smaller title size, so no word sits alone on a line. */}
        <Txt
          v="title"
          accessibilityRole="header"
          style={[
            { marginTop: f.tiny ? 10 : 16 },
            f.tiny
              ? { fontSize: 22, lineHeight: 27, letterSpacing: -0.6 }
              : f.small
                ? { fontSize: 24, lineHeight: 30, letterSpacing: -0.7 }
                : f.tablet
                  ? null
                  : { fontSize: 26, lineHeight: 32, letterSpacing: -0.8 },
          ]}
        >
          {`Get a reminder\nbefore you’re${NB}charged.`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          {'3 days and 1 day before. You pick the time.\nOnly about your subscriptions.'}
        </Txt>

        {/* A picture of the lock screen, always in the sunflower look (dark mode too). */}
        <ForceLightContext.Provider value>
          <View
            accessible
            accessibilityLabel={`${example ? 'An example reminder' : 'Your first reminders'}: ${shown.map((s) => `${weekdayDate(s.day)}, 9 AM: ${s.body}`).join('. ')}`}
            style={{
              marginTop: f.tiny ? 12 : f.small ? 20 : 12,
              flex: 1,
              // Grows into spare room, but never pushes the buttons below off screen (audit Nov 19).
              minHeight: f.tiny ? 196 : f.small ? 238 : 300,
              borderRadius: 34,
              backgroundColor: brand.sunflower,
              overflow: 'hidden',
              paddingTop: f.small ? 14 : 14,
              paddingHorizontal: 12,
              paddingBottom: lockBottom,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            }}
          >
            <View style={{ alignItems: 'center' }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              <Lock color={brand.ink} />
              <Txt v="label" color={brand.ink} style={{ marginTop: 6 }} maxFontSizeMultiplier={1.2}>
                {longDate(lockDay)}
              </Txt>
              <Txt
                v="label"
                color={brand.ink}
                num
                style={{ fontFamily: F.wideHeavy, fontSize: f.tiny ? 40 : f.small ? 48 : f.tablet ? 72 : 60, lineHeight: f.tiny ? 44 : f.small ? 52 : f.tablet ? 76 : 64, letterSpacing: -2 }}
                maxFontSizeMultiplier={1}
              >
                9:00
              </Txt>
            </View>

            <View importantForAccessibility="no-hide-descendants" style={{ zIndex: 2, marginTop: 14, gap: 8 }}>
              {stack.map(({ s }, k) => (
                <LandingCard key={s.key} landed={k < landed} reduce={reduce}>
                  {/* The newest (top) card is the bright one; older ones sit back. */}
                  {card(s, k === 0)}
                </LandingCard>
              ))}
            </View>

            {/* The wallpaper: Ditch, rising once the reminders are in. SE: no room, so no duck. */}
            {f.small ? null : (
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -4, alignItems: 'center' }}>
                <Duck width={128} bottom={0} delay={reduce ? 0 : 400 + count * GAP} style={{ position: 'relative' }} />
              </View>
            )}
            {f.small ? null : (
              <>
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
              </>
            )}
          </View>
        </ForceLightContext.Provider>
      </FitScroll>

      {/* Pinned, so "Maybe later" is always on screen (audit Nov 19); the lock screen above takes what's left. */}
      <View style={{ paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        {status === 'denied' ? (
          <Button
            label="Open iPhone Settings"
            hint="Turn on notifications for Ditch there"
            left={<Bell color={p.ctaFg} size={20} />}
            onPress={() => (setNotifications('denied'), Linking.openSettings().catch(() => {}), go())}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Button
            label={decided ? 'Continue' : 'Turn on reminders'}
            hint={decided ? undefined : 'Shows the iPhone permission prompt'}
            left={decided ? undefined : <Bell color={p.ctaFg} size={20} />}
            onPress={turnOn}
            style={{ marginTop: f.tiny ? 10 : 16 }}
          />
        )}
        <Txt v="sub" tone="mute" center style={{ marginTop: f.tiny ? 4 : 8 }}>
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
            style={{ marginTop: f.tiny ? 0 : 4 }}
          />
        )}
      </View>
    </OnbRoot>
  );
}
