// Home after a bank check (design/v32 screens 7–11, spec e/g): one sync card at a time under the
// total, and the "Added Max from your bank" toast with Undo. Cards only appear; nothing slides
// next to a price (CLAUDE.md rule 8). Prices change only after a tap; nothing is ditched alone.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';

import { shortDate, type DateOnly } from '@/domain/dates';
import { formatWholeMoney } from '@/domain/money';
import { planById } from '@/services/purchases';
import { useAppMoney } from '@/state/app';
import { bankOf, type BankToast } from '@/state/bank';
import { TOAST_MS, spokenMoney, type SyncCard } from '@/state/bankLogic';
import { Button, Card, Close, DuckIcon, F, LogoTile, Txt, brand, usePalette } from '@/ui/sunflower';

import { BankTile } from './Parts';

export type SyncHandlers = {
  updatePrice: (c: Extract<SyncCard, { kind: 'price' }>) => void;
  dismiss: (key: string) => void;
  markDitched: (subId: string) => void;
  reconnect: (linkId: string) => void;
  later: (linkId: string) => void;
  answer: (key: string, yes: boolean) => void;
  howToCancel: () => void;
};

function Notice({ children, amber }: { children: ReactNode; amber?: boolean }) {
  const p = usePalette();
  return <Card style={[{ borderRadius: 18, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 }, amber ? { borderWidth: 1.5, borderColor: p.amberLine } : null]}>{children}</Card>;
}

