// Settings → Bank connections (design/v32 screen 12, spec h). Each bank with its status in words,
// Reconnect right on the row when it needs a sign-in, up to 3 banks. No "check now" (banks update
// a few times a day). Tap a bank (or the VoiceOver action) to disconnect: one sheet that says what
// stays. Test builds also get the practice bank's switches, to try every Home card.

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BankTile, TextLink, WhatWeSee } from '@/bank/Parts';
import { DEV_TOOLS } from '@/dev/flags';
import { shortDate } from '@/domain/dates';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { bankOf, useBank } from '@/state/bank';
import { MAX_LINKS, canAddLink, linkStatusWords, needsSignIn, type BankLink } from '@/state/bankLogic';
import { tell } from '@/ui/alert';
import { Button, Card, ChevronRight, F, Plus, RowDivider, Sheet, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

export default function BankConnections() {
  const p = usePalette();
  const bank = useBank();
  const [see, setSee] = useState(false);
  const [leaving, setLeaving] = useState<BankLink | null>(null);
  const links = bank.state.links;
  const full = !canAddLink(bank.state);
  const now = new Date();

  const reconnect = async (l: BankLink) => {
    haptic.select();
    try {
      await bank.reconnect(l.id);
      tell('Back on', `${l.name} is connected again. Ditch caught up on what it missed.`);
    } catch {
      // It used to fail silently (audit, Nov 20).
      tell(`Couldn’t reach ${l.name}`, 'Check your connection and try again in a bit.');
    }
  };

  const disconnect = async () => {
    if (!leaving) return;
    haptic.medium();
    await bank.disconnect(leaving.id);
    setLeaving(null);
  };

  const practice = async (kind: Parameters<typeof bank.practice>[0], done: string) => {
    if (!links.length) {
      tell('Connect a bank first', 'Add the practice bank, then try these.');
      return;
    }
    await bank.practice(kind);
    tell('Sent', done);
  };

  return (
    <SettingsPage title="Bank connections" intro="Banks update a few times a day.">
      {links.length ? (
        <Card style={{ marginTop: 18 }}>
          {links.map((l, i) => {
            const st = linkStatusWords(l, now);
            const color = st.tone === 'ok' ? p.ok : st.tone === 'warn' ? p.amber : p.mute;
            const broken = needsSignIn(l);
            return (
              <View key={l.id}>
                {i ? <RowDivider inset={64} /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${l.name}${l.accounts ? `, ${l.accounts.replace(' · ', ', ')}` : ''}, ${st.text}`}
                    accessibilityHint="Opens disconnect"
                    accessibilityActions={broken ? [{ name: 'activate' }, { name: 'reconnect', label: 'Reconnect' }] : [{ name: 'activate' }]}
                    onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'reconnect' ? void reconnect(l) : setLeaving(l))}
                    onPress={() => setLeaving(l)}
                    style={({ pressed }) => ({ flex: 1, minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingVertical: 12, opacity: pressed ? 0.7 : 1 })}
                  >
                    <BankTile bank={bankOf(l)} size={38} name={l.name} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt v="bodyStrong" color={p.cardFg}>
                        {l.name}
                      </Txt>
                      {l.accounts ? (
                        <Txt v="sub" tone="mute" style={{ fontSize: 13, lineHeight: 18 }}>
                          {l.accounts}
                        </Txt>
                      ) : null}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                        {broken ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.amber }} /> : null}
                        <Txt v="sub" color={color} style={{ fontSize: 13, lineHeight: 18, fontFamily: F.semi }}>
                          {st.text}
                        </Txt>
                      </View>
                    </View>
                    {broken ? null : <ChevronRight color={p.mute} size={16} />}
                  </Pressable>
                  {broken ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Reconnect ${l.name}`}
                      onPress={() => void reconnect(l)}
                      style={({ pressed }) => ({
                        minHeight: 44,
                        borderRadius: 22,
                        paddingHorizontal: 14,
                        backgroundColor: p.cta,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Txt v="label" color={p.ctaFg} style={{ fontSize: 14 }}>
                        Reconnect
                      </Txt>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })}
        </Card>
      ) : (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 18 }}>
          No banks connected yet.
        </Txt>
      )}

      <Card style={{ marginTop: 14 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a bank or card"
          accessibilityState={{ disabled: full }}
          disabled={full}
          onPress={() => router.push('/bank?from=settings')}
          style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, opacity: full ? 0.45 : pressed ? 0.7 : 1 })}
        >
          <Plus color={p.fg} size={18} />
          <Txt v="bodyStrong" color={p.cardFg}>
            Add a bank or card
          </Txt>
        </Pressable>
      </Card>
      <Txt v="fine" tone="mute" style={{ marginTop: 8, marginHorizontal: 4, fontSize: 13.5 }}>
        {full ? `${MAX_LINKS} is the limit. Disconnect one to add another.` : `Connect the card or bank that pays your subscriptions. You can connect up to ${MAX_LINKS}.`}
      </Txt>
      <View style={{ marginTop: 10, marginHorizontal: 4 }}>
        <TextLink label="What we see" onPress={() => setSee(true)} />
      </View>

      {DEV_TOOLS && !bank.live ? (
        <Group header="Test build only" note="The practice bank makes these up, so you can see each Home card. Go back to Home after each one.">
          <Row label="Practice: a new subscription" chevron={false} onPress={() => void practice('new', 'Disney+ charged twice. Check Home: it’s on your list with an Undo.')} />
          <Row label="Practice: Netflix charges more" chevron={false} onPress={() => void practice('price', 'Netflix charged $22.99 today. Check the card on Home.')} />
          <Row label="Practice: Hulu stops charging" chevron={false} onPress={() => void practice('cancelled', 'No Hulu charge for 40 days. Check the card on Home.')} />
          <Row label="Practice: bank signs Ditch out" chevron={false} onPress={() => void practice('relogin', 'The practice bank needs a sign-in. Check Home and this page.')} />
        </Group>
      ) : null}

      <WhatWeSee visible={see} onClose={() => setSee(false)} />
      <Sheet visible={!!leaving} onClose={() => setLeaving(null)} fit label={leaving ? `Disconnect ${leaving.name}?` : 'Disconnect'}>
        {leaving ? (
          <>
            <Txt v="heading" accessibilityRole="header" style={{ marginTop: 4 }}>
              {`Disconnect ${leaving.name}?`}
            </Txt>
            <Txt v="leadS" tone="fg2" style={{ marginTop: 6 }}>
              {`Ditch stops checking ${leaving.name}. Everything on your list stays.`}
            </Txt>
            <Txt v="sub" tone="mute" style={{ marginTop: 6 }}>
              {`Connected ${shortDate(leaving.connectedOn)}.`}
            </Txt>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Disconnect ${leaving.name}`}
              onPress={() => void disconnect()}
              style={({ pressed }) => ({ marginTop: 18, minHeight: 56, borderRadius: 28, backgroundColor: p.dangerFill, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
            >
              <Txt v="button" color={p.dark ? brand.ink : brand.white}>
                Disconnect
              </Txt>
            </Pressable>
            <Button kind="text" label="Cancel" onPress={() => setLeaving(null)} style={{ marginTop: 4 }} />
          </>
        ) : null}
      </Sheet>
    </SettingsPage>
  );
}
