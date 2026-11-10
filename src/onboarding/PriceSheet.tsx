// "Add your price": for services we have no checked local price for.
// The user types what they pay, in their own currency. Never converted.

import { getLocales } from 'expo-localization';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { priceRow } from '@/catalog/prices';
import { CYCLE_WORDS, currencyDigits, formatMoney, parseAmountInput, type Cycle } from '@/domain/money';
import { useCountry, type Picked } from '@/state/onboarding';
import { Button, F, LogoTile, Segmented, Sheet, Txt, usePalette } from '@/ui/sunflower';

function Body({ sub, onSave }: { sub: Picked; onSave: (amountMinor: number, currency: string, cycle: Cycle) => void }) {
  const p = usePalette();
  const country = useCountry();
  // Their price country's currency, else the iPhone's own currency.
  const currency = sub.currency ?? country?.currency ?? getLocales()[0]?.currencyCode ?? 'USD';
  // Start empty unless they typed a price before: typing onto a pre-filled
  // plan price is how "12.99" became "12.9911.99". The plan price shows as
  // the grey hint instead.
  const digits = currencyDigits(currency);
  const own = sub.priceSource === 'user' && sub.amountMinor;
  const [text, setText] = useState(own ? (sub.amountMinor! / 10 ** digits).toFixed(digits) : '');
  const hint = sub.amountMinor ? (sub.amountMinor / 10 ** digits).toFixed(digits) : digits ? '0.00' : '0';
  const [cycle, setCycle] = useState<Cycle>(sub.cycle === 'yearly' ? 'yearly' : 'monthly');
  const amount = parseAmountInput(text, currency);
  const symbol = formatMoney(0, currency).replace(/[\d.,\s]/g, '');

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <LogoTile id={sub.id} size={40} />
        <View style={{ flex: 1 }}>
          <Txt v="bodyStrong" style={{ fontSize: 17 }} accessibilityRole="header">
            {sub.name}
          </Txt>
          <Txt v="body" tone="mute" style={{ fontSize: 14 }}>
            {priceRow(sub.id, sub.priceCountry)
              ? 'Paying something different? Type it here.'
              : country
                ? `We don’t have ${country.name} prices for this one yet.`
                : 'We don’t have prices for your country yet.'}
          </Txt>
        </View>
      </View>

      <Txt v="label" style={{ marginTop: 20 }}>
        What do you pay?
      </Txt>
      <View
        style={{
          marginTop: 8,
          height: 56,
          borderRadius: 14,
          backgroundColor: p.chipBg,
          borderWidth: 1.5,
          borderColor: p.chipBorder,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          gap: 6,
        }}
      >
        <Txt v="moneyL" tone="mute">
          {symbol || currency}
        </Txt>
        <TextInput
          value={text}
          onChangeText={setText}
          autoFocus
          keyboardType="decimal-pad"
          placeholder={hint}
          placeholderTextColor={p.mute}
          accessibilityLabel={`Price in ${currency}`}
          style={{ flex: 1, minWidth: 0, height: 52, fontFamily: F.wideHeavy, fontSize: 22, color: p.fg, outlineStyle: 'none' } as object}
        />
        <Txt v="sub" tone="mute">
          {currency}
        </Txt>
      </View>
      <Segmented
        label="How often"
        value={cycle}
        onChange={setCycle}
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
        style={{ marginTop: 12 }}
      />
      <Txt v="sub" tone="mute" style={{ marginTop: 10 }}>
        Your bank app or the receipt email has the exact amount.
      </Txt>
      <Button
        style={{ marginTop: 20 }}
        label={amount ? `Save ${formatMoney(amount, currency)} ${CYCLE_WORDS[cycle]}` : text.trim() ? 'Check the price' : 'Type what you pay'}
        disabled={!amount}
        onPress={() => amount && onSave(amount, currency, cycle)}
      />
    </View>
  );
}

export function PriceSheet({
  sub,
  visible,
  onClose,
  onSave,
}: {
  sub: Picked | null;
  visible: boolean;
  onClose: () => void;
  onSave: (amountMinor: number, currency: string, cycle: Cycle) => void;
}) {
  return (
    <Sheet visible={visible && !!sub} onClose={onClose} fit avoidKeyboard label={sub ? `${sub.name} price` : 'Price'}>
      {sub ? <Body key={sub.id} sub={sub} onSave={onSave} /> : null}
    </Sheet>
  );
}
