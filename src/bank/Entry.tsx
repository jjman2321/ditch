// Ways into bank sync (design/v32 screen 1): the big bank card that leads "Where should we look?"
// and the Find hub, and the smaller grouped rows for the do-it-yourself routes under it.

import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Bank, Card, ChevronRight, F, RowDivider, Txt, brand, usePalette, usePressScale } from '@/ui/sunflower';

/** "My bank or card · Finds them, then spots new ones. US & Canada." with a sunflower ring and the PRO chip. */
export function BankHero({ onPress, tag, title = 'My bank or card', line = 'Finds them, then spots new ones. US & Canada.' }: { onPress: () => void; tag?: string; title?: string; line?: string }) {
  const p = usePalette();
  const press = usePressScale();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${line}${tag ? ` ${tag.replace('·', ',')}` : ''}`} onPress={onPress} {...press.handlers} style={{ marginTop: 18 }}>
      <Animated.View
        style={[
          { backgroundColor: p.card, borderRadius: 20, padding: 16, borderWidth: 2, borderColor: brand.sunflower },
          p.dark ? null : { shadowColor: '#463200', shadowOpacity: 0.08, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
          press.style,
        ]}
      >
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center' }}>
            <Bank color={brand.ink} size={24} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17, lineHeight: 22, fontFamily: F.bold }}>
              {title}
            </Txt>
            <Txt v="sub" tone="fg2" style={{ marginTop: 1 }}>
              {line}
            </Txt>
          </View>
          <ChevronRight color={p.mute} size={18} />
        </View>
        {tag ? (
          <View style={{ alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: p.sunSoft }}>
            <Txt v="eyebrow" color={p.sunSoftFg} style={{ fontSize: 11, letterSpacing: 0.6 }}>
              {tag}
            </Txt>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export type MiniRoute = { key: string; icon: ComponentType<{ color: string; size?: number }>; title: string; line: string; onPress: () => void };

/** "OR DO IT YOURSELF": the free routes as one grouped card of compact rows. */
export function MiniRoutes({ routes, header = 'Or do it yourself' }: { routes: MiniRoute[]; header?: string }) {
  const p = usePalette();
  return (
    <>
      <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 22, marginBottom: 8, marginHorizontal: 4 }}>
        {header}
      </Txt>
      <Card>
        {routes.map((r, i) => (
          <View key={r.key}>
            {i ? <RowDivider inset={62} /> : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${r.title}. ${r.line.replace(' · ', ', ')}`}
              onPress={r.onPress}
              style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: p.dark ? '#2A2721' : '#EFE8D9', alignItems: 'center', justifyContent: 'center' }}>
                <r.icon color={p.fg} size={20} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 15 }}>
                  {r.title}
                </Txt>
                <Txt v="sub" tone="mute" style={{ fontSize: 13, lineHeight: 18 }}>
                  {r.line}
                </Txt>
              </View>
              <ChevronRight color={p.mute} size={16} />
            </Pressable>
          </View>
        ))}
      </Card>
    </>
  );
}
