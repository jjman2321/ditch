// Home's top: the yellow total card, the reminders-off banner, the guesses
// nudge, and the empty state with the duck and quick add.

import type { Overlap } from '@/domain/overlaps';
import type { PriceChange } from '@/domain/priceWatch';
import { Linking, Pressable, View, useWindowDimensions } from 'react-native';

import { POPULAR_ORDER, SERVICE_BY_ID, availableIn } from '@/catalog/services';
import type { SpendTotal } from '@/domain/money';
import type { NotifStatus } from '@/services/notifications';
import { approxLine } from '@/domain/copy';
import { shortDate, weekdayDate } from '@/domain/dates';
import type { BeforePayday } from '@/domain/subs';
import { useCombinedTotal } from '@/services/fx';
import { useApp, useAppMoney } from '@/state/app';
import { Bang, Bell, BellOff, Button, Card, ChevronRight, Duck, F, LogoTile, Plus, Search, Txt, brand, usePalette } from '@/ui/sunflower';

export function TotalCard({
  totals,
  on,
  of,
  all,
  blocked,
  trials,
}: {
  totals: SpendTotal[];
  on: number;
  of: number;
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
  // 2+ currencies: one rough line in their own currency. Never replaces the real totals.
  const combined = useCombinedTotal(totals, useApp().settings.currency);
  const approx = combined ? approxLine(money(combined.monthlyMinor, combined.currency, { whole: true }), 'a month', combined.date) : null;
  const reminders = blocked ? 'Reminders off' : all && of > 0 ? `all ${of}` : `${on} of ${of}`;
  // One currency: "+ 1 trial, then $13.99 a month". Mixed or unpriced: just the count.
  const trialLine = trials?.count
    ? `+ ${trials.count} ${trials.count === 1 ? 'trial' : 'trials'}${trials.monthly.length === 1 ? `, then ${money(trials.monthly[0].monthlyMinor, trials.monthly[0].currency)} a month` : ''}`
    : null;
  const a11y = first
    ? `${money(first.monthlyMinor, first.currency)} a month, ${money(first.yearlyMinor, first.currency, { whole: true })} a year. ${rest.map((t) => `And ${money(t.monthlyMinor, t.currency)} a month, kept separate.`).join(' ')}${approx ? ` ${approx.spoken}` : ''} ${trialLine ? ` ${trialLine}.` : ''} ${blocked ? 'Reminders are off.' : `Reminders on ${reminders}.`}`
    : `${trialLine ? `Nothing charging yet. ${trialLine}.` : 'No prices yet.'}`;
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
          <Txt
            v="displayM"
            num
            color={p.dark ? brand.sunflower : brand.ink}
            style={tiny ? { fontSize: 32, lineHeight: 36, letterSpacing: -1.2 } : { fontSize: 42, lineHeight: 44, letterSpacing: -1.6 }}
          >
            {money(first.monthlyMinor, first.currency)}
          </Txt>
          <Txt v="lead" color={fg} style={{ fontFamily: F.semi, fontSize: 17 }}>
            a month
          </Txt>
        </View>
      ) : (
        <Txt v="heading" color={fg}>
          {trialLine ? 'Nothing charging yet' : of === 0 ? 'Nothing active right now' : 'Add prices to see your total'}
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
          <Txt v="body" num color={fg} style={{ fontSize: tiny ? 14 : 15.5 }}>
            <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: tiny ? 14 : 15.5 }}>
              {money(first.yearlyMinor, first.currency, { whole: true })}
            </Txt>{' '}
            a year ·
          </Txt>
        ) : null}
        {/* Everything ditched: no "Reminders on 0 of 0". */}
        {of === 0 ? null : blocked ? <BellOff color={fg} size={16} /> : <Bell color={p.dark ? brand.sunflower : brand.ink} fill={p.dark ? brand.sunflower : brand.ink} size={15} />}
        {of === 0 ? null : (
          <Txt v="body" color={fg} style={{ fontSize: tiny ? 14 : 15.5, fontFamily: blocked ? F.bold : F.regular }}>
            {blocked ? 'Reminders off' : tiny ? '' : 'Reminders on '}
            {blocked ? null : (
              <Txt v="body" num color={fg} style={{ fontFamily: F.bold, fontSize: tiny ? 14 : 15.5 }}>
                {reminders}
              </Txt>
            )}
          </Txt>
        )}
      </View>
      {/* Other currencies after the first one's year, each on its own line with no "+": they are never added together. */}
      {rest.map((t) => (
        <Txt key={t.currency} v="label" num color={fg} style={{ marginTop: 4 }}>
          {money(t.monthlyMinor, t.currency)} a month · {money(t.yearlyMinor, t.currency, { whole: true })} a year
        </Txt>
      ))}
      {approx ? (
        <Txt v="sub" num color={fg} style={{ marginTop: 4, opacity: 0.72 }}>
          {approx.text}
        </Txt>
      ) : null}
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
  const title = before.count ? amounts : 'nothing due';
  // Small phones: "Nov 25" so the date (the point of the line) never gets cut.
  const day = useWindowDimensions().width < 380 ? shortDate(before.payday) : weekdayDate(before.payday);
  const line = before.count ? `${before.count} ${before.count === 1 ? 'charge' : 'charges'} until payday, ${day}` : `Payday is ${day}`;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Before payday: ${title}. ${line}`} accessibilityHint="Opens the calendar" onPress={onPress}>
      {({ pressed }) => (
        <Card style={{ minHeight: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.75 : 1 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="body" color={p.cardFg} num numberOfLines={1} style={{ fontSize: 15 }}>
              <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
                Before payday:
              </Txt>
              {` ${title}`}
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
            {' so no\u00A0reminders.'}
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
const SHORT_NAME: Record<string, string> = { 'chatgpt-plus': 'ChatGPT', max: 'HBO Max', 'amazon-prime': 'Prime', 'disney-plus': 'Disney+', 'apple-music': 'Apple Music' };

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
 * "Netflix is on your list twice" / "2 music services" (DECISIONS #60). Free. A nudge toward the
 * ditch moment, never a scold: it states what they pay together and lets them decide.
 * "Pick one to ditch" opens the cheaper one (its sheet has the Ditch button; they can still pick the other).
 * "Got it" hides it until the set changes.
 */
export function OverlapCard({ overlap, money, onDismiss, onPick }: { overlap: Overlap; money: (minor: number, currency: string) => string; onDismiss: () => void; onPick: () => void }) {
  const p = usePalette();
  const names = overlap.subs.map((s) => s.name);
  const listed = names.length > 2 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names.join(' and ');
  const title =
    overlap.kind === 'twice' ? `${overlap.label} is on your list ${overlap.subs.length === 2 ? 'twice' : `${overlap.subs.length} times`}.` : `${overlap.subs.length} ${overlap.label}: ${listed}.`;
  // Mixed currencies stay apart (rule 1): "£11.99 · US$10.99 a month together", never with a "+".
  const together = overlap.totals.map((t) => money(Math.round(t.monthlyMinor), t.currency)).join(' · ');
  const line = together
    ? `${together} a month together.${overlap.kind === 'twice' ? ' Same account twice, or one to ditch?' : ''}`
    : overlap.kind === 'twice'
      ? 'Same account twice, or one to ditch?'
      : '';
  return (
    <Card style={{ borderRadius: 16, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }}>
      <View accessible accessibilityLabel={`${title} ${line}`}>
        <Txt v="body" color={p.cardFg} num style={{ fontFamily: F.bold, fontSize: 15 }}>
          {title}
        </Txt>
        {line ? (
          <Txt v="body" tone="mute" num style={{ fontSize: 14.5, marginTop: 2 }}>
            {line}
          </Txt>
        ) : null}
      </View>
      <Button label="Pick one to ditch" hint="Opens the cheaper one" onPress={onPick} height={48} style={{ marginTop: 10 }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Got it"
        accessibilityHint="Hides this until the list changes"
        onPress={onDismiss}
        hitSlop={8}
        style={{ alignSelf: 'center', minHeight: 44, justifyContent: 'center' }}
      >
        <Txt v="label" color={p.cardFg} style={{ fontSize: 15, textDecorationLine: 'underline' }}>
          Got it
        </Txt>
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
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={`A price on your list ${change.up ? 'went up' : 'changed'}. See it with Pro`} onPress={onPro}>
        {({ pressed }) => (
          <Card style={{ minHeight: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, opacity: pressed ? 0.75 : 1 }}>
            <Txt v="body" color={p.cardFg} style={{ flex: 1, fontSize: 15 }}>
              <Txt v="body" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 15 }}>
                {`A price on your list ${change.up ? 'went up' : 'changed'}.`}
              </Txt>
              {' Price watch is in Pro.'}
            </Txt>
            <ChevronRight color={p.cardFg} size={16} />
          </Card>
        )}
      </Pressable>
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
