// 07 · Which 3 get reminders? Free covers 3 (DECISIONS #11). The 3 biggest
// yearly charges come pre-selected; tap a bell to swap. Nothing is hidden or
// deleted: the rest stay on the list with dates and totals.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { weekdayDate } from '@/domain/dates';
import { byYearlyDesc, chargeOf, defaultReminderPicks, useOnboarding, usePickedList, usePickPrice } from '@/state/onboarding';
import { Bell, BellMark, Button, Card, LogoTile, RowDivider, Screen, SectionHeader, StepHeader, Txt, brand, haptic } from '@/ui/sunflower';

const FREE = 3;

export default function Which3() {
  const { reminderPicks, setReminderPicks } = useOnboarding();
  const list = usePickedList();
  const priceOf = usePickPrice();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [on, setOn] = useState<string[]>(() => reminderPicks ?? defaultReminderPicks(list));
  const reduce = useReducedMotion();
  const nudge = useSharedValue(0);
  const nudgeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: nudge.get() }] }));

  const toggle = (id: string, name: string) => {
    if (on.includes(id)) {
      haptic.select();
      setOn(on.filter((x) => x !== id));
      return;
    }
    if (on.length >= FREE) {
      haptic.warning();
      AccessibilityInfo.announceForAccessibility(`Free covers ${FREE}. Turn one off first to remind you about ${name}.`);
      if (!reduce) {
        nudge.set(
          withSequence(
            withTiming(3, { duration: 30 }),
            withTiming(-3, { duration: 60 }),
            withTiming(3, { duration: 60 }),
            withTiming(-3, { duration: 60 }),
            withTiming(0, { duration: 30 }),
          ),
        );
      }
      return;
    }
    haptic.select();
    setOn([...on, id]);
  };

  const k = on.length;
  const rest = list.length - k;

  return (
    <Screen
      scroll
      footer={
        <>
          <Button
            label={k === 0 ? 'Continue without reminders' : `Save my ${k}`}
            onPress={() => {
              setReminderPicks(on);
              router.push('/onboarding/done');
            }}
          />
          <Txt v="fine" tone="mute" center style={{ marginTop: 8 }}>
            You can switch to Pro anytime in Settings.
          </Txt>
        </>
      }
    >
      <StepHeader step={5} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        Which 3 get reminders?
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        Free covers 3. We picked your biggest. Tap a bell to swap.
      </Txt>

      <SectionHeader
        title={`Your ${list.length}`}
        style={{ marginTop: 18, marginBottom: 8 }}
        right={
          <Animated.View
            accessible
            accessibilityLabel={`Reminders ${k} of ${FREE}`}
            style={[{ height: 30, borderRadius: 15, backgroundColor: brand.sunflower, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 }, nudgeStyle]}
          >
            <Bell color={brand.ink} size={14} fill={brand.ink} />
            <Txt v="label" color={brand.ink} num style={{ fontFamily: 'Inter_700Bold', fontSize: 13.5 }}>
              Reminders {k} of {FREE}
            </Txt>
          </Animated.View>
        }
      />
      <Card style={{ paddingVertical: 2 }}>
        {sorted.map((x, i) => {
          const isOn = on.includes(x.id);
          const line = `${priceOf(x) ?? 'No price yet'} · ${weekdayDate(chargeOf(x))}`;
          return (
            <View key={x.id}>
              {i ? <RowDivider inset={68} /> : null}
              <Pressable
                accessibilityRole="switch"
                accessibilityLabel={`Reminders for ${x.name}, ${line}`}
                accessibilityState={{ checked: isOn }}
                onPress={() => toggle(x.id, x.name)}
                style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 10, paddingVertical: 6, opacity: pressed ? 0.75 : 1 })}
              >
                <LogoTile id={x.id} size={40} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt v="bodyStrong" numberOfLines={1}>
                    {x.name}
                  </Txt>
                  <Txt v="sub" tone="mute" num numberOfLines={1} style={{ marginTop: 1 }}>
                    {line}
                  </Txt>
                </View>
                <BellMark on={isOn} />
              </Pressable>
            </View>
          );
        })}
      </Card>
      {rest > 0 ? (
        <Txt v="body" tone="fg2" style={{ marginTop: 14, marginHorizontal: 4, fontSize: 14 }}>
          The other {rest} stay on your list with their dates and totals. You just won’t get a heads-up.
        </Txt>
      ) : null}
      <View style={{ height: 12 }} />
    </Screen>
  );
}
