// A soft fade where a scrolling list meets the tab bar, so a half-hidden row
// dissolves instead of looking cut off (most visible on short screens like
// the folded iPhone Duo and the SE).

import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { usePalette } from './tokens';

export function BottomFade({ height = 28 }: { height?: number }) {
  const p = usePalette();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height }}>
      <LinearGradient colors={[p.bg + '00', p.bg]} style={{ flex: 1 }} />
    </View>
  );
}
