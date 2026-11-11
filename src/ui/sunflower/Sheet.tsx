// Bottom sheet: dims the screen, slides up, closes on a tap outside, a
// drag down on the grabber, the × (closeButton), the back gesture or the
// VoiceOver escape (two-finger scrub). Content that's taller than the
// screen scrolls.
// Reduce Motion: a quick fade instead of the slide.
//
// Only one sheet is ever on screen. iOS can't open a new pop-up while the
// last one is still closing: try it and an invisible layer is left over
// the app that swallows every tap. So a sheet asked to open while another
// is closing waits its turn (see modalSlot.ts).

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Keyboard, Modal, Platform, Pressable, ScrollView, useColorScheme, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { scheduleOnRN } from 'react-native-worklets';

import { Close } from './icons';
import { releaseSlot, requestSlot } from './modalSlot';
import { useInsets } from './Screen';
import { EDGE, SurfaceContext, paletteFor, radius } from './tokens';

export function Sheet({
  visible,
  onClose,
  children,
  maxHeight = 648,
  label,
  fit,
  gap = 12,
  maxContent = 512,
  topGap = 16,
  avoidKeyboard,
  closeButton,
}: {
  /** A 44pt × in the top-right corner (sheets that don't have their own close). */
  closeButton?: boolean;
  /** Slide up so the keyboard never covers the sheet (sheets with a text box). */
  avoidKeyboard?: boolean;
  /** Space left above a full-height sheet. */
  topGap?: number;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number;
  /** What VoiceOver calls the sheet. */
  label: string;
  /** Size to the content instead of a fixed height. */
  fit?: boolean;
  /** Space between the grabber and the content. */
  gap?: number;
  /** iPad: the content sits in a centred column this wide. */
  maxContent?: number;
}) {
  const dark = useColorScheme() === 'dark';
  const p = paletteFor('cream', dark);
  const reduce = useReducedMotion();
  const insets = useInsets();
  const { height: winH, width: winW } = useWindowDimensions();
  const height = Math.min(maxHeight, winH - insets.top - topGap);
  const tablet = Math.min(winW, winH) >= 600;
  const side = tablet ? Math.max(EDGE, Math.round((winW - maxContent) / 2)) : EDGE;
  const [mounted, setMounted] = useState(false);
  const t = useSharedValue(0);
  const kb = useSharedValue(0);
  const sheetH = useSharedValue(0);
  const shown = visible && mounted;

  const holding = useRef(false);
  const letGo = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;
    releaseSlot();
  }, []);

  // Mount once it's this sheet's turn on screen.
  useEffect(() => {
    if (!visible || mounted) return;
    return requestSlot(() => {
      holding.current = true;
      setMounted(true);
    });
  }, [visible, mounted]);

  // Hand the screen to the next sheet only after this one is fully gone
  // (or if the whole screen goes away with it open).
  const closed = useCallback(() => {
    setMounted(false);
    letGo();
  }, [letGo]);
  useEffect(() => letGo, [letGo]);

  useEffect(() => {
    if (!mounted) return;
    if (shown) {
      t.set(withTiming(1, { duration: reduce ? 150 : 320, easing: Easing.out(Easing.cubic) }));
    } else {
      Keyboard.dismiss();
      t.set(
        withTiming(0, { duration: reduce ? 120 : 220, easing: Easing.in(Easing.cubic) }, (done) => {
          if (done) scheduleOnRN(closed);
        }),
      );
    }
  }, [shown, mounted, reduce, t, closed]);

  useEffect(() => {
    if (!avoidKeyboard || !mounted) return;
    const ios = Platform.OS === 'ios';
    const up = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
      kb.set(withTiming(e.endCoordinates.height, { duration: e.duration || 250, easing: Easing.out(Easing.cubic) }));
    });
    const down = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', (e) => {
      kb.set(withTiming(0, { duration: e.duration || 250, easing: Easing.out(Easing.cubic) }));
    });
    return () => {
      up.remove();
      down.remove();
      kb.set(0);
    };
  }, [avoidKeyboard, mounted, kb]);

  // Drag the grabber down to close: past a third of the way, or a quick flick.
  const drag = useSharedValue(0);
  const pan = Gesture.Pan()
    .activeOffsetY(6)
    .onUpdate((e) => {
      drag.set(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (e.translationY > Math.min(160, sheetH.get() / 3) || e.velocityY > 900) scheduleOnRN(onClose);
      else drag.set(withSpring(0, { damping: 22, stiffness: 260 }));
    });
  useEffect(() => {
    if (shown) drag.set(0);
  }, [shown, drag]);

  const topRoom = insets.top + 8;
  const bottomInset = insets.bottom;
  const scrim = useAnimatedStyle(() => ({ opacity: t.get() }));
  const sheet = useAnimatedStyle(() => {
    // Lift above the keyboard, but never past the top of the screen.
    const room = Math.max(0, winH - topRoom - sheetH.get());
    const lift = Math.min(Math.max(0, kb.get() - bottomInset), room);
    return reduce
      ? { opacity: t.get(), transform: [{ translateY: drag.get() - lift }] }
      : { transform: [{ translateY: (1 - t.get()) * (winH + 40) + drag.get() - lift }] };
  });

  if (!mounted) return null;
  return (
    <Modal transparent visible statusBarTranslucent onRequestClose={onClose} animationType="none">
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SurfaceContext.Provider value="cream">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: p.scrim }, scrim]}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" style={{ flex: 1 }} onPress={onClose} />
          </Animated.View>
          <Animated.View
            accessibilityViewIsModal
            accessibilityLabel={label}
            onAccessibilityEscape={onClose}
            onLayout={(e) => sheetH.set(e.nativeEvent.layout.height)}
            style={[
              {
                ...(fit ? { maxHeight: winH - insets.top - 16 } : { height }),
                backgroundColor: p.sheet,
                borderTopLeftRadius: radius.sheet,
                borderTopRightRadius: radius.sheet,
                paddingTop: 8,
                paddingHorizontal: side,
                paddingBottom: fit || gap === 0 ? insets.bottom + 16 : Math.max(insets.bottom, 16),
              },
              sheet,
            ]}
          >
            {/* The grabber strip: drag it down to close. */}
            <GestureDetector gesture={pan}>
              <View style={{ height: 24, marginTop: -8, marginHorizontal: -side, marginBottom: Math.max(0, gap - 11), alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: p.grabber }} />
              </View>
            </GestureDetector>
            {fit ? (
              // Taller than the screen (SE, big text sizes): scroll instead of cutting off.
              <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ flexGrow: 0 }}>
                {children}
              </ScrollView>
            ) : (
              children
            )}
            {closeButton ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={6}
                style={({ pressed }) => ({ position: 'absolute', top: 6, right: side - 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
              >
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.dark ? '#2A2722' : 'rgba(22,20,15,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                  <Close color={p.fg} size={12} />
                </View>
              </Pressable>
            ) : null}
          </Animated.View>
        </View>
      </SurfaceContext.Provider>
      </GestureHandlerRootView>
    </Modal>
  );
}
