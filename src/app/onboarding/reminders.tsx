// 5 · Reminders pre-ask (design/v12 render 05). After the dates, so it can
// show the user's own first reminders, worded like the real ones. "Turn on
// reminders" shows the real iOS prompt; "Maybe later" doesn't ask.

import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { catalogPrice } from '@/catalog/prices';
import { addDays, weekdayDate, weekdayName } from '@/domain/dates';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { useFirstReminders } from '@/onboarding/useFirstReminders';
import { requestNotifPermission } from '@/services/notifications';
import { onboardingToday, useMoney, useOnboarding, usePickedList } from '@/state/onboarding';
import { Bell, Button, ForceLightContext, NotificationPreview, StepHeader, Txt, brand, useFrame, usePalette } from '@/ui/sunflower';

const NB = ' ';

/** Keep the last two words together, so a line never ends on one word. */
const noOrphan = (s: string) => s.replace(/ (\S+)$/, `${NB}$1`);

export default function Reminders() {
  const p = usePalette();
  const f = useFrame({ colH: 800 });
  const { setNotifications, country } = useOnboarding();
  const n = usePickedList().length;
  const money = useMoney();
  const { reminders } = useFirstReminders(f.small ? 1 : 2);
  const today = onboardingToday();
  const reduce = useReducedMotion();

  // Nothing picked yet: the Welcome example instead.
  const shown = reminders.length
    ? reminders.map((r) => ({ key: r.id, date: weekdayDate(r.reminder), body: r.body }))
    : (() => {
        const local = catalogPrice('netflix', country);
        const charge = addDays(today, 9);
        const price = local ? ` ${money(local.amountMinor, local.currency)}.` : '';
        return [{ key: 'example', date: weekdayDate(addDays(charge, -3)), body: `Netflix renews ${weekdayName(charge)}.${price} Still watching?` }];
      })();

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
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
          {`Get a reminder before each${NB}charge.`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          {'3 days and 1 day before, at 9:00 AM.\nOnly about your subscriptions.'}
        </Txt>

        {/* Always the sunflower panel, in dark mode too: it's a picture of the lock screen. */}
        <ForceLightContext.Provider value>
          <View
            accessible
            accessibilityLabel={`Your first reminders: ${shown.map((s) => `${s.date}, 9 AM: ${s.body}`).join('. ')}`}
            style={{
              marginTop: 24,
              flex: 1,
              minHeight: f.small ? 200 : 320,
              borderRadius: 28,
              backgroundColor: brand.sunflower,
              paddingVertical: f.small ? 16 : 24,
              paddingHorizontal: 12,
              justifyContent: 'center',
              gap: f.small ? 12 : 16,
            }}
          >
            <Txt v="label" color={brand.ink} style={{ marginLeft: 4 }} importantForAccessibility="no">
              Your first reminders
            </Txt>
            {shown.map((s, i) => (
              // They arrive one after another, like on the lock screen. Reduce Motion: already there.
              <Animated.View
                key={s.key}
                importantForAccessibility="no-hide-descendants"
                entering={reduce ? undefined : FadeInDown.delay(350 + i * 550).springify().damping(18)}
              >
                <Txt v="eyebrow" num color="#4B4220" style={{ marginLeft: 4, marginBottom: 8 }}>
                  {s.date}
                </Txt>
                <NotificationPreview time="9:00 AM" message={noOrphan(s.body)} />
              </Animated.View>
            ))}
          </View>
        </ForceLightContext.Provider>

        <Txt v="sub" tone="fg2" center style={{ marginTop: 16 }}>
          7 in 10 people have paid for a forgotten free trial.
        </Txt>
        <Button
          label="Turn on reminders"
          hint="Shows the iPhone permission prompt"
          left={<Bell color={p.ctaFg} size={20} />}
          onPress={turnOn}
          style={{ marginTop: 16 }}
        />
        <Txt v="sub" tone="mute" center style={{ marginTop: 8 }}>
          Tap “Allow” on the next screen.
        </Txt>
        <Button
          kind="text"
          label="Maybe later"
          onPress={() => {
            setNotifications('later');
            go();
          }}
          style={{ marginTop: 4 }}
        />
      </FitScroll>
    </OnbRoot>
  );
}
