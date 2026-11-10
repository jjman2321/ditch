// 7 · You're set (design/v12 renders 07, 07c). The 3-line checklist, then
// the first reminders. Free: "Reminders on your 3 biggest · Change" (the
// Which-3 choice folded in; the paywall's × leads here). Pro: reminders on
// all of them, and Ditch's own trial on the list. Reminders off: "Almost
// set", with one clear fix that shows the real iOS prompt.
// "Go to my list" saves everything to SQLite and schedules the reminders.

import { getLocales } from 'expo-localization';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Linking, Text, View } from 'react-native';

import { namesLine } from '@/domain/copy';
import { headsUpDates } from '@/domain/charges';
import { weekdayDate } from '@/domain/dates';
import { FitScroll, OnbRoot, TextLink } from '@/onboarding/Parts';
import { useFirstReminders } from '@/onboarding/useFirstReminders';
import { Which3Sheet } from '@/onboarding/Which3Sheet';
import { now as clockNow } from '@/services/clock';
import { getNotifStatus, requestNotifPermission } from '@/services/notifications';
import { useApp } from '@/state/app';
import { onboardingToday, totalsFor, useCountry, useMoney, useOnboarding, usePickedList, useRemindedIds } from '@/state/onboarding';
import { Bell, Button, Check, Duck, DuckIcon, F, LogoTile, Txt, brand, useFitSize, useFrame, useIsDark, usePalette } from '@/ui/sunflower';

type Mark = 'ok' | 'todo' | 'warn';

