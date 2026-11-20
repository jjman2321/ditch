// One subscription on Home: logo, name, date, bell, price.
// Tap to edit. Hold to ditch (design/v10/MOTION.md §2): after 150 ms the row
// lifts, a ring fills around the logo over 1.2 s with selection ticks at
// 25/50/75%, and "Keep holding to ditch. Let go to keep it." appears.
// Letting go early drains the ring and nothing changes. No haptic at 100%:
// the stamp's heavy impact on the next screen is the completion haptic.

import { memo, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { GestureDetector, useExclusiveGestures, useLongPressGesture, useTapGesture } from 'react-native-gesture-handler';
import Animated, { Easing, interpolateColor, ReduceMotion, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { daysBetween, shortDate, weekdayDate, type DateOnly } from '@/domain/dates';
import { CYCLE_SHORT, CYCLE_WORDS, currencyDigits, yearlyMinor } from '@/domain/money';
import { inTrial, isPending, isPricedSub, isProTrial, type Sub } from '@/domain/subs';
import { useAppMoney } from '@/state/app';
import { Bell, BellOff, DitchedTag, DuckIcon, F, LogoTile, ProLockup, Txt, brand, haptic, tileRadius, usePalette } from '@/ui/sunflower';

const HOLD_MS = 1200;
const LIFT_AFTER = 150;
const TILE = 36;
const RING_R = 23.5;
const RING_BOX = 52;
const CIRC = 2 * Math.PI * RING_R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type BellState = 'on' | 'off' | 'blocked';

function relative(charge: DateOnly, today: DateOnly): string {
  const n = daysBetween(today, charge);
  return n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;
}

/**
 * A row's price. 1,000 or more (in the currency's own units) drops the cents: "$14,985" instead of "$14,985.00",
 * so one big price doesn't widen the shared price column and cut every row's date line.
 * Home should measure its price column with this too.
 */
export function rowPrice(sub: Sub, money: (amountMinor: number, currency: string, opts?: { whole?: boolean }) => string): string | null {
  if (!isPricedSub(sub)) return null;
  const big = sub.amountMinor / 10 ** currencyDigits(sub.currency) >= 1000;
  return money(sub.amountMinor, sub.currency, big ? { whole: true } : undefined);
}

/** The grey line under the name. No date yet: "Add date" (DECISIONS #33). `tiny` (under 350pt): no weekday, "Nov 19 · today". */
export function rowLine(sub: Sub, charge: DateOnly | null, today: DateOnly, narrow = false, tiny = false): string {
  if (!charge) return isPending(sub) ? 'Cancel before it renews' : 'Add date';
  // "Cancel by" only for a date the user chose; otherwise the charge day itself (too late to call it a deadline).
  if (isPending(sub)) return sub.cancelBy && sub.cancelBy >= today ? `Cancel by ${weekdayDate(sub.cancelBy)}` : `Charges ${weekdayDate(charge)}`;
  if (isProTrial(sub)) return `${weekdayDate(charge)} · trial ends`;
  if (inTrial(sub, today)) return `Trial ends ${weekdayDate(charge)}`;
  // "in N days" only for the coming week (further out the date says it). Narrow iPhones
  // (SE, mini) keep it for today and tomorrow only, so the line never gets cut off.
  const n = daysBetween(today, charge);
  const day = tiny ? shortDate(charge) : weekdayDate(charge);
  return n <= (narrow ? 1 : 6) ? `${day} · ${relative(charge, today)}` : day;
}

/**
 * A ditched row's date line, shown after the DITCHED tag, so it's short enough to sit next to it on an SE:
 * "DITCHED Tue, Nov 24" (the charge, like every other row), "DITCHED by Nov 23" (a cancel-by date they set).
 * VoiceOver still hears the full rowLine.
 */
function pendingLine(sub: Sub, charge: DateOnly | null, today: DateOnly, narrow: boolean): string {
  if (sub.cancelBy && sub.cancelBy >= today) return `by ${shortDate(sub.cancelBy)}`;
  if (!charge) return narrow ? 'No date' : 'No date yet';
  return narrow ? shortDate(charge) : weekdayDate(charge);
}

/**
 * The sub's logo. `ditched`: grey at 60% so it reads as gone (owner, Nov 19; Revolut, Ro do the same).
 * iOS doesn't draw a `grayscale` filter by default, so a grey layer with the "saturation" blend takes the colour
 * out instead (works on iOS, Android and web). The name next to it keeps its full contrast.
 */
export function SubLogo({ sub, size = TILE, ditched }: { sub: Sub; size?: number; ditched?: boolean }) {
  const dark = usePalette().dark;
  const tile = isProTrial(sub) ? (
    <DuckIcon size={size} />
  ) : (
    <LogoTile id={sub.catalogId ?? sub.id} size={size} mono={sub.catalogId ? undefined : sub.name.slice(0, 1).toUpperCase()} color={sub.catalogId ? undefined : '#6B6559'} />
  );
  if (!ditched) return tile;
  return (
    // Dark mode: greyed logos at 0.6 nearly vanished on the night card (audit, Nov 20).
    <View style={[{ width: size, height: size, opacity: dark ? 0.85 : 0.6, borderRadius: tileRadius(size), overflow: 'hidden' }, continuous]}>
      {tile}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#808080', mixBlendMode: 'saturation' }} />
    </View>
  );
}

const continuous = Platform.OS === 'ios' ? ({ borderCurve: 'continuous' } as const) : null;

/**
 * Invisible copy of the longest price on Home, drawn exactly like a row's
 * price, so every row can use its width and the bells line up.
 */
export function PriceColumnMeasure({ prices, onWidth }: { prices: (string | null)[]; onWidth: (w: number) => void }) {
  const longest = prices.reduce<string>((a, b) => (b && b.length > a.length ? b : a), '');
  if (!longest) return null;
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ position: 'absolute', opacity: 0, left: 0, top: 0, width: 1000, flexDirection: 'row' }}
    >
      <Txt v="moneyM" num style={{ fontSize: 17.5 }} onLayout={(e) => onWidth(Math.ceil(e.nativeEvent.layout.width) + 2)}>
        {longest}
      </Txt>
    </View>
  );
}

