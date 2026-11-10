// One tile for every logo: 22.5% corners and an inset 0.5pt hairline,
// so white logos (ChatGPT, YouTube) keep a clean edge. Decorative: the
// row next to it names the service.

import { Image } from 'expo-image';
import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { LOGOS } from '@/catalog/logos';
import { SERVICE_BY_ID } from '@/catalog/services';

import { brand, tileRadius, usePalette } from './tokens';
import { F } from './type';

import { DUCK_H, DUCK_INK, DUCK_LIGHT, DUCK_W } from './duckAsset';

const continuous = Platform.OS === 'ios' ? ({ borderCurve: 'continuous' } as const) : null;

function Hairline({ size }: { size: number }) {
  const p = usePalette();
  return (
    <View
      pointerEvents="none"
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: tileRadius(size), borderWidth: 0.5, borderColor: p.logoHair },
        continuous,
      ]}
    />
  );
}

export function LogoTile({
  id,
  size = 40,
  color,
  mono,
  ink,
  style,
}: {
  id: string;
  size?: number;
  color?: string;
  mono?: string;
  ink?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const src = LOGOS[id];
  const svc = SERVICE_BY_ID[id];
  const r = tileRadius(size);
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size, borderRadius: r, overflow: 'hidden', backgroundColor: src ? '#FFFFFF' : (color ?? svc?.color ?? '#6B6559') }, continuous, style]}
    >
      {src ? (
        <Image source={src} style={{ width: size, height: size }} contentFit="cover" transition={0} />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: F.wideHeavy, fontSize: size * 0.4, color: ink ?? svc?.ink ?? '#FFFFFF' }} maxFontSizeMultiplier={1}>
            {mono ?? svc?.mono ?? '?'}
          </Text>
        </View>
      )}
      <Hairline size={size} />
    </View>
  );
}

/** The Ditch app icon: sunflower tile, the duck centred and resting on the bottom edge. */
export function DuckIcon({ size = 38, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  // The file has air around the head; size it so the duck fills ~86% of the tile.
  const w = Math.round((size * 0.86) / DUCK_INK);
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size, borderRadius: tileRadius(size), overflow: 'hidden', backgroundColor: brand.sunflower }, continuous, style]}
    >
      <Image
        source={DUCK_LIGHT}
        style={{ position: 'absolute', width: w, height: (w * DUCK_H) / DUCK_W, left: Math.round((size - w) / 2), bottom: 0 }}
        contentFit="contain"
        transition={0}
      />
      <View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: tileRadius(size), borderWidth: 0.5, borderColor: 'rgba(22,20,15,0.18)' }, continuous]}
      />
    </View>
  );
}
