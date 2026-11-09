import { View } from 'react-native';

import { Screen, T } from '@/components/ui';
import { space } from '@/theme/tokens';

export default function Placeholder() {
  return (
    <Screen edges={['top']}>
      <View style={{ padding: space.xl }}>
        <T v="largeTitle">Subs</T>
        <T v="body" tone="secondary">Coming after the Home design.</T>
      </View>
    </Screen>
  );
}
