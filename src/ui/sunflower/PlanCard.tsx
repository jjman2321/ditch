// Paywall plan card (design/v12): full width, 56pt (48 on small phones).
// The billed price is always the biggest price on it. Selection: the radio
// fills and the border goes 1.5 → 2.5pt with no layout shift. The "SAVE 49%"
// ribbon sits on the top edge above the name, so it never touches the price.

import { Pressable, View } from 'react-native';

import { Tag } from './Card';
import { Radio } from './Controls';
import { brand, radius, usePalette } from './tokens';
import { F, Txt } from './type';

export function PlanCard({
  title,
  price,
  sub,
  tag,
  badge,
  selected,
  onPress,
  a11y,
  height = 56,
}: {
  title: string;
  /** The billed price, e.g. "$29.99/yr". */
  price: string;
  sub?: string;
  /** Pill next to the name, e.g. "7 days free". */
  tag?: string;
  /** Ribbon on the card's top edge, e.g. "SAVE 49%". */
  badge?: string;
  selected: boolean;
  onPress: () => void;
  /** Full spoken description of the plan. */
  a11y: string;
  height?: number;
}) {
  const p = usePalette();
  const border = selected ? (p.dark ? brand.sunflower : p.fg) : p.dark ? '#3A3630' : p.controlBorder;
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={a11y} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
      <View style={{ minHeight: height, borderRadius: radius.plan, backgroundColor: p.card, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
        <Radio on={selected} />
        <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Txt v="bodyStrong" color={p.cardFg} numberOfLines={1}>
            {title}
          </Txt>
          {tag ? <Tag label={tag} /> : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Txt v="moneyM" num color={p.cardFg}>
            {price}
          </Txt>
          {sub ? (
            <Txt v="fine" tone="mute" num>
              {sub}
            </Txt>
          ) : null}
        </View>
      </View>
      {/* Border drawn on top so 1.5 → 2.5pt never shifts the layout. */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.plan, borderWidth: selected ? 2.5 : 1.5, borderColor: border }} />
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 52,
            height: 20,
            borderRadius: 10,
            paddingHorizontal: 8,
            justifyContent: 'center',
            backgroundColor: p.dark ? brand.sunflower : p.fg,
          }}
        >
          <Txt v="fine" color={p.dark ? brand.ink : p.bg} style={{ fontFamily: F.bold, fontSize: 11, lineHeight: 20, letterSpacing: 0.4 }} maxFontSizeMultiplier={1.2}>
            {badge}
          </Txt>
        </View>
      ) : null}
    </Pressable>
  );
}
