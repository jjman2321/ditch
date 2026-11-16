// Shared bits for the Find screens (design/find-subs, DECISIONS #63).

import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

import { DEV_TOOLS } from '@/dev/flags';
import { ChevronLeft, ChevronRight, F, Txt, useInsets, usePageEdge, usePalette } from '@/ui/sunflower';

/** Sample buttons: web preview and test builds only, never the App Store build. */
export const SHOW_SAMPLES = Platform.OS === 'web' || DEV_TOOLS;

export function FindPage({ title, back = 'Back', intro, children, footer }: { title: string; back?: string; intro?: string; children: ReactNode; footer?: ReactNode }) {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: edge, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Back to ${back}`}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={8}
          style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginLeft: -8, paddingRight: 12 }}
        >
          <ChevronLeft color={p.fg} size={24} />
          <Txt v="label" style={{ fontSize: 17, fontFamily: F.medium }}>
            {back}
          </Txt>
        </Pressable>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 2, fontSize: 28, lineHeight: 34 }}>
          {title}
        </Txt>
        {intro ? (
          <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
            {intro}
          </Txt>
        ) : null}
        {children}
      </ScrollView>
      {footer ? <View style={{ paddingHorizontal: edge, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), gap: 4 }}>{footer}</View> : null}
    </View>
  );
}

/** A big tappable card: icon, title, line, optional tag. */
export function RouteCard({ icon, title, line, tag, onPress }: { icon: string; title: string; line: string; tag?: string; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${line}${tag ? `. ${tag}` : ''}`} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1, marginTop: 12 })}>
      <View style={{ backgroundColor: p.card, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
        <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
          <Txt v="lead" style={{ fontSize: 22 }}>
            {icon}
          </Txt>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 16.5 }}>
            {title}
          </Txt>
          <Txt v="sub" tone="fg2" style={{ marginTop: 2 }}>
            {line}
          </Txt>
          {tag ? (
            <View style={{ alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, backgroundColor: p.dark ? '#33302A' : '#F3EDE0' }}>
              <Txt v="eyebrow" tone="fg2" style={{ fontSize: 10.5, letterSpacing: 0.6 }}>
                {tag}
              </Txt>
            </View>
          ) : null}
        </View>
        <View style={{ alignSelf: 'center' }}>
          <ChevronRight color={p.mute} size={18} />
        </View>
      </View>
    </Pressable>
  );
}

export function Step({ n, children }: { n: number; children: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFCC2E', alignItems: 'center', justifyContent: 'center', borderWidth: p.dark ? 0 : 1.5, borderColor: '#16140F' }}>
        <Txt v="label" color="#16140F" style={{ fontFamily: F.heavy, fontSize: 14 }}>
          {String(n)}
        </Txt>
      </View>
      <Txt v="leadS" style={{ flex: 1, paddingTop: 2 }}>
        {children}
      </Txt>
    </View>
  );
}
