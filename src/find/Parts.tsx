// Shared bits for the Find screens (design/find-subs, DECISIONS #63).

import { router } from 'expo-router';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { DEV_TOOLS } from '@/dev/flags';
import { BottomFade, ChevronLeft, ChevronRight, F, GAP, Lock, Txt, brand, useHeadlineGap, useInsets, usePageEdge, usePalette, usePressScale } from '@/ui/sunflower';

/** Sample buttons: web preview and test builds only, never the App Store build. */
export const SHOW_SAMPLES = Platform.OS === 'web' || DEV_TOOLS;

/** The one place we say it: right under the button that picks the screenshot or statement (owner, Nov 20: it was everywhere). */
export function PrivateNote({ text = 'Read on your iPhone. Never uploaded.' }: { text?: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }} accessible accessibilityLabel={text}>
      <Lock color={p.mute} size={13} />
      <Txt v="sub" tone="mute" style={{ fontSize: 13 }}>
        {text}
      </Txt>
    </View>
  );
}

export function FindPage({ title, back = 'Back', intro, children, footer }: { title: string; back?: string; intro?: string; children: ReactNode; footer?: ReactNode }) {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  const gap = useHeadlineGap();
  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <View style={{ flex: 1 }}>
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
          <Txt v="title" accessibilityRole="header" style={{ marginTop: gap, fontSize: 28, lineHeight: 34 }}>
            {title}
          </Txt>
          {intro ? (
            <Txt v="leadS" tone="fg2" style={{ marginTop: GAP.lead }}>
              {intro}
            </Txt>
          ) : null}
          {children}
        </ScrollView>
        {/* Content that runs under the buttons fades out instead of being sliced mid-line. */}
        {footer ? <BottomFade height={24} /> : null}
      </View>
      {footer ? <View style={{ paddingHorizontal: edge, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), gap: 4 }}>{footer}</View> : null}
    </View>
  );
}

/** A big tappable card: a line icon (from ui/sunflower/icons) on a tinted tile, title, line, optional tag. Presses in to 0.97. */
export function RouteCard({
  icon: Icon,
  title,
  line,
  tag,
  onPress,
  disabled,
}: {
  icon: ComponentType<{ color: string; size?: number }>;
  title: string;
  line: string;
  tag?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const p = usePalette();
  const press = usePressScale(disabled);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${line}${tag ? `. ${tag}` : ''}`}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      {...press.handlers}
      style={{ marginTop: 12 }}
    >
      <Animated.View style={[{ backgroundColor: p.card, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }, press.style]}>
        <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
          <Icon color={p.dark ? brand.sunflower : brand.ink} size={24} />
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
      </Animated.View>
    </Pressable>
  );
}
