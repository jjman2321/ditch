// Shared bits for the bank screens (design/v32): the bank tile, the page frame, the tick lines,
// the scan steps, the "What we see" sheet and the money words VoiceOver reads.

import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { Image } from 'expo-image';

import { OnbRoot } from '@/onboarding/Parts';
import { Bank, Button, Check, ChevronLeft, F, IconButton, STEP_HEADER_H, Sheet, Txt, Wordmark, brand, tileRadius, useInsets, usePageEdge, usePalette } from '@/ui/sunflower';

import type { BankEntry } from './banks';

/** A bank's tile: the provider's logo when we have it, else its letters in its own colours. */
export function BankTile({ bank, size = 36, name }: { bank: BankEntry | null; size?: number; name?: string }) {
  const p = usePalette();
  const r = tileRadius(size);
  const box: StyleProp<ViewStyle> = { width: size, height: size, borderRadius: r, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' };
  if (bank?.logo) {
    return (
      <View accessible={false} importantForAccessibility="no-hide-descendants" style={[box, { backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: p.logoHair }]}>
        <Image source={typeof bank.logo === 'string' ? { uri: bank.logo } : bank.logo} style={{ width: size, height: size }} contentFit="contain" transition={0} />
      </View>
    );
  }
  if (!bank) {
    return (
      <View accessible={false} importantForAccessibility="no-hide-descendants" style={[box, { backgroundColor: p.dark ? '#2A2721' : p.sunSoft }]}>
        {name ? (
          <Txt v="label" color={p.fg} style={{ fontFamily: F.wideHeavy, fontSize: size * 0.4 }} maxFontSizeMultiplier={1}>
            {name.slice(0, 1).toUpperCase()}
          </Txt>
        ) : (
          <Bank color={p.fg} size={size * 0.55} />
        )}
      </View>
    );
  }
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={[box, { backgroundColor: bank.color }]}>
      <Txt v="label" color={bank.ink} style={{ fontFamily: F.wideHeavy, fontSize: bank.mono.length > 1 ? size * 0.34 : size * 0.44, letterSpacing: -0.3 }} maxFontSizeMultiplier={1}>
        {bank.mono}
      </Txt>
    </View>
  );
}

/** The bank screens' frame: the bare back chevron (like Where should we look?), a scroll body, an optional pinned footer. */
/** `brand`: the ditch wordmark centred in the top bar, for screens that would otherwise look bare (owner, Nov 20). */
export function BankPage({ children, footer, onBack, scroll = true, brand: showBrand = false }: { children: ReactNode; footer?: ReactNode; onBack?: () => void; scroll?: boolean; brand?: boolean }) {
  const p = usePalette();
  const insets = useInsets();
  const edge = usePageEdge();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')));
  const head = (
    <View style={{ height: STEP_HEADER_H, flexDirection: 'row', alignItems: 'center' }}>
      {showBrand ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Wordmark size={25} />
        </View>
      ) : null}
      <IconButton label="Back" onPress={back} style={{ marginLeft: -12 }}>
        <ChevronLeft color={p.fg} />
      </IconButton>
    </View>
  );
  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {scroll ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: edge, paddingBottom: 16 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {head}
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, paddingHorizontal: edge }}>
            {head}
            {children}
          </View>
        )}
        {footer ? <View style={{ paddingHorizontal: edge, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 16) }}>{footer}</View> : null}
      </View>
    </OnbRoot>
  );
}

export function BigTitle({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Txt v="title" accessibilityRole="header" style={{ fontSize: 32, lineHeight: 36 }}>
        {children}
      </Txt>
    </View>
  );
}

/** "✓ Read-only. Ditch can't move money." One VoiceOver element each. */
export function TickLine({ children }: { children: string }) {
  return (
    <View accessible accessibilityLabel={children} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 7 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
        <Check color={brand.ink} size={13} />
      </View>
      <Txt v="leadS" style={{ flex: 1, lineHeight: 22 }}>
        {children}
      </Txt>
    </View>
  );
}

/** One scan step: done (filled tick), now (ring with a dot), or still to come. */
export function StepRow({ label, state }: { label: string; state: 'done' | 'now' | 'todo' }) {
  const p = usePalette();
  return (
    <View
      accessible
      accessibilityLabel={`${label}${state === 'done' ? ', done' : state === 'now' ? ', in progress' : ''}`}
      style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 40, paddingVertical: 6 }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: state === 'done' ? (p.dark ? brand.sunflower : brand.ink) : 'transparent',
          borderWidth: state === 'done' ? 0 : state === 'now' ? 2.5 : 2,
          borderColor: state === 'now' ? p.fg : p.tickBorder,
        }}
      >
        {state === 'done' ? <Check color={p.dark ? brand.ink : brand.sunflower} size={12} /> : null}
        {state === 'now' ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.fg }} /> : null}
      </View>
      <Txt v="leadS" color={state === 'todo' ? p.mute : p.fg} style={{ flex: 1, fontFamily: F.medium }}>
        {label}
      </Txt>
    </View>
  );
}

/** An underlined text link with a 44pt target. */
export function TextLink({ label, onPress, center, hint }: { label: string; onPress: () => void; center?: boolean; hint?: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({ minHeight: 44, justifyContent: 'center', alignSelf: center ? 'center' : 'flex-start', opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="label" style={{ fontSize: 15, textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** The "What we see" sheet (spec a2). */
export function WhatWeSee({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} fit label="What we see" closeButton>
      <Txt v="heading" accessibilityRole="header" style={{ marginTop: 4 }}>
        What we see
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
        Charges from the accounts you pick: name, amount, date. Not your balance or login.
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
        Charges pass through to your phone; we don’t keep them. Your list stays on your phone.
      </Txt>
      <Button label="OK" onPress={onClose} style={{ marginTop: 20 }} />
    </Sheet>
  );
}
