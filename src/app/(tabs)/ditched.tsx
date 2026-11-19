// 13 · Ditched. "You won't pay $X a year" counts only cancels the user
// confirmed (marked as cancelled). Ditched-but-not-cancelled ones wait
// at the top with "I cancelled it". Rewards are real money only (DECISIONS #13).

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { MONTH_LONG, parseDate, shortDate, weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, CYCLE_WORDS } from '@/domain/money';
import { chargeOfSub, confirmedSavings, isConfirmed, isPending, isPricedSub, pendingSavings, savingsSteps, snapYearly, type Sub } from '@/domain/subs';
import { useCancelHelp } from '@/ditch/CancelHelp';
import { StepChart } from '@/ditched/StepChart';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { ask } from '@/ui/alert';
import { DUCK_DARK, DUCK_LIGHT } from '@/ui/sunflower/duckAsset';
import { BottomFade, Button, Card, ChevronRight, DitchedTag, F, ProLockup, RowDivider, SectionHeader, Txt, brand, haptic, useInsets, usePalette, usePageEdge } from '@/ui/sunflower';

export default function DitchedTab() {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  const { width, fontScale } = useWindowDimensions();
  // SE and mini (375pt): the two buttons get their own full-width row under the name, so the full labels fit.
  const narrow = width < 380;
  const app = useApp();
  const money = useAppMoney();
  const help = useCancelHelp();
  const home = app.settings.currency;

  // Most urgent first: the soonest cancel-by date; no date last.
  const pending = app.subs
    .filter(isPending)
    .map((s) => ({ s, by: s.cancelBy && s.cancelBy >= app.today ? s.cancelBy : chargeOfSub(s, app.today) }))
    .sort((a, b) => (a.by ?? '9999').localeCompare(b.by ?? '9999'))
    .map((x) => x.s);
  const confirmed = useMemo(() => app.subs.filter(isConfirmed).sort((a, b) => ((a.confirmedOn ?? '') < (b.confirmedOn ?? '') ? 1 : -1)), [app.subs]);
  const saving = confirmedSavings(app.subs, home);
  const waiting = pendingSavings(app.subs, home);
  const main = saving[0];
  const steps = main ? savingsSteps(app.subs, main.currency) : [];
  const since = confirmed.length ? confirmed[confirmed.length - 1].confirmedOn : null;
  const sinceWord = since ? sinceLabel(since, app.today) : '';
  // "From 3 subs you cancelled since June · $35.93 a month" needs about 440pt at 16pt text; the hero card has 20pt sides.
  const oneLine = (width - edge * 2 - 40) / Math.max(1, fontScale) >= 440;

  const reactivate = (s: Sub) =>
    ask(`Still paying for ${s.name}?`, 'Put it back on your list, or back with the ones waiting for you to cancel.', [
      { text: 'Keep it cancelled', style: 'cancel' },
      { text: 'Not cancelled yet', onPress: () => void app.unconfirmCancelled(s.id) },
      { text: 'Put it back on my list', onPress: () => void app.reactivate(s.id) },
    ]);

  const nothing = pending.length === 0 && confirmed.length === 0;

  const pills = (s: Sub) => (
    <View style={{ flexDirection: 'row', gap: narrow ? 8 : 6, rowGap: 10, marginTop: narrow ? 12 : 10, flexWrap: narrow ? 'nowrap' : 'wrap' }}>
      <Pill
        label="I cancelled it"
        a11y={`I cancelled ${s.name}`}
        filled
        full={narrow}
        onPress={async () => {
          await app.confirmCancelled(s.id);
          haptic.success();
          // A win: offer the rating once the moment has landed.
          setTimeout(() => app.maybeAskReview('cancelled').catch(() => {}), 1500);
        }}
      />
      <Pill label="How to cancel" a11y={`How to cancel ${s.name}`} chevron full={narrow} onPress={() => help.open(s)} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      {/* The tab bar sits below this screen, not over it, so 16pt here is the tab bar's height + 16 from the bottom of the phone. */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 8, paddingHorizontal: edge, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Txt v="displayM" accessibilityRole="header" style={{ fontSize: 32, lineHeight: 40 }}>
          Ditched
        </Txt>

        {nothing ? (
          // Sits a little above the middle of the space, not stuck under the title with a blank screen below.
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 360, paddingBottom: 48 }}>
            {/* Empty state: the duck (CLAUDE.md rule 8: he has a job here), not the old stamp (DECISIONS #58). */}
            <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: 260, alignItems: 'center' }}>
              <Image source={p.dark ? DUCK_DARK : DUCK_LIGHT} style={{ width: 150, height: 88, marginBottom: -3 }} contentFit="contain" />
              {/* A faint row for him to sit on: the art's flat bottom is made to tuck behind a card. */}
              <View
                style={{
                  width: 260,
                  height: 64,
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: p.cardBorder,
                  backgroundColor: p.dark ? p.card : brand.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: p.segBg }} />
                <View style={{ flex: 1, gap: 7 }}>
                  <View style={{ width: '70%', height: 9, borderRadius: 5, backgroundColor: p.segBg }} />
                  <View style={{ width: '45%', height: 9, borderRadius: 5, backgroundColor: p.segBg }} />
                </View>
              </View>
            </View>
            <Txt v="heading" center style={{ marginTop: 28 }}>
              Nothing ditched yet.
            </Txt>
            <Txt v="leadS" tone="fg2" center style={{ marginTop: 8, maxWidth: 300 }}>
              Press and hold a subscription on Home to ditch it. What you stop paying adds up here.
            </Txt>
            <Button label="Go to my list" onPress={() => router.navigate('/')} style={{ marginTop: 24, width: '100%', maxWidth: 320 }} />
          </View>
        ) : (
          <>
            <View
              accessible
              accessibilityLabel={
                main
                  ? `You won’t pay ${money(main.yearlyMinor, main.currency, { whole: true })} a year, from ${main.count} ${main.count === 1 ? 'sub' : 'subs'} you cancelled${sinceWord ? ` since ${sinceWord}` : ''}, ${money(main.monthlyMinor, main.currency)} a month.`
                  : confirmed.length
                    ? `${confirmed.length} cancelled. No price on ${confirmed.length === 1 ? 'it' : 'them'}, so there’s nothing to add up yet.`
                    : 'Nothing cancelled yet.'
              }
              style={[
                { marginTop: 16, borderRadius: 24, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, backgroundColor: p.dark ? p.card : brand.sunflower },
                p.dark ? { borderWidth: 1, borderColor: p.cardBorder } : null,
              ]}
            >
              {main ? (
                <>
                  <Txt v="lead" color={p.dark ? p.fg : brand.ink} style={{ fontFamily: F.semi }}>
                    You won’t pay
                  </Txt>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 10 }}>
                    <Txt v="displayXL" num color={p.dark ? brand.sunflower : brand.ink} style={{ fontSize: 60, lineHeight: 66 }}>
                      {money(main.yearlyMinor, main.currency, { whole: true })}
                    </Txt>
                    <Txt v="title" color={p.dark ? p.fg : brand.ink} style={{ fontSize: 26 }}>
                      a year.
                    </Txt>
                  </View>
                  {saving.slice(1).map((t) => (
                    <Txt key={t.currency} v="label" num color={p.dark ? p.fg : brand.ink}>
                      + {money(t.yearlyMinor, t.currency, { whole: true })} a year
                    </Txt>
                  ))}
                  <Txt v="leadS" num color={p.dark ? p.fg2 : '#4B4220'} style={{ marginTop: 6 }}>
                    {/* Too narrow for one line (every phone): the monthly gets its own line, no dot. Wide (iPad): one line,
                        with the dot glued to the word before it so a dot never starts a line. */}
                    {`From ${main.count} ${main.count === 1 ? 'sub' : 'subs'} you cancelled${sinceWord ? ` since ${sinceWord}` : ''}`}
                    {oneLine ? `\u00A0· ${`${money(main.monthlyMinor, main.currency)} a month`.replace(/ /g, '\u00A0')}` : `\n${money(main.monthlyMinor, main.currency)} a month`}
                  </Txt>
                </>
              ) : confirmed.length ? (
                // Cancelled, but nothing had a price: say so instead of "nothing cancelled".
                <>
                  <Txt v="heading" num color={p.dark ? p.fg : brand.ink}>
                    {`${confirmed.length} cancelled. Nice.`}
                  </Txt>
                  <Txt v="leadS" color={p.dark ? p.fg2 : '#4B4220'} style={{ marginTop: 6 }}>
                    {`No price on ${confirmed.length === 1 ? 'it' : 'them'}, so there’s nothing to add up yet.`}
                  </Txt>
                </>
              ) : (
                <>
                  <Txt v="heading" color={p.dark ? p.fg : brand.ink}>
                    Nothing cancelled yet.
                  </Txt>
                  <Txt v="leadS" num color={p.dark ? p.fg2 : '#4B4220'} style={{ marginTop: 6 }}>
                    {waiting[0]
                      ? `Cancel what you ditched and that’s ${money(waiting[0].yearlyMinor, waiting[0].currency, { whole: true })} a year you won’t pay.`
                      : 'Cancel what you ditched and it adds up here.'}
                  </Txt>
                </>
              )}
            </View>

            {pending.length ? (
              <>
                <SectionHeader
                  title="To cancel"
                  // Cents, like the Ditched screen it came from ($17.99 a month is $215.88 a year there, not $216).
                  right={waiting[0] ? `${money(waiting[0].yearlyMinor, waiting[0].currency)} a year left to cancel` : undefined}
                  style={{ marginTop: 24, marginBottom: 8 }}
                />
                <Card>
                  {pending.map((s, i) => {
                    // "Cancel by" only for a date the user set; otherwise it's just when it charges.
                    const cancelBy = s.cancelBy && s.cancelBy >= app.today ? s.cancelBy : null;
                    const charge = cancelBy ? null : chargeOfSub(s, app.today);
                    // Glued with no-break spaces so "a month" never wraps on its own. SE: "Nov 24 · $17.99/mo" fits one line.
                    const price = isPricedSub(s)
                      ? ` · ${(narrow ? `${money(s.amountMinor, s.currency)}${CYCLE_SHORT[s.cycle]}` : `${money(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]}`).replace(/ /g, '\u00A0')}`
                      : '';
                    const day = narrow ? shortDate : weekdayDate;
                    return (
                      <View key={s.id}>
                        {i ? <RowDivider inset={16} /> : null}
                        <View style={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14 }}>
                          <View style={{ flexDirection: 'row', gap: 12 }}>
                            <SubLogo sub={s} ditched />
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {s.kind === 'ditch_pro_trial' ? (
                                  <ProLockup size={16} suffix="trial" color={p.cardFg} />
                                ) : (
                                  <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17, flexShrink: 1 }} numberOfLines={1}>
                                    {s.name}
                                  </Txt>
                                )}
                                <DitchedTag size="s" />
                              </View>
                              <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 2 }}>
                                {cancelBy ? `Cancel by ${day(cancelBy)}` : charge ? `Charges ${day(charge)}` : 'Cancel before it renews'}
                                {price}
                              </Txt>
                              {narrow ? null : pills(s)}
                            </View>
                          </View>
                          {/* Narrow phones (SE): full labels on their own full-width row, never "Cancelled", which reads like a status. */}
                          {narrow ? pills(s) : null}
                        </View>
                      </View>
                    );
                  })}
                </Card>
              </>
            ) : null}

            {confirmed.length ? (
              <>
                <SectionHeader title="Cancelled" right="You confirmed these" style={{ marginTop: 24, marginBottom: 8 }} />
                <Card>
                  {confirmed.map((s, i) => {
                    const y = snapYearly(s);
                    return (
                      <View key={s.id}>
                        {i ? <RowDivider inset={62} /> : null}
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`${s.name}, cancelled ${s.confirmedOn ? weekdayDate(s.confirmedOn) : ''}${y ? `, ${money(y.amountMinor, y.currency)} a year` : ''}`}
                          accessibilityHint="Opens options. Still paying? Put it back on your list."
                          onPress={() => reactivate(s)}
                          style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 8, opacity: pressed ? 0.7 : 1 })}
                        >
                          <SubLogo sub={s} ditched />
                          <View style={{ flex: 1, minWidth: 0 }}>
                            {/* Two lines before it cuts off: "Audible Premium Plus" fits whole on every iPhone. */}
                            <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={2}>
                              {s.name}
                            </Txt>
                            <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 1 }}>
                              Cancelled {s.confirmedOn ? shortDate(s.confirmedOn) : ''}
                            </Txt>
                          </View>
                          {y ? (
                            <View style={{ alignItems: 'flex-end' }}>
                              {/* Struck through: a price they no longer pay. Same ink, so it stays easy to read. */}
                              <Txt v="moneyM" num color={p.cardFg} style={{ fontSize: 17, textDecorationLine: 'line-through' }}>
                                {money(y.amountMinor, y.currency)}
                              </Txt>
                              <Txt v="sub" tone="mute">
                                a year
                              </Txt>
                            </View>
                          ) : null}
                          {/* No chevron: a tap opens a choice, not another page. */}
                        </Pressable>
                      </View>
                    );
                  })}
                </Card>
              </>
            ) : null}

            {steps.length ? (
              <>
                <SectionHeader title="Adding up" right="a year, after each one" style={{ marginTop: 24, marginBottom: 8 }} />
                <Card style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}>
                  <StepChart steps={steps} currency={main!.currency} />
                </Card>
              </>
            ) : null}

            <Txt v="fine" tone="mute" style={{ marginTop: 18, marginHorizontal: 4 }}>
              This only counts the ones you marked as cancelled.
            </Txt>
          </>
        )}
      </ScrollView>
      {/* As tall as the bottom padding, so the last line is never faded once you reach the end. */}
      <BottomFade height={16} />
      {help.sheet}
    </View>
  );
}

