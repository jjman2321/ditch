// 09 / 09b / 09c / 11 · Home. The total per currency, every sub grouped by
// week, bells for reminders, and hold-to-ditch. Totals never move: no
// count-up here (MOTION.md §1).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { DISMISSED_KEEP } from '@/domain/settings';
import { nextReminder, whenLabel } from '@/domain/reminders';
import { overlapToShow } from '@/domain/overlaps';
import { priceChanges } from '@/domain/priceWatch';
import { priceRow } from '@/catalog/prices';
import {
  beforePayday,
  cheapestSub,
  hasDate,
  trialsAfter,
  homeGroups,
  homeTotals,
  isPending,
  isPricedSub,
  isProTrial,
  listedUserSubs,
  remindedIds,
  undatedSubs,
  yearlyOfSub,
  type Sub,
} from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { AddDatesSheet } from '@/home/AddDatesSheet';
import { EmptyHome, NextReminderRow, NoDateRow, OffBanner, OverlapCard, PaydayRow, PriceChangeCard, TotalCard, openPhoneSettings } from '@/home/HomeParts';
import { PriceColumnMeasure, SubRow, type BellState } from '@/home/SubRow';
import { BankToastView, SyncCardView, type SyncHandlers } from '@/bank/HomeCards';
import { openUrl } from '@/ditch/CancelHelp';
import { useApp, useAppMoney } from '@/state/app';
import { useBank } from '@/state/bank';
import { foundTagShows } from '@/state/bankLogic';
import { BottomFade, Card, Chip, Gear, IconButton, Plus, RowDivider, SectionHeader, SurfaceContext, Txt, Wordmark, brand, haptic, useInsets, usePalette, usePageEdge } from '@/ui/sunflower';

