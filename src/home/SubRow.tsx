// One subscription on Home: logo, name, date, bell, price.
// Tap to edit. Hold to ditch (design/v10/MOTION.md §2): after 150 ms the row
// lifts, a ring fills around the logo over 1.2 s with selection ticks at
// 25/50/75%, and "Keep holding to ditch. Let go to keep it." appears.
// Letting go early drains the ring and nothing changes. No haptic at 100%:
// the stamp's heavy impact on the next screen is the completion haptic.

import { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
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
import { CYCLE_SHORT, CYCLE_WORDS, yearlyMinor } from '@/domain/money';
import { inTrial, isPending, isPricedSub, isProTrial, type Sub } from '@/domain/subs';
import { useAppMoney } from '@/state/app';
import { Bell, BellOff, DitchedTag, DuckIcon, F, LogoTile, ProLockup, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

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

/** The grey line under the name. No date yet: "Add date" (DECISIONS #33). */
export function rowLine(sub: Sub, charge: DateOnly | null, today: DateOnly, narrow = false): string {
  if (!charge) return isPending(sub) ? 'Cancel before it renews' : 'Add date';
  if (isPending(sub)) return `Cancel by ${weekdayDate(charge)}`;
  if (isProTrial(sub)) return `${weekdayDate(charge)} · trial ends`;
  if (inTrial(sub, today)) return `Trial ends ${weekdayDate(charge)}`;
  // "in N days" only for the coming week (further out the date says it). Narrow iPhones
  // (SE, mini) keep it for today and tomorrow only, so the line never gets cut off.
  const n = daysBetween(today, charge);
  return n <= (narrow ? 1 : 6) ? `${weekdayDate(charge)} · ${relative(charge, today)}` : weekdayDate(charge);
}

export function SubLogo({ sub, size = TILE }: { sub: Sub; size?: number }) {
  return isProTrial(sub) ? <DuckIcon size={size} /> : <LogoTile id={sub.catalogId ?? sub.id} size={size} mono={sub.catalogId ? undefined : sub.name.slice(0, 1).toUpperCase()} color={sub.catalogId ? undefined : '#6B6559'} />;
}

/**
 * Invisible copy of the longest price on Home, drawn exactly like a row's
 * price, so every row can use its width and the bells line up.
 */
export function PriceColumnMeasure({ prices, onWidth }: { prices: (string | null)[]; onWidth: (w: number) => void }) {
  const longest = prices.reduce<string>((a, b) => (b && b.length > a.length ? b : a), '');
  if (!longest) return null;
  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', opacity: 0, left: 0, top: 0, width: 1000, flexDirection: 'row' }}>
      <Txt v="moneyM" num style={{ fontSize: 17.5 }} onLayout={(e) => onWidth(Math.ceil(e.nativeEvent.layout.width) + 2)}>
        {longest}
      </Txt>
    </View>
  );
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
  priceWidth,
}: {
  /** Same for every row on Home, so the bells and prices line up. */
  priceWidth?: number;
  sub: Sub;
  /** Null: no date yet. */
  charge: DateOnly | null;
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
  // A flick to scroll must never count as a tap (it would open the editor).
  const tap = useTapGesture({ runOnJS: true, maxDistance: 10, onActivate: () => onOpen(sub) });
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
  const narrow = useWindowDimensions().width < 380;
  const line = rowLine(sub, charge, today, narrow);
  const per = sub.cycle === 'monthly' ? '' : CYCLE_SHORT[sub.cycle];
  const on = holding && !p.dark;
  const fg = on ? brand.ink : p.cardFg;
  const sub2 = on ? '#4B4220' : p.mute;
  const label = `${isProTrial(sub) ? 'Ditch Pro trial' : sub.name}, ${price ? `${price} ${CYCLE_WORDS[sub.cycle]}` : 'no price yet'}, ${charge ? line : 'no date yet, add date'}${pending ? ', ditched, not cancelled yet' : ''}, reminders ${bell === 'on' ? 'on' : 'off'}`;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={canHold ? 'Opens it. The actions menu has Ditch it.' : 'Opens the cancel check.'}
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
              <Txt
                v="body"
                color={charge || pending ? sub2 : fg}
                num
                numberOfLines={1}
                style={[{ fontSize: 14.5, lineHeight: 19, flexShrink: 1 }, !charge && !pending ? { fontFamily: F.semi, textDecorationLine: 'underline' } : null]}
              >
                {line}
              </Txt>
            </View>
          </View>
          <View style={{ width: 20, alignItems: 'center' }} importantForAccessibility="no-hide-descendants">
            {bell === 'blocked' || pending ? (
              <BellOff color={p.disabledFg} size={19} />
            ) : (
              <Bell color={bell === 'on' ? (on ? brand.ink : p.dark ? brand.sunflower : brand.ink) : p.disabledFg} size={19} fill={bell === 'on' ? (on ? brand.ink : brand.sunflower) : undefined} />
            )}
          </View>
          <Txt v="moneyM" num color={price ? fg : p.mute} style={[{ minWidth: 62, textAlign: 'right', fontSize: price ? 17.5 : 13 }, priceWidth ? { width: Math.max(62, priceWidth) } : null]}>
            {price ?? 'Add price'}
            {/* Not monthly? Say so, or $139 a year looks like $139 a month. */}
            {price && per ? (
              <Txt v="sub" num color={sub2} style={{ fontSize: 12 }}>
                {per}
              </Txt>
            ) : null}
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
                  {'\n'}
                  <Txt v="body" color={p.dark ? p.fg : brand.ink} num style={{ fontFamily: F.bold, fontSize: 15 }}>
                    {yearly} a year
                  </Txt>{' '}
                  you won’t pay once you cancel.
                </>
              ) : null}
            </Txt>
          </View>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}
