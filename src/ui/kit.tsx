import { ReactNode, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import { C, F, LIP, PAD, R } from './theme';
import { E3D, Emoji } from './emoji';
import { Icon, IconName } from './icons';

export { C, F, R, PAD };

// ---------- feedback ----------
export const tap = (kind: 'light' | 'medium' | 'success' | 'error' = 'light') => {
  if (Platform.OS === 'web') return;
  if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (kind === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  else Haptics.impactAsync(kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
};
export const shadow = (y = 6, blur = 20, a = 0.07): ViewStyle => ({ shadowColor: '#0C0D10', shadowOpacity: a, shadowRadius: blur, shadowOffset: { width: 0, height: y }, elevation: Math.round(y / 2) });

// ---------- layout ----------
export function Screen({ children, scroll = true, bg = C.bg, gap = 16, top = 8, footer, pad = PAD, tabs }: {
  children: ReactNode; scroll?: boolean; bg?: string; gap?: number; top?: number; footer?: ReactNode; pad?: number; tabs?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const body: ViewStyle = { paddingTop: insets.top + top, paddingHorizontal: pad, paddingBottom: footer ? 16 : insets.bottom + (tabs ? 120 : 28), gap };
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {scroll
        ? <ScrollView contentContainerStyle={body} showsVerticalScrollIndicator={false}>{children}</ScrollView>
        : <View style={[{ flex: 1 }, body]}>{children}</View>}
      {footer ? <View style={{ paddingHorizontal: pad, paddingTop: 10, paddingBottom: insets.bottom + 14, gap: 10, backgroundColor: bg }}>{footer}</View> : null}
    </View>
  );
}
export function Row({ children, style, gap = 10, align = 'center' }: { children: ReactNode; style?: ViewStyle | ViewStyle[]; gap?: number; align?: ViewStyle['alignItems'] }) {
  return <View style={[{ flexDirection: 'row', alignItems: align, gap }, style as ViewStyle]}>{children}</View>;
}
/** staggered entrance */
export function Rise({ children, i = 0, style }: { children: ReactNode; i?: number; style?: ViewStyle | ViewStyle[] }) {
  return <Animated.View entering={FadeInDown.duration(380).delay(40 + i * 60).springify().damping(20)} style={style}>{children}</Animated.View>;
}

// ---------- type ----------
type TP = { children: ReactNode; style?: TextStyle | (TextStyle | false | undefined | null)[]; color?: string; center?: boolean; lines?: number };
const mk = (base: TextStyle) => function T({ children, style, color, center, lines }: TP) {
  return <Text numberOfLines={lines} style={[{ color: C.ink }, base, color ? { color } : null, center ? { textAlign: 'center' } : null, style as TextStyle]}>{children}</Text>;
};
export const Display = mk({ fontFamily: F.display, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 });
export const Title = mk({ fontFamily: F.display, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 });
export const H2 = mk({ fontFamily: F.bold, fontSize: 21, lineHeight: 28, letterSpacing: -0.3 });
export const Label = mk({ fontFamily: F.bold, fontSize: 16, lineHeight: 21, letterSpacing: -0.1 });
export const Body = mk({ fontFamily: F.medium, fontSize: 16, lineHeight: 23, color: C.ink2 });
export const Small = mk({ fontFamily: F.medium, fontSize: 14, lineHeight: 20, color: C.ink2 });
export const Tiny = mk({ fontFamily: F.semi, fontSize: 12, lineHeight: 16, color: C.ink3 });
export const Eyebrow = mk({ fontFamily: F.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.1, textTransform: 'uppercase', color: C.ink3 });
export const Num = mk({ fontFamily: F.display, fontSize: 18, letterSpacing: -0.4 });

/** reading text (serif, like a book) with one [[key phrase]] in bold on a soft highlight */
export function Reading({ text, size = 19, color = C.ink, mark = '#FFF0B8' }: { text: string; size?: number; color?: string; mark?: string }) {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <Text style={{ fontFamily: F.serif, fontSize: size, lineHeight: size * 1.5, color }}>
      {parts.map((p, i) => (p.startsWith('[[')
        ? <Text key={i} style={{ fontFamily: F.serifSemi, backgroundColor: mark }}>{p.slice(2, -2)}</Text>
        : <Text key={i}>{p}</Text>))}
    </Text>
  );
}

// ---------- 3D objects ----------
export function E({ name, size = 48, style }: { name: Emoji; size?: number; style?: ViewStyle }) {
  return <Image source={E3D[name]} style={[{ width: size, height: size }, style as object]} contentFit="contain" />;
}

// ---------- tactile press (Brilliant / Mimo lip) ----------
type PressProps = {
  children: ReactNode; onPress?: () => void; face?: string; lip?: string; border?: string; bw?: number; radius?: number; depth?: number;
  style?: ViewStyle | ViewStyle[]; inner?: ViewStyle | ViewStyle[]; disabled?: boolean; label?: string; role?: 'button' | 'radio' | 'checkbox' | 'tab' | 'link'; selected?: boolean; haptic?: 'light' | 'medium' | false;
};
export function Press({ children, onPress, face = C.card, lip = C.line, border, bw = 1.5, radius = R.tile, depth = LIP, style, inner, disabled, label, role = 'button', selected, haptic = 'light' }: PressProps) {
  const y = useSharedValue(0);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Pressable accessibilityRole={role} accessibilityLabel={label} accessibilityState={{ disabled: !!disabled, selected: !!selected, checked: role === 'checkbox' || role === 'radio' ? !!selected : undefined }}
      disabled={disabled} onPress={() => { if (haptic) tap(haptic); onPress?.(); }}
      onPressIn={() => { if (depth) y.set(withTiming(depth, { duration: 60 })); }} onPressOut={() => { y.set(withSpring(0, { damping: 15, stiffness: 340 })); }}
      style={[{ borderRadius: radius, backgroundColor: depth ? lip : 'transparent', paddingBottom: depth }, style as ViewStyle]}>
      <Animated.View style={[{ borderRadius: radius, backgroundColor: face, borderWidth: border ? bw : 0, borderColor: border }, inner as ViewStyle, a]}>{children}</Animated.View>
    </Pressable>
  );
}

type BtnKind = 'primary' | 'secondary' | 'soft' | 'ghost' | 'good' | 'warn' | 'kiwi' | 'white';
const BTN: Record<BtnKind, { face: string; lip: string; text: string; border?: string }> = {
  primary: { face: C.graphite, lip: C.graphiteLip, text: '#FFFFFF' },
  secondary: { face: C.card, lip: C.line, text: C.ink, border: C.line },
  soft: { face: C.pressed, lip: '#D8DAE0', text: C.ink },
  ghost: { face: 'transparent', lip: 'transparent', text: C.ink2 },
  good: { face: C.good, lip: C.goodLip, text: '#FFFFFF' },
  warn: { face: C.warn, lip: C.warnLip, text: C.ink },
  kiwi: { face: C.kiwi, lip: C.kiwiLip, text: '#FFFFFF' },
  white: { face: '#FFFFFF', lip: 'rgba(0,0,0,0.18)', text: C.ink },
};
export function Btn({ label, onPress, kind = 'primary', disabled, icon, iconLeft, emoji, style, small, color, lip, textColor }: {
  label: string; onPress?: () => void; kind?: BtnKind; disabled?: boolean; icon?: IconName; iconLeft?: IconName; emoji?: Emoji; style?: ViewStyle; small?: boolean; color?: string; lip?: string; textColor?: string;
}) {
  const k = BTN[kind];
  const ghost = kind === 'ghost';
  const fg = disabled ? C.ink3 : textColor ?? k.text;
  return (
    <Press onPress={onPress} disabled={disabled} label={label} face={disabled ? C.sunken : color ?? k.face} lip={disabled ? C.sunken : lip ?? k.lip} border={disabled ? undefined : k.border}
      depth={ghost || disabled ? 0 : LIP} radius={R.button} style={style} haptic={ghost ? false : 'medium'}
      inner={{ minHeight: small ? 44 : 54, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 22 }}>
      {emoji ? <E name={emoji} size={22} /> : null}
      {iconLeft ? <Icon name={iconLeft} size={19} color={fg} weight={2.4} /> : null}
      <Text style={{ fontFamily: F.bold, fontSize: small ? 15 : 17, letterSpacing: -0.2, color: fg }}>{label}</Text>
      {icon ? <Icon name={icon} size={18} color={fg} weight={2.6} /> : null}
    </Press>
  );
}

/** floating round button (back, close, share) */
export function CircleBtn({ name, onPress, label, size = 44, bg = C.card, color = C.ink, flat }: { name: IconName; onPress?: () => void; label: string; size?: number; bg?: string; color?: string; flat?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { tap(); onPress?.(); }} hitSlop={6}
      style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.94 : 1 }] }, flat ? null : shadow(3, 10, 0.08)]}>
      <Icon name={name} size={Math.round(size * 0.46)} color={color} weight={2.4} />
    </Pressable>
  );
}
export function IconBtn({ name, onPress, label, size = 44, color = C.ink3 }: { name: IconName; onPress?: () => void; label: string; size?: number; color?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { tap(); onPress?.(); }} hitSlop={8} style={({ pressed }) => ({ width: size, height: size, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}>
      <Icon name={name} size={Math.round(size * 0.55)} color={color} weight={2.4} />
    </Pressable>
  );
}

// ---------- surfaces ----------
/** soft card (Brainly): white, very round, no border, barely-there shadow */
export function Card({ children, style, tint, pad = 18, gap = 10, outline }: { children: ReactNode; style?: ViewStyle | ViewStyle[]; tint?: string; pad?: number; gap?: number; outline?: boolean }) {
  return (
    <View style={[{ backgroundColor: tint ?? C.card, borderRadius: R.card, padding: pad, gap }, outline ? { borderWidth: 1.5, borderColor: C.line, borderBottomWidth: 5 } : tint ? null : shadow(4, 16, 0.05), style as ViewStyle]}>
      {children}
    </View>
  );
}
export function TapCard({ children, onPress, style, inner, label, tint }: { children: ReactNode; onPress?: () => void; style?: ViewStyle | ViewStyle[]; inner?: ViewStyle | ViewStyle[]; label?: string; tint?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => [{ backgroundColor: tint ?? C.card, borderRadius: R.card, padding: 16, gap: 8, transform: [{ scale: pressed ? 0.98 : 1 }] }, tint ? null : shadow(4, 16, 0.05), style as ViewStyle, inner as ViewStyle]}>
      {children}
    </Pressable>
  );
}
export function Section({ title, sub, action, onAction, children, style }: { title: string; sub?: string; action?: string; onAction?: () => void; children?: ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{ gap: 14 }, style]}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: F.display, fontSize: 21, letterSpacing: -0.4, color: C.ink }}>{title}</Text>
          {sub ? <Small>{sub}</Small> : null}
        </View>
        {action ? (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10} style={{ backgroundColor: C.pressed, borderRadius: 10, paddingHorizontal: 12, height: 32, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.ink }}>{action}</Text>
          </Pressable>
        ) : null}
      </Row>
      {children}
    </View>
  );
}

