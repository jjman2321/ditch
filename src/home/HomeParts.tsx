// Home's top: the yellow total card, the reminders-off banner, the guesses
// nudge, and the empty state with the duck and quick add.

import { overlapWhat, type Overlap } from '@/domain/overlaps';
import type { PriceChange } from '@/domain/priceWatch';
import { useState } from 'react';
import { Linking, Pressable, View, useWindowDimensions } from 'react-native';

import { POPULAR_ORDER, SERVICE_BY_ID, availableIn } from '@/catalog/services';
import type { SpendTotal } from '@/domain/money';
import type { NotifStatus } from '@/services/notifications';
import { approxLine } from '@/domain/copy';
import { shortDate, weekdayDate } from '@/domain/dates';
import type { BeforePayday } from '@/domain/subs';
import { useCombinedTotal } from '@/services/fx';
import { useApp, useAppMoney } from '@/state/app';
import { Bang, Bell, BellOff, Button, Card, CardIcon, ChevronRight, Close, Duck, F, LogoTile, Plus, Search, Txt, brand, usePalette } from '@/ui/sunflower';

/** "3,000", not "3000": counts read like the money next to them. */
const count = (n: number) => n.toLocaleString('en-US');

export function TotalCard({
  totals,
  on,
  of,
  listed,
  all,
  blocked,
  trials,
}: {
  totals: SpendTotal[];
  on: number;
  /** Subs that can be reminded (they have a date). */
  of: number;
  /** Everything on the list, dated or not. */
  listed: number;
  all: boolean;
  blocked: boolean;
  /** Free trials still running: "+ 1 trial, then $13.99 a month" (SPEC §3.2). */
  trials?: { count: number; monthly: { currency: string; monthlyMinor: number }[] };
}) {
  const p = usePalette();
  const money = useAppMoney();
  const [first, ...rest] = totals;
  const fg = p.dark ? p.fg : brand.ink;
  // 320pt wide (SE with Display Zoom): a smaller total so "a month" and the reminder line stay on one line each.
  const tiny = useWindowDimensions().width < 350;
  const hero = first ? money(first.monthlyMinor, first.currency) : '';
  // Big totals step down so "a month" stays beside them ("$1,234.56", "$130,385.78"); the fit below catches the rest.
  const heroSize = hero.length >= 12 ? 28 : hero.length >= 11 ? 30 : hero.length >= 10 ? 32 : hero.length >= 9 ? 34 : 42;
  const heroStyle = tiny
    ? { fontSize: Math.min(32, heroSize - 6), lineHeight: Math.min(36, heroSize - 2), letterSpacing: -1.2 }
    : { fontSize: heroSize, lineHeight: heroSize + 2, letterSpacing: heroSize >= 42 ? -1.6 : -1.2 };
  // 2+ currencies: one rough line in their own currency. Never replaces the real totals.
  const combined = useCombinedTotal(totals, useApp().settings.currency);
  const approx = combined ? approxLine(money(combined.monthlyMinor, combined.currency, { whole: true }), 'a month', combined.date) : null;
  const reminders = blocked ? 'Reminders off' : all && of > 0 ? `all ${count(of)}` : `${count(on)} of ${count(of)}`;
  // One currency: "+ 1 trial, then $13.99 a month". Mixed or unpriced: just the count.
  const trialLine = trials?.count
    ? `+ ${trials.count} ${trials.count === 1 ? 'trial' : 'trials'}${trials.monthly.length === 1 ? `, then ${money(trials.monthly[0].monthlyMinor, trials.monthly[0].currency)} a month` : ''}`
    : null;
  const a11y = first
    ? `${money(first.monthlyMinor, first.currency)} a month, ${money(first.yearlyMinor, first.currency, { whole: true })} a year. ${rest.map((t) => `And ${money(t.monthlyMinor, t.currency)} a month, kept separate.`).join(' ')}${approx ? ` ${approx.spoken}` : ''} ${trialLine ? ` ${trialLine}.` : ''} ${blocked ? 'Reminders are off.' : of > 0 ? `Reminders on ${reminders}.` : ''}`
    : `${trialLine ? `Nothing charging yet. ${trialLine}.` : 'No prices yet.'}`;
  const fs = tiny ? 14 : 15.5;
  const reminderRow = rest.length > 0;
  // "2 of 6 reminded" / "All 6 reminded": the count first, short enough for every phone. VoiceOver keeps "Reminders on 2 of 6".
  // Everything ditched (or nothing dated yet): no "Reminders on 0 of 0".
  // The bell and its words are one unit, so they wrap to the next line together (audit, Nov 20).
  const remindersBit =
    of === 0 ? null : (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {blocked ? <BellOff color={fg} size={16} /> : <Bell color={p.dark ? brand.sunflower : brand.ink} fill={p.dark ? brand.sunflower : brand.ink} size={15} />}
        <Txt v="body" num color={fg} style={{ fontSize: fs, fontFamily: blocked ? F.bold : F.regular }}>
          {blocked ? 'Reminders off' : null}
          {blocked ? null : (
            <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: fs }}>
              {all && of > 0 ? `All ${count(of)}` : `${count(on)} of ${count(of)}`}
            </Txt>
          )}
          {blocked ? null : ' reminded'}
        </Txt>
      </View>
    );
  return (
    <View
      accessible
      accessibilityLabel={a11y}
      style={[
        { borderRadius: 22, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12, backgroundColor: p.dark ? p.card : brand.sunflower },
        p.dark ? { borderWidth: 1, borderColor: p.cardBorder } : null,
      ]}
    >
      {first ? (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 8 }}>
          <Txt v="displayM" num numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} color={p.dark ? brand.sunflower : brand.ink} style={[heroStyle, { flexShrink: 1 }]}>
            {hero}
          </Txt>
          <Txt v="lead" color={fg} style={{ fontFamily: F.semi, fontSize: 17 }}>
            a month
          </Txt>
        </View>
      ) : (
        <Txt v="heading" color={fg}>
          {trialLine ? 'Nothing charging yet' : listed === 0 ? 'Nothing active right now' : 'Add prices to see your total'}
        </Txt>
      )}
      {trialLine ? (
        <Txt v="label" num color={fg} style={{ marginTop: 2 }}>
          {trialLine}
        </Txt>
      ) : null}
      <View style={{ height: 1, backgroundColor: p.dark ? p.rule : 'rgba(22,20,15,0.18)', marginTop: 8, marginBottom: 9 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        {first ? (
          <Txt v="body" num color={fg} style={{ fontSize: fs }}>
            <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: fs }}>
              {money(first.yearlyMinor, first.currency, { whole: true })}
            </Txt>
            {reminderRow || !remindersBit ? ' a year' : ' a year ·'}
          </Txt>
        ) : null}
        {reminderRow ? null : remindersBit}
      </View>
      {/* Other currencies after the first one's year, each on its own line with no "+": they are never added together.
          Same weights as the line above: the amounts bold, the words regular. */}
      {rest.map((t) => (
        <Txt key={t.currency} v="body" num color={fg} style={{ marginTop: 4, fontSize: fs }}>
          <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: fs }}>
            {money(t.monthlyMinor, t.currency)}
          </Txt>
          {' a month · '}
          <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: fs }}>
            {money(t.yearlyMinor, t.currency, { whole: true })}
          </Txt>
          {' a year'}
        </Txt>
      ))}
      {approx ? (
        <Txt v="sub" num color={fg} style={{ marginTop: 4, opacity: 0.72 }}>
          {approx.text}
        </Txt>
      ) : null}
      {/* 2+ currencies: the reminder count gets its own line, so it doesn't read as part of the first currency. */}
      {reminderRow && remindersBit ? <View style={{ flexDirection: 'row', marginTop: 6 }}>{remindersBit}</View> : null}
    </View>
  );
}

