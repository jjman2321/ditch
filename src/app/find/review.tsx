// Check and add (design/find-subs screen 4): every suggestion with its proof.
// Sure ones that still charge start ticked; "maybe" and cancelled ones start
// off. Nothing is added until Add. Already on the list = shown, not added.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { SERVICE_BY_ID } from '@/catalog/services';
import { shortDate } from '@/domain/dates';
import { CYCLE_SHORT, monthlyMinorExact, roundMinor } from '@/domain/money';
import { FREE_REMINDERS, remindedIds, yearlyOfSub } from '@/domain/subs';
import { FindPage } from '@/find/Parts';
import { findTarget, setFindResult, setFindTarget, useFindResult } from '@/import/session';
import { alreadyOnList, foundToSub } from '@/import/toSubs';
import { preTicked, type Found } from '@/import/types';
import { useApp, useAppMoney } from '@/state/app';
import { onboardingToday, useOnboarding } from '@/state/onboarding';
import { pickFromFound } from '@/state/picks';
import { Button, F, LogoTile, Tick, Txt, haptic, usePalette } from '@/ui/sunflower';

function line(f: Found): string {
  if (f.source === 'statement') return f.evidence.replace(/^/, f.confidence === 'maybe' && !f.evidence.includes(',') ? 'One charge: ' : '');
  if (f.state === 'trial') return f.date ? `Free trial ends ${shortDate(f.date)}` : 'Free trial';
  if (f.state === 'ends') return f.date ? `Ends ${shortDate(f.date)}. Won’t renew.` : 'Won’t renew';
  if (f.state === 'expired') return 'Expired';
  return f.date ? `Renews ${shortDate(f.date)}` : 'Renewal date not shown';
}

