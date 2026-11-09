// Bottom sheet: dims the screen, slides up, closes on a tap outside, the
// back gesture or the VoiceOver escape (two-finger scrub).
// Reduce Motion: a quick fade instead of the slide.

import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, useColorScheme, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { scheduleOnRN } from 'react-native-worklets';

import { useInsets } from './Screen';
import { EDGE, SurfaceContext, paletteFor, radius } from './tokens';

export function Sheet({
  visible,
  onClose,
  children,
  maxHeight = 648,
  label,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number;
  /** What VoiceOver calls the sheet. */
  label: string;
}) {
  const dark = useColorScheme() === 'dark';
  const p = paletteFor('cream', dark);
  const reduce = useReducedMotion();
  const insets = useInsets();
  const { height: winH } = useWindowDimensions();
  const height = Math.min(maxHeight, winH - insets.top - 16);
  const [mounted, setMounted] = useState(visible);
  const t = useSharedValue(0);
  // Mount as soon as it opens; unmount only after the close animation.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      t.set(withTiming(1, { duration: reduce ? 150 : 320, easing: Easing.out(Easing.cubic) }));
    } else {
      t.set(
        withTiming(0, { duration: reduce ? 120 : 220, easing: Easing.in(Easing.cubic) }, (done) => {
          if (done) scheduleOnRN(setMounted, false);
        }),
      );
    }
  }, [visible, reduce, t]);

  const scrim = useAnimatedStyle(() => ({ opacity: t.get() }));
  const sheet = useAnimatedStyle(() =>
    reduce ? { opacity: t.get() } : { transform: [{ translateY: (1 - t.get()) * (height + 40) }] },
  );

  if (!mounted) return null;
  return (
    <Modal transparent visible statusBarTranslucent onRequestClose={onClose} animationType="none">
      <SurfaceContext.Provider value="cream">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: p.scrim }, scrim]}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" style={{ flex: 1 }} onPress={onClose} />
          </Animated.View>
          <Animated.View
            accessibilityViewIsModal
            accessibilityLabel={label}
            onAccessibilityEscape={onClose}
            style={[
              {
                height,
                backgroundColor: p.sheet,
                borderTopLeftRadius: radius.sheet,
                borderTopRightRadius: radius.sheet,
                paddingTop: 8,
                paddingHorizontal: EDGE,
                paddingBottom: Math.max(insets.bottom, 16),
              },
              sheet,
            ]}
          >
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: p.grabber, alignSelf: 'center', marginBottom: 12 }} />
            {children}
          </Animated.View>
        </View>
      </SurfaceContext.Provider>
    </Modal>
  );
}
