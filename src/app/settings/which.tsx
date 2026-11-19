// Which subscriptions get reminders. Free: pick 3 (bells, biggest yearly
// first). Pro: a switch on each, all on by default. Nothing is hidden: the
// rest stay on the list with dates and totals. A 4th bell opens the paywall
// (DECISIONS #66: "4th reminder" is a paywall moment).

import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { shortDate, weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, CYCLE_WORDS } from '@/domain/money';
import { FREE_REMINDERS, chargeOfSub, isPricedSub, listedUserSubs, remindedIds, yearlyOfSub } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { SubLogo } from '@/home/SubRow';
import { TextLink } from '@/onboarding/Parts';
import { planById } from '@/services/purchases';
import { Group, SettingsPage } from '@/settings/Parts';
import { useApp, useAppMoney } from '@/state/app';
import { Bell, BellMark, ChevronRight, F, SunSwitch, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

export default function Which() {
  const narrow = useWindowDimensions().width < 400;
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
    if (!reduce)
      nudge.set(withSequence(withTiming(3, { duration: 30 }), withTiming(-3, { duration: 60 }), withTiming(3, { duration: 60 }), withTiming(-3, { duration: 60 }), withTiming(0, { duration: 30 })));
    router.push('/paywall?from=which');
  };
  // Dark mode: the empty bell's ring is drawn stronger on top (#8E877A on the #1E1C18 card is 4.8:1; the stock one is 1.8:1).
  const offRing = p.dark ? '#8E877A' : null;
  const upsellFg = p.dark ? brand.sunflower : brand.ink;

  return (
    <SettingsPage title="Which subscriptions" intro={pro ? 'Pro reminds you about all of them. Switch off any you don’t need.' : `Pick ${FREE_REMINDERS} to get reminders.`}>
      {pro ? null : (
        <Animated.View
          accessible
          accessibilityLabel={`Reminders ${on.size} of ${FREE_REMINDERS}`}
          style={[
            { alignSelf: 'flex-start', marginTop: 14, height: 30, borderRadius: 15, backgroundColor: brand.sunflower, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
            nudgeStyle,
          ]}
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
          <TextLink label="see Pro" a11y="See Ditch Pro" onPress={() => router.push('/paywall?from=which')} style={{ fontSize: 15 }} />
        </View>
      ) : null}
      {/* The way to all of them, above the list so it's on screen without scrolling (SE). Home total card colours. */}
      {pro ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Get reminders on all of them. Try Pro free for ${planById('yearly').trialDays} days`}
          onPress={() => router.push('/paywall?from=which')}
          style={({ pressed }) => ({
            marginTop: 14,
            minHeight: 64,
            borderRadius: 22,
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: p.dark ? p.card : brand.sunflower,
            borderWidth: p.dark ? 1 : 0,
            borderColor: p.cardBorder,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Bell color={upsellFg} fill={upsellFg} size={18} />
          <View style={{ flex: 1 }}>
            <Txt v="bodyStrong" color={upsellFg} style={{ fontFamily: F.bold }}>
              Get reminders on all of them
            </Txt>
            <Txt v="sub" color={p.dark ? p.cardFg : brand.ink}>
              Try Pro free for {planById('yearly').trialDays} days
            </Txt>
          </View>
          <ChevronRight color={upsellFg} size={16} />
        </Pressable>
      )}
      {list.length ? (
        <Group style={{ marginTop: 14 }} note={pro ? undefined : 'The rest stay on your list with real dates and totals. You just won’t get a reminder.'}>
          {list.map((s) => {
            const isOn = on.has(s.id);
            const next = chargeOfSub(s, today);
            // SE-sized phones: "$20.00/mo · Nov 21" so the date isn't cut off.
            const line = narrow
              ? `${isPricedSub(s) ? `${money(s.amountMinor, s.currency)}${CYCLE_SHORT[s.cycle]} · ` : ''}${next ? shortDate(next) : 'No date yet'}`
              : `${isPricedSub(s) ? `${money(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]} · ` : ''}${next ? weekdayDate(next) : 'No date yet'}`;
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
                <View>
                  <BellMark on={isOn} />
                  {!isOn && offRing ? (
                    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: offRing }} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </Group>
      ) : (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 20 }}>
          Nothing on your list yet. Add a subscription on Home first.
        </Txt>
      )}
    </SettingsPage>
  );
}