export default function Home() {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  const app = useApp();
  const editor = useEditor();
  const { subs, today, pro, notif, settings } = app;
  const [holding, setHolding] = useState<string | null>(null);
  const [datesOpen, setDatesOpen] = useState(false);

  const allGroups = useMemo(() => homeGroups(subs, today), [subs, today]);
  // Filter by card (DECISIONS #60): only once 2+ different cards are noted, so it never clutters a simple list.
  const cards = useMemo(
    () =>
      [
        ...new Set(
          listedUserSubs(subs)
            .map((s) => s.paidWith?.trim())
            .filter((c): c is string => !!c),
        ),
      ].sort(),
    [subs],
  );
  const [card, setCard] = useState<string | null>(null);
  const cardOn = card && cards.includes(card) ? card : null;
  const groups = useMemo(
    () => (cardOn ? allGroups.map((g) => ({ ...g, rows: g.rows.filter((r) => r.sub.paidWith?.trim() === cardOn) })).filter((g) => g.rows.length) : allGroups),
    [allGroups, cardOn],
  );
  const totals = useMemo(() => homeTotals(subs, today, settings.currency), [subs, today, settings.currency]);
  // The picked card's own total, one line per currency (the big card above stays the whole list).
  const cardTotals = useMemo(
    () =>
      cardOn
        ? homeTotals(
            subs.filter((s) => s.paidWith?.trim() === cardOn),
            today,
            settings.currency,
          )
        : [],
    [subs, today, settings.currency, cardOn],
  );
  const trials = useMemo(() => trialsAfter(subs, today), [subs, today]);
  const reminded = useMemo(() => remindedIds(subs, pro), [subs, pro]);
  const listed = listedUserSubs(subs);
  const blocked = notif === 'denied' || notif === 'undetermined';
  // No date yet: no reminders until they add one (DECISIONS #33). Biggest first.
  const undated = undatedSubs(subs).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a));
  const empty = allGroups.length === 0;
  const overlap = useMemo(() => overlapToShow(subs, settings.dismissedOverlaps), [subs, settings.dismissedOverlaps]);
  const payday = useMemo(() => beforePayday(subs, today, settings.payday), [subs, today, settings.payday]);
  // Price watch (Pro): our checked price for their plan changed. Dismissed keys share the overlaps list.
  const change = useMemo(() => priceChanges(subs, priceRow).find((c) => !settings.dismissedOverlaps.includes(c.key)) ?? null, [subs, settings.dismissedOverlaps]);
  // Bank sync (DECISIONS #70): one card at a time, reconnect > price change > looks cancelled > check these > trial recap.
  const bank = useBank();
  const sync = bank.cards[0] ?? null;
  // At most two cards above the list on every phone, so the list starts on the first screen:
  // Next reminder (when there is one) plus ONE other. A bank sync card takes that slot first (it's
  // about real money that just moved), then a duplicate/overlap, then before payday
  // (then price watch, the other suggestion), then dates missing.
  // The overlap card can be dismissed, so it goes before payday; payday only when something is actually due (audit, Nov 19).
  const other = sync ? 'sync' : overlap ? 'overlap' : payday?.count ? 'payday' : change ? 'change' : undated.length && !blocked ? 'undated' : null;
  // The very next one, so it's plain that reminders are scheduled.
  const next = blocked ? null : nextReminder(app.plan, subs);
  const money = useAppMoney();
  // The "/yr" sits under each price, so only the price itself sets the column's width.
  const prices = useMemo(() => groups.flatMap((g) => g.rows.map((r) => (isPricedSub(r.sub) ? money(r.sub.amountMinor, r.sub.currency) : null))), [groups, money]);
  const [priceW, setPriceW] = useState<number | undefined>(undefined);

  const bellOf = (id: string): BellState => {
    const s = subs.find((x) => x.id === id);
    if (blocked) return 'blocked';
    if (s && isProTrial(s)) return 'on';
    return reminded.has(id) ? 'on' : 'off';
  };

  // Free plan: tap a bell to move one of the 3 reminders (same rules as Settings → Which subscriptions).
  // A 4th one opens Pro instead.
  const toggleBell = async (s: Sub) => {
    const ok = await app.setReminder(s.id, !reminded.has(s.id));
    if (ok) {
      haptic.select();
      return;
    }
    haptic.warning();
    router.push('/paywall?from=which');
  };

  const ditch = async (id: string) => {
    await app.ditch(id);
    setHolding(null);
    router.push(`/ditch/${id}?fresh=1`);
  };

  const syncHandlers: SyncHandlers = {
    updatePrice: (c) => {
      haptic.select();
      void app.saveSub({ ...c.sub, amountMinor: c.change.toMinor, amountIsEstimate: false, priceSource: 'user' });
    },
    dismiss: (key) => void bank.dismissCard(key),
    markDitched: (id) => void ditch(id),
    reconnect: (id) => void bank.reconnect(id),
    later: (id) => void bank.later(id),
    answer: (key, yes) => {
      haptic.select();
      void bank.answer(key, yes);
    },
    // Ditch Pro is billed by Apple: its page in iPhone Settings is where the trial is cancelled.
    howToCancel: () => openUrl('https://apps.apple.com/account/subscriptions'),
  };

  const turnOn = async () => {
    if (notif === 'denied') openPhoneSettings();
    else await app.askNotif();
  };

  return (
    <SurfaceContext.Provider value="cream">
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <PriceColumnMeasure prices={prices} onWidth={setPriceW} />
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 6, paddingHorizontal: edge, paddingBottom: 28 }} showsVerticalScrollIndicator={false} scrollEnabled={!holding}>
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
                <TotalCard
                  totals={totals}
                  on={[...reminded].filter((id) => listed.some((s) => s.id === id)).length}
                  of={listed.length}
                  all={pro && listed.every((s) => reminded.has(s.id))}
                  blocked={blocked}
                  trials={trials}
                />
              </View>
              {next ? (
                <View style={{ marginTop: 10 }}>
                  <NextReminderRow when={whenLabel(next.fireAt, today, settings.reminderTime)} name={next.name} onPress={() => router.push('/calendar')} />
                </View>
              ) : null}
              {sync && other === 'sync' ? (
                <View style={{ marginTop: 10 }}>
                  <SyncCardView card={sync} today={today} h={syncHandlers} />
                </View>
              ) : null}
              {payday && other === 'payday' ? (
                <View style={{ marginTop: 10 }}>
                  <PaydayRow before={payday} money={money} onPress={() => router.push('/calendar')} />
                </View>
              ) : null}
              {other === 'undated' ? (
                <View style={{ marginTop: 10 }}>
                  <NoDateRow count={undated.length} onPress={() => setDatesOpen(true)} />
                </View>
              ) : null}

              {change && other === 'change' ? (
                <View style={{ marginTop: 10 }}>
                  <PriceChangeCard
                    change={change}
                    pro={pro}
                    money={money}
                    onUpdate={() => void app.saveSub({ ...change.sub, amountMinor: change.now, amountIsEstimate: true })}
                    onDismiss={() => void app.updateSettings({ dismissedOverlaps: [...settings.dismissedOverlaps, change.key].slice(-DISMISSED_KEEP) })}
                    onPro={() => router.push('/paywall?from=app')}
                  />
                </View>
              ) : null}

              {/* One suggestion at a time: the free overlap win first (shortest path to a ditch), then price watch. */}
              {overlap && other === 'overlap' ? (
                <View style={{ marginTop: 10 }}>
                  <OverlapCard
                    overlap={overlap}
                    money={money}
                    onPick={() => editor.openEdit((cheapestSub(overlap.subs) ?? overlap.subs[0]).id)}
                    onDismiss={() => void app.updateSettings({ dismissedOverlaps: [...settings.dismissedOverlaps, overlap.key].slice(-DISMISSED_KEEP) })}
                  />
                </View>
              ) : null}

              {cards.length >= 2 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 16, marginHorizontal: -edge }}
                  contentContainerStyle={{ gap: 8, paddingHorizontal: edge }}
                  accessibilityLabel="Filter by card"
                >
                  <Chip label="All" selected={!cardOn} onPress={() => setCard(null)} />
                  {cards.map((c) => (
                    <Chip key={c} label={c} selected={cardOn === c} onPress={() => setCard(cardOn === c ? null : c)} />
                  ))}
                </ScrollView>
              ) : null}
              {cardOn && cardTotals.length ? (
                <View style={{ marginTop: 8, marginHorizontal: 2 }}>
                  {cardTotals.map((t) => (
                    <Txt key={t.currency} v="sub" tone="mute" num>
                      {`${cardOn}: ${money(t.monthlyMinor, t.currency)} a month`}
                    </Txt>
                  ))}
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
                          onBell={!pro && !blocked && !isPending(r.sub) && hasDate(r.sub) ? toggleBell : undefined}
                          priceWidth={priceW}
                          foundTag={bank.on && foundTagShows(r.sub, today) && bank.toast?.subId !== r.sub.id}
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
              {/* No "Missing any?" / find cards on Home (owner, Nov 19: too much for the main page). They live in the + sheet. */}
            </>
          )}
        </ScrollView>
        <BottomFade />
        <BankToastView toast={bank.toast} onUndo={(id) => void bank.undo(id)} onDone={bank.dismissToast} />
      </View>
      <AddDatesSheet visible={datesOpen} onClose={() => setDatesOpen(false)} />
    </SurfaceContext.Provider>
  );
}