// ---------- answer / choice ----------
export type OptState = 'idle' | 'selected' | 'right' | 'wrong' | 'dim';
const OPT: Record<OptState, { face: string; lip: string; border: string; text: string }> = {
  idle: { face: C.card, lip: C.line, border: C.line, text: C.ink },
  selected: { face: C.selectSoft, lip: C.select, border: C.select, text: C.ink },
  right: { face: C.goodSheet, lip: C.good, border: C.good, text: C.ink },
  wrong: { face: C.badSoft, lip: C.bad, border: C.bad, text: C.ink },
  dim: { face: C.card, lip: C.line, border: C.line, text: C.ink3 },
};
export function Option({ label, sub, state = 'idle', onPress, left, multi, right, center, big, children }: {
  label: string; sub?: string; state?: OptState; onPress?: () => void; left?: ReactNode; multi?: boolean; right?: ReactNode; center?: boolean; big?: boolean; children?: ReactNode;
}) {
  const o = OPT[state];
  const on = state === 'selected' || state === 'right' || state === 'wrong';
  return (
    <Press onPress={onPress} role={multi ? 'checkbox' : 'radio'} selected={on} label={label} face={o.face} lip={o.lip} border={o.border} bw={on ? 2 : 1.5} radius={R.tile}
      inner={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
      <Row gap={14} style={{ justifyContent: center ? 'center' : 'flex-start', minHeight: big ? 40 : 26 }}>
        {left}
        <View style={{ flex: center ? undefined : 1, gap: 2 }}>
          <Text style={{ fontFamily: F.semi, fontSize: big ? 17 : 16, lineHeight: big ? 22 : 21, color: o.text, textAlign: center ? 'center' : 'left' }}>{label}</Text>
          {sub ? <Text style={{ fontFamily: F.medium, fontSize: 13.5, color: state === 'dim' ? C.ink3 : C.ink2 }}>{sub}</Text> : null}
        </View>
        {right ?? (center ? null : state === 'right' ? <Dot color={C.good} icon="check" /> : state === 'wrong' ? <Dot color={C.bad} icon="x" /> : state === 'selected' ? <Dot color={C.select} icon="check" square={multi} />
          : <View style={{ width: 24, height: 24, borderRadius: multi ? 7 : 12, borderWidth: 2, borderColor: '#D3D5DB' }} />)}
      </Row>
      {children}
    </Press>
  );
}
function Dot({ color, icon, square }: { color: string; icon: IconName; square?: boolean }) {
  return <Animated.View entering={FadeIn.duration(150)} style={{ width: 24, height: 24, borderRadius: square ? 7 : 12, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={14} color="#FFFFFF" weight={3.4} /></Animated.View>;
}

export function Chip({ label, on, onPress, emoji }: { label: string; on?: boolean; onPress?: () => void; emoji?: Emoji }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: !!on }} onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 16, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: on ? C.selectSoft : C.card, borderWidth: 1.5, borderColor: on ? C.select : C.line, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      {emoji ? <E name={emoji} size={22} /> : null}
      <Text style={{ fontFamily: F.bold, fontSize: 15, color: C.ink }}>{label}</Text>
    </Pressable>
  );
}
export function Tag({ text, bg = C.pressed, color = C.ink, style, emoji }: { text: string; bg?: string; color?: string; style?: ViewStyle; emoji?: Emoji }) {
  return (
    <View style={[{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }, style]}>
      {emoji ? <E name={emoji} size={14} /> : null}
      <Text style={{ fontFamily: F.bold, fontSize: 11.5, letterSpacing: 0.6, color, textTransform: 'uppercase' }}>{text}</Text>
    </View>
  );
}
/** white stat pill with a 3D object (Brilliant "3 ⚡") */
export function StatPill({ emoji, value, label, onPress }: { emoji: Emoji; value: string | number; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 38, paddingLeft: 8, paddingRight: 12, borderRadius: 19, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.line, opacity: pressed ? 0.7 : 1 }]}>
      <E name={emoji} size={22} />
      <Text style={{ fontFamily: F.display, fontSize: 15, color: C.ink }}>{value}</Text>
    </Pressable>
  );
}