function Pill({ label, a11y, onPress, filled, chevron, full }: { label: string; a11y?: string; onPress: () => void; filled?: boolean; chevron?: boolean; full?: boolean }) {
  const p = usePalette();
  const bg = filled ? (p.dark ? brand.sunflower : brand.ink) : 'transparent';
  const fg = filled ? (p.dark ? brand.ink : brand.white) : p.cardFg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y ?? label}
      onPress={onPress}
      hitSlop={{ top: 5, bottom: 5 }}
      style={({ pressed }) => ({
        minHeight: full ? 44 : 36,
        borderRadius: full ? 22 : 18,
        paddingHorizontal: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: full ? 1 : undefined,
        gap: 2,
        backgroundColor: bg,
        borderWidth: filled ? 0 : 1.5,
        borderColor: p.dark ? 'rgba(246,240,227,0.45)' : brand.ink,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Txt v="label" color={fg} style={{ fontSize: 15 }}>
        {label}
      </Txt>
      {chevron ? <ChevronRight color={fg} size={13} /> : null}
    </Pressable>
  );
}

/** "June", or "June 2025" when it's not this year. */
function sinceLabel(d: string, today: string): string {
  const { y, m } = parseDate(d);
  return y === parseDate(today).y ? MONTH_LONG[m - 1] : `${MONTH_LONG[m - 1]} ${y}`;
}
