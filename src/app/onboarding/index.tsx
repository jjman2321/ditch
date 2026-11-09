// 1 · Welcome

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FlickScene } from '@/components/onboarding';
import { Button, Screen, T } from '@/components/ui';
import { space } from '@/theme/tokens';

export default function Welcome() {
  return (
    <Screen>
      <View style={styles.body}>
        <View style={styles.heroArea}>
          {/* The raccoon joins this scene once its design is approved. */}
          <FlickScene />
        </View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.copy}>
          <T v="largeTitle" accessibilityRole="header">
            Ditch it before it renews.
          </T>
          <T v="body" tone="secondary">
            Track every subscription, get a heads-up before each charge, and cancel what you don&apos;t use.
          </T>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.footer}>
        <Button label="Get started" onPress={() => router.push('/onboarding/tick')} />
        <T v="footnote" tone="tertiary" style={styles.fine}>
          Free. No account. Your list stays on your phone.
        </T>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: space.xl, justifyContent: 'center' },
  heroArea: { flexGrow: 1, justifyContent: 'center', minHeight: 260 },
  copy: { gap: space.md, paddingBottom: space.xl },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.md, gap: space.md },
  fine: { textAlign: 'center' },
});