// ---------- progress ----------
export function Bar({ value, color = C.good, track = C.sunken, h = 10 }: { value: number; color?: string; track?: string; h?: number }) {
  const v = Math.min(1, Math.max(0, value));
  const w = useSharedValue(0);
  useEffect(() => { w.value = withTiming(v, { duration: 600, easing: Easing.out(Easing.cubic) }); }, [v]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={{ height: h, borderRadius: h, backgroundColor: track, overflow: 'hidden' }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}>
      <Animated.View style={[{ height: h, borderRadius: h, backgroundColor: color, minWidth: v > 0 ? h : 0 }, a]}>
        {h >= 10 ? <View style={{ position: 'absolute', left: h / 2, right: h / 2, top: h * 0.2, height: Math.max(2, h * 0.22), borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' }} /> : null}
      </Animated.View>
    </View>
  );
}
/** Brilliant-style: filled bar + detached dots for what's left */
export function StepBar({ done, total, dots = 0, color = C.good }: { done: number; total: number; dots?: number; color?: string }) {
  return (
    <Row gap={6} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}><Bar value={done / total} color={color} /></View>
      {Array.from({ length: dots }).map((_, i) => <View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.sunken }} />)}
    </Row>
  );
}
export function Ring({ value, size = 64, stroke = 8, color = C.good, track = C.sunken, children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        {value > 0 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${c}`} strokeDashoffset={c * (1 - Math.min(1, value))} transform={`rotate(-90 ${size / 2} ${size / 2})`} /> : null}
      </Svg>
      {children}
    </View>
  );
}

// ---------- the raccoon (same rig as Kiwi: blinks, talks, hops) ----------
export type Pose = 'idle' | 'talk' | 'happy' | 'sleep' | 'oops';
export type Prop = 'none' | 'party' | 'glasses' | 'grad';
const FRAMES = {
  idle: require('../../assets/mascot/raccoon/idle.png'), blink: require('../../assets/mascot/raccoon/blink.png'),
  talk: require('../../assets/mascot/raccoon/talk.png'), talkBlink: require('../../assets/mascot/raccoon/talk-blink.png'),
  happy: require('../../assets/mascot/raccoon/happy.png'), oops: require('../../assets/mascot/raccoon/oops.png'),
};
type Frame = keyof typeof FRAMES;
/** the mascot: blinks, talks (beak flaps for `talkMs`), hops, tilts, shakes; can wear a prop */
export function Raccoon({ size = 96, pose = 'idle', move = 'bob', flip, style, prop = 'none', talkMs = 1500 }: { size?: number; pose?: Pose; move?: 'bob' | 'hop' | 'tilt' | 'shake' | 'none'; flip?: boolean; style?: ViewStyle; prop?: Prop; talkMs?: number }) {
  const [blink, setBlink] = useState(false);
  const [open, setOpen] = useState(pose === 'talk');
  useEffect(() => {
    if (pose === 'happy' || pose === 'sleep') return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => { t = setTimeout(() => { setBlink(true); t = setTimeout(() => { setBlink(false); loop(); }, 130); }, 2200 + Math.random() * 2600); };
    loop();
    return () => clearTimeout(t);
  }, [pose]);
  useEffect(() => {
    if (pose !== 'talk') return;
    let n = 0;
    const iv = setInterval(() => { n += 1; setOpen((o) => !o); if (n * 150 > talkMs) { clearInterval(iv); setOpen(true); } }, 150);
    return () => clearInterval(iv);
  }, [pose, talkMs]);
  const frame: Frame = pose === 'talk' ? (open ? (blink ? 'talkBlink' : 'talk') : blink ? 'blink' : 'idle') : pose === 'idle' ? (blink ? 'blink' : 'idle') : pose === 'sleep' ? 'blink' : pose;

  const t = useSharedValue(0);
  useEffect(() => {
    if (move === 'none') return;
    if (move === 'hop') t.value = withRepeat(withSequence(withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) }), withDelay(600, withTiming(0, { duration: 1 }))), -1);
    else if (move === 'shake') t.value = withSequence(withTiming(1, { duration: 70 }), withTiming(-1, { duration: 90 }), withTiming(0.7, { duration: 90 }), withTiming(0, { duration: 80 }));
    else t.value = withRepeat(withTiming(1, { duration: move === 'tilt' ? 1400 : 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [move]);
  const a = useAnimatedStyle(() => {
    const sx = flip ? -1 : 1;
    if (move === 'hop') return { transform: [{ translateY: -t.value * size * 0.12 }, { scaleX: sx }] };
    if (move === 'tilt') return { transform: [{ rotate: `${(t.value - 0.5) * 7}deg` }, { scaleX: sx }] };
    if (move === 'shake') return { transform: [{ translateX: t.value * 6 }, { scaleX: sx }] };
    return { transform: [{ translateY: -t.value * 3 }, { scaleX: sx }] };
  });
  return (
    <Animated.View style={[{ width: size, height: size * 1.17 }, a, style]} accessible accessibilityLabel="Ditch the raccoon">
      {(Object.keys(FRAMES) as Frame[]).map((f) => <Image key={f} source={FRAMES[f]} style={[StyleSheet.absoluteFill, { opacity: f === frame ? 1 : 0 }]} contentFit="contain" />)}
      <KiwiProp prop={prop} size={size} />
    </Animated.View>
  );
}
/** clean vector props, drawn in the mascot image's own coordinates (444×520) */
function KiwiProp({ prop, size }: { prop: Prop; size: number }) {
  if (prop === 'none') return null;
  return (
    <Svg pointerEvents="none" width={size} height={size * (610 / 444)} viewBox="0 -90 444 610" style={{ position: 'absolute', left: 0, top: -size * (90 / 444) }}>
      {prop === 'party' ? <>
        <Path d="M150,62 L214,-62 L262,46 Z" fill="#F0609E" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <Path d="M170,24 L236,6 M190,-16 L247,-6" stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" />
        <Circle cx={214} cy={-66} r={16} fill="#FFD23F" stroke={C.ink} strokeWidth={6} />
      </> : null}
      {prop === 'glasses' ? <>
        <Circle cx={132} cy={116} r={30} fill="rgba(255,255,255,0.25)" stroke={C.ink} strokeWidth={8} />
        <Circle cx={214} cy={108} r={30} fill="rgba(255,255,255,0.25)" stroke={C.ink} strokeWidth={8} />
        <Path d="M162,112 C172,104 178,104 184,108" stroke={C.ink} strokeWidth={8} strokeLinecap="round" fill="none" />
      </> : null}
      {prop === 'grad' ? <>
        <Path d="M90,30 L200,-14 L320,26 L208,70 Z" fill={C.ink} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <Path d="M300,32 L306,96" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" />
        <Circle cx={306} cy={104} r={12} fill="#FFD23F" stroke={C.ink} strokeWidth={5} />
      </> : null}
    </Svg>
  );
}

/** speech bubble (white, hairline, small tail) */
export function Bubble({ text, side = 'left', style, size = 17, children, tint = C.card }: { text?: string; side?: 'left' | 'right' | 'down'; style?: ViewStyle; size?: number; children?: ReactNode; tint?: string }) {
  return (
    <Animated.View entering={FadeIn.duration(260).delay(120)} style={[{ flexShrink: 1 }, style]}>
      <View style={[{ backgroundColor: tint, borderWidth: 1.5, borderColor: C.line, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 16 }, shadow(2, 8, 0.04)]}>
        {text ? <Text style={{ fontFamily: F.semi, fontSize: size, lineHeight: size * 1.35, color: C.ink }}>{text}</Text> : children}
      </View>
      <View style={[{ position: 'absolute', width: 14, height: 14, backgroundColor: tint, borderColor: C.line, transform: [{ rotate: '45deg' }] },
        side === 'down' ? { bottom: -7, left: 34, borderRightWidth: 1.5, borderBottomWidth: 1.5 }
          : side === 'left' ? { left: -7, top: 20, borderLeftWidth: 1.5, borderBottomWidth: 1.5 } : { right: -7, top: 20, borderRightWidth: 1.5, borderTopWidth: 1.5 }]} />
    </Animated.View>
  );
}
export function RaccoonSays({ text, size = 72, pose = 'talk', prop }: { text: string; size?: number; pose?: Pose; prop?: Prop }) {
  return (
    <Row gap={16} align="flex-start">
      <Raccoon size={size} pose={pose} prop={prop} />
      <Bubble text={text} side="left" style={{ flex: 1, marginTop: 6 }} />
    </Row>
  );
}

/** soft radial light (Brilliant celebration glow) */
export function Glow({ color = C.good, size = 300, opacity = 0.5, style }: { color?: string; size?: number; opacity?: number; style?: ViewStyle }) {
  const id = `g${color.replace(/[^a-z0-9]/gi, '')}${Math.round(opacity * 100)}`;
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor={color} stopOpacity={opacity} /><Stop offset="1" stopColor={color} stopOpacity={0} /></RadialGradient></Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
/** glowing podium disc under a hero (Brilliant lesson complete) */
export function Podium({ color = C.good, w = 200 }: { color?: string; w?: number }) {
  const h = w * 0.28;
  const id = `pd${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <Svg width={w} height={h + 10}>
      <Defs><RadialGradient id={id} cx="50%" cy="40%" r="60%"><Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} /><Stop offset="1" stopColor={color} stopOpacity={0.35} /></RadialGradient></Defs>
      <Ellipse cx={w / 2} cy={h / 2 + 8} rx={w / 2 - 2} ry={h / 2} fill={color} opacity={0.35} />
      <Ellipse cx={w / 2} cy={h / 2 + 2} rx={w / 2 - 2} ry={h / 2} fill={`url(#${id})`} stroke={color} strokeOpacity={0.5} strokeWidth={2} />
    </Svg>
  );
}

// ---------- lists & settings ----------
export function Group({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[{ backgroundColor: C.card, borderRadius: 20, overflow: 'hidden' }, shadow(3, 12, 0.04), style]}>{children}</View>;
}
export function ListRow({ icon, emoji, label, value, onPress, danger, right, sub, last }: {
  icon?: IconName; emoji?: Emoji; label: string; value?: string; onPress?: () => void; danger?: boolean; right?: ReactNode; sub?: string; last?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ backgroundColor: pressed ? C.sunken : 'transparent' })}>
      <Row gap={14} style={{ minHeight: 56, paddingHorizontal: 16, paddingVertical: 10 }}>
        {emoji ? <E name={emoji} size={26} /> : icon ? <Icon name={icon} size={21} color={danger ? C.bad : C.ink} weight={2.2} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.semi, fontSize: 16, color: danger ? C.bad : C.ink }}>{label}</Text>
          {sub ? <Text style={{ fontFamily: F.medium, fontSize: 13, color: C.ink3 }}>{sub}</Text> : null}
        </View>
        {value ? <Text style={{ fontFamily: F.medium, fontSize: 15, color: C.ink3 }}>{value}</Text> : null}
        {right ?? (danger ? null : <Icon name="chevron" size={16} color={C.ink3} weight={2.6} />)}
      </Row>
      {!last ? <View style={{ height: StyleSheet.hairlineWidth * 2, backgroundColor: C.line, marginLeft: emoji || icon ? 56 : 16 }} /> : null}
    </Pressable>
  );
}
export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const x = useSharedValue(value ? 1 : 0);
  useEffect(() => { x.value = withSpring(value ? 1 : 0, { damping: 16, stiffness: 260 }); }, [value]);
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 20 }] }));
  return (
    <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} onPress={() => { tap(); onChange(!value); }} hitSlop={8}
      style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: value ? C.good : '#DADCE2', padding: 3 }}>
      <Animated.View style={[{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF' }, shadow(1, 3, 0.15), knob]} />
    </Pressable>
  );
}

/** bottom sheet */
export function Sheet({ children, onClose, tint = C.card, dim = true }: { children: ReactNode; onClose?: () => void; tint?: string; dim?: boolean }) {
  const insets = useSafeAreaInsets();
  const y = useSharedValue(420);
  useEffect(() => { y.value = withSpring(0, { damping: 22, stiffness: 200 }); }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {dim ? <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}><Pressable accessibilityLabel="Close" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: C.scrim }]} /></Animated.View> : null}
      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: tint, borderTopLeftRadius: R.sheet, borderTopRightRadius: R.sheet, padding: PAD, paddingTop: 22, paddingBottom: insets.bottom + 16, gap: 16 }, shadow(-4, 24, 0.08), a]}>
        {children}
      </Animated.View>
    </View>
  );
}