/** "Reminders are off. Nothing can reach you. [Turn on]" (9c). */
export function OffBanner({ status, onTurnOn }: { status: NotifStatus; onTurnOn: () => void }) {
  const p = usePalette();
  const asked = status === 'denied';
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, paddingVertical: 12, paddingLeft: 14, paddingRight: 10, backgroundColor: p.dark ? '#25231E' : brand.ink },
        p.dark ? { borderWidth: 2, borderColor: brand.bill } : null,
      ]}
    >
      <Bang color={brand.ink} bg={brand.bill} />
      <View style={{ flex: 1 }} accessible accessibilityRole="text">
        <Txt v="label" color="#F6F0E3" style={{ fontFamily: F.bold, fontSize: 16 }}>
          {asked ? 'Reminders are off.' : 'Reminders aren’t on yet.'}
        </Txt>
        <Txt v="body" color="#CFC7B6" style={{ fontSize: 14.5 }}>
          {asked ? 'Nothing can reach you.' : 'Ditch needs your OK to send them.'}
        </Txt>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Turn on reminders"
        accessibilityHint={asked ? 'Opens iPhone Settings' : 'Shows the iPhone permission prompt'}
        onPress={onTurnOn}
        style={({ pressed }) => ({
          minHeight: 44,
          borderRadius: 22,
          paddingHorizontal: 16,
          backgroundColor: brand.sunflower,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Txt v="label" color={brand.ink} style={{ fontFamily: F.semi, fontSize: 16 }}>
          Turn on
        </Txt>
      </Pressable>
    </View>
  );
}

/**
 * Notifications allowed but banners (or sounds) off: reminders land in Notification Center without a sound,
 * which reads as "Ditch never reminded me". One line, with a way to fix it.
 */
export function QuietRow({ onFix }: { onFix: () => void }) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Banners are off, so reminders arrive silently. Fix" accessibilityHint="Opens iPhone Settings" onPress={onFix}>
      {({ pressed }) => (
        <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.75 : 1 }}>
          <BellOff color={p.cardFg} size={17} bg={p.card} />
          <Txt v="body" color={p.cardFg} style={{ flex: 1, minWidth: 0, fontSize: 15 }}>
            <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
              Banners are off,
            </Txt>
            {' so reminders arrive silently.'}
          </Txt>
          <Txt v="label" color={p.cardFg} style={{ fontSize: 15 }}>
            Fix
          </Txt>
          <ChevronRight color={p.cardFg} size={16} />
        </Card>
      )}
    </Pressable>
  );
}

