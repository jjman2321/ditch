// One subscription on Home: logo, name, date, bell, price.
// Tap to edit. Hold to ditch (design/v10/MOTION.md §2): after 150 ms the row
// lifts, a ring fills around the logo over 1.2 s with selection ticks at
// 25/50/75%, and "Keep holding to ditch. Let go to keep it." appears.
// Letting go early drains the ring and nothing changes. No haptic at 100%:
// the stamp's heavy impact on the next screen is the completion haptic.

import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GestureDetector, useExclusiveGestures, useLongPressGesture, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { daysBetween, weekdayDate, type DateOnly } from '@/domain/dates';
import { yearlyMinor } from '@/domain/money';
import { inTrial, isGuess, isPending, isPricedSub, isProTrial, type Sub } from '@/domain/subs';
import { useAppMoney } from '@/state/app';
import { Bell, BellOff, DitchedTag, DuckIcon, F, GuessTag, LogoTile, ProLockup, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

const HOLD_MS = 1200;
const LIFT_AFTER = 150;
const TILE = 36;
const RING_R = 24.5;
const RING_BOX = 56;
const CIRC = 2 * Math.PI * RING_R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type BellState = 'on' | 'off' | 'blocked';

function relative(charge: DateOnly, today: DateOnly): string {
  const n = daysBetween(today, charge);
  return n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;
}

/** The grey line under the name. */
export function rowLine(sub: Sub, charge: DateOnly, today: DateOnly): string {
  if (isPending(sub)) return `Cancel by ${weekdayDate(charge)}`;
  if (isProTrial(sub)) return `${weekdayDate(charge)} · trial ends`;
  if (inTrial(sub, today)) return `Trial ends ${weekdayDate(charge)}`;
  if (isGuess(sub)) return weekdayDate(charge);
  return `${weekdayDate(charge)} · ${relative(charge, today)}`;
}

export function SubLogo({ sub, size = TILE }: { sub: Sub; size?: number }) {
  return isProTrial(sub) ? <DuckIcon size={size} /> : <LogoTile id={sub.catalogId ?? sub.id} size={size} mono={sub.catalogId ? undefined : sub.name.slice(0, 1).toUpperCase()} color={sub.catalogId ? undefined : '#6B6559'} />;
}

export function SubRow({
  sub,
  charge,
  today,
  bell,
  holding,
  dimmed,
  onHoldStart,
  onHoldEnd,
  onDitch,
  onOpen,
}: {
  sub: Sub;
  charge: DateOnly;
  today: DateOnly;
  bell: BellState;
  holding: boolean;
  dimmed: boolean;
  onHoldStart: (id: string) => void;
  onHoldEnd: () => void;
  onDitch: (id: string) => void;
  onOpen: (sub: Sub) => void;
}) {
  const p = usePalette();
  const money = useAppMoney();
  const reduce = useReducedMotion();
  const pending = isPending(sub);
  const canHold = !pending;

  const progress = useSharedValue(0);
  const lift = useSharedValue(0);
  const dim = useSharedValue(dimmed ? 1 : 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const done = useRef(false);

  useEffect(() => {
    dim.set(withTiming(dimmed ? 1 : 0, { duration: 200 }));
  }, [dimmed, dim]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const complete = () => {
    if (done.current) return;
    done.current = true;
    clearTimers();
    onDitch(sub.id);
  };

  const start = () => {
    done.current = false;
    onHoldStart(sub.id);
    if (!reduce) lift.set(withSpring(1, { damping: 20, stiffness: 220 }));
    progress.set(
      withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(complete);
      }),
    );
    // Selection ticks at 25%, 50% and 75%. Nothing at 100%.
    timers.current = [0.25, 0.5, 0.75].map((f) => setTimeout(haptic.select, HOLD_MS * f));
  };

  const stop = () => {
    clearTimers();
    if (done.current) {
      // Ditched: settle quietly behind the next screen.
      progress.set(0);
      lift.set(0);
      onHoldEnd();
      return;
    }
    progress.set(withTiming(0, { duration: 250 }));
    lift.set(withTiming(0, { duration: 200 }));
    onHoldEnd();
  };

  const longPress = useLongPressGesture({
    minDuration: LIFT_AFTER,
    maxDistance: 12,
    enabled: canHold,
    runOnJS: true,
    onActivate: start,
    onFinalize: () => stop(),
  });
  const tap = useTapGesture({ runOnJS: true, onActivate: () => onOpen(sub) });
  const gesture = useExclusiveGestures(longPress, tap);

  const ringProps = useAnimatedProps(() => {
    // Reduce Motion: a stepped 4-segment fill instead of a smooth sweep.
    const v = reduce ? Math.floor(progress.get() * 4 + 0.0001) / 4 : progress.get();
    return { strokeDashoffset: CIRC * (1 - v) };
  });
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.02 * lift.get() }],
    opacity: 1 - 0.45 * dim.get(),
  }));
  const fill = useAnimatedStyle(() =>
    p.dark
      ? { borderColor: interpolateColor(lift.get(), [0, 1], ['rgba(255,204,46,0)', brand.sunflower]) }
      : { backgroundColor: interpolateColor(lift.get(), [0, 1], ['rgba(255,204,46,0)', brand.sunflower]) },
  );

  const price = isPricedSub(sub) ? money(sub.amountMinor, sub.currency) : null;
  const yearly = isPricedSub(sub) ? money(yearlyMinor(sub.amountMinor, sub.cycle), sub.currency) : null;
  const line = rowLine(sub, charge, today);
  const on = holding && !p.dark;
  const fg = on ? brand.ink : p.cardFg;
  const sub2 = on ? '#4B4220' : p.mute;
  const label = `${isProTrial(sub) ? 'Ditch Pro trial' : sub.name}, ${price ?? 'no price yet'}, ${line}${isGuess(sub) && !pending ? ', date is a guess' : ''}${pending ? ', ditched, not cancelled yet' : ''}, reminders ${bell === 'on' ? 'on' : 'off'}`;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={canHold ? 'Opens it. Hold to ditch it.' : 'Opens the cancel check.'}
        accessibilityActions={canHold ? [{ name: 'activate' }, { name: 'ditch', label: 'Ditch it' }] : [{ name: 'activate' }]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'ditch' ? onDitch(sub.id) : onOpen(sub))}
        style={[
          { borderRadius: 20, zIndex: holding ? 2 : 0, borderWidth: p.dark ? 1.5 : 0, borderColor: 'transparent' },
          holding && !p.dark ? { shadowColor: '#463200', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 } : null,
          fill,
          rowStyle,
        ]}
      >
        <View style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 14, paddingRight: 14, paddingVertical: 7 }}>
          <View style={{ width: TILE, height: TILE, alignItems: 'center', justifyContent: 'center' }}>
            <SubLogo sub={sub} />
            {holding ? (
              <Svg width={RING_BOX} height={RING_BOX} style={{ position: 'absolute', left: (TILE - RING_BOX) / 2, top: (TILE - RING_BOX) / 2 }}>
                <Circle cx={RING_BOX / 2} cy={RING_BOX / 2} r={RING_R} stroke={p.dark ? 'rgba(246,240,227,0.18)' : 'rgba(22,20,15,0.15)'} strokeWidth={3} fill="none" />
                <AnimatedCircle
                  cx={RING_BOX / 2}
                  cy={RING_BOX / 2}
                  r={RING_R}
                  stroke={p.dark ? brand.sunflower : brand.ink}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${CIRC} ${CIRC}`}
                  animatedProps={ringProps}
                  transform={`rotate(-90 ${RING_BOX / 2} ${RING_BOX / 2})`}
                />
              </Svg>
            ) : null}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {isProTrial(sub) ? (
                <ProLockup size={16} suffix="trial" color={fg} />
              ) : (
                <Txt v="bodyStrong" color={fg} numberOfLines={1} style={{ fontSize: 17, lineHeight: 21, flexShrink: 1 }}>
                  {sub.name}
                </Txt>
              )}
              {pending ? <DitchedTag /> : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <Txt v="body" color={sub2} num numberOfLines={1} style={{ fontSize: 14.5, lineHeight: 19, flexShrink: 1 }}>
                {line}
              </Txt>
              {isGuess(sub) && !pending ? <GuessTag /> : null}
            </View>
          </View>
          <View style={{ width: 20, alignItems: 'center' }} importantForAccessibility="no-hide-descendants">
            {bell === 'blocked' || pending ? (
              <BellOff color={p.disabledFg} size={19} />
            ) : (
              <Bell color={bell === 'on' ? (on ? brand.ink : p.dark ? brand.sunflower : brand.ink) : p.disabledFg} size={19} fill={bell === 'on' ? (on ? brand.ink : brand.sunflower) : undefined} />
            )}
          </View>
          <Txt v="moneyM" num color={price ? fg : p.mute} style={{ minWidth: 62, textAlign: 'right', fontSize: price ? 17.5 : 13 }}>
            {price ?? 'Add price'}
          </Txt>
        </View>
        {holding ? (
          <View style={{ marginHorizontal: 12, marginBottom: 12, marginTop: -2, borderRadius: 14, padding: 12, paddingHorizontal: 14, backgroundColor: p.dark ? '#2A2722' : 'rgba(255,255,255,0.78)' }}>
            <Txt v="body" color={p.dark ? p.fg : brand.ink} style={{ fontSize: 15, lineHeight: 20 }}>
              <Txt v="body" color={p.dark ? brand.sunflower : brand.ink} style={{ fontFamily: F.bold, fontSize: 15 }}>
                Keep holding to ditch.
              </Txt>{' '}
              Let go to keep it.
              {yearly ? (
                <>
                  {'\n'}Saves{' '}
                  <Txt v="body" color={p.dark ? p.fg : brand.ink} num style={{ fontFamily: F.bold, fontSize: 15 }}>
                    {yearly} a year
                  </Txt>{' '}
                  once you cancel.
                </>
              ) : null}
            </Txt>
          </View>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}