/** lesson / onboarding top bar */
export function FlowBar({ onBack, icon = 'close', progress, right }: { onBack?: () => void; icon?: IconName; progress?: ReactNode; right?: ReactNode }) {
  return (
    <Row gap={8}>
      <IconBtn name={icon} label={icon === 'close' ? 'Close' : 'Back'} onPress={onBack} color={C.ink2} />
      <View style={{ flex: 1 }}>{progress}</View>
      {right ?? <View style={{ width: 44 }} />}
    </Row>
  );
}

// ---------- celebration ----------
const CONF = ['#2BCD5B', '#F5B400', '#4C6FFF', '#FF8F25', '#F0609E', '#8B5CF6'];
export function Confetti({ n = 34, seed = 1 }: { n?: number; seed?: number }) {
  const [pieces] = useState(() => Array.from({ length: n }, (_, i) => {
    const r = (k: number) => { const x = Math.sin((i + 1) * 9301 * (k + seed) + 49297) * 233280; return x - Math.floor(x); };
    return { x: r(1) * 390, d: 900 + r(2) * 1200, delay: r(3) * 300, w: 6 + r(4) * 5, rot: r(5) * 720 - 360, c: CONF[i % CONF.length], drift: (r(6) - 0.5) * 120, round: r(7) > 0.6 };
  }));
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 20 }]}>{pieces.map((p, i) => <Piece key={i} {...p} />)}</View>;
}
function Piece({ x, d, delay, w, rot, c, drift, round }: { x: number; d: number; delay: number; w: number; rot: number; c: string; drift: number; round: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(delay, withTiming(1, { duration: d + 900, easing: Easing.out(Easing.quad) })); }, []);
  const a = useAnimatedStyle(() => ({ opacity: t.value < 0.85 ? 1 : (1 - t.value) / 0.15, transform: [{ translateX: x + drift * t.value }, { translateY: -40 + t.value * 760 }, { rotate: `${rot * t.value}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width: w, height: round ? w : w * 1.7, borderRadius: round ? w : 2, backgroundColor: c }, a]} />;
}
export function Sparkles({ color = '#2BCD5B', spots }: { color?: string; spots: { x: number; y: number; s: number; d?: number }[] }) {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{spots.map((p, i) => <Twinkle key={i} {...p} color={color} />)}</View>;
}
function Twinkle({ x, y, s, d = 0, color }: { x: number; y: number; s: number; d?: number; color: string }) {
  const t = useSharedValue(0.4);
  useEffect(() => { t.value = withDelay(d, withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }), -1, true)); }, []);
  const a = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: 0.7 + t.value * 0.4 }] }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: y }, a]}><Svg width={s} height={s} viewBox="0 0 24 24"><Path fill={color} d="M12 1.5c.9 5.3 2.7 7.6 10.5 10.5-7.8 2.9-9.6 5.2-10.5 10.5C11.1 17.2 9.3 14.9 1.5 12 9.3 9.1 11.1 6.8 12 1.5z" /></Svg></Animated.View>;
}
export function CountUp({ to, from = 0, style, duration = 900, prefix = '', suffix = '' }: { to: number; from?: number; style?: TextStyle; duration?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const t0 = Date.now(); let raf = 0;
    const step = () => { const p = Math.min(1, (Date.now() - t0) / duration); setV(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <Text style={style}>{prefix}{v}{suffix}</Text>;
}
export function Pop({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: ViewStyle | ViewStyle[] }) {
  const s = useSharedValue(0.5);
  const o = useSharedValue(0);
  useEffect(() => { s.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 170 })); o.value = withDelay(delay, withTiming(1, { duration: 180 })); }, []);
  const a = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: s.value }] }));
  return <Animated.View style={[a, style as ViewStyle]}>{children}</Animated.View>;
}
/** gentle floating motion for 3D hero objects */
export function Float({ children, style, amp = 6 }: { children: ReactNode; style?: ViewStyle; amp?: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }), -1, true); }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: -t.value * amp }, { rotate: `${(t.value - 0.5) * 4}deg` }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}
export function Fill({ colors, style }: { colors: [string, string, ...string[]]; style?: ViewStyle }) {
  return <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, style]} />;
}
