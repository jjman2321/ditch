// 09 / 09b / 09c / 11 · Home. The total per currency, every sub grouped by
// week, bells for reminders, and hold-to-ditch. Totals never move: no
// count-up here (MOTION.md §1).
// The list is a SectionList, so only the rows near the screen are drawn: 3,000 subs open as fast as 3 (audit, Nov 20).

import { router, useFocusEffect } from 'expo-router';
import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState, ScrollView, SectionList, View } from 'react-native';

import { DISMISSED_KEEP } from '@/domain/settings';
import { chargeDay } from '@/domain/copy';
import { shouldShowOpenUpsell, soonUnreminded } from '@/domain/upsell';
import { nextReminder, whenLabel } from '@/domain/reminders';
import { overlapToShow } from '@/domain/overlaps';
import { priceChanges } from '@/domain/priceWatch';
import { priceRow } from '@/catalog/prices';
import {
  FREE_REMINDERS,
  beforePayday,
  cheapestSub,
  hasDate,
  trialsAfter,
  homeGroups,
  homeTotals,
  isPending,
  isProTrial,
  listedUserSubs,
  remindedIds,
  undatedSubs,
  yearlyOfSub,
  type HomeRow,
  type Sub,
} from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { AddDatesSheet } from '@/home/AddDatesSheet';
import { EmptyHome, ForgottenRow, NextReminderRow, NoDateRow, NoReminderRow, OffBanner, OverlapCard, PaydayRow, PriceChangeCard, QuietRow, TotalCard, openPhoneSettings } from '@/home/HomeParts';
import { PriceColumnMeasure, SubRow, rowPrice, type BellState } from '@/home/SubRow';
import { BankToastView, SyncCardView, type SyncHandlers } from '@/bank/HomeCards';
import { openUrl } from '@/ditch/CancelHelp';
import { tell } from '@/ui/alert';
import { useApp, useAppMoney } from '@/state/app';
import { BankApiError } from '@/services/bank';
import { useBank } from '@/state/bank';
import { foundTagShows } from '@/state/bankLogic';
import { BottomFade, Card, Chip, Gear, IconButton, Plus, RowDivider, SectionHeader, SurfaceContext, Txt, Wordmark, brand, haptic, useInsets, usePalette, usePageEdge } from '@/ui/sunflower';

/** Room around a slice for the card's shadow (Card: 20pt blur, 6pt down). */
const SHADOW_X = 24;
const SHADOW_TOP = 24;
const SHADOW_BOTTOM = 32;

/**
 * One row as a slice of its week's card. The card is drawn whole behind every slice and cut to the
 * slice's height, so the stacked slices look exactly like one card (border, corners and shadow),
 * while the list only draws the rows near the screen.
 */
function CardSlice({ first, last, children }: { first: boolean; last: boolean; children: ReactNode }) {
  return (
    <View>
      <View pointerEvents="none" style={{ position: 'absolute', left: -SHADOW_X, right: -SHADOW_X, top: first ? -SHADOW_TOP : 0, bottom: last ? -SHADOW_BOTTOM : 0, overflow: 'hidden' }}>
        <Card style={{ position: 'absolute', left: SHADOW_X, right: SHADOW_X, top: first ? SHADOW_TOP : -60, bottom: last ? SHADOW_BOTTOM : -60 }}>{null}</Card>
      </View>
      {/* The card's 1pt border sits outside the rows, as it did. */}
      <View style={{ marginHorizontal: 1, marginTop: first ? 1 : 0, marginBottom: last ? 1 : 0 }}>{children}</View>
    </View>
  );
}

type RowHandlers = {
  onBell: (s: Sub) => void;
  onDitch: (id: string) => void;
  onOpen: (s: Sub) => void;
  onHoldStart: (id: string) => void;
  onHoldEnd: (id: string) => void;
};

