// Paywall plan card (design/v12): full width, 56pt by default (the paywall uses 58).
// The billed price is always the biggest price on it. Selection: the radio
// fills and the border goes 1.5 → 2.5pt with no layout shift. The "SAVE 83%"
// ribbon sits on the top edge, so it never touches the price.
// Plans (DECISIONS #69): Weekly $6.99, Yearly $59.99 with a 7-day trial, Lifetime $119.99.
// Purchases go through RevenueCat (DECISIONS #79).

import { Pressable, View } from 'react-native';

import { Tag } from './Card';
import { Radio } from './Controls';
import { brand, radius, usePalette } from './tokens';
import { F, Txt } from './type';

export function PlanCard({
  title,
  price,
  sub,
  note,
  tag,
  badge,
  selected,
  onPress,
  a11y,
  height = 56,
  tint,
  banner,
  badgeBg,
  badgeRight,
  noteStrong,
  badgeFg,
  scale = 1,
}: {
  /** The paywall draws its cards on a canvas scaled to the phone. Small lines and badges grow by 1/scale so
   *  they never show under 12pt (lines) or 10.5pt (badges) on screen (audit, Nov 20: ~11pt and ~9.4pt on SE). */
  scale?: number;
  /** Fill for the selected card (the plan we want picked). */
  tint?: string;
  /** A strip across the top of the card, e.g. "7 DAYS FREE · SAVE 83%" (Cal AI / Deepstash pattern). */
  banner?: string;
  /** Badge colours (default: ink on cream, sunflower in dark mode). */
  badgeBg?: string;
  /** Put the badge on the top-right edge instead of over the name. */
  badgeRight?: boolean;
  /** Show the note line in bold ink (e.g. "Free for 7 days"). */
  noteStrong?: boolean;
  badgeFg?: string;
  title: string;
  /** The billed price, e.g. "$59.99/yr". */
  price: string;
  sub?: string;
  /** Small line under the name, e.g. "Pay once. No subscription." or "Free for 7 days". */
  note?: string;
  /** Pill next to the name, e.g. "7 days free". */
  tag?: string;
  /** Ribbon on the card's top edge, e.g. "SAVE 83%". */
  badge?: string;
  selected: boolean;
  onPress: () => void;
  /** Full spoken description of the plan. */
  a11y: string;
  height?: number;
}) {
  const p = usePalette();
  const fine = { fontSize: Math.max(13, 12 / scale), lineHeight: Math.max(16, 15 / scale) };
  const badgeSize = Math.max(11, 10.5 / scale);
  const border = selected ? (p.dark ? brand.sunflower : p.fg) : p.dark ? '#3A3630' : p.controlBorder;
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={a11y} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
      {banner ? (
        <View
          style={{
            height: 26,
            borderTopLeftRadius: radius.plan,
            borderTopRightRadius: radius.plan,
            backgroundColor: p.dark ? brand.sunflower : brand.ink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Txt v="fine" color={p.dark ? brand.ink : brand.sunflower} style={{ fontFamily: F.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.8 }} maxFontSizeMultiplier={1.2}>
            {banner}
          </Txt>
        </View>
      ) : null}
      <View
        style={{
          minHeight: height,
          borderRadius: radius.plan,
          ...(banner ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : null),
          backgroundColor: selected && tint ? tint : p.card,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 16,
        }}
      >
        <Radio on={selected} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Txt v="bodyStrong" color={p.cardFg} numberOfLines={1}>
              {title}
            </Txt>
            {tag ? <Tag label={tag} /> : null}
          </View>
          {note ? (
            <Txt
              v="fine"
              tone={noteStrong ? undefined : 'fg2'}
              color={noteStrong ? p.cardFg : undefined}
              style={noteStrong ? [fine, { fontFamily: F.bold }] : fine}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {note}
            </Txt>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Txt v="moneyM" num color={p.cardFg}>
            {price}
          </Txt>
          {sub ? (
            <Txt v="fine" tone="mute" num style={fine}>
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
            ...(badgeRight ? { right: 16 } : { left: 52 }),
            height: 20,
            borderRadius: 10,
            paddingHorizontal: 8,
            justifyContent: 'center',
            backgroundColor: badgeBg ?? (p.dark ? brand.sunflower : p.fg),
          }}
        >
          <Txt v="fine" color={badgeFg ?? (p.dark ? brand.ink : p.bg)} style={{ fontFamily: F.bold, fontSize: badgeSize, lineHeight: 20, letterSpacing: 0.4 }} maxFontSizeMultiplier={1.2}>
            {badge}
          </Txt>
        </View>
      ) : null}
    </Pressable>
  );
}
