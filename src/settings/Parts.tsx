// Settings building blocks: the page frame (back + large title), grouped
// white cards on cream, rows with a value and a chevron, and grey notes.
// Apple-style grouped lists (docs/research/settings.md).

import { router } from 'expo-router';
import { Children, useRef, type ReactNode } from 'react';
import { PixelRatio, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { Card, ChevronLeft, ChevronRight, F, Txt, usePalette, useInsets, usePageEdge } from '@/ui/sunflower';

/** Back button, large title and the grey intro: the top of every Settings page. */
export function SettingsHeader({ title, back = 'Settings', intro }: { title: string; back?: string; intro?: string }) {
  const p = usePalette();
  return (
    <>
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
      <Txt v="displayM" accessibilityRole="header" style={{ fontSize: 32, lineHeight: 40, marginTop: 2 }}>
        {title}
      </Txt>
      {intro ? (
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          {intro}
        </Txt>
      ) : null}
    </>
  );
}

/** Padding for a Settings page's scroll content (safe areas, the page edge). Shared with list pages. */
export function useSettingsPagePadding() {
  const insets = useInsets();
  const edge = usePageEdge();
  return { paddingTop: insets.top, paddingHorizontal: edge, paddingBottom: Math.max(insets.bottom, 16) + 16 };
}

export function SettingsPage({ title, back = 'Settings', children, intro }: { title: string; back?: string; children: ReactNode; intro?: string }) {
  const p = usePalette();
  const pad = useSettingsPagePadding();
  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={pad} showsVerticalScrollIndicator={false}>
        <SettingsHeader title={title} back={back} intro={intro} />
        {children}
      </ScrollView>
    </View>
  );
}

export function Group({ header, note, children, style }: { header?: string; note?: ReactNode; children: ReactNode; style?: object }) {
  const p = usePalette();
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ marginTop: 22 }, style]}>
      {header ? (
        <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginHorizontal: 4, marginBottom: 8 }}>
          {header}
        </Txt>
      ) : null}
      <Card style={{ paddingHorizontal: 16 }}>
        {items.map((child, i) => (
          <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}>
            {child}
          </View>
        ))}
      </Card>
      {note ? (
        <Txt v="fine" tone="mute" style={{ marginTop: 8, marginHorizontal: 4, fontSize: 13.5 }}>
          {note}
        </Txt>
      ) : null}
    </View>
  );
}

export function Row({
  label,
  value,
  onPress,
  chevron = !!onPress,
  right,
  danger,
  hint,
  a11yValue,
  labelNode,
}: {
  /** Drawn instead of the plain label (VoiceOver still reads `label`). */
  labelNode?: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  right?: ReactNode;
  danger?: boolean;
  hint?: string;
  a11yValue?: string;
}) {
  const p = usePalette();
  // One tap at a time: a quick double tap must not open the same page twice.
  const last = useRef(0);
  const press = () => {
    const now = Date.now();
    if (now - last.current < 600) return;
    last.current = now;
    onPress?.();
  };
  const labelText = labelNode ?? (
    <Txt v="leadS" color={danger ? p.danger : p.cardFg} style={{ flexShrink: 1, fontFamily: danger ? F.semi : F.regular, fontSize: 16.5 }}>
      {label}
    </Txt>
  );
  // Large text (iPhone Settings → Display & Brightness → Text Size) or a 320pt-wide screen: the value
  // goes under the label, in full, instead of being cut to "3 days, 1 d…" beside it.
  const { width } = useWindowDimensions();
  const stack = !right && !!value && (PixelRatio.getFontScale() >= 1.35 || width < 350);
  const body = (pressed: boolean) =>
    stack ? (
      <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, opacity: pressed ? 0.6 : 1 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          {labelText}
          <Txt v="leadS" tone="mute" num style={{ fontSize: 16 }}>
            {value}
          </Txt>
        </View>
        {chevron ? <ChevronRight color={p.mute} size={16} /> : null}
      </View>
    ) : (
      <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, opacity: pressed ? 0.6 : 1 }}>
        {labelText}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {right ??
            (value ? (
              <Txt v="leadS" tone="mute" num numberOfLines={1} style={{ fontSize: 16 }}>
                {value}
              </Txt>
            ) : null)}
        </View>
        {chevron ? <ChevronRight color={p.mute} size={16} /> : null}
      </View>
    );
  // A control on the right (the time picker, a switch) carries its own label, so the row
  // mustn't group it away from VoiceOver.
  if (!onPress)
    return right ? (
      body(false)
    ) : (
      <View accessible accessibilityLabel={`${label}${a11yValue ?? (value ? `, ${value}` : '')}`}>
        {body(false)}
      </View>
    );
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}${a11yValue ?? (value ? `, ${value}` : '')}`} accessibilityHint={hint} onPress={press}>
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}
