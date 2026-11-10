// Small state marks: the round tick, the plan radio, and the bell toggle.
// They are visual only; the row or card around them is the control.

import { useEffect, useRef } from 'react';
import { Switch, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Bell, Check } from './icons';
import { brand, usePalette } from './tokens';

export function Tick({ on, size = 28 }: { on: boolean; size?: number }) {
  const p = usePalette();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: on ? (p.dark ? brand.sunflower : brand.ink) : 'transparent',
        borderWidth: on ? 0 : 2,
        borderColor: p.tickBorder,
      }}
    >
      {on ? <Check color={p.dark ? brand.ink : brand.sunflower} size={15} /> : null}
    </View>
  );
}

export function Radio({ on }: { on: boolean }) {
  const p = usePalette();
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: on ? p.accent : 'transparent',
        borderWidth: on ? 0 : 2,
        borderColor: p.radioBorder,
      }}
    >
      {on ? <Check color={p.accentFg} size={13} /> : null}
    </View>
  );
}

/** 44pt bell: sunflower and filled when on. Pops a little when it changes. */
export function BellMark({ on }: { on: boolean }) {
  const p = usePalette();
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    s.set(withSequence(withTiming(1.12, { duration: 90 }), withSpring(1, { damping: 12, stiffness: 260 })));
  }, [on, reduce, s]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <Animated.View
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? brand.sunflower : 'transparent',
          borderWidth: on ? 2 : 1.5,
          borderColor: on ? brand.ink : p.guessBorder,
        },
        anim,
      ]}
    >
      <Bell color={on ? brand.ink : p.disabledFg} size={19} fill={on ? brand.ink : undefined} />
    </Animated.View>
  );
}

/** iOS switch in Sunflower colours: ink when on (sunflower in dark). */
export function SunSwitch({ value, onValueChange, label, hint, disabled }: { value: boolean; onValueChange: (v: boolean) => void; label: string; hint?: string; disabled?: boolean }) {
  const p = usePalette();
  const on = p.dark ? brand.sunflower : brand.ink;
  return (
    <Switch
      accessibilityLabel={label}
      accessibilityHint={hint}
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
      trackColor={{ true: on, false: p.track }}
      thumbColor={brand.white}
      ios_backgroundColor={p.track}
      {...({ activeThumbColor: brand.white, activeTrackColor: on } as object)}
    />
  );
}