function Head({ logo, title, line, dot }: { logo: ReactNode; title: ReactNode; line?: string; dot?: boolean }) {
  const p = usePalette();
  return (
    <View accessible style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      {logo}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="bodyStrong" color={p.cardFg} num style={{ fontFamily: F.bold, fontSize: 16, lineHeight: 21 }}>
          {dot ? (
            <Txt v="bodyStrong" color={p.amber}>
              {'● '}
            </Txt>
          ) : null}
          {title}
        </Txt>
        {line ? (
          <Txt v="body" tone="mute" num style={{ marginTop: 2, fontSize: 14.5, lineHeight: 20 }}>
            {line}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

function Pair({ a, b }: { a: { label: string; onPress: () => void; hint?: string }; b: { label: string; onPress: () => void; hint?: string; text?: boolean } }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
      <Button label={a.label} hint={a.hint} onPress={a.onPress} height={44} style={{ flex: 1, paddingHorizontal: 12 }} />
      <Button kind={b.text ? 'text' : 'secondary'} label={b.label} hint={b.hint} onPress={b.onPress} height={44} style={{ flex: 1, paddingHorizontal: 12 }} />
    </View>
  );
}

const subLogo = (catalogId: string | null, name: string, size = 36) => <LogoTile id={catalogId ?? 'custom'} size={size} mono={catalogId ? undefined : name.slice(0, 1).toUpperCase()} />;

export function SyncCardView({ card, today, h }: { card: SyncCard; today: DateOnly; h: SyncHandlers }) {
  const p = usePalette();
  const money = useAppMoney();
  if (card.kind === 'reconnect') {
    const l = card.link;
    return (
      <Notice amber>
        <Head dot logo={<BankTile bank={bankOf(l)} size={36} name={l.name} />} title={`Sign back in to ${l.name}.`} line="Banks do this every few months. Your list and reminders still work." />
        <Pair a={{ label: 'Reconnect', onPress: () => h.reconnect(l.id), hint: `Opens ${l.name}’s sign-in` }} b={{ label: 'Later', onPress: () => h.later(l.id), hint: 'Hides this for 3 days' }} />
      </Notice>
    );
  }
  if (card.kind === 'price') {
    const c = card.change;
    const up = c.toMinor > c.fromMinor;
    const delta = `${up ? '+' : '−'}${money(Math.abs(c.toMinor - c.fromMinor), c.currency)}`;
    const when = c.date === today ? 'today’s charge' : `the ${shortDate(c.date)} charge`;
    return (
      <Notice>
        <Head
          logo={subLogo(card.sub.catalogId, card.sub.name)}
          title={
            <>
              {`${card.sub.name} charged ${money(c.toMinor, c.currency)}, not ${money(c.fromMinor, c.currency)}. `}
              <Txt v="bodyStrong" num color={up ? p.amber : p.ok} style={{ fontFamily: F.bold }}>
                {delta}
              </Txt>
            </>
          }
          line={`From ${when} at ${card.bank}.`}
        />
        <Pair
          a={{ label: 'Update price', onPress: () => h.updatePrice(card), hint: `Sets ${card.sub.name} to ${spokenMoney(c.toMinor, c.currency)}` }}
          b={{ label: 'It was a one-off', onPress: () => h.dismiss(card.key), hint: `Keeps ${spokenMoney(c.fromMinor, c.currency)}` }}
        />
      </Notice>
    );
  }
  if (card.kind === 'cancelled') {
    const g = card.gone;
    return (
      <Notice>
        <Head logo={subLogo(card.sub.catalogId, card.sub.name)} title={`No ${card.sub.name} charge since ${shortDate(g.lastSeen)}.`} line={`It was due ${shortDate(g.expected)}. Cancelled?`} />
        <Pair a={{ label: 'Mark ditched', onPress: () => h.markDitched(card.sub.id) }} b={{ label: 'Still paying', onPress: () => h.dismiss(card.key), hint: 'Hides this' }} />
      </Notice>
    );
  }
  if (card.kind === 'check') {
    const f = card.items[0];
    const price = f.price ? money(f.price.amountMinor, f.price.currency) : null;
    const more = card.items.length - 1;
    return (
      <Notice>
        <Txt v="bodyStrong" accessibilityRole="header" color={p.cardFg} style={{ fontFamily: F.bold, fontSize: 16, lineHeight: 21, marginBottom: 10 }}>
          {card.items.length > 1 ? `Are these subscriptions? ${card.items.length} to check` : 'Is this a subscription?'}
        </Txt>
        <Head logo={subLogo(f.catalogId, f.name)} title={`${f.name}${price ? ` · ${price}` : ''}`} line={`${f.evidence}. Subscription?`} />
        <Pair
          a={{ label: 'Yes', onPress: () => h.answer(f.key, true), hint: `Adds ${f.name} to your list` }}
          b={{ label: 'No', onPress: () => h.answer(f.key, false), hint: 'Never asks about it again' }}
        />
        {more > 0 ? (
          <Txt v="fine" tone="mute" style={{ marginTop: 8 }}>
            {`${more} more after this.`}
          </Txt>
        ) : null}
      </Notice>
    );
  }
  // Day-5 trial recap: only real counts from their own bank.
  const totals = card.totals.map((t) => `${formatWholeMoney(t.yearlyMinor, t.currency)} a year`).join(' · ');
  const caught = card.caught ? ` Caught ${card.caught.name} going up ${money(card.caught.deltaMinor, card.caught.currency)}.` : '';
  return (
    <Notice>
      <Head logo={<DuckIcon size={36} />} title="Your free week so far" line={`${card.found} found at ${card.bank}${totals ? ` · ${totals}` : ''}.${caught}`} />
      <Txt v="fine" tone="mute" num style={{ marginTop: 10 }}>
        {`Trial ends ${shortDate(card.trialEnds)}, then ${planById('yearly').priceString}/yr. Cancel before then to pay nothing.`}
      </Txt>
      <Pair a={{ label: 'Got it', onPress: () => h.dismiss(card.key) }} b={{ label: 'How to cancel', onPress: h.howToCancel, text: true, hint: 'Opens your Apple subscriptions' }} />
    </Notice>
  );
}

/**
 * "Added Max from your bank. $16.99 a month. [Undo]" at the bottom of Home. 8 seconds, or until
 * dismissed when VoiceOver is on. Fades in and out; never slides (it carries a price).
 */
export function BankToastView({ toast, onUndo, onDone }: { toast: BankToast | null; onUndo: (subId: string) => void; onDone: () => void }) {
  const p = usePalette();
  const money = useAppMoney();
  const reduce = useReducedMotion();
  const [reader, setReader] = useState(false);
  const shownFor = useRef<string | null>(null);
  useEffect(() => {
    // The web preview reports a screen reader that isn't there: it gets the phone's 8 seconds.
    AccessibilityInfo.isScreenReaderEnabled()
      .then((on) => setReader(on && Platform.OS !== 'web'))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!toast) return;
    if (shownFor.current !== toast.id) {
      shownFor.current = toast.id;
      AccessibilityInfo.announceForAccessibility(
        `Added ${toast.name} from your bank.${toast.amountMinor != null && toast.currency ? ` ${spokenMoney(toast.amountMinor, toast.currency)} ${per(toast.cycle)}.` : ''} Undo is at the bottom.`,
      );
    }
    if (reader) return;
    const t = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(t);
  }, [toast, reader, onDone]);
  if (!toast) return null;
  const price = toast.amountMinor != null && toast.currency ? ` ${money(toast.amountMinor, toast.currency)} ${per(toast.cycle)}.` : '';
  const bg = p.dark ? '#F6F0E3' : brand.ink;
  const fg = p.dark ? brand.ink : brand.white;
  return (
    <Animated.View
      key={toast.id}
      entering={reduce ? undefined : FadeIn.duration(180)}
      exiting={reduce ? undefined : FadeOut.duration(160)}
      style={{
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 14,
        borderRadius: 16,
        backgroundColor: bg,
        paddingLeft: 16,
        paddingRight: 6,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      }}
    >
      <Txt v="body" num color={fg} accessibilityLiveRegion="polite" style={{ flex: 1, fontFamily: F.medium, fontSize: 15, lineHeight: 20, paddingVertical: 10 }}>
        {`Added ${toast.name} from your bank.${price}`}
      </Txt>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Undo, take ${toast.name} off your list`}
        onPress={() => onUndo(toast.subId)}
        hitSlop={4}
        style={({ pressed }) => ({ minHeight: 44, minWidth: 56, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
      >
        <Txt v="label" color={p.dark ? brand.ink : brand.sunflower} style={{ fontFamily: F.bold, fontSize: 15, textDecorationLine: p.dark ? 'underline' : 'none' }}>
          Undo
        </Txt>
      </Pressable>
      {reader ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDone} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Close color={fg} size={12} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

function per(cycle: BankToast['cycle']): string {
  return cycle === 'yearly'
    ? 'a year'
    : cycle === 'weekly'
      ? 'a week'
      : cycle === 'monthly'
        ? 'a month'
        : `every ${cycle === 'biweekly' ? '2 weeks' : cycle === 'quarterly' ? '3 months' : '6 months'}`;
}