export function openPhoneSettings() {
  Linking.openSettings().catch(() => {});
}

/**
 * "🔔 Next reminder · Tomorrow, 9 AM · Netflix ›" under the total, so it's
 * plain that reminders are scheduled (reviews: users couldn't tell a broken
 * reminder from a setting). Tap: the Calendar, which shows every one.
 */
export function NextReminderRow({ when, name, onPress }: { when: string; name: string; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Next reminder: ${name}, ${when}`} accessibilityHint="Opens the calendar" onPress={onPress}>
      {({ pressed }) => (
        <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.75 : 1 }}>
          <Bell color={p.cardFg} fill={p.dark ? brand.sunflower : brand.ink} size={17} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="body" color={p.cardFg} numberOfLines={1} style={{ fontSize: 15 }}>
              <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
                Next reminder:
              </Txt>
              {` ${name}`}
            </Txt>
            <Txt v="sub" tone="mute" num numberOfLines={1}>
              {when}
            </Txt>
          </View>
          <ChevronRight color={p.cardFg} size={16} />
        </Card>
      )}
    </Pressable>
  );
}

/**
 * Before payday (DECISIONS #60, free): what still leaves the account before
 * the next payday. Currencies stay apart (CLAUDE.md rule 1).
 */
export function PaydayRow({ before, money, onPress }: { before: BeforePayday; money: (minor: number, currency: string) => string; onPress: () => void }) {
  const p = usePalette();
  const amounts = before.totals.map((t) => money(t.amountMinor, t.currency)).join(' · ');
  // "$17.99 due before payday" / "1 charge · payday Wed, Nov 25": the money first, then what it is.
  // Small phones: "Nov 25" so the date (the point of the line) never gets cut.
  const day = useWindowDimensions().width < 380 ? shortDate(before.payday) : weekdayDate(before.payday);
  const line = before.count ? `${before.count} ${before.count === 1 ? 'charge' : 'charges'} · payday ${day}` : `Payday is ${day}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${before.count ? `${amounts} due before payday` : 'Nothing due before payday'}. ${line.replace(' · ', ', ')}`}
      accessibilityHint="Opens the calendar"
      onPress={onPress}
    >
      {({ pressed }) => (
        <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.75 : 1 }}>
          {/* Same 17pt icon slot as Next reminder, so the stacked cards' text starts at one line. */}
          <CardIcon color={p.cardFg} size={17} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="body" color={p.cardFg} num numberOfLines={1} style={{ fontSize: 15 }}>
              <Txt v="body" color={p.cardFg} num style={{ fontFamily: F.bold, fontSize: 15 }}>
                {before.count ? amounts : 'Nothing'}
              </Txt>
              {' due before payday'}
            </Txt>
            <Txt v="sub" tone="mute" num numberOfLines={1}>
              {line}
            </Txt>
          </View>
          <ChevronRight color={p.cardFg} size={16} />
        </Card>
      )}
    </Pressable>
  );
}

/** "Missing any? See where subscriptions hide ›", until they tap Done in the sheet. */
export function ForgottenRow({ onPress }: { onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Missing any? See where subscriptions hide" onPress={onPress}>
      {({ pressed }) => (
        <Card style={{ minHeight: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, opacity: pressed ? 0.75 : 1 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
            <Search color={p.fg} size={20} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="label" color={p.cardFg}>
              Missing any?
            </Txt>
            <Txt v="sub" tone="mute">
              See where subscriptions hide
            </Txt>
          </View>
          <ChevronRight color={p.mute} />
        </Card>
      )}
    </Pressable>
  );
}

/**
 * "4 have no date yet" / "No reminders yet"   Add dates ›  (design/v13-dates screen 3).
 * Bold line plus a grey line, like Next reminder and Payday above it.
 */
export function NoDateRow({ count, onPress }: { count: number; onPress: () => void }) {
  const p = usePalette();
  const one = count === 1;
  const countLabel = count.toLocaleString('en-US');
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${countLabel} ${one ? 'has' : 'have'} no date yet, so no reminders. Add ${one ? 'it' : 'dates'}.`} onPress={onPress}>
      {({ pressed }) => (
        <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.75 : 1 }}>
          <BellOff color={p.mute} size={17} bg={p.card} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="body" color={p.cardFg} numberOfLines={1} style={{ fontFamily: F.bold, fontSize: 15 }}>
              {`${countLabel} ${one ? 'has' : 'have'} no date yet`}
            </Txt>
            <Txt v="sub" tone="mute" numberOfLines={1}>
              {one ? 'No reminder yet' : 'No reminders yet'}
            </Txt>
          </View>
          <Txt v="label" color={p.cardFg} style={{ fontSize: 15 }}>
            {one ? 'Add date' : 'Add dates'}
          </Txt>
          <ChevronRight color={p.cardFg} size={16} />
        </Card>
      )}
    </Pressable>
  );
}

