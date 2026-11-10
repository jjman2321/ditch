// 09 / 09b / 09c / 11 · Home. The total per currency, every sub grouped by
// week, bells for reminders, and hold-to-ditch. Totals never move: no
// count-up here (MOTION.md §1).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { homeGroups, homeTotals, isActive, isGuess, isPending, isPricedSub, isProTrial, listedUserSubs, remindedIds } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { EmptyHome, GuessesRow, OffBanner, TotalCard, openPhoneSettings } from '@/home/HomeParts';
import { PriceColumnMeasure, SubRow, type BellState } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { Card, EDGE, Gear, IconButton, Plus, RowDivider, SectionHeader, SurfaceContext, Wordmark, brand, useInsets, usePalette } from '@/ui/sunflower';

export default function Home() {
  const p = usePalette();
  const insets = useInsets();
  const app = useApp();
  const editor = useEditor();
  const { subs, today, pro, notif, settings } = app;
  const [holding, setHolding] = useState<string | null>(null);

  const groups = useMemo(() => homeGroups(subs, today), [subs, today]);
  const totals = useMemo(() => homeTotals(subs, today, settings.currency), [subs, today, settings.currency]);
  const reminded = useMemo(() => remindedIds(subs, pro), [subs, pro]);
  const listed = listedUserSubs(subs);
  const blocked = notif === 'denied' || notif === 'undetermined';
  const guesses = subs.filter((s) => isActive(s) && !isProTrial(s) && isGuess(s));
  const empty = groups.length === 0;
  const money = useAppMoney();
  const prices = useMemo(() => groups.flatMap((g) => g.rows.map((r) => (isPricedSub(r.sub) ? money(r.sub.amountMinor, r.sub.currency) : null))), [groups, money]);
  const [priceW, setPriceW] = useState<number | undefined>(undefined);

  const bellOf = (id: string): BellState => {
    const s = subs.find((x) => x.id === id);
    if (blocked) return 'blocked';
    if (s && isProTrial(s)) return 'on';
    return reminded.has(id) ? 'on' : 'off';
  };

  const ditch = async (id: string) => {
    await app.ditch(id);
    setHolding(null);
    router.push(`/ditch/${id}?fresh=1`);
  };

  const turnOn = async () => {
    if (notif === 'denied') openPhoneSettings();
    else await app.askNotif();
  };

  return (
    <SurfaceContext.Provider value="cream">
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <PriceColumnMeasure prices={prices} onWidth={setPriceW} />
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 6, paddingHorizontal: EDGE, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!holding}
        >
          <View style={{ height: 52, flexDirection: 'row', alignItems: 'center' }}>
            <Wordmark size={25} />
            <View style={{ flex: 1 }} />
            <IconButton label="Settings" onPress={() => router.push('/settings')} bg={p.dark ? p.iconBtn : '#EFE8D9'} size={44}>
              <Gear color={p.fg} size={25} />
            </IconButton>
            {empty ? null : (
              <IconButton label="Add a subscription" onPress={() => editor.openAdd()} bg={p.dark ? brand.sunflower : brand.ink} size={44} style={{ marginLeft: 6, marginRight: -2 }}>
                <Plus color={p.dark ? brand.ink : brand.sunflower} size={22} />
              </IconButton>
            )}
          </View>

          {empty ? (
            <EmptyHome country={settings.country} onAdd={(id) => editor.openAdd(id)} />
          ) : (
            <>
              {blocked ? (
                <View style={{ marginTop: 14 }}>
                  <OffBanner status={notif} onTurnOn={turnOn} />
                </View>
              ) : null}
              <View style={{ marginTop: 14 }}>
                <TotalCard totals={totals} on={[...reminded].filter((id) => listed.some((s) => s.id === id)).length} of={listed.length} all={pro && listed.every((s) => reminded.has(s.id))} blocked={blocked} />
              </View>
              {guesses.length && !blocked ? (
                <View style={{ marginTop: 10 }}>
                  <GuessesRow count={guesses.length} onPress={() => editor.openEdit(guesses.sort((a, b) => (a.anchor < b.anchor ? -1 : 1))[0].id)} />
                </View>
              ) : null}

              {groups.map((g, gi) => (
                <View key={g.title} style={{ marginTop: gi === 0 ? 22 : 20 }}>
                  <SectionHeader title={g.title} right={gi === 0 && !settings.holdHintDone ? 'Hold a sub to ditch it' : undefined} style={{ marginBottom: 8 }} />
                  <Card style={{ overflow: 'visible' }}>
                    {g.rows.map((r, i) => (
                      <View key={r.sub.id}>
                        {i ? <RowDivider inset={62} /> : null}
                        <SubRow
                          sub={r.sub}
                          charge={r.charge}
                          today={today}
                          bell={bellOf(r.sub.id)}
                          priceWidth={priceW}
                          holding={holding === r.sub.id}
                          dimmed={!!holding && holding !== r.sub.id}
                          onHoldStart={setHolding}
                          onHoldEnd={() => setHolding((h) => (h === r.sub.id ? null : h))}
                          onDitch={ditch}
                          onOpen={(s) => (isPending(s) ? router.push(`/ditch/${s.id}`) : editor.openEdit(s.id))}
                        />
                      </View>
                    ))}
                  </Card>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SurfaceContext.Provider>
  );
}