export const SubRow = memo(function SubRow({
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
  onBell,
  priceWidth,
  foundTag,
}: {
  /** "FOUND IN YOUR BANK" for 7 days after the bank added it (DECISIONS #67), or until the row is opened once. */
  foundTag?: boolean;
  /** Free plan: tapping the bell turns this one's reminder on or off (one of the 3). Not set: the bell is just a sign. */
  onBell?: (sub: Sub) => void;
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
  // Low on the screen (bottom 40%), the hint under the row would sit behind the tab bar on an SE: show it above the row instead.
  const box = useRef<ComponentRef<typeof View>>(null);
  const screenH = useWindowDimensions().height;
  const [hintAbove, setHintAbove] = useState(false);
  const measure = () => box.current?.measureInWindow((_x, y, _w, h) => setHintAbove(y + h / 2 > screenH * 0.6));

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
      // The hold is a timer, not decoration: it must take the full HOLD_MS even with Reduce Motion on.
      // (Reanimated would otherwise jump to the end and ditch on a short press; the ring steps instead.)
      withTiming(1, { duration: HOLD_MS, easing: Easing.linear, reduceMotion: ReduceMotion.Never }, (finished) => {
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
    // Measured on touch-down, so it's ready by the time the hold starts 150 ms later.
    onBegin: measure,
    onActivate: start,
    onFinalize: () => stop(),
  });
  // A flick to scroll must never count as a tap (it would open the editor).
  const tap = useTapGesture({ runOnJS: true, maxDistance: 10, onActivate: () => onOpen(sub) });
  const gesture = useExclusiveGestures(longPress, tap);
  // The bell is its own 44pt target; the row's tap and hold wait for it, so a bell tap never opens the editor.
  const bellTap = useTapGesture({ runOnJS: true, maxDistance: 10, hitSlop: 12, enabled: !!onBell, block: onBell ? [longPress, tap] : undefined, onActivate: () => onBell?.(sub) });

  const ringProps = useAnimatedProps(() => {
    // Reduce Motion: a stepped 4-segment fill instead of a smooth sweep.
    const v = reduce ? Math.floor(progress.get() * 4 + 0.0001) / 4 : progress.get();
    return { strokeDashoffset: CIRC * (1 - v) };
  });
  // Only the logo and its ring grow while you hold; the name and price never move (owner, Nov 16; CLAUDE.md rule 8).
  const rowStyle = useAnimatedStyle(() => ({ opacity: 1 - 0.45 * dim.get() }));
  const logoLift = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.04 * lift.get() }] }));
  const fill = useAnimatedStyle(() =>
    p.dark
      ? { borderColor: interpolateColor(lift.get(), [0, 1], ['rgba(255,204,46,0)', brand.sunflower]) }
      : { backgroundColor: interpolateColor(lift.get(), [0, 1], ['rgba(255,204,46,0)', brand.sunflower]) },
  );

  const price = rowPrice(sub, money);
  const yearly = isPricedSub(sub) ? money(yearlyMinor(sub.amountMinor, sub.cycle), sub.currency) : null;
  // Short date line when the row is tight: small phones, or a wide price column ("US$120.00").
  // The "/yr" sits under the price now, so one yearly row no longer cuts "in 5 days" from the others.
  const screenW = useWindowDimensions().width;
  const narrow = screenW < 380 || (priceWidth ?? 0) > 70;
  const line = rowLine(sub, charge, today, narrow, screenW < 350);
  const shown = pending ? pendingLine(sub, charge, today, narrow) : line;
  const per = sub.cycle === 'monthly' ? '' : CYCLE_SHORT[sub.cycle];
  const on = holding && !p.dark;
  const fg = on ? brand.ink : p.cardFg;
  const sub2 = on ? '#4B4220' : p.mute;
  const label = `${isProTrial(sub) ? 'Ditch Pro trial' : sub.name}, ${price ? `${price} ${CYCLE_WORDS[sub.cycle]}` : 'no price yet'}, ${charge ? line : 'no date yet, add date'}${pending ? ', ditched, not cancelled yet' : ''}${foundTag ? ', found in your bank' : ''}, reminders ${bell === 'on' ? 'on' : 'off'}`;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={box}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={canHold ? (onBell ? 'Opens it. The actions menu has Ditch it and the reminder switch.' : 'Opens it. The actions menu has Ditch it.') : 'Opens the cancel check.'}
        accessibilityActions={[
          { name: 'activate' },
          ...(canHold ? [{ name: 'ditch', label: 'Ditch it' }] : []),
          ...(onBell ? [{ name: 'bell', label: bell === 'on' ? 'Turn reminder off' : 'Turn reminder on' }] : []),
        ]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'ditch' ? onDitch(sub.id) : e.nativeEvent.actionName === 'bell' ? onBell?.(sub) : onOpen(sub))}
        style={[
          { borderRadius: 20, zIndex: holding ? 2 : 0, borderWidth: p.dark ? 1.5 : 0, borderColor: 'transparent' },
          holding && !p.dark ? { shadowColor: '#463200', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 } : null,
          fill,
          rowStyle,
        ]}
      >
        <View style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 14, paddingRight: 14, paddingVertical: 7 }}>
          <Animated.View style={[{ width: TILE, height: TILE, alignItems: 'center', justifyContent: 'center' }, logoLift]}>
            <SubLogo sub={sub} ditched={pending} />
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
          </Animated.View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 8, rowGap: 2 }}>
              {isProTrial(sub) ? (
                <ProLockup size={16} suffix="trial" color={fg} />
              ) : (
                // Shrinks a little (to 15pt) before it cuts off, so "YouTube Premium" fits next to a "US$20.00" column.
                <Txt v="bodyStrong" color={fg} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88} style={{ fontSize: 17, lineHeight: 21, flexShrink: 1 }}>
                  {sub.name}
                </Txt>
              )}
              {foundTag && !pending ? <FoundTag /> : null}
            </View>
            {/* Ditched: the tag leads the date line ("DITCHED Tue, Nov 24"), so it never wraps under a long name. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
              {pending ? <DitchedTag size="s" /> : null}
              <Txt
                v="body"
                color={charge || pending ? sub2 : fg}
                num
                numberOfLines={1}
                style={[{ fontSize: 14.5, lineHeight: 19, flexShrink: 1 }, !charge && !pending ? { fontFamily: F.semi, textDecorationLine: 'underline' } : null]}
              >
                {shown}
              </Txt>
            </View>
          </View>
          <GestureDetector gesture={bellTap}>
            {/* 20pt wide like before; the gesture's 12pt hit slop makes it a 44pt target. The row is one VoiceOver
                element (a button inside a button can't be reached), so VoiceOver gets it as the row's "Turn reminder on/off" action. */}
            <View style={{ width: 20, minHeight: 20, alignItems: 'center', justifyContent: 'center' }} importantForAccessibility="no-hide-descendants">
              {bell === 'blocked' || pending ? (
                <BellOff color={p.bellOff} size={19} />
              ) : (
                <Bell color={bell === 'on' ? (on ? brand.ink : p.dark ? brand.sunflower : brand.ink) : p.bellOff} size={19} fill={bell === 'on' ? (on ? brand.ink : brand.sunflower) : undefined} />
              )}
            </View>
          </GestureDetector>
          <View style={[{ minWidth: 62, alignItems: 'flex-end' }, priceWidth ? { width: Math.max(62, priceWidth) } : null]}>
            <Txt v="moneyM" num color={price ? fg : p.mute} style={{ textAlign: 'right', fontSize: price ? 17.5 : 13 }}>
              {price ?? 'Add price'}
            </Txt>
            {/* Not monthly? Say so, or $139 a year looks like $139 a month. Under the price, so the column (and every row's date line) stays narrow. */}
            {price && per ? (
              <Txt v="sub" num color={sub2} maxFontSizeMultiplier={1.3} style={{ position: 'absolute', top: '100%', right: 0, fontSize: 12, lineHeight: 14, marginTop: -2 }}>
                {per}
              </Txt>
            ) : null}
          </View>
        </View>
        {holding ? (
          <View
            style={
              hintAbove
                ? // Above the row: floats over the row before it (the name and price never move), solid so the row under it doesn't show through.
                  {
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: '100%',
                    marginBottom: 8,
                    borderRadius: 14,
                    padding: 12,
                    paddingHorizontal: 14,
                    backgroundColor: p.dark ? '#2A2722' : brand.white,
                    borderWidth: p.dark ? 1 : 0,
                    borderColor: p.cardBorder,
                    shadowColor: '#463200',
                    shadowOpacity: 0.16,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 6,
                  }
                : { marginHorizontal: 12, marginBottom: 12, marginTop: -2, borderRadius: 14, padding: 12, paddingHorizontal: 14, backgroundColor: p.dark ? '#2A2722' : 'rgba(255,255,255,0.78)' }
            }
          >
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
});

/** The ink tag on a row the bank just added ("FOUND IN YOUR BANK", 7 days). Sunflower on night in dark mode. */
export function FoundTag() {
  const p = usePalette();
  return (
    <View style={{ borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: p.dark ? brand.sunflower : brand.ink }}>
      <Txt v="eyebrow" color={p.dark ? brand.ink : brand.sunflower} style={{ fontSize: 9.5, lineHeight: 13, letterSpacing: 0.6, fontFamily: F.wideHeavy }} maxFontSizeMultiplier={1.3}>
        Found in your bank
      </Txt>
    </View>
  );
}
