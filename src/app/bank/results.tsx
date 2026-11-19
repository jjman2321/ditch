// What we found (design/v32 screen 6, spec d). Leads with money: "Found 5 at Chase. $924 a year."
// The sure ones are already on the list (untick = Undo, the whole row is a 44pt checkbox);
// unsure ones need a Yes or No, both the same size. Every row shows its proof: the real dates.
// In onboarding nothing is saved yet: "Looks right" hands the ticked ones to onboarding's picks.

import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';

import { BankPage, TextLink } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { shortDate } from '@/domain/dates';
import { CYCLE_SHORT, formatWholeMoney } from '@/domain/money';
import type { Sub } from '@/domain/subs';
import { setFindTarget } from '@/import/session';
import { cleanMerchant, isApple } from '@/import/statement';
import { useApp, useAppMoney } from '@/state/app';
import { useBank } from '@/state/bank';
import { canAddLink, findTotals, spokenMoney, type BankFind } from '@/state/bankLogic';
import { onboardingToday, useOnboarding } from '@/state/onboarding';
import { pickFromFound } from '@/state/picks';
import { Button, Card, Check, Duck, F, LogoTile, RowDivider, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

/** "Sep 10, Oct 10, Nov 10 · next Dec 10" */
function proof(f: Pick<BankFind, 'evidence' | 'next'>): string {
  return `${f.evidence.replace(' · price went up', '')}${f.next ? ` · next ${shortDate(f.next)}` : ''}`;
}

export default function BankResults() {
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const bank = useBank();
  const flow = useBankFlow();
  const ob = useOnboarding();
  const big = useWindowDimensions().fontScale > 1.35;
  const link = bank.state.links.find((l) => l.id === flow.linkId) ?? bank.state.links[bank.state.links.length - 1] ?? null;
  const name = link?.name ?? 'your bank';
  const mine = (f: { linkId: string | null }) => !link || f.linkId === link.id || f.linkId === null;

  const autos = bank.state.finds.filter((f) => f.how === 'auto' && mine(f));
  const yeses = bank.state.finds.filter((f) => f.how === 'yes' && mine(f));
  const asks = bank.state.suggestions.filter(mine);
  // Keep each added sub as it was, so ticking again puts back the same one.
  const kept = useRef(new Map<string, Sub>(app.subs.filter((s) => autos.some((f) => f.subId === s.id)).map((s) => [s.id, s])));
  // Onboarding keeps its own ticks until "Looks right" (nothing is on the list yet).
  const [obOff, setObOff] = useState<Set<string>>(() => new Set());
  const isOn = (f: BankFind) => (flow.onboarding ? !obOff.has(f.subId) : !f.undone);
  const totals = useMemo(() => findTotals(autos.map((f) => ({ ...f, undone: !isOn(f) }))), [autos, obOff]); // eslint-disable-line react-hooks/exhaustive-deps
  const totalLine = totals.map((t) => `${formatWholeMoney(t.yearlyMinor, t.currency, { home: app.settings.currency })} a year`).join(' · ');
  const apple = link ? bank.state.txns.filter((t) => bank.state.txnLink[t.id] === link.id && isApple(cleanMerchant(t.merchantName ?? t.text))).length : 0;

  const toggle = async (f: BankFind) => {
    haptic.select();
    if (flow.onboarding) {
      setObOff((cur) => {
        const next = new Set(cur);
        if (next.has(f.subId)) next.delete(f.subId);
        else next.add(f.subId);
        return next;
      });
      return;
    }
    if (f.undone) {
      const s = kept.current.get(f.subId);
      if (s) await bank.redo(s);
    } else {
      const s = app.subs.find((x) => x.id === f.subId);
      if (s) kept.current.set(s.id, s);
      await bank.undo(f.subId);
    }
  };

  const answer = async (key: string, yes: boolean) => {
    haptic.select();
    await bank.answer(key, yes, { toList: !flow.onboarding });
  };

  const done = async () => {
    haptic.success();
    if (flow.onboarding) {
      const ticked = [...autos.filter(isOn), ...yeses];
      ob.addPicks(ticked.map((f) => pickFromFound(f.src, ob.country, onboardingToday())));
      await bank.remember(autos.map((f) => f.key));
      router.replace('/onboarding/total');
      return;
    }
    router.dismissTo('/(tabs)');
  };

  const screenshot = () => {
    setFindTarget(flow.onboarding ? 'onboarding' : 'app');
    router.push('/find/apple');
  };

  const n = autos.length;
  const k = asks.length;
  const nothing = n === 0 && k === 0 && yeses.length === 0;

  if (nothing) {
    return (
      <BankPage
        footer={
          <>
            {canAddLink(bank.state) ? <Button label="Add another card" onPress={() => router.replace(`/bank/pick?${flow.q()}`)} /> : null}
            <Button kind="secondary" label="Screenshot my Apple list" onPress={screenshot} style={{ marginTop: 10 }} />
            <Button kind="text" label={flow.onboarding ? 'Pick them myself' : 'Go to my list'} onPress={() => (flow.onboarding ? router.replace('/onboarding/services') : router.dismissTo('/(tabs)'))} style={{ marginTop: 4 }} />
          </>
        }
      >
        <View style={{ flex: 0.6 }} />
        <View style={{ alignItems: 'flex-start' }}>
          <Duck width={92} bottom={0} style={{ position: 'relative' }} />
        </View>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 18, fontSize: 32, lineHeight: 36 }}>
          {`Nothing repeating at ${name}.`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
          Your subscriptions might be on another card.
        </Txt>
      </BankPage>
    );
  }

  const title = `Found ${n || k} at ${name}.`;
  const lead = n ? `They’re on your list.${k ? ` ${k} more ${k === 1 ? 'needs' : 'need'} a yes or no.` : ''}` : `${k === 1 ? 'It needs' : 'They need'} a yes or no.`;

  return (
    <BankPage onBack={() => (flow.onboarding ? router.replace('/onboarding/where') : router.dismissTo('/(tabs)'))} footer={<Button label="Looks right" onPress={done} />}>
      <View accessible accessibilityRole="header" accessibilityLabel={`${title}${n && totals.length ? ` ${totals.map((t) => `${spokenMoney(t.yearlyMinor, t.currency)} a year`).join(', ')}.` : ''} ${lead}`}>
        <Txt v="title" style={{ marginTop: 8, fontSize: 30, lineHeight: 34 }} num>
          {title}
          {n && totalLine ? `\n${totalLine}.` : ''}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 6 }}>
          {lead}
        </Txt>
      </View>

      {n ? (
        <>
          <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 18, marginBottom: 8, marginHorizontal: 4 }}>
            Added
          </Txt>
          <Card>
            {autos.map((f, i) => {
              const on = isOn(f);
              const price = f.amountMinor != null && f.currency ? money(f.amountMinor, f.currency) : null;
              const per = f.src.cycle && f.src.cycle !== 'monthly' ? CYCLE_SHORT[f.src.cycle] : '';
              const spoken = `${f.name}, ${price ? spokenMoney(f.amountMinor!, f.currency!) : 'no price'}, charged ${f.evidence.replace(' · price went up', ', price went up')}${f.next ? `, next ${shortDate(f.next)}` : ''}, ${on ? 'added' : 'not added'}`;
              return (
                <View key={f.key}>
                  {i ? <RowDivider inset={66} /> : null}
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={spoken}
                    accessibilityHint={on ? 'Untick to take it off your list' : 'Tick to put it back on your list'}
                    onPress={() => void toggle(f)}
                    style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 6, paddingVertical: 10, opacity: pressed ? 0.75 : 1 })}
                  >
                    <View style={{ opacity: on ? 1 : 0.45 }}>
                      <LogoTile id={f.catalogId ?? 'custom'} size={40} mono={f.catalogId ? undefined : f.name.slice(0, 1).toUpperCase()} color={f.catalogId ? undefined : p.mute} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: big ? 'column' : 'row', alignItems: big ? 'flex-start' : 'center', gap: big ? 0 : 8 }}>
                        <Txt v="bodyStrong" color={on ? p.cardFg : p.mute} numberOfLines={big ? 2 : 1} style={{ flexShrink: 1, flex: big ? undefined : 1, textDecorationLine: on ? 'none' : 'line-through' }}>
                          {f.name}
                        </Txt>
                        {price ? (
                          <Txt v="moneyS" num color={on ? p.cardFg : p.mute}>
                            {price}
                            {per}
                          </Txt>
                        ) : null}
                      </View>
                      <Txt v="sub" tone="mute" num style={{ marginTop: 1, fontSize: 13 }}>
                        {proof(f)}
                      </Txt>
                    </View>
                    <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: on ? (p.dark ? brand.sunflower : brand.ink) : 'transparent',
                          borderWidth: on ? 0 : 2,
                          borderColor: p.tickBorder,
                        }}
                      >
                        {on ? <Check color={p.dark ? brand.ink : brand.sunflower} size={14} /> : null}
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </>
      ) : null}

      {k || yeses.length ? (
        <>
          <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 18, marginBottom: 8, marginHorizontal: 4 }}>
            Check these
          </Txt>
          <Card>
            {yeses.map((f, i) => (
              <View key={f.key}>
                {i ? <RowDivider inset={66} /> : null}
                <View accessible accessibilityLabel={`${f.name}, ${f.amountMinor != null && f.currency ? spokenMoney(f.amountMinor, f.currency) : ''}, added`} style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
                  <LogoTile id={f.catalogId ?? 'custom'} size={40} mono={f.catalogId ? undefined : f.name.slice(0, 1).toUpperCase()} color={f.catalogId ? undefined : p.mute} />
                  <Txt v="bodyStrong" color={p.cardFg} style={{ flex: 1 }}>
                    {`${f.name} · ${f.amountMinor != null && f.currency ? money(f.amountMinor, f.currency) : ''}`}
                  </Txt>
                  <Txt v="sub" tone="mute">
                    Added
                  </Txt>
                </View>
              </View>
            ))}
            {asks.map((f, i) => {
              const price = f.price ? money(f.price.amountMinor, f.price.currency) : null;
              return (
                <View key={f.key}>
                  {i || yeses.length ? <RowDivider inset={66} /> : null}
                  <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                    <View
                      accessible
                      accessibilityLabel={`${f.name}${f.price ? `, ${spokenMoney(f.price.amountMinor, f.price.currency)}` : ''}, charged ${f.evidence}. Subscription?`}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                    >
                      <LogoTile id={f.catalogId ?? 'custom'} size={40} mono={f.catalogId ? undefined : f.name.slice(0, 1).toUpperCase()} color={f.catalogId ? undefined : p.mute} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Txt v="bodyStrong" color={p.cardFg} num>
                          {`${f.name}${price ? ` · ${price}` : ''}`}
                        </Txt>
                        <Txt v="sub" tone="mute" num style={{ fontSize: 13 }}>
                          {`${f.evidence}. Subscription?`}
                        </Txt>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, paddingLeft: big ? 0 : 52 }}>
                      <Button kind="secondary" label="Yes" hint={`Adds ${f.name} to your list`} onPress={() => answer(f.key, true)} height={44} style={{ flex: 1 }} />
                      <Button kind="secondary" label="No" hint="Never asks about it again" onPress={() => answer(f.key, false)} height={44} style={{ flex: 1 }} />
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      ) : null}

      {apple ? (
        <Pressable accessibilityRole="button" accessibilityHint="Opens the Apple screenshot finder" onPress={screenshot} style={{ marginTop: 14, backgroundColor: p.dark ? '#2A2516' : '#FFF6D6', borderRadius: 14, padding: 14 }}>
          <Txt v="sub" color={p.dark ? p.fg2 : '#4B4220'}>
            {'Apple bundles all its subscriptions into one charge. '}
            <Txt v="sub" style={{ textDecorationLine: 'underline', fontFamily: F.semi }} color={p.dark ? p.fg : brand.ink}>
              Screenshot your Apple list
            </Txt>
            {' to split them.'}
          </Txt>
        </Pressable>
      ) : null}

      {canAddLink(bank.state) ? (
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Txt v="sub" tone="mute">
            Pay some with another card?
          </Txt>
          <TextLink label="Add it" onPress={() => router.push(`/bank/pick?${flow.q()}`)} />
        </View>
      ) : null}
    </BankPage>
  );
}
