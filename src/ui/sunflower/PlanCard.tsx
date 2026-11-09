// Paywall plan card. The billed price is always the biggest price on it.
// Selection: the radio fills and the border goes 1.5 → 2.5pt with no layout shift.

import { Pressable, View } from 'react-native';

import { Tag } from './Card';
import { Radio } from './Controls';
import { brand, radius, usePalette } from './tokens';
import { Txt } from './type';

export function PlanCard({
  title,
  price,
  sub,
  tag,
  badge,
  selected,
  onPress,
  a11y,
}: {
  title: string;
  /** The billed price, e.g. "$29.99/yr". */
  price: string;
  sub?: string;
  /** Pill next to the name, e.g. "7 days free". */
  tag?: string;
  /** Tab on the card's top edge, e.g. "Save 49%". */
  badge?: string;
  selected: boolean;
  onPress: () => void;
  /** Full spoken description of the plan. */
  a11y: string;
}) {
  const p = usePalette();
  const border = selected ? (p.dark ? brand.sunflower : p.fg) : p.controlBorder;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={a11y}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <View
        style={{
          minHeight: 58,
          borderRadius: radius.plan,
          backgroundColor: p.card,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 14,
          paddingRight: 16,
          paddingVertical: 8,
        }}
      >
        <Radio on={selected} />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 16.5 }}>
            {title}
          </Txt>
          {tag ? <Tag label={tag} /> : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Txt v="moneyM" num color={p.cardFg}>
            {price}
          </Txt>
          {sub ? (
            <Txt v="sub" tone="mute" num style={{ fontSize: 13, lineHeight: 16 }}>
              {sub}
            </Txt>
          ) : null}
        </View>
      </View>
      {/* Border drawn on top so 1.5 → 2.5pt never shifts the layout. */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.plan, borderWidth: selected ? 2.5 : 1.5, borderColor: border }}
      />
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 14,
            height: 20,
            borderRadius: 6,
            paddingHorizontal: 7,
            justifyContent: 'center',
            backgroundColor: p.dark ? brand.sunflower : brand.ink,
          }}
        >
          <Txt v="sub" color={p.dark ? brand.ink : brand.sunflower} style={{ fontFamily: 'Inter_700Bold', fontSize: 11.5, lineHeight: 14 }} maxFontSizeMultiplier={1.2}>
            {badge}
          </Txt>
        </View>
      ) : null}
    </Pressable>
  );
}