/**
 * Free plan, 3 reminders in use, and a dated subscription has none (owner, Nov 20): the moment Pro is
 * worth the most, so say exactly what's unprotected and offer Pro once. "Copilot Pro has no reminder" /
 * "Pro reminds you about every one". Both lines wrap instead of being cut on small phones (audit, Nov 20). The × hides it until another one is left without a reminder.
 */
export function NoReminderRow({ names, total, onPress, onDismiss }: { names: string[]; total: number; onPress: () => void; onDismiss: () => void }) {
  const p = usePalette();
  const one = names.length === 1;
  const title = one ? `${names[0]} has no reminder` : `${count(names.length)} have no reminder`;
  return (
    <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingLeft: 14 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. Only 3 reminders are free. Pro reminds you about every one. Try Pro.`}
        onPress={onPress}
        style={({ pressed }) => ({ flex: 1, minWidth: 0, minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, opacity: pressed ? 0.75 : 1 })}
      >
        <BellOff color={p.mute} size={17} bg={p.card} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
            {title}
          </Txt>
          <Txt v="sub" tone="mute">
            Pro reminds you about every one
          </Txt>
        </View>
        <View style={{ paddingHorizontal: 10, height: 28, borderRadius: 14, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center' }}>
          <Txt v="label" color={brand.ink} style={{ fontFamily: F.bold, fontSize: 13.5 }} maxFontSizeMultiplier={1.3}>
            Try Pro
          </Txt>
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Hide" hitSlop={8} onPress={onDismiss} style={{ width: 44, height: 56, alignItems: 'center', justifyContent: 'center' }}>
        <Close color={p.mute} size={12} />
      </Pressable>
    </Card>
  );
}

const QUICK = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'max', 'apple-music', 'hulu'];
const SHORT_NAME: Record<string, string> = { 'chatgpt-plus': 'ChatGPT', max: 'HBO Max', 'amazon-prime': 'Prime', 'disney-plus': 'Disney+', 'apple-music': 'Apple Music' };

/**
 * "Missing any?" under a short list (owner, Nov 20 video: "the other subs, just a small one, so it's not
 * so plain"). Not a card: a label and one row of popular services they don't have yet, each one tap to add.
 * "More" opens the full add sheet. Replaces DECISIONS #71's "no Missing any? on Home" for short lists only.
 */
export function MissingStrip({ country, have, onAdd }: { country: string | null; have: Set<string>; onAdd: (catalogId?: string) => void }) {
  const p = usePalette();
  const ids = [...QUICK, ...POPULAR_ORDER].filter((id, i, a) => a.indexOf(id) === i && !have.has(id) && SERVICE_BY_ID[id] && availableIn(SERVICE_BY_ID[id], country)).slice(0, 4);
  if (!ids.length) return null;
  const tile = { width: '20%', alignItems: 'center' } as const;
  return (
    <View>
      <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginBottom: 12, marginHorizontal: 4 }}>
        Missing any?
      </Txt>
      <View style={{ flexDirection: 'row' }}>
        {ids.map((id) => (
          <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Add ${SERVICE_BY_ID[id].name}`} onPress={() => onAdd(id)} style={({ pressed }) => ({ ...tile, opacity: pressed ? 0.7 : 1 })}>
            <View>
              <LogoTile id={id} size={44} />
              <View
                style={{
                  position: 'absolute',
                  right: -7,
                  bottom: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: p.dark ? brand.sunflower : brand.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: p.bg,
                }}
              >
                <Plus color={p.dark ? brand.ink : brand.sunflower} size={11} />
              </View>
            </View>
            <Txt v="sub" center numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={{ marginTop: 8, fontSize: 13, width: 72 }}>
              {SHORT_NAME[id] ?? SERVICE_BY_ID[id].name}
            </Txt>
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" accessibilityLabel="See all subscriptions to add" onPress={() => onAdd()} style={({ pressed }) => ({ ...tile, opacity: pressed ? 0.7 : 1 })}>
          <View style={{ width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: p.chipBorder, alignItems: 'center', justifyContent: 'center' }}>
            <Plus color={p.fg} size={18} />
          </View>
          <Txt v="sub" center numberOfLines={1} style={{ marginTop: 8, fontSize: 13, width: 72 }}>
            More
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

/** 11 · Nothing on the list yet. */
export function EmptyHome({ country, onAdd }: { country: string | null; onAdd: (catalogId?: string) => void }) {
  const p = usePalette();
  const ids = [...QUICK, ...POPULAR_ORDER].filter((id, i, a) => a.indexOf(id) === i && SERVICE_BY_ID[id] && availableIn(SERVICE_BY_ID[id], country)).slice(0, 8);
  return (
    <View>
      <View style={{ marginTop: 92 }}>
        <Duck width={128} left={110} sink={2} />
        <View
          style={{
            borderRadius: 26,
            backgroundColor: p.dark ? p.card : brand.sunflower,
            paddingHorizontal: 22,
            paddingTop: 24,
            paddingBottom: 22,
            alignItems: 'center',
            borderWidth: p.dark ? 1 : 0,
            borderColor: p.cardBorder,
          }}
        >
          <Txt v="displayM" center accessibilityRole="header" color={p.dark ? p.fg : brand.ink} style={{ fontSize: 33, lineHeight: 35 }}>
            {'Nothing to watch\u00A0yet.'}
          </Txt>
          <Txt v="leadS" center color={p.dark ? p.fg2 : '#4B4220'} style={{ marginTop: 10 }}>
            Add what you pay for. Ditch reminds you before it charges.
          </Txt>
          <Button label="Add a subscription" onPress={() => onAdd()} style={{ marginTop: 18, alignSelf: 'stretch' }} left={<Plus color={p.dark ? brand.ink : brand.sunflower} size={20} />} />
        </View>
      </View>
      <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 28, marginBottom: 12, marginHorizontal: 4 }}>
        Quick add
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 }}>
        {ids.map((id) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={`Add ${SERVICE_BY_ID[id].name}`}
            onPress={() => onAdd(id)}
            style={({ pressed }) => ({ width: '25%', alignItems: 'center', opacity: pressed ? 0.7 : 1 })}
          >
            <View>
              <LogoTile id={id} size={52} />
              <View
                style={{
                  position: 'absolute',
                  right: -9,
                  bottom: -7,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: brand.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: p.bg,
                }}
              >
                <Plus color={brand.sunflower} size={13} />
              </View>
            </View>
            <Txt v="body" center numberOfLines={1} style={{ marginTop: 8, fontSize: 14, width: 104 }}>
              {SHORT_NAME[id] ?? SERVICE_BY_ID[id].name}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/**
 * "You pay for 2 AI chat apps · $219.99/mo   Need both? ›" / "You pay for Netflix twice · $35.98/mo   Need both? ›"
 * (DECISIONS #60, owner Nov 19). Free. One compact line, a nudge toward the ditch moment, never a scold:
 * it states what they pay together and lets them decide.
 * It stays on one line: narrower screens (or bigger text) drop "You pay for", then the price ("2 AI chat apps   Need both? ›").
 * Tapping it opens the cheaper one (its sheet has the Ditch button; they can still pick the other).
 * The × hides it until the set changes.
 */
export function OverlapCard({ overlap, money, onDismiss, onPick }: { overlap: Overlap; money: (minor: number, currency: string) => string; onDismiss: () => void; onPick: () => void }) {
  const p = usePalette();
  const names = overlap.subs.map((s) => s.name);
  const listed = names.length > 2 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names.join(' and ');
  // Mixed currencies stay apart (rule 1): "£11.99/mo · US$10.99/mo", never with a "+".
  const together = overlap.totals.map((t) => `${money(Math.round(t.monthlyMinor), t.currency)}/mo`).join(' · ');
  const spokenTogether = overlap.totals.map((t) => money(Math.round(t.monthlyMinor), t.currency)).join(' and ');
  const spoken = `${overlapWhat(overlap)}: ${listed}.${spokenTogether ? ` ${spokenTogether} a month together.` : ''}`;
  // Longest first; the first one that fits beside "Need both? ›" is shown.
  const options: { what: string; price: string }[] = [
    { what: overlapWhat(overlap), price: together },
    { what: overlapWhat(overlap, { short: true }), price: together },
    { what: overlapWhat(overlap, { short: true }), price: '' },
  ];
  const [widths, setWidths] = useState<(number | undefined)[]>([]);
  const [room, setRoom] = useState(0);
  const measured = room > 0 && options.every((_, i) => widths[i] !== undefined);
  const pick = measured ? options.findIndex((_, i) => widths[i]! <= room) : 1;
  const shown = options[pick === -1 ? options.length - 1 : pick];
  const fs = useWindowDimensions().width < 380 ? 14 : 14.5;
  const line = (o: { what: string; price: string }) => (
    <>
      <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: fs }}>
        {o.what}
      </Txt>
      {o.price ? ` · ${o.price}` : ''}
    </>
  );
  return (
    <Card style={{ minHeight: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingLeft: 14 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${spoken} Need both?`} accessibilityHint="Opens the cheaper one" onPress={onPick} style={{ flex: 1, minWidth: 0 }}>
        {({ pressed }) => (
          <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, opacity: pressed ? 0.7 : 1 }}>
            {/* Off-screen copies of each version, to see which one fits. */}
            <View pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ position: 'absolute', opacity: 0, width: 2000, alignItems: 'flex-start' }}>
              {options.map((o, i) => (
                <Txt
                  key={i}
                  v="body"
                  num
                  style={{ fontSize: fs }}
                  onLayout={(e) => {
                    const w = Math.ceil(e.nativeEvent.layout.width);
                    setWidths((prev) => (prev[i] === w ? prev : Object.assign([...prev], { [i]: w })));
                  }}
                >
                  {line(o)}
                </Txt>
              ))}
            </View>
            {/* Two overlapping tiles: the same 17pt icon slot as the other Home cards, so every card's text starts at one x. */}
            <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ width: 17, height: 17, marginRight: 6 }}>
              <View style={{ position: 'absolute', left: 0, top: 0, width: 11, height: 11, borderRadius: 3, borderWidth: 1.6, borderColor: p.cardFg }} />
              <View style={{ position: 'absolute', left: 5, top: 5, width: 11, height: 11, borderRadius: 3, borderWidth: 1.6, borderColor: p.cardFg, backgroundColor: p.card }} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }} onLayout={(e) => setRoom(Math.floor(e.nativeEvent.layout.width))}>
              <Txt v="body" color={p.cardFg} num numberOfLines={pick === -1 ? undefined : 1} style={{ fontSize: fs }}>
                {line(shown)}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: fs }}>
                Need both?
              </Txt>
              <ChevronRight color={p.cardFg} size={14} />
            </View>
          </View>
        )}
      </Pressable>
      {/* 28pt wide, plus 8pt of hit slop each side: a 44pt target that leaves the line room. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hide this"
        accessibilityHint="Hides this until the list changes"
        onPress={onDismiss}
        hitSlop={8}
        style={({ pressed }) => ({ width: 28, minHeight: 44, marginRight: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
      >
        <Close color={p.mute} size={12} />
      </Pressable>
    </Card>
  );
}

/**
 * Price watch (Pro, DECISIONS #60): our checked price for their plan changed.
 * Pro sees it and can update in one tap; free sees that something changed, with a way to Pro.
 * Prices sit still (rule 8); the card only appears, it doesn't slide.
 */
export function PriceChangeCard({
  change,
  pro,
  money,
  onUpdate,
  onDismiss,
  onPro,
}: {
  change: PriceChange;
  pro: boolean;
  money: (minor: number, currency: string) => string;
  onUpdate: () => void;
  onDismiss: () => void;
  onPro: () => void;
}) {
  const p = usePalette();
  const s = change.sub;
  if (!pro) {
    // The × works like the overlap card's: hidden for this price change.
    return (
      <Card style={{ minHeight: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingLeft: 14 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={`A price on your list ${change.up ? 'went up' : 'changed'}. See it with Pro`} onPress={onPro} style={{ flex: 1, minWidth: 0 }}>
          {({ pressed }) => (
            <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, opacity: pressed ? 0.75 : 1 }}>
              <Txt v="body" color={p.cardFg} style={{ flex: 1, fontSize: 15 }}>
                <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
                  {`A price on your list ${change.up ? 'went up' : 'changed'}.`}
                </Txt>
                {' Price watch is in Pro.'}
              </Txt>
              <ChevronRight color={p.cardFg} size={16} />
            </View>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hide this"
          accessibilityHint="Hides this price change"
          onPress={onDismiss}
          hitSlop={8}
          style={({ pressed }) => ({ width: 28, minHeight: 44, marginLeft: 4, marginRight: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
        >
          <Close color={p.mute} size={12} />
        </Pressable>
      </Card>
    );
  }
  const was = money(change.was, s.currency);
  const now = money(change.now, s.currency);
  const title = `${s.name} ${change.planName.replace(/\s*\((monthly|yearly)\)$/i, '')} ${change.up ? 'went up' : 'went down'} to ${now}.`;
  const line = `You have ${was}. Checked ${shortDate(change.checked)} on ${s.name}’s own page.`;
  return (
    <Card style={{ borderRadius: 16, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }}>
      <View accessible accessibilityLabel={`${title} ${line}`}>
        <Txt v="body" color={p.cardFg} num style={{ fontFamily: F.bold, fontSize: 15 }}>
          {title}
        </Txt>
        <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 2 }}>
          {line}
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Update ${s.name} to ${now}`} onPress={onUpdate} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Txt v="label" num color={p.cardFg} style={{ fontSize: 15, fontFamily: F.bold, textDecorationLine: 'underline' }}>
            Update to {now}
          </Txt>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keep my price"
          accessibilityHint="Hides this for this price"
          onPress={onDismiss}
          hitSlop={8}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Txt v="label" color={p.cardFg} style={{ fontSize: 15, textDecorationLine: 'underline' }}>
            Keep mine
          </Txt>
        </Pressable>
      </View>
    </Card>
  );
}
