// Which bank? (design/v32 screen 3). Pick first, so a bank that can't connect is caught before
// anyone pays (Copilot does the same). The big nine as a grid, the rest by search.
// Tiles are letters in each bank's colours until the provider's logos arrive (src/bank/banks.ts).

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View, useWindowDimensions } from 'react-native';

import { searchBanks, type BankEntry } from '@/bank/banks';
import { BankPage, BankTile, BigTitle, TextLink } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { useBank } from '@/state/bank';
import { canAddLink } from '@/state/bankLogic';
import { tell } from '@/ui/alert';
import { F, Search, Txt, haptic, usePageEdge, usePalette } from '@/ui/sunflower';

export default function BankPick() {
  const p = usePalette();
  const flow = useBankFlow();
  const bank = useBank();
  const [q, setQ] = useState('');
  const list = searchBanks(q);
  // Three across, whatever the phone (10pt gaps).
  const edge = usePageEdge();
  const { width } = useWindowDimensions();
  const tileW = Math.floor((width - edge * 2 - 20) / 3);

  const pick = (b: BankEntry) => {
    haptic.select();
    if (!canAddLink(bank.state)) {
      tell('3 is the limit', 'You can connect up to 3. Disconnect one in Settings → Bank connections to add another.');
      return;
    }
    if (bank.state.links.some((l) => l.bankId === b.id)) {
      tell(`${b.name} is already connected`, 'Pick another bank or card, or reconnect it in Settings → Bank connections.');
      return;
    }
    // Price before the bank, never after (spec principle 2): no Pro yet → the paywall first.
    if (flow.pro) router.push(`/bank/scan?${flow.q({ bank: b.id })}`);
    else router.push(`/paywall?from=bank&bank=${b.id}`);
  };

  return (
    <BankPage>
      <BigTitle style={{ marginTop: 8 }}>Which bank pays your subscriptions?</BigTitle>
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
                justifyContent: 'center',
                gap: 8,
                borderWidth: p.dark ? 1 : 0,
                borderColor: p.cardBorder,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <BankTile bank={b} size={36} />
              <Txt v="sub" center numberOfLines={2} color={p.cardFg} style={{ fontFamily: F.semi, fontSize: 13, lineHeight: 16 }}>
                {b.name}
              </Txt>
            </Pressable>
          ))}
        </View>
      ) : (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 18 }}>
          {`No bank called “${q.trim()}” yet.`}
        </Txt>
      )}
      <Txt v="fine" tone="mute" center style={{ marginTop: 16 }}>
        Pick the card or account you pay subscriptions with.
      </Txt>
      <TextLink center label="Bank not here?" onPress={() => router.push(`/bank/missing?${flow.q()}`)} />
    </BankPage>
  );
}
