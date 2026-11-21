// Which bank? (design/v32 screen 3). Pick first, so a bank that can't connect is caught before
// anyone pays (Copilot does the same). The big nine as a grid, the rest by search.
// Tiles are letters in each bank's colours until the provider's logos arrive (src/bank/banks.ts).

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, TextInput, View, useWindowDimensions } from 'react-native';

import { mergeBanks, searchBanks, type BankEntry } from '@/bank/banks';
import { searchDirectory } from '@/bank/directory';
import { BankPage, BankTile, BigTitle, TextLink } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { useBank } from '@/state/bank';
import { canAddLink } from '@/state/bankLogic';
import { ask } from '@/ui/alert';
import { F, Search, Txt, haptic, usePageEdge, usePalette } from '@/ui/sunflower';

export default function BankPick() {
  const p = usePalette();
  const flow = useBankFlow();
  const bank = useBank();
  const [q, setQ] = useState('');
  // Every bank the provider supports: the built-in ones match at once, the directory a moment later.
  const [remote, setRemote] = useState<{ q: string; list: BankEntry[] }>({ q: '', list: [] });
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) return;
    let live = true;
    const t = setTimeout(() => {
      searchDirectory(query).then((list) => live && setRemote({ q: query, list }));
    }, 300);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);
  const searching = q.trim().length >= 2 && remote.q !== q.trim();
  const list = q.trim().length >= 2 && remote.q === q.trim() ? mergeBanks(searchBanks(q), remote.list) : searchBanks(q);
  // Three across, whatever the phone (10pt gaps).
  const edge = usePageEdge();
  const { width } = useWindowDimensions();
  const tileW = Math.floor((width - edge * 2 - 20) / 3);

  const pick = (b: BankEntry) => {
    haptic.select();
    if (!canAddLink(bank.state)) {
      ask('3 is the limit', 'You can connect up to 3. Disconnect one to add another.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Bank connections', onPress: () => router.push('/settings/banks') },
      ]);
      return;
    }
    if (bank.state.links.some((l) => l.bankId === b.id)) {
      ask(`${b.name} is already connected`, 'Pick another bank or card, or reconnect this one from Bank connections.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Bank connections', onPress: () => router.push('/settings/banks') },
      ]);
      return;
    }
    // Price before the bank, never after (spec principle 2): no Pro yet → the paywall first.
    if (flow.pro) router.push(`/bank/scan?${flow.q({ bank: b.id })}`);
    else router.push(`/paywall?from=bank&bank=${b.id}`);
  };

  return (
    <BankPage brand>
      <BigTitle brandBar>{'Which bank pays\nyour subs?'}</BigTitle>
      <View
        style={{
          marginTop: 16,
          minHeight: 48,
          borderRadius: 14,
          backgroundColor: p.card,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: p.dark ? p.cardBorder : p.hair,
        }}
      >
        <Search color={p.mute} size={18} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search banks"
          placeholderTextColor={p.mute}
          accessibilityLabel="Search banks"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={{ flex: 1, minHeight: 46, fontFamily: F.medium, fontSize: 16, color: p.fg }}
        />
      </View>
      {list.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
          {list.map((b) => (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={b.name}
              accessibilityHint={flow.pro ? 'Opens the bank sign-in' : 'Shows Pro first'}
              onPress={() => pick(b)}
              style={({ pressed }) => ({
                width: tileW,
                minHeight: 86,
                paddingVertical: 10,
                paddingHorizontal: 6,
                borderRadius: 16,
                backgroundColor: p.card,
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: 14,
                gap: 8,
                borderWidth: p.dark ? 1 : 0,
                borderColor: p.cardBorder,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <BankTile bank={b} size={36} />
              {/* Room for 2 lines on every tile, so one long name doesn't lift its logo above the others (audit, Nov 20). */}
              <View style={{ minHeight: 32, justifyContent: 'center' }}>
                <Txt v="sub" center numberOfLines={2} color={p.cardFg} style={{ fontFamily: F.semi, fontSize: 13, lineHeight: 16 }}>
                  {b.name}
                </Txt>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 18 }}>
          {searching ? 'Searching…' : `No bank called “${q.trim()}”.`}
        </Txt>
      )}
      <Txt v="fine" tone="mute" center style={{ marginTop: 16 }}>
        Pick the card or account you pay subscriptions with.
      </Txt>
      <TextLink center label="Bank not here?" onPress={() => router.push(`/bank/missing?${flow.q()}`)} />
    </BankPage>
  );
}
