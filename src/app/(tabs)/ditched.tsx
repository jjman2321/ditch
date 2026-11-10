// 13 · Ditched. "You're saving $X a year" counts only cancels the user
// confirmed (Ditch can't see the bank). Ditched-but-not-cancelled ones wait
// at the top with "I cancelled it". Rewards are real money only (DECISIONS #13).

import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { MONTH_LONG, parseDate, weekdayDate } from '@/domain/dates';
import { CYCLE_WORDS } from '@/domain/money';
import { chargeOfSub, confirmedSavings, isConfirmed, isPending, isPricedSub, pendingSavings, savingsSteps, snapYearly, type Sub } from '@/domain/subs';
import { useCancelHelp } from '@/ditch/CancelHelp';
import { StepChart } from '@/ditched/StepChart';
import { SubLogo } from '@/home/SubRow';
import { useApp, useAppMoney } from '@/state/app';
import { ask } from '@/ui/alert';
import { Card, ChevronRight, DitchedTag, EDGE, F, ProLockup, RowDivider, SectionHeader, Stamp, Txt, brand, haptic, useInsets, usePalette } from '@/ui/sunflower';

export default function DitchedTab() {
  const p = usePalette();
  const insets = useInsets();
  const app = useApp();
  const money = useAppMoney();
  const help = useCancelHelp();
  const home = app.settings.currency;

  const pending = app.subs.filter(isPending);
  const confirmed = useMemo(
    () => app.subs.filter(isConfirmed).sort((a, b) => ((a.confirmedOn ?? '') < (b.confirmedOn ?? '') ? 1 : -1)),
    [app.subs],
  );
  const saving = confirmedSavings(app.subs, home);
  const waiting = pendingSavings(app.subs, home);
  const main = saving[0];
  const steps = main ? savingsSteps(app.subs, main.currency) : [];
  const since = confirmed.length ? confirmed[confirmed.length - 1].confirmedOn : null;
  const sinceWord = since ? sinceLabel(since, app.today) : '';

  const reactivate = (s: Sub) =>
    ask(`Still paying for ${s.name}?`, 'It goes back on your list and out of your savings.', [
      { text: 'Keep it cancelled', style: 'cancel' },
      { text: 'Put it back', onPress: () => app.reactivate(s.id) },
    ]);

  const nothing = pending.length === 0 && confirmed.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: EDGE, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Txt v="displayM" accessibilityRole="header" style={{ fontSize: 32, lineHeight: 40 }}>
          Ditched
        </Txt>

        {nothing ? (
          <View style={{ alignItems: 'center', marginTop: 56 }}>
            <View style={{ opacity: 0.25 }}>
              <Stamp date={app.today} width={240} bg={p.bg} />
            </View>
            <Txt v="heading" center style={{ marginTop: 28 }}>
              Nothing ditched yet.
            </Txt>
            <Txt v="leadS" tone="fg2" center style={{ marginTop: 8, maxWidth: 300 }}>
              Hold a subscription on Home to ditch it. What you stop paying adds up here.
            </Txt>
          </View>
        ) : (
          <>
            <View
              accessible
              accessibilityLabel={
                main
                  ? `You’re saving ${money(main.yearlyMinor, main.currency, { whole: true })} a year, from ${main.count} ${main.count === 1 ? 'sub' : 'subs'} you cancelled${sinceWord ? ` since ${sinceWord}` : ''}, ${money(main.monthlyMinor, main.currency)} a month.`
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
                    You’re saving
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
                    From {main.count} {main.count === 1 ? 'sub' : 'subs'} you cancelled{sinceWord ? ` since ${sinceWord}` : ''} · {money(main.monthlyMinor, main.currency)} a month
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
                    {waiting[0] ? `Cancel what you ditched and you’ll be saving ${money(waiting[0].yearlyMinor, waiting[0].currency, { whole: true })} a year.` : 'Cancel what you ditched and it adds up here.'}
                  </Txt>
                </>
              )}
            </View>

            {pending.length ? (
              <>
                <SectionHeader
                  title="Waiting for you to cancel"
                  right={waiting[0] ? `+${money(waiting[0].yearlyMinor, waiting[0].currency)} a year` : undefined}
                  style={{ marginTop: 24, marginBottom: 8 }}
                />
                <Card>
                  {pending.map((s, i) => {
                    const charge = s.cancelBy && s.cancelBy >= app.today ? s.cancelBy : chargeOfSub(s, app.today);
                    const price = isPricedSub(s) ? ` · ${money(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]}` : '';
                    return (
                      <View key={s.id}>
                        {i ? <RowDivider inset={16} /> : null}
                        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14 }}>
                          <SubLogo sub={s} />
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              {s.kind === 'ditch_pro_trial' ? (
                                <ProLockup size={16} suffix="trial" color={p.cardFg} />
                              ) : (
                                <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17, flexShrink: 1 }} numberOfLines={1}>
                                  {s.name}
                                </Txt>
                              )}
                              <DitchedTag />
                            </View>
                            <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 2 }}>
                              Cancel by {weekdayDate(charge)}
                              {price}
                            </Txt>
                            <View style={{ flexDirection: 'row', gap: 6, rowGap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                              <Pill
                                label="I cancelled it"
                                filled
                                onPress={async () => {
                                  await app.confirmCancelled(s.id);
                                  haptic.success();
                                }}
                              />
                              <Pill label="How to cancel" chevron onPress={() => help.open(s)} />
                            </View>
                          </View>
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
                          accessibilityHint="Still paying? Put it back on your list."
                          onPress={() => reactivate(s)}
                          style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 8, opacity: pressed ? 0.7 : 1 })}
                        >
                          <SubLogo sub={s} />
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }} numberOfLines={1}>
                              {s.name}
                            </Txt>
                            <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 1 }}>
                              Cancelled {s.confirmedOn ? weekdayDate(s.confirmedOn) : ''}
                            </Txt>
                          </View>
                          {y ? (
                            <View style={{ alignItems: 'flex-end' }}>
                              <Txt v="moneyM" num color={p.cardFg} style={{ fontSize: 17 }}>
                                {money(y.amountMinor, y.currency)}
                              </Txt>
                              <Txt v="sub" tone="mute">
                                a year
                              </Txt>
                            </View>
                          ) : null}
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
              Ditch can’t see your bank, so this only counts the ones you told us you cancelled.
            </Txt>
          </>
        )}
      </ScrollView>
      {help.sheet}
    </View>
  );
}

function Pill({ label, onPress, filled, chevron }: { label: string; onPress: () => void; filled?: boolean; chevron?: boolean }) {
  const p = usePalette();
  const bg = filled ? (p.dark ? brand.sunflower : brand.ink) : 'transparent';
  const fg = filled ? (p.dark ? brand.ink : brand.white) : p.cardFg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 5, bottom: 5 }}
      style={({ pressed }) => ({
        minHeight: 36,
        borderRadius: 18,
        paddingHorizontal: 11,
        flexDirection: 'row',
        alignItems: 'center',
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
