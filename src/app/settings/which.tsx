// Which subscriptions get reminders. Free: pick 3 (bells, biggest yearly
// first). Pro: a switch on each, all on by default. Nothing is hidden: the
// rest stay on the list with dates and totals.

import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { weekdayDate } from '@/domain/dates';
import { CYCLE_WORDS } from '@/domain/money';
import { FREE_REMINDERS, chargeOfSub, isPricedSub, listedUserSubs, remindedIds, yearlyOfSub } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { SubLogo } from '@/home/SubRow';
import { TextLink } from '@/onboarding/Parts';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { useApp, useAppMoney } from '@/state/app';
import { Bell, BellMark, SunSwitch, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

export default function Which() {
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const editor = useEditor();
  const reduce = useReducedMotion();
  const { subs, pro, today } = app;
  const list = [...listedUserSubs(subs)].sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a));
  const on = remindedIds(subs, pro);
  const nudge = useSharedValue(0);
  const [limitHit, setLimitHit] = useState(false);
  const nudgeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: nudge.get() }] }));

  const toggle = async (id: string, name: string) => {
    const next = !on.has(id);
    const ok = await app.setReminder(id, next);
    if (ok) {
      haptic.select();
      return;
    }
    haptic.warning();
    setLimitHit(true);
    AccessibilityInfo.announceForAccessibility(`Free covers ${FREE_REMINDERS}. Turn one off first to remind you about ${name}.`);
    if (!reduce) nudge.set(withSequence(withTiming(3, { duration: 30 }), withTiming(-3, { duration: 60 }), withTiming(3, { duration: 60 }), withTiming(-3, { duration: 60 }), withTiming(0, { duration: 30 })));
  };

  return (
    <SettingsPage title="Which subscriptions" intro={pro ? 'Pro reminds you about all of them. Switch off any you don’t need.' : `Pick ${FREE_REMINDERS} to get reminders.`}>
      {pro ? null : (
        <Animated.View
          accessible
          accessibilityLabel={`Reminders ${on.size} of ${FREE_REMINDERS}`}
          style={[{ alignSelf: 'flex-start', marginTop: 14, height: 30, borderRadius: 15, backgroundColor: brand.sunflower, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 }, nudgeStyle]}
        >
          <Bell color={brand.ink} size={14} fill={brand.ink} />
          <Txt v="label" color={brand.ink} num style={{ fontFamily: 'Inter_700Bold', fontSize: 13.5 }}>
            Reminders {on.size} of {FREE_REMINDERS}
          </Txt>
        </Animated.View>
      )}
      {/* The 4th tap: say why, and offer the way out (DECISIONS #24). */}
      {!pro && limitHit ? (
        <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6 }}>
          <Txt v="body" tone="fg2" style={{ fontSize: 15 }}>
            Free covers {FREE_REMINDERS}. Turn one off, or
          </Txt>
          <TextLink label="see Pro" a11y="See Ditch Pro" onPress={() => router.push('/paywall?from=app')} style={{ fontSize: 15 }} />
        </View>
      ) : null}
      {list.length ? (
        <Group
          style={{ marginTop: 14 }}
          note={pro ? undefined : 'The rest stay on your list with real dates and totals. You just won’t get a reminder.'}
        >
          {list.map((s) => {
            const isOn = on.has(s.id);
            const next = chargeOfSub(s, today);
            const line = `${isPricedSub(s) ? `${money(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]} · ` : ''}${next ? weekdayDate(next) : 'No date yet'}`;
            const body = (
              <>
                <SubLogo sub={s} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt v="bodyStrong" color={p.cardFg} numberOfLines={1}>
                    {s.name}
                  </Txt>
                  <Txt v="sub" tone="mute" num numberOfLines={1}>
                    {line}
                  </Txt>
                </View>
              </>
            );
            // No date, nothing to remind about: offer the date instead (DECISIONS #33).
            if (!next)
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.name}, no date yet. Add date to get reminders`}
                  onPress={() => editor.openEdit(s.id)}
                  style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
                >
                  {body}
                  <Txt v="label" color={p.cardFg} style={{ textDecorationLine: 'underline' }}>
                    Add date
                  </Txt>
                </Pressable>
              );
            return pro ? (
              <View key={s.id} style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {body}
                <SunSwitch label={`Reminders for ${s.name}`} value={isOn} onValueChange={() => toggle(s.id, s.name)} />
              </View>
            ) : (
              <Pressable
                key={s.id}
                accessibilityRole="switch"
                accessibilityState={{ checked: isOn }}
                accessibilityLabel={`Reminders for ${s.name}, ${line}`}
                onPress={() => toggle(s.id, s.name)}
                style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
              >
                {body}
                <BellMark on={isOn} />
              </Pressable>
            );
          })}
        </Group>
      ) : (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 20 }}>
          Nothing on your list yet. Add a subscription on Home first.
        </Txt>
      )}
      {pro ? null : (
        <Group>
          <Row label="Get reminders on all of them" onPress={() => router.push('/paywall?from=app')} />
        </Group>
      )}
    </SettingsPage>
  );
}
