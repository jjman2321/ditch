// 1 · Welcome

import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Btn, Mascot, Screen } from '@/components/kit';
import { ink, text } from '@/theme/brand';

export default function Welcome() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Mascot pose="flick" size={290} />
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ gap: 10 }}>
          <Text style={[text.display, styles.center]} accessibilityRole="header">
            Ditch it before{'\n'}it renews.
          </Text>
          <Text style={[text.body, styles.center]}>I&apos;ll add up what you pay and warn you before each charge. You decide what to ditch.</Text>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.footer}>
        <Btn label="Let's see what I pay" onPress={() => router.push('/onboarding/tick')} />
        <Text style={[text.small, styles.center]}>Free. No account. Your list stays on your phone.</Text>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 8 },
  center: { textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 8, gap: 14, borderTopWidth: 2, borderTopColor: ink.line, paddingTop: 16 },
});