/** Memoized, with handlers that never change: holding one row re-renders only the rows whose look changes. */
const HomeListRow = memo(function HomeListRow({
  row,
  first,
  last,
  today,
  bell,
  canBell,
  priceWidth,
  foundTag,
  holding,
  dimmed,
  h,
}: {
  row: HomeRow;
  first: boolean;
  last: boolean;
  today: string;
  bell: BellState;
  canBell: boolean;
  priceWidth?: number;
  foundTag: boolean;
  holding: boolean;
  dimmed: boolean;
  h: RowHandlers;
}) {
  const id = row.sub.id;
  const onHoldEnd = useCallback(() => h.onHoldEnd(id), [h, id]);
  return (
    <CardSlice first={first} last={last}>
      {first ? null : <RowDivider inset={62} />}
      <SubRow
        sub={row.sub}
        charge={row.charge}
        today={today}
        bell={bell}
        onBell={canBell ? h.onBell : undefined}
        priceWidth={priceWidth}
        foundTag={foundTag}
        holding={holding}
        dimmed={dimmed}
        onHoldStart={h.onHoldStart}
        onHoldEnd={onHoldEnd}
        onDitch={h.onDitch}
        onOpen={h.onOpen}
      />
    </CardSlice>
  );
});

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
  const listed = useMemo(() => listedUserSubs(subs), [subs]);
  const byId = useMemo(() => new Map(subs.map((s) => [s.id, s])), [subs]);
  // Only subs with a date can be reminded, so "3 of 20 reminded" counts those (audit, Nov 20).
  const dated = useMemo(() => listed.filter(hasDate), [listed]);
  const blocked = notif === 'denied' || notif === 'undetermined';
  // No date yet: no reminders until they add one (DECISIONS #33). Biggest first.
  const undated = undatedSubs(subs).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a));
  const empty = allGroups.length === 0;
  const overlap = useMemo(() => overlapToShow(subs, settings.dismissedOverlaps), [subs, settings.dismissedOverlaps]);
  const payday = useMemo(() => beforePayday(subs, today, settings.payday), [subs, today, settings.payday]);
  // Price watch (Pro): our checked price for their plan changed. Dismissed keys share the overlaps list.
  const change = useMemo(() => priceChanges(subs, priceRow).find((c) => !settings.dismissedOverlaps.includes(c.key)) ?? null, [subs, settings.dismissedOverlaps]);
  const dismiss = (key: string) => void app.updateSettings({ dismissedOverlaps: [...settings.dismissedOverlaps, key].slice(-DISMISSED_KEEP) });
  // Bank sync (DECISIONS #70): one card at a time, reconnect > new account > price change > looks cancelled > check these > trial recap.
  const bank = useBank();
  const sync = bank.cards[0] ?? null;
  // At most two cards above the list on every phone, so the list starts on the first screen:
  // Next reminder (when there is one) plus ONE other. A bank sync card takes that slot first (it's
  // about real money that just moved), then a duplicate/overlap, then before payday
  // (then price watch, the other suggestion), then dates missing.
  // The overlap card can be dismissed, so it goes before payday; payday only when something is actually due (audit, Nov 19).
  // Free plan with every free reminder in use: dated subs left without one get one Pro card (owner, Nov 20).
  // Banners off ("quiet"): reminders arrive without a sound or banner, so it comes right after a bank card (audit, Nov 20).
  // The free "price went up" card is only a Pro pitch, so it waits until dates are added (audit, Nov 20).
  const unreminded = useMemo(
    () => (pro || blocked ? [] : listed.filter((s) => s.status === 'active' && hasDate(s) && !isProTrial(s) && !reminded.has(s.id)).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a))),
    [pro, blocked, listed, reminded],
  );
  const noRemindKey = `noremind:${unreminded
    .map((s) => s.id)
    .sort()
    .join(',')}`;
  // Timely version (option C, DECISIONS #82): one of them charges within a week. Hiding it hides that charge only,
  // so the next charge without a reminder brings it back.
  const soon = useMemo(() => (reminded.size >= FREE_REMINDERS ? soonUnreminded(unreminded, today) : null), [unreminded, reminded, today]);
  const soonKey = soon ? `noremind-soon:${soon.sub.id}:${soon.charge}` : '';
  const soonShows = !!soon && !settings.dismissedOverlaps.includes(soonKey);
  const showNoRemind = unreminded.length > 0 && reminded.size >= FREE_REMINDERS && (soonShows || !settings.dismissedOverlaps.includes(noRemindKey));

  // The weekly Pro paywall on open (DECISIONS #82): only on Home, a moment after it shows, at most once a week.
  const upsellRef = useRef({ settings, pro, blocked, reminded: reminded.size, unreminded: unreminded.length, today });
  useLayoutEffect(() => {
    upsellRef.current = { settings, pro, blocked, reminded: reminded.size, unreminded: unreminded.length, today };
  });
  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const check = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const u = upsellRef.current;
          const show = shouldShowOpenUpsell({
            pro: u.pro,
            onboardingDone: u.settings.onboardingDone,
            blocked: u.blocked,
            installedOn: u.settings.review.installedOn,
            lastShownOn: u.settings.upsellShownOn,
            reviewAskedOn: u.settings.review.lastAskedOn,
            remindedCount: u.reminded,
            unremindedCount: u.unreminded,
            freeReminders: FREE_REMINDERS,
            today: u.today,
          });
          if (!show) return;
          void app.updateSettings({ upsellShownOn: u.today });
          router.push('/paywall?from=open');
        }, 1200);
      };
      check();
      const sub = AppState.addEventListener('change', (st) => (st === 'active' ? check() : clearTimeout(timer)));
      return () => {
        clearTimeout(timer);
        sub.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const changeNow = change && (pro || !(undated.length && !blocked));
  const other = sync
    ? 'sync'
    : notif === 'quiet'
      ? 'quiet'
      : showNoRemind
        ? 'noremind'
        : overlap
          ? 'overlap'
          : payday?.count
            ? 'payday'
            : changeNow
              ? 'change'
              : undated.length && !blocked
                ? 'undated'
                : change
                  ? 'change'
                  : null;
  // The very next one, so it's plain that reminders are scheduled.
  const next = blocked ? null : nextReminder(app.plan, subs);
  const money = useAppMoney();
  // The "/yr" sits under each price, so only the price itself sets the column's width.
  // Measured the way the rows show them (1,000 and up without cents), so one big price doesn't widen every row.
  const prices = useMemo(() => groups.flatMap((g) => g.rows.map((r) => rowPrice(r.sub, money))), [groups, money]);
  const [priceW, setPriceW] = useState<number | undefined>(undefined);

  const bellOf = (id: string): BellState => {
    const s = byId.get(id);
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
    const before = await app.ditch(id);
    setHolding(null);
    // Not saved: the app already said so, and the row is back as it was.
    if (before) router.push(`/ditch/${id}?fresh=1`);
  };

  // Opening a row the bank added counts as seen: its "Found in your bank" tag goes (owner, Nov 20: "removable").
  const open = (s: Sub) => {
    if (s.foundInBankOn) void app.saveSub({ ...s, foundInBankOn: null });
    if (isPending(s)) router.push(`/ditch/${s.id}`);
    else editor.openEdit(s.id);
  };

  // The rows get handlers that never change; these refs always point at this render's versions.
  const latest = useRef({ toggleBell, ditch, open });
  useLayoutEffect(() => {
    latest.current = { toggleBell, ditch, open };
  });
  const rowHandlers = useMemo<RowHandlers>(
    () => ({
      onBell: (s) => void latest.current.toggleBell(s),
      onDitch: (id) => void latest.current.ditch(id),
      onOpen: (s) => latest.current.open(s),
      onHoldStart: (id) => setHolding(id),
      onHoldEnd: (id) => setHolding((h) => (h === id ? null : h)),
    }),
    [],
  );
  const sections = useMemo(() => (empty ? [] : groups.map((g, gi) => ({ key: g.title, title: g.title, gi, data: g.rows }))), [empty, groups]);

  const syncHandlers: SyncHandlers = {
    updatePrice: (c) => {
      haptic.select();
      void app.saveSub({ ...c.sub, amountMinor: c.change.toMinor, amountIsEstimate: false, priceSource: 'user' });
    },
    dismiss: (key) => void bank.dismissCard(key),
    markDitched: (id) => void ditch(id),
    reconnect: (id) => void bank.reconnect(id).catch(() => tell('Couldn’t reconnect', 'Check your connection and try again in a bit.')),
    later: (id) => void bank.later(id),
    addAccounts: (id) =>
      void bank.addAccounts(id).catch((e: unknown) => {
        // Closing the bank's sheet without finishing isn't an error.
        if (e instanceof BankApiError && e.code === 'link_closed') return;
        tell(`Couldn’t reach ${bank.state.links.find((l) => l.id === id)?.name ?? 'your bank'}`, 'Check your connection and try again in a bit.');
      }),
    laterAccounts: (id) => void bank.laterAccounts(id),
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

  const header = (
    <>
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
              on={dated.filter((s) => reminded.has(s.id)).length}
              of={dated.length}
              listed={listed.length}
              all={pro && dated.length > 0 && dated.every((s) => reminded.has(s.id))}
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
          {other === 'quiet' ? (
            <View style={{ marginTop: 10 }}>
              <QuietRow onFix={openPhoneSettings} />
            </View>
          ) : null}
          {payday && other === 'payday' ? (
            <View style={{ marginTop: 10 }}>
              <PaydayRow before={payday} money={money} onPress={() => router.push('/calendar')} />
            </View>
          ) : null}
          {other === 'noremind' ? (
            <View style={{ marginTop: 10 }}>
              <NoReminderRow
                names={unreminded.map((s) => s.name)}
                total={reminded.size + unreminded.length}
                soon={soonShows && soon ? { name: soon.sub.name, when: chargeDay(soon.charge, today) } : undefined}
                onPress={() => router.push('/paywall?from=which')}
                onDismiss={() => dismiss(soonShows ? soonKey : noRemindKey)}
              />
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
                onDismiss={() => dismiss(change.key)}
                onPro={() => router.push('/paywall?from=app')}
              />
            </View>
          ) : null}

          {/* One suggestion at a time: the free overlap win first (shortest path to a ditch), then price watch. */}
          {overlap && other === 'overlap' ? (
            <View style={{ marginTop: 10 }}>
              <OverlapCard overlap={overlap} money={money} onPick={() => editor.openEdit((cheapestSub(overlap.subs) ?? overlap.subs[0]).id)} onDismiss={() => dismiss(overlap.key)} />
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
        </>
      )}
    </>
  );

  // Short lists only: a small "Missing any?" row so Home isn't bare (owner, Nov 20). Long lists don't need it.
  const footer =
    // Short lists: the older "Missing any?" card (owner, Nov 20: logos could get cluttered). Gone once they've been through it.
    !empty && listed.length <= 8 && !cardOn && !settings.forgottenDone ? (
      <View style={{ marginTop: 22 }}>
        <ForgottenRow onPress={() => editor.openForgotten()} />
      </View>
    ) : undefined;

  return (
    <SurfaceContext.Provider value="cream">
      <View style={{ flex: 1, backgroundColor: p.bg }}>
        <PriceColumnMeasure prices={prices} onWidth={setPriceW} />
        <SectionList
          sections={sections}
          keyExtractor={(r) => r.sub.id}
          extraData={holding}
          contentContainerStyle={{ paddingTop: insets.top + 6, paddingHorizontal: edge, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!holding}
          stickySectionHeadersEnabled={false}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              title={section.title}
              right={section.gi === 0 && !settings.holdHintDone ? 'Hold a sub to ditch it' : undefined}
              style={{ marginTop: section.gi === 0 ? 22 : 20, marginBottom: 8 }}
            />
          )}
          renderItem={({ item, index, section }) => (
            <HomeListRow
              row={item}
              first={index === 0}
              last={index === section.data.length - 1}
              today={today}
              bell={bellOf(item.sub.id)}
              canBell={!pro && !blocked && !isPending(item.sub) && hasDate(item.sub)}
              priceWidth={priceW}
              foundTag={!!(bank.on && foundTagShows(item.sub, today) && bank.toast?.subId !== item.sub.id)}
              holding={holding === item.sub.id}
              dimmed={!!holding && holding !== item.sub.id}
              h={rowHandlers}
            />
          )}
        />
        <BottomFade />
        <BankToastView toast={bank.toast} onUndo={(id) => void bank.undo(id)} onDone={bank.dismissToast} />
      </View>
      <AddDatesSheet visible={datesOpen} onClose={() => setDatesOpen(false)} />
    </SurfaceContext.Provider>
  );
}
