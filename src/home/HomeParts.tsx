// Home's top: the yellow total card, the reminders-off banner, the guesses
// nudge, and the empty state with the duck and quick add.

import { Linking, Pressable, View } from 'react-native';

import { POPULAR_ORDER, SERVICE_BY_ID, availableIn } from '@/catalog/services';
import type { SpendTotal } from '@/domain/money';
import type { NotifStatus } from '@/services/notifications';
import { approxLine } from '@/domain/copy';
import { useCombinedTotal } from '@/services/fx';
import { useApp, useAppMoney } from '@/state/app';
import { Bang, Bell, BellOff, Button, Card, ChevronRight, Duck, F, LogoTile, Plus, Search, Txt, brand, usePalette } from '@/ui/sunflower';

export function TotalCard({ totals, on, of, all, blocked }: { totals: SpendTotal[]; on: number; of: number; all: boolean; blocked: boolean }) {
  const p = usePalette();
  const money = useAppMoney();
  const [first, ...rest] = totals;
  const fg = p.dark ? p.fg : brand.ink;
  // 2+ currencies: one rough line in their own currency. Never replaces the real totals.
  const combined = useCombinedTotal(totals, useApp().settings.currency);
  const approx = combined ? approxLine(money(combined.monthlyMinor, combined.currency, { whole: true }), 'a month', combined.date) : null;
  const reminders = blocked ? 'Reminders off' : all && of > 0 ? `all ${of}` : `${on} of ${of}`;
  const a11y = first
    ? `${money(first.monthlyMinor, first.currency)} a month, ${money(first.yearlyMinor, first.currency, { whole: true })} a year. ${rest.map((t) => `Plus ${money(t.monthlyMinor, t.currency)} a month.`).join(' ')}${approx ? ` ${approx.spoken}` : ''} ${blocked ? 'Reminders are off.' : `Reminders on ${reminders}.`}`
    : 'No prices yet.';
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
          <Txt v="displayM" num color={p.dark ? brand.sunflower : brand.ink} style={{ fontSize: 42, lineHeight: 44, letterSpacing: -1.6 }}>
            {money(first.monthlyMinor, first.currency)}
          </Txt>
          <Txt v="lead" color={fg} style={{ fontFamily: F.semi, fontSize: 17 }}>
            a month
          </Txt>
        </View>
      ) : (
        <Txt v="heading" color={fg}>
          Add prices to see your total
        </Txt>
      )}
      {rest.map((t) => (
        <Txt key={t.currency} v="label" num color={fg} style={{ marginTop: 2 }}>
          + {money(t.monthlyMinor, t.currency)} a month · {money(t.yearlyMinor, t.currency, { whole: true })} a year
        </Txt>
      ))}
      {approx ? (
        <Txt v="sub" num color={fg} style={{ marginTop: 4, opacity: 0.72 }}>
          {approx.text}
        </Txt>
      ) : null}
      <View style={{ height: 1, backgroundColor: p.dark ? p.rule : 'rgba(22,20,15,0.18)', marginTop: 8, marginBottom: 9 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        {first ? (
          <Txt v="body" num color={fg} style={{ fontSize: 15.5 }}>
            <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: 15.5 }}>
              {money(first.yearlyMinor, first.currency, { whole: true })}
            </Txt>{' '}
            a year ·
          </Txt>
        ) : null}
        {blocked ? <BellOff color={fg} size={16} /> : <Bell color={p.dark ? brand.sunflower : brand.ink} fill={p.dark ? brand.sunflower : brand.ink} size={15} />}
        <Txt v="body" color={fg} style={{ fontSize: 15.5, fontFamily: blocked ? F.bold : F.regular }}>
          {blocked ? 'Reminders off' : 'Reminders on '}
          {blocked ? null : (
            <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: 15.5 }}>
              {reminders}
            </Txt>
          )}
        </Txt>
      </View>
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
        style={({ pressed }) => ({ minHeight: 44, borderRadius: 22, paddingHorizontal: 16, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}
      >
        <Txt v="label" color={brand.ink} style={{ fontFamily: F.semi, fontSize: 16 }}>
          Turn on
        </Txt>
      </Pressable>
    </View>
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

/** "4 have no date yet, so no reminders. Add dates ›" (design/v13-dates screen 3). */
export function NoDateRow({ count, onPress }: { count: number; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${count} ${count === 1 ? 'has' : 'have'} no date yet, so no reminders. Add ${count === 1 ? 'it' : 'dates'}.`} onPress={onPress}>
      {({ pressed }) => (
        <Card style={{ minHeight: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, opacity: pressed ? 0.75 : 1 }}>
          <Txt v="body" color={p.cardFg} style={{ flex: 1, fontSize: 15 }}>
            <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
              {`${count} ${count === 1 ? 'has' : 'have'} no date yet,`}
            </Txt>
            {' so no reminders.'}
          </Txt>
          <Txt v="label" color={p.cardFg} style={{ fontSize: 15 }}>
            {count === 1 ? 'Add date' : 'Add dates'}
          </Txt>
          <ChevronRight color={p.cardFg} size={16} />
        </Card>
      )}
    </Pressable>
  );
}

const QUICK = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'max', 'apple-music', 'hulu'];
const SHORT_NAME: Record<string, string> = { 'chatgpt-plus': 'ChatGPT', max: 'Max' };

/** 11 · Nothing on the list yet. */
export function EmptyHome({ country, onAdd }: { country: string | null; onAdd: (catalogId?: string) => void }) {
  const p = usePalette();
  const ids = [...QUICK, ...POPULAR_ORDER].filter((id, i, a) => a.indexOf(id) === i && SERVICE_BY_ID[id] && availableIn(SERVICE_BY_ID[id], country)).slice(0, 8);
  return (
    <View>
      <View style={{ marginTop: 92 }}>
        <Duck width={128} left={110} sink={2} />
        <View style={{ borderRadius: 26, backgroundColor: p.dark ? p.card : brand.sunflower, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22, alignItems: 'center', borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
          <Txt v="displayM" center accessibilityRole="header" color={p.dark ? p.fg : brand.ink} style={{ fontSize: 33, lineHeight: 35 }}>
            Nothing to watch yet.
          </Txt>
          <Txt v="leadS" center color={p.dark ? p.fg2 : '#4B4220'} style={{ marginTop: 10 }}>
            Add what you pay for. Ditch reminds you before each charge.
          </Txt>
          <Button
            label="Add a subscription"
            onPress={() => onAdd()}
            style={{ marginTop: 18, alignSelf: 'stretch' }}
            left={<Plus color={p.dark ? brand.ink : brand.sunflower} size={20} />}
          />
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
              <View style={{ position: 'absolute', right: -9, bottom: -7, width: 24, height: 24, borderRadius: 12, backgroundColor: brand.ink, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: p.bg }}>
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
