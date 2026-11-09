// 1 · Welcome (Kiwi structure: glow, floating 3D objects, mascot, big title, one button)

import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Btn, C, Display, E, Float, Glow, Raccoon, Rise, Screen, Small } from '@/ui/kit';
import type { Emoji } from '@/ui/emoji';

const RING: { e: Emoji; x: number; y: number; s: number }[] = [
  { e: 'tv', x: 4, y: 44, s: 64 },
  { e: 'music', x: 252, y: 22, s: 60 },
  { e: 'card', x: 258, y: 196, s: 66 },
  { e: 'popcorn', x: 0, y: 212, s: 58 },
  { e: 'cloud', x: 128, y: -14, s: 50 },
];

export default function Welcome() {
  return (
    <Screen scroll={false} footer={<Btn label="Get started" onPress={() => router.push('/onboarding/tick')} />}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <View style={{ width: 330, height: 300, alignItems: 'center', justifyContent: 'center' }}>
          <Glow color={C.kiwi} size={320} opacity={0.2} />
          {RING.map((r, k) => (
            <Float key={r.e} amp={5 + k} style={{ position: 'absolute', left: r.x, top: r.y }}>
              <E name={r.e} size={r.s} />
            </Float>
          ))}
          <Raccoon size={150} pose="talk" />
        </View>
        <Rise i={1} style={{ alignItems: 'center', gap: 10 }}>
          <Display center style={{ fontSize: 34, lineHeight: 40 }}>
            Ditch it before{'\n'}it <Text style={{ color: C.kiwi }}>renews</Text>
          </Display>
          <Small center style={{ fontSize: 16, lineHeight: 23, paddingHorizontal: 16 }}>
            See everything you pay for, get a heads-up before each charge, and drop what you don&apos;t use.
          </Small>
        </Rise>
      </View>
    </Screen>
  );
}
