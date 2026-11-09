// "Prices for 🇬🇧 UK · Change": pick which country's prices to show.
// Defaults to the iPhone's Region; this is for people living elsewhere.

import { Pressable, ScrollView, View } from 'react-native';

import { COUNTRIES } from '@/catalog/prices';
import { Check, RowDivider, Sheet, Txt, haptic, usePalette } from '@/ui/sunflower';

export function CountrySheet({
  visible,
  value,
  onClose,
  onPick,
}: {
  visible: boolean;
  value: string | null;
  onClose: () => void;
  onPick: (code: string) => void;
}) {
  const p = usePalette();
  return (
    <Sheet visible={visible} onClose={onClose} maxHeight={700} label="Prices for which country">
      <Txt v="title" style={{ fontSize: 24, lineHeight: 28 }} accessibilityRole="header">
        Prices for
      </Txt>
      <Txt v="sub" tone="mute" style={{ marginTop: 4 }}>
        We show each service’s local price. Pick where you pay.
      </Txt>
      <ScrollView style={{ marginTop: 12, flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: p.card, borderRadius: 16 }}>
          {COUNTRIES.map((c, i) => {
            const on = c.code === value;
            return (
              <View key={c.code}>
                {i ? <RowDivider inset={52} /> : null}
                <Pressable
                  accessibilityRole="radio"
                  accessibilityLabel={`${c.name}, prices in ${c.currency}`}
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    haptic.select();
                    onPick(c.code);
                  }}
                  style={({ pressed }) => ({ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, opacity: pressed ? 0.6 : 1 })}
                >
                  <Txt v="lead" style={{ fontSize: 22, width: 26 }} importantForAccessibility="no">
                    {c.flag}
                  </Txt>
                  <Txt v="bodyStrong" style={{ flex: 1 }}>
                    {c.name}
                  </Txt>
                  <Txt v="sub" tone="mute">
                    {c.currency}
                  </Txt>
                  <View style={{ width: 20, alignItems: 'center' }}>{on ? <Check color={p.fg} size={17} /> : null}</View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Sheet>
  );
}
