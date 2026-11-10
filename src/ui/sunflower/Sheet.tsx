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
  fit,
  gap = 12,
  maxContent = 512,
  topGap = 16,
}: {
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
    reduce ? { opacity: t.get() } : { transform: [{ translateY: (1 - t.get()) * (winH + 40) }] },
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
            <View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: p.grabber, alignSelf: 'center', marginBottom: gap }} />
            {children}
          </Animated.View>
        </View>
      </SurfaceContext.Provider>
    </Modal>
  );
}
