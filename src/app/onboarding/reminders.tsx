// 05 · Reminders pre-ask. A lock screen with the user's own next heads-ups
// dropping in one by one, then the real iOS permission prompt.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SERVICE_BY_ID } from '@/catalog/services';
import { stillUsingIt } from '@/domain/copy';
import { addDays, longDate, toDateOnly, weekdayName, weekdayShort } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { chargeOf, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, Camera, Duck, F, Flashlight, ForceLightContext, Lock, NotificationPreview, Screen, StepHeader, Txt, brand } from '@/ui/sunflower';

/** The example: the soonest real date (2+ days out), else the soonest guess. */
function useExample() {
  const list = usePickedList();
  const today = toDateOnly();
  return useMemo(() => {
    const ok = list.filter((x) => chargeOf(x, today) >= addDays(today, 2));
    const soonest = (a: Picked, b: Picked) => (chargeOf(a, today) < chargeOf(b, today) ? -1 : 1);
    const pick = ok.filter((x) => x.dateSource !== 'guess').sort(soonest)[0] ?? [...ok].sort(soonest)[0];
    if (pick) {
      return {
        name: pick.name,
        price: formatMoney(pick.amountMinor, pick.currency),
        charge: chargeOf(pick, today),
        guess: pick.dateSource === 'guess',
        nudge: stillUsingIt(pick.category),
      };
    }
    const n = SERVICE_BY_ID['netflix'];
    return { name: n.name, price: formatMoney(n.amountMinor, n.currency), charge: addDays(today, 5), guess: false, nudge: stillUsingIt(n.category) };
  }, [list, today]);
}

export default function Reminders() {
  const { setNotifications } = useOnboarding();
  const n = usePickedList().length;
  const ex = useExample();
  const dayBefore = addDays(ex.charge, -1);
  const threeBefore = addDays(ex.charge, -3);
  const around = ex.guess ? 'around ' : '';

  const go = () => router.push(n > 0 ? '/paywall' : '/onboarding/done');
  const turnOn = async () => {
    // The web preview can't show the iOS prompt; it carries on as if allowed.
    if (Platform.OS === 'web') {
      setNotifications('granted');
      return go();
    }
    try {
      const r = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
      setNotifications(r.granted ? 'granted' : 'denied');
    } catch {
      setNotifications('denied');
    }
    go();
  };

  return (
    <Screen
      scroll
      footer={
        <>
          <Button label="Turn on reminders" hint="Shows the iPhone permission prompt" onPress={turnOn} />
          <Button
            kind="text"
            label="Maybe later"
            onPress={() => {
              setNotifications('later');
              go();
            }}
          />
        </>
      }
    >
      <StepHeader step={4} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        A heads-up before every charge.
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        3 days and 1 day before, at 9:00 AM. That’s all we’ll ever send.
      </Txt>

      {/* An illustration of the lock screen, always in the sunflower look. */}
      <ForceLightContext.Provider value>
      <View
        accessible
        accessibilityLabel={`Example: on ${longDate(dayBefore)} at 9 AM, Ditch says ${ex.name} renews ${around}tomorrow.`}
        style={{
          marginTop: 20,
          marginBottom: 12,
          flex: 1,
          minHeight: 360,
          borderRadius: 34,
          backgroundColor: brand.sunflower,
          overflow: 'hidden',
          paddingTop: 20,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <View style={{ alignItems: 'center' }} importantForAccessibility="no-hide-descendants">
          <Lock color={brand.ink} />
          <Txt v="label" color={brand.ink} style={{ marginTop: 6 }} maxFontSizeMultiplier={1.2}>
            {longDate(dayBefore)}
          </Txt>
          <Txt v="label" color={brand.ink} num style={{ fontFamily: F.wideHeavy, fontSize: 72, lineHeight: 76, letterSpacing: -2 }} maxFontSizeMultiplier={1}>
            9:00
          </Txt>
        </View>
        <View importantForAccessibility="no-hide-descendants" style={{ zIndex: 2 }}>
          <Animated.View entering={FadeInDown.delay(900).springify().damping(18)} style={{ marginTop: 14 }}>
            <NotificationPreview time="now" message={`${ex.name} renews ${around}tomorrow. ${ex.price}. Last call if you’re done with it.`} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(350).springify().damping(18)} style={{ marginTop: 8 }}>
            <NotificationPreview faded time={`${weekdayShort(threeBefore)} 9:00 AM`} message={`${ex.name} renews ${around}${weekdayName(ex.charge)}. ${ex.price}. ${ex.nudge}`} />
          </Animated.View>
        </View>
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -4, alignItems: 'center' }}>
          <Duck width={150} bottom={0} delay={1300} style={{ position: 'relative' }} />
        </View>
        <View style={{ position: 'absolute', left: 16, bottom: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(22,20,15,0.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Flashlight color={brand.ink} />
        </View>
        <View style={{ position: 'absolute', right: 16, bottom: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(22,20,15,0.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Camera color={brand.ink} />
        </View>
      </View>
      </ForceLightContext.Provider>
    </Screen>
  );
}
