// Currency for new subscriptions. Ones already on the list keep their own
// currency: Ditch never relabels or converts money.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Group, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { Check, F, Search, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

const CURRENCIES: [string, string][] = [
  ['USD', 'US dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'British pound'],
  ['CAD', 'Canadian dollar'],
  ['AUD', 'Australian dollar'],
  ['NZD', 'New Zealand dollar'],
  ['INR', 'Indian rupee'],
  ['JPY', 'Japanese yen'],
  ['CHF', 'Swiss franc'],
  ['SEK', 'Swedish krona'],
  ['NOK', 'Norwegian krone'],
  ['DKK', 'Danish krone'],
  ['PLN', 'Polish złoty'],
  ['CZK', 'Czech koruna'],
  ['BRL', 'Brazilian real'],
  ['MXN', 'Mexican peso'],
  ['ZAR', 'South African rand'],
  ['SGD', 'Singapore dollar'],
  ['HKD', 'Hong Kong dollar'],
  ['KRW', 'South Korean won'],
  ['AED', 'UAE dirham'],
  ['SAR', 'Saudi riyal'],
  ['EGP', 'Egyptian pound'],
  ['TRY', 'Turkish lira'],
  ['ILS', 'Israeli shekel'],
  ['PHP', 'Philippine peso'],
  ['IDR', 'Indonesian rupiah'],
  ['MYR', 'Malaysian ringgit'],
  ['THB', 'Thai baht'],
  ['NGN', 'Nigerian naira'],
];

export default function CurrencyPage() {
  const p = usePalette();
  const app = useApp();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CURRENCIES.filter(([code, name]) => !s || code.toLowerCase().includes(s) || name.toLowerCase().includes(s));
  }, [q]);
  return (
    <SettingsPage title="Currency" intro="For new subscriptions. Ones you’ve already added keep their own currency.">
      <View style={{ marginTop: 16, height: 46, borderRadius: 12, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
        <Search color={p.mute} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search"
          placeholderTextColor={p.mute}
          accessibilityLabel="Search currencies"
          style={{ flex: 1, height: 44, fontFamily: F.regular, fontSize: 16, color: p.fg, outlineStyle: 'none' } as object}
        />
      </View>
      <Group style={{ marginTop: 14 }}>
        {list.map(([code, name]) => {
          const on = code === app.settings.currency;
          return (
            <Pressable
              key={code}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${name}, ${code}`}
              onPress={async () => {
                haptic.select();
                await app.updateSettings({ currency: code });
                router.back();
              }}
              style={({ pressed }) => ({ minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.6 : 1 })}
            >
              <Txt v="label" num color={p.cardFg} style={{ width: 46, fontFamily: F.bold }}>
                {code}
              </Txt>
              <Txt v="leadS" color={p.cardFg} style={{ flex: 1 }}>
                {name}
              </Txt>
              {on ? <Check color={p.dark ? brand.sunflower : brand.ink} size={20} /> : null}
            </Pressable>
          );
        })}
      </Group>
    </SettingsPage>
  );
}