function MarkIcon({ kind }: { kind: Mark }) {
  const dark = useIsDark();
  const ink = dark ? '#F6F0E3' : brand.ink;
  const base = { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' } as const;
  if (kind === 'ok')
    return (
      <View style={[base, { backgroundColor: dark ? brand.sunflower : brand.ink }]}>
        <Check color={dark ? brand.ink : brand.sunflower} size={14} />
      </View>
    );
  if (kind === 'warn')
    return (
      <View style={[base, { backgroundColor: brand.bill }]}>
        <Text style={{ fontFamily: F.heavy, fontSize: 15, lineHeight: 18, color: brand.ink }} allowFontScaling={false}>
          !
        </Text>
      </View>
    );
  return <View style={[base, { borderWidth: 2, borderColor: ink }]} />;
}

export default function Done() {
  const p = usePalette();
  const dark = useIsDark();
  const { pro: proPlan } = useOnboarding();
  const f = useFrame({ maxContent: 480, colH: proPlan ? 820 : 760 });
  const { pro, notifications, setNotifications, setReminderPicks, country } = useOnboarding();
  const { finishOnboarding } = useApp();
  const countryInfo = useCountry();
  const money = useMoney();
  const list = usePickedList();
  const remindedIds = useRemindedIds();
  const n = list.length;
  const many = n > 3;
  const on = notifications === 'granted';
  const { reminders, undated, trialCharge } = useFirstReminders(pro || (f.small && notifications !== 'granted') ? 2 : 3);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const sub2 = dark ? '#BFB7A7' : '#4B4220';

  // Came back from iPhone Settings with reminders allowed: switch to "You're set".
  useEffect(() => {
    const s = AppState.addEventListener('change', async (state) => {
      if (state !== 'active' || on) return;
      const st = await getNotifStatus();
      if (st === 'granted' || st === 'quiet') setNotifications('granted');
    });
    return () => s.remove();
  }, [on, setNotifications]);

  const turnOn = async () => {
    const now = await getNotifStatus();
    // iOS asks only once; after "Don't Allow" only iPhone Settings can change it.
    if (now === 'denied') {
      Linking.openSettings().catch(() => {});
      return;
    }
    const st = await requestNotifPermission();
    setNotifications(st === 'granted' || st === 'quiet' ? 'granted' : 'denied');
  };

  const finish = async () => {
    // Save everything first, so nothing is lost if the app closes.
    setSaving(true);
    const currency = countryInfo?.currency ?? list.find((x) => x.currency)?.currency ?? getLocales()[0]?.currencyCode ?? 'USD';
    await finishOnboarding({ picks: list, reminderIds: remindedIds, pro, country, currency });
    router.replace('/(tabs)');
  };

  const totals = totalsFor(list, countryInfo?.currency);
  const yearly = totals.map((t) => money(t.yearlyMinor, t.currency, { whole: true })).join(' + ');
  // Ditch's own trial gets the same two reminders (DECISIONS #15).
  const trialDays = trialCharge ? headsUpDates(trialCharge, onboardingToday(), { nowHour: clockNow().getHours() }) : [];

  const items: { mark: Mark; title: string; sub: string }[] = [
    n
      ? { mark: 'ok', title: `${n} ${n === 1 ? 'subscription' : 'subscriptions'} on your list`, sub: yearly ? `${yearly} a year` : 'Add prices to see your total' }
      : { mark: 'todo', title: 'Your list is ready', sub: 'Add what you pay for, and we’ll remind you before each charge.' },
    on
      ? { mark: 'ok', title: pro ? (undated.length ? `Reminders on all ${n - undated.length} with a date` : `Reminders on all ${n}`) : 'Reminders are on', sub: '3 days and 1 day before, at 9:00 AM' }
      : { mark: 'warn', title: 'Reminders are off', sub: 'Nothing can reach you until you turn them\u00A0on.' },
  ];
  if (trialDays.length) items.push({ mark: 'ok', title: 'Ditch Pro trial on your list', sub: `Reminders ${trialDays.map(weekdayDate).join(' and ')}` });
  // No guesses (DECISIONS #33): say plainly which ones have no reminder yet.
  if (n)
    items.push(
      undated.length
        ? { mark: 'todo', title: `${undated.length} with no date yet`, sub: `Add ${undated.length === 1 ? 'its date' : 'dates'} for ${namesLine(undated)} to get ${undated.length === 1 ? 'its' : 'their'} reminders` }
        : { mark: 'ok', title: 'Every date is set', sub: 'Reminders land on the right day.' },
    );

  const header = !on ? 'Waiting for your OK' : !pro && many ? 'Reminders on your 3 biggest' : 'Your first reminders';
  const title = on ? 'You’re set.' : 'Almost set.';
  const titleBase = f.tablet ? 80 : 60;
  const [titleSize, onTitle] = useFitSize(titleBase, f.content);
  const cardBg = dark ? '#1E1C18' : 'rgba(255,255,255,0.72)';

  return (
    <OnbRoot surface="sun">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <View style={{ height: f.small ? 16 : 56 }} />
        <View pointerEvents="none" style={{ position: 'absolute', opacity: 0, width: 2000, alignItems: 'flex-start' }}>
          <Text allowFontScaling={false} onLayout={(e) => onTitle(e.nativeEvent.layout.width)} style={{ fontFamily: F.display, fontSize: titleBase, letterSpacing: -0.04 * titleBase }}>
            {title}
          </Text>
        </View>
        <Txt v="displayL" accessibilityRole="header" numberOfLines={1} ellipsizeMode="clip" style={{ fontSize: titleSize, lineHeight: titleSize, letterSpacing: -0.04 * titleSize }}>
          {title}
        </Txt>

        <View style={{ marginTop: f.small ? 8 : 24 }}>
          {items.map((it, i) => (
            // No dividers on the yellow: spacing separates the items (lines on colour read as muddy grey).
            <View key={it.title} accessible accessibilityLabel={`${it.mark === 'ok' ? 'Done' : it.mark === 'warn' ? 'Needs you' : 'To do'}: ${it.title}. ${it.sub}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: f.small ? 8 : 10, marginTop: i ? 4 : 0 }}>
              <MarkIcon kind={it.mark} />
              <View style={{ flex: 1 }}>
                <Txt v="strong">{it.title}</Txt>
                <Txt v="sub" num color={sub2}>
                  {it.sub}
                </Txt>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, minHeight: f.small ? 16 : 32 }} />

        {reminders.length ? (
          <View>
            {f.small || !on ? null : <Duck width={104} right={16} sink={4} />}
            <View style={{ borderRadius: 20, paddingVertical: 4, paddingHorizontal: 16, backgroundColor: cardBg, borderWidth: dark ? 1 : 0, borderColor: '#2C2924' }}>
              <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <Txt v="label" accessibilityRole="header" style={{ flex: 1 }}>
                  {header}
                </Txt>
                {on && !pro && many ? <TextLink label="Change" a11y="Change which 3 get reminders" onPress={() => setPicking(true)} style={{ fontSize: 15 }} /> : null}
              </View>
              {reminders.map((r, i) => (
                <View
                  key={r.id}
                  accessible
                  accessibilityLabel={`${r.name}, renews ${weekdayDate(r.charge)}. ${on ? 'Reminder' : 'Paused reminder'} ${weekdayDate(r.reminder)}.`}
                  style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <View style={{ position: 'absolute', top: 0, left: i ? 44 : 0, right: 0, height: 1, backgroundColor: dark ? '#2B2823' : 'rgba(22,20,15,0.1)' }} />
                  {r.trial ? <DuckIcon size={32} /> : <LogoTile id={r.id} size={32} />}
                  <View style={{ flex: 1, minWidth: 0, paddingVertical: 8 }}>
                    <Txt v="label" numberOfLines={1}>
                      {r.name}
                    </Txt>
                    <Txt v="sub" num color={sub2} numberOfLines={1}>
                      {`renews ${weekdayDate(r.charge)}`}
                    </Txt>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Txt v="label" num>
                      {weekdayDate(r.reminder)}
                    </Txt>
                    <Txt v="sub" color={sub2}>
                      {on ? 'reminder' : 'paused'}
                    </Txt>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ height: f.small ? 16 : 24 }} />
        {on ? (
          <Button label="Go to my list" disabled={saving} onPress={finish} />
        ) : (
          <>
            <Button label="Turn on reminders" hint="Shows the iPhone permission prompt" left={<Bell color={p.ctaFg} size={20} />} onPress={turnOn} />
            <Button kind="text" label="Go to my list" disabled={saving} onPress={finish} style={{ marginTop: 4 }} />
          </>
        )}
      </FitScroll>
      <Which3Sheet
        visible={picking}
        list={list}
        initial={remindedIds}
        onClose={() => setPicking(false)}
        onKeep={(ids) => {
          setReminderPicks(ids);
          setPicking(false);
        }}
      />
    </OnbRoot>
  );
}