export default function Review() {
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const result = useFindResult();
  const found = useMemo(() => result?.found ?? [], [result]);
  const [on, setOn] = useState<Set<string>>(() => new Set(found.filter((f) => preTicked(f) && !alreadyOnList(f, app.subs)).map((f) => f.key)));
  const opts = { country: app.settings.country, currency: app.settings.currency, today: app.today };
  const picked = found.filter((f) => on.has(f.key));
  const monthly = useMemo(() => {
    const byCur = new Map<string, number>();
    for (const f of picked) {
      const s = foundToSub(f, opts);
      if (s.amountMinor && s.currency && !s.isTrial) byCur.set(s.currency, (byCur.get(s.currency) ?? 0) + monthlyMinorExact(s.amountMinor, s.cycle));
    }
    return [...byCur.entries()].map(([c, m]) => money(roundMinor(m), c)).join(' + ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked.length, on]);

  const groups: [string, Found[]][] = [
    ['Still charging', found.filter((f) => (f.state === 'renews' || f.state === 'trial') && f.confidence !== 'maybe')],
    ['Maybe', found.filter((f) => f.confidence === 'maybe' && f.state !== 'expired')],
    ['Already cancelled', found.filter((f) => f.state === 'ends' || f.state === 'expired')],
  ];

  const onboarding = useOnboarding();
  const add = async () => {
    if (!picked.length) return;
    if (findTarget() === 'onboarding') {
      // During onboarding: they join the picks, then the total. This was their free find.
      onboarding.addPicks(picked.map((f) => pickFromFound(f, onboarding.country, onboardingToday())));
      await app.updateSettings({ freeFindUsed: true });
      haptic.success();
      setFindResult(null);
      setFindTarget('app');
      router.replace('/onboarding/total');
      return;
    }
    let subs = picked.map((f) => foundToSub(f, opts));
    if (!app.pro) {
      // Free: fill the free reminder slots that are left, trials first (they're the surprise charges), then the biggest.
      let room = FREE_REMINDERS - remindedIds(app.subs, false).size;
      const order = [...subs].filter((x) => x.dateSource !== 'none').sort((a, b) => Number(b.isTrial) - Number(a.isTrial) || yearlyOfSub(b) - yearlyOfSub(a));
      const give = new Set<string>();
      for (const x of order) if (room-- > 0) give.add(x.id);
      subs = subs.map((x) => (give.has(x.id) ? { ...x, freePick: true } : x));
    }
    await app.addSubs(subs);
    if (!app.pro) await app.updateSettings({ freeFindUsed: true });
    haptic.success();
    setFindResult(null);
    router.dismissTo('/(tabs)');
  };

  if (!result) {
    return (
      <FindPage title="Nothing to check">
        <Button label="Find your subscriptions" onPress={() => router.replace('/find')} style={{ marginTop: 20 }} />
      </FindPage>
    );
  }

  return (
    <FindPage
      title={found.length ? `We spotted ${found.length}. Check them.` : 'Nothing repeats yet'}
      intro={result.note ?? undefined}
      footer={
        found.length ? (
          <>
            <Button label={picked.length ? `Add ${picked.length}${monthly ? ` · ${monthly} a month` : ''}` : 'Tick what you pay for'} disabled={!picked.length} onPress={add} />
            <Txt v="sub" tone="mute" center style={{ marginTop: 6 }}>
              Nothing’s added until you tap Add. Edit any of them after.
            </Txt>
          </>
        ) : (
          <Button kind="secondary" label="Try another list" onPress={() => router.back()} />
        )
      }
    >
      {groups.map(([title, list]) =>
        list.length ? (
          <View key={title}>
            <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 22, marginHorizontal: 4, marginBottom: 8 }}>
              {title}
            </Txt>
            <View style={{ backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 14, borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
              {list.map((f, i) => {
                const dup = alreadyOnList(f, app.subs);
                const ticked = on.has(f.key);
                const s = foundToSub(f, opts);
                const over = f.state === 'expired' || f.state === 'ends';
                const price = !over && s.amountMinor && s.currency ? `${f.state === 'trial' ? 'then ' : ''}${money(s.amountMinor, s.currency)}${s.cycle === 'monthly' ? '' : CYCLE_SHORT[s.cycle]}` : null;
                const svc = f.catalogId ? SERVICE_BY_ID[f.catalogId] : undefined;
                const sub = dup ? 'Already on your list' : `${line(f)}${s.amountIsEstimate && !over ? ' · usual price' : ''}`;
                return (
                  <Pressable
                    key={f.key}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: ticked, disabled: dup }}
                    accessibilityLabel={`${f.name}, ${sub}${price ? `, ${price}` : ''}`}
                    disabled={dup}
                    onPress={() => {
                      haptic.select();
                      setOn((cur) => {
                        const next = new Set(cur);
                        if (next.has(f.key)) next.delete(f.key);
                        else next.add(f.key);
                        return next;
                      });
                    }}
                    style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair, opacity: dup ? 0.5 : pressed ? 0.7 : 1 })}
                  >
                    <Tick on={ticked} size={26} />
                    <LogoTile id={svc?.id ?? 'custom'} size={40} mono={f.name.slice(0, 1).toUpperCase()} color={svc ? undefined : '#6B6559'} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt v="bodyStrong" color={p.cardFg} numberOfLines={1}>
                        {f.name}
                      </Txt>
                      <Txt v="sub" tone="mute" num numberOfLines={2}>
                        {sub}
                      </Txt>
                    </View>
                    {price ? (
                      <Txt v="label" num color={p.cardFg} style={{ fontFamily: F.wideBold }}>
                        {price}
                      </Txt>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null,
      )}
      {result.appleCharges ? (
        <Pressable accessibilityRole="button" onPress={() => router.replace('/find/apple')} style={{ marginTop: 14, backgroundColor: p.dark ? '#2A2516' : '#FFF6D6', borderRadius: 14, padding: 14 }}>
          <Txt v="sub" color={p.dark ? p.fg2 : '#4B4220'}>
            {`${result.appleCharges} ${result.appleCharges === 1 ? 'charge' : 'charges'} to APPLE.COM/BILL. `}
            <Txt v="sub" style={{ textDecorationLine: 'underline', fontFamily: F.semi }}>
              Screenshot your Apple list
            </Txt>
            {' to name them.'}
          </Txt>
        </Pressable>
      ) : null}
    </FindPage>
  );
}
