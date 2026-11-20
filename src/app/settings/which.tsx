// Which subscriptions get reminders. Free: pick 3 (bells, biggest yearly
// first). Pro: a switch on each, all on by default. Nothing is hidden: the
// rest stay on the list with dates and totals. A 4th bell opens the paywall
// (DECISIONS #66: "4th reminder" is a paywall moment).
// A FlatList, not a ScrollView: with thousands of subscriptions only the rows
// on screen are drawn (audit, Nov 20: 3,000 subs took 18 s to open).

import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { shortDate, weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, CYCLE_WORDS } from '@/domain/money';
import { FREE_REMINDERS, chargeOfSub, isPricedSub, listedUserSubs, remindedIds, yearlyOfSub, type Sub } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { SubLogo } from '@/home/SubRow';
import { planById } from '@/services/purchases';
import { SettingsHeader, useSettingsPagePadding } from '@/settings/Parts';
import { useApp, useAppMoney } from '@/state/app';
import { Bell, BellMark, Button, ChevronRight, F, SunSwitch, Txt, brand, haptic, radius, usePalette } from '@/ui/sunflower';

type Item = { sub: Sub; isOn: boolean; hasNext: boolean; line: string };

export default function Which() {
  const narrow = useWindowDimensions().width < 400;
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const editor = useEditor();
  const reduce = useReducedMotion();
  const pad = useSettingsPagePadding();
  const { subs, pro, today } = app;
  const on = useMemo(() => remindedIds(subs, pro), [subs, pro]);
  const items = useMemo<Item[]>(
    () =>
      [...listedUserSubs(subs)]
        .sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a))
        .map((s) => {
          const next = chargeOfSub(s, today);
          // SE-sized phones: "$20.00/mo · Nov 21" so the date isn't cut off.
          const line = narrow
            ? `${isPricedSub(s) ? `${money(s.amountMinor, s.currency)}${CYCLE_SHORT[s.cycle]} · ` : ''}${next ? shortDate(next) : 'No date yet'}`
            : `${isPricedSub(s) ? `${money(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]} · ` : ''}${next ? weekdayDate(next) : 'No date yet'}`;
          return { sub: s, isOn: on.has(s.id), hasNext: !!next, line };
        }),
    [subs, today, narrow, money, on],
  );
  const nudge = useSharedValue(0);
  const nudgeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: nudge.get() }] }));

  // Stable across renders, so the memoized rows don't all redraw when one bell flips.
  const latest = useRef({ app, reduce });
  useEffect(() => {
    latest.current = { app, reduce };
  }, [app, reduce]);
  const toggle = useCallback(
    async (id: string, name: string, isOn: boolean) => {
      const { app: a, reduce: still } = latest.current;
      const ok = await a.setReminder(id, !isOn);
      if (ok) {
        haptic.select();
        return;
      }
      haptic.warning();
      AccessibilityInfo.announceForAccessibility(`Your ${FREE_REMINDERS} free reminders are in use. Turn one off first to remind you about ${name}.`);
      if (!still)
        nudge.set(withSequence(withTiming(3, { duration: 30 }), withTiming(-3, { duration: 60 }), withTiming(3, { duration: 60 }), withTiming(-3, { duration: 60 }), withTiming(0, { duration: 30 })));
      router.push('/paywall?from=which');
    },
    [nudge],
  );
  const openEdit = editor.openEdit;

  const upsellFg = p.dark ? brand.sunflower : brand.ink;
  const empty = items.length === 0;
  // The count lives in the intro (no yellow pill): the upsell card and the bells are the only yellow here.
  const intro = empty
    ? undefined
    : pro
      ? 'Pro reminds you about all of them. Switch off any you don’t need.'
      : `${on.size} of ${FREE_REMINDERS} picked. ${on.size >= FREE_REMINDERS ? 'Turn one off to pick another.' : 'Tap a bell to add one.'}`;

  const header = (
    <>
      {/* Same title as the Settings row that opens it. */}
      <SettingsHeader title="Which subscriptions" intro={intro} />
      {/* The way to all of them, above the list so it's on screen without scrolling (SE). Home total card colours.
          Nothing to remind about yet, so no upsell on an empty list. */}
      {pro || empty ? null : (
        // The 4th tap nudges this card: it's the way to more than 3.
        <Animated.View style={nudgeStyle}>
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
        </Animated.View>
      )}
      {/* Where the card starts (Group's spacing). */}
      {empty ? null : <View style={{ height: 14 }} />}
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.sub.id}
        renderItem={({ item, index }) => <WhichRow item={item} pro={pro} first={index === 0} last={index === items.length - 1} onToggle={toggle} onEdit={openEdit} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={{ marginTop: 20, gap: 16 }}>
            <Txt v="leadS" tone="fg2">
              Nothing on your list yet.
            </Txt>
            <Button label="Add a subscription" onPress={() => editor.openAdd()} />
          </View>
        }
        ListFooterComponent={
          pro || empty ? undefined : (
            <Txt v="fine" tone="mute" style={{ marginTop: 8, marginHorizontal: 4, fontSize: 13.5 }}>
              The rest stay on your list with real dates and totals. You just won’t get a reminder.
            </Txt>
          )
        }
        contentContainerStyle={pad}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={11}
      />
    </View>
  );
}

const WhichRow = memo(function WhichRow({
  item,
  pro,
  first,
  last,
  onToggle,
  onEdit,
}: {
  item: Item;
  pro: boolean;
  first: boolean;
  last: boolean;
  onToggle: (id: string, name: string, isOn: boolean) => void;
  onEdit: (id: string) => void;
}) {
  const p = usePalette();
  const { sub: s, isOn, hasNext, line } = item;
  // Dark mode: the empty bell's ring is drawn stronger on top (#8E877A on the #1E1C18 card is 4.8:1; the stock one is 1.8:1).
  const offRing = p.dark ? '#8E877A' : null;
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
  let row;
  // No date, nothing to remind about: offer the date instead (DECISIONS #33).
  if (!hasNext)
    row = (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${s.name}, no date yet. Add date to get reminders`}
        onPress={() => onEdit(s.id)}
        style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
      >
        {body}
        <Txt v="label" color={p.cardFg} style={{ textDecorationLine: 'underline' }}>
          Add date
        </Txt>
      </Pressable>
    );
  else if (pro)
    row = (
      <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {body}
        <SunSwitch label={`Reminders for ${s.name}`} value={isOn} onValueChange={() => onToggle(s.id, s.name, isOn)} />
      </View>
    );
  else
    row = (
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: isOn }}
        accessibilityLabel={`Reminders for ${s.name}, ${line}`}
        onPress={() => onToggle(s.id, s.name, isOn)}
        style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
      >
        {body}
        <View>
          <BellMark on={isOn} />
          {!isOn && offRing ? <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: offRing }} /> : null}
        </View>
      </Pressable>
    );
  // One slice of the grouped white card (Group's look, drawn row by row so the list can be virtualized).
  const edge = p.dark ? p.cardBorder : 'rgba(22,20,15,0.05)';
  return (
    <View
      style={{
        backgroundColor: p.card,
        paddingHorizontal: 16,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: edge,
        borderTopWidth: first ? 1 : 0,
        borderBottomWidth: last ? 1 : 0,
        borderTopLeftRadius: first ? radius.card : 0,
        borderTopRightRadius: first ? radius.card : 0,
        borderBottomLeftRadius: last ? radius.card : 0,
        borderBottomRightRadius: last ? radius.card : 0,
      }}
    >
      <View style={{ borderTopWidth: first ? 0 : 1, borderTopColor: p.hair }}>{row}</View>
    </View>
  );
});
