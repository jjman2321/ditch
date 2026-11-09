// Onboarding progress: a back chevron and five segments.

import { router } from 'expo-router';
import { View } from 'react-native';

import { IconButton } from './Button';
import { ChevronLeft } from './icons';
import { usePalette } from './tokens';

export function ProgressBar({ step, of = 5 }: { step: number; of?: number }) {
  const p = usePalette();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${step} of ${of}`}
      accessibilityValue={{ min: 0, max: of, now: step }}
      style={{ flex: 1, flexDirection: 'row', gap: 5 }}
    >
      {Array.from({ length: of }, (_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? p.fg : p.track }} />
      ))}
    </View>
  );
}

export function StepHeader({ step, of = 5, onBack }: { step: number; of?: number; onBack?: () => void }) {
  const p = usePalette();
  return (
    <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton label="Back" onPress={onBack ?? (() => (router.canGoBack() ? router.back() : undefined))} style={{ marginLeft: -12 }}>
        <ChevronLeft color={p.fg} />
      </IconButton>
      <ProgressBar step={step} of={of} />
    </View>
  );
}
