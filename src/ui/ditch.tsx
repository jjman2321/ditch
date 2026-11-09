// Ditch-specific pieces on top of the Kiwi kit: app-icon logos, the flow
// header (back + segmented bar), and the running-total footer line.

import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { LOGOS } from '@/catalog/logos';
import { Bar, C, F, IconBtn, Row } from './kit';

/** The service's real App Store icon; a clean monogram tile when we don't have one. */
export function AppLogo({ id, color, ink = '#FFFFFF', mono, size = 44 }: { id: string; color: string; ink?: string; mono: string; size?: number }) {
  const src = LOGOS[id];
  const r = size * 0.225; // iOS icon corner
  if (src) {
    return (
      <Image
        source={src}
        style={{ width: size, height: size, borderRadius: r, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' }}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text allowFontScaling={false} style={{ color: ink, fontFamily: F.display, fontSize: mono.length > 1 ? size * 0.34 : size * 0.46 }}>
        {mono}
      </Text>
    </View>
  );
}

/** Kiwi-style flow header: back arrow + 3 segments (You → Your dates → Your plan). */
export function FlowHeader({ section, fill, right }: { section: 0 | 1 | 2; fill: number; right?: React.ReactNode }) {
  return (
    <Row gap={6}>
      <IconBtn name="back" label="Back" onPress={() => router.canGoBack() && router.back()} color={C.ink2} />
      <Row gap={6} style={{ flex: 1, marginRight: right ? 4 : 12 }}>
        {[0, 1, 2].map((k) => (
          <View key={k} style={{ flex: 1 }}>
            <Bar value={k < section ? 1 : k === section ? Math.max(0.12, Math.min(1, fill)) : 0} h={8} color={C.kiwi} />
          </View>
        ))}
      </Row>
      {right}
    </Row>
  );
}
