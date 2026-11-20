// 2 · What do you pay for? (design/v12 render 02). Tick each one; a tick
// takes the local default plan ("Standard · $19.99/mo · Change"), and
// "Change" opens the plan sheet. The running monthly total sits above the
// button. Prices are the local ones for the iPhone's Region (DECISIONS #17);
// no checked local price means "Add your price", never a converted one.

import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { catalogPrice, defaultPlan, planChoices, priceRow } from '@/catalog/prices';
import { CHIP, FILTERS, type Filter } from '@/catalog/filters';
import { SERVICES, availableIn, popularIn, searchServices, type CatalogService } from '@/catalog/services';
import { shortPlanName } from '@/domain/copy';
import { type DateOnly } from '@/domain/dates';
import { CYCLE_SHORT } from '@/domain/money';
import { CountrySheet } from '@/onboarding/CountrySheet';
import { LinkButton, OnbRoot, TextLink } from '@/onboarding/Parts';
import { PlanSheet } from '@/onboarding/PlanSheet';
import { PriceSheet } from '@/onboarding/PriceSheet';
import { isPriced, onboardingToday, totalsFor, useCountry, useMoney, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { setOwnPrice } from '@/state/picks';
import { Button, ChevronRight, EASE_OUT, F, LogoTile, Plus, POP, PRESS, RELEASE, Search, StepHeaderSpace, TickPop, Txt, haptic, radius, useFrame, usePalette } from '@/ui/sunflower';

const NB = ' ';

/** A plan name that's only a cycle word ("Monthly"): the price already says it ("$14.99/mo"). */
const cycleWord = (name: string | null) => (name && /^(monthly|yearly|annual|annually|weekly|quarterly)$/i.test(name.trim()) ? null : name);

/** Something not in our catalog, typed into search: saved by name, like one found on a statement. */
function customPick(name: string, today: DateOnly): Picked {
  const clean = name.trim();
  return {
    id: `custom:${clean.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: clean,
    color: '#E9E2D2',
    ink: '#16140F',
    mono: clean.slice(0, 1).toUpperCase() || '?',
    cycle: 'monthly',
    amountMinor: null,
    currency: null,
    planId: null,
    planName: null,
    priceSource: 'none',
    priceCountry: null,
    amountIsEstimate: false,
    anchor: today,
    dateSource: 'none',
    custom: true,
  };
}

/** A custom pick as a list row, so it shows (and can be unticked) like the rest. */
const asService = (x: Picked): CatalogService => ({ id: x.id, name: x.name, category: 'Productivity', color: x.color, ink: x.ink, mono: x.mono, cycle: x.cycle });

/** The second line of a row. Returns the text and whether "Change" / "Add your price" shows. */
function useRowLine() {
  const money = useMoney();
  const { country } = useOnboarding();
  return (s: CatalogService, pick: Picked | undefined): { text: string; link: 'plan' | 'price' | null } => {
    if (pick) {
      if (!isPriced(pick)) return { text: '', link: 'price' };
      const amount = `${money(pick.amountMinor, pick.currency)}${CYCLE_SHORT[pick.cycle]}`;
      if (pick.priceSource === 'user') return { text: `Your price · ${amount}`, link: 'price' };
      const plans = planChoices(s.id, pick.priceCountry);
      const short = pick.planName
        ? shortPlanName(
            pick.planName,
            s.name,
            plans.map((x) => x.name),
          )
        : null;
      // "Monthly · $14.99/mo" says it twice: drop a plan name that's only a cycle word.
      const name = cycleWord(short);
      return { text: name ? `${name} · ${amount}` : amount, link: plans.length > 1 ? 'plan' : null };
    }
    // Not ticked yet: show the plan and price a tick will give, so ticking
    // only adds the tick and "Change" instead of changing the whole line.
    const plans = planChoices(s.id, country);
    const row = plans.length > 1 ? priceRow(s.id, country) : null;
    if (row) {
      const d = defaultPlan(row);
      const name = shortPlanName(
        d.name,
        s.name,
        plans.map((x) => x.name),
      );
      const amount = `${money(d.amountMinor, row.currency)}${CYCLE_SHORT[d.cycle]}`;
      return { text: name ? `${name} · ${amount}` : amount, link: null };
    }
    const c = catalogPrice(s.id, country);
    return { text: c ? `${money(c.amountMinor, c.currency)}${CYCLE_SHORT[c.cycle]}` : 'Add your price', link: null };
  };
}

/**
 * The logo's answer to a touch: it sinks a little while your finger is down, then pops past full
 * size and settles on a spring when it's ticked, or dips and settles when it's unticked.
 * Nothing on first show; Reduce Motion: no movement (the tick still switches).
 */
function useLogoPop(on: boolean) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    s.set(withSequence(withTiming(on ? 1.12 : 0.9, { duration: 90, easing: EASE_OUT }), withSpring(1, POP)));
  }, [on, reduce, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return {
    style,
    pressIn: () => {
      if (!reduce) s.set(withTiming(0.92, { duration: PRESS.in, easing: EASE_OUT }));
    },
    // A scroll that cancels the tap: spring back to rest.
    pressOut: () => {
      if (!reduce) s.set(withSpring(1, RELEASE));
    },
  };
}

function Row({ s, pick, first, onToggle, onChange }: { s: CatalogService; pick: Picked | undefined; first: boolean; onToggle: () => void; onChange: (kind: 'plan' | 'price') => void }) {
  const p = usePalette();
  const line = useRowLine()(s, pick);
  const on = !!pick;
  const spoken = line.text || 'no local price yet';
  const logo = useLogoPop(on);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${s.name}, ${spoken}`}
      accessibilityState={{ checked: on }}
      // VoiceOver can't reach the "Change" link inside the row, so it's an action on the row too.
      accessibilityActions={line.link ? [{ name: 'activate' }, { name: 'change', label: line.link === 'plan' ? 'Change plan' : line.text ? 'Change price' : 'Add your price' }] : undefined}
      onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'change' && line.link ? onChange(line.link) : onToggle())}
      onPress={onToggle}
      onPressIn={logo.pressIn}
      onPressOut={logo.pressOut}
      style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      {first ? null : <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} />}
      <Animated.View style={logo.style}>
        <LogoTile id={s.id} size={40} color={s.color} ink={s.ink} mono={s.mono} />
      </Animated.View>
      <View style={{ flex: 1, minWidth: 0, paddingVertical: 12 }}>
        <Txt v="bodyStrong" numberOfLines={1}>
          {s.name}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 4 }}>
          {line.text && line.link ? (
            // The whole price line is the "change" control (audit Nov 19: seven "Change" links read as noise).
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={line.link === 'plan' ? `${line.text}. Change ${s.name} plan` : `${line.text}. Change your price for ${s.name}`}
              onPress={() => onChange(line.link!)}
              hitSlop={{ top: 12, bottom: 12 }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            >
              <Txt v="sub" tone="mute" num>
                {line.text}
              </Txt>
              <ChevronRight color={p.mute} size={14} />
            </Pressable>
          ) : line.text ? (
            <Txt v="sub" tone="mute" num>
              {line.text}
            </Txt>
          ) : null}
          {line.link && !line.text ? <TextLink label="Add your price" a11y={`Add your price for ${s.name}`} onPress={() => onChange(line.link!)} /> : null}
        </View>
      </View>
      <View style={{ width: 44, height: 44, marginRight: -8, alignItems: 'center', justifyContent: 'center' }}>
        <TickPop on={on} />
      </View>
    </Pressable>
  );
}

/** "Tick each one. Prices for 🇺🇸 US · Change" */
function CountryLine({ onChange }: { onChange: () => void }) {
  const country = useCountry();
  return (
    <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
      <Txt v="sub" tone="fg2">
        {country ? `Tick each one. Prices for ${country.flag} ${country.code === 'GB' ? 'UK' : country.code} · ` : 'Tick each one. No local prices here · '}
      </Txt>
      <TextLink label={country ? 'Change' : 'Choose'} a11y={country ? `Prices for ${country.name}. Change country` : 'Choose a country for prices'} onPress={onChange} />
    </View>
  );
}

/**
 * "6 picked": the count gives a small springy nudge each time it changes, so a tick far down the
 * list still shows up here. Only the count moves; the monthly total beside it just switches (rule 8).
 */
function Count({ n }: { n: number }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce || n === 0) return;
    s.set(withSequence(withTiming(1.14, { duration: 80, easing: EASE_OUT }), withSpring(1, POP)));
  }, [n, reduce, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <Animated.View style={[{ transformOrigin: 'left' }, style]}>
      <Txt v="label">{n === 0 ? 'Tick what you pay for' : `${n} picked`}</Txt>
    </Animated.View>
  );
}

/** The bar above the button: "6 picked · $96.45 a month". */
function PickBar({ list, onSkip }: { list: Picked[]; onSkip: () => void }) {
  const money = useMoney();
  const home = useCountry()?.currency;
  const n = list.length;
  const unpriced = list.filter((x) => !isPriced(x)).length;
  const totals = totalsFor(list, home);
  const spoken = `${n} picked${totals.length ? `, ${totals.map((t) => money(t.monthlyMinor, t.currency)).join(' plus ')} a month` : ''}${unpriced ? `, ${unpriced} without a price yet` : ''}`;
  return (
    <View accessible accessibilityLabel={spoken} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 24, marginBottom: 12, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', flexShrink: 1 }}>
        <Count n={n} />
        {unpriced ? <Txt v="sub" tone="mute">{` · ${unpriced} need${unpriced === 1 ? 's' : ''} a price`}</Txt> : null}
      </View>
      {totals.length ? (
        <Txt v="label" num numberOfLines={1} style={{ flexShrink: 1, fontFamily: F.medium }}>
          <Txt v="moneyS" num>
            {money(totals[0].monthlyMinor, totals[0].currency)}
          </Txt>
          {totals.length > 1
            ? ` + ${totals
                .slice(1)
                .map((t) => money(t.monthlyMinor, t.currency))
                .join(' + ')}`
            : ''}
          {' a month'}
        </Txt>
      ) : n === 0 ? (
        <LinkButton label="Skip for now" onPress={onSkip} />
      ) : null}
    </View>
  );
}

/** "See my total" wakes up on the first tick: it fades to full (Button) and swells once on a spring. */
function WakeUp({ on, children }: { on: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const was = useRef(on);
  useEffect(() => {
    if (on && !was.current && !reduce) s.set(withSequence(withTiming(1.04, { duration: 110, easing: EASE_OUT }), withSpring(1, POP)));
    was.current = on;
  }, [on, reduce, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function Services() {
  const p = usePalette();
  const f = useFrame();
  const list = usePickedList();
  const { picked, toggleService, addPicks, country, setCountry, setPrice, setPlan } = useOnboarding();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'plan' | 'price' | null>(null);
  const [footerH, setFooterH] = useState(140);
  // "+ Add “Kagi” yourself": the pick waiting on its price (nothing is added until it's saved).
  const [custom, setCustom] = useState<Picked | null>(null);

  const data = useMemo(() => {
    // Anything already ticked stays findable (and untickable) even after a country change.
    const here = SERVICES.filter((s) => availableIn(s, country) || picked[s.id]);
    // Ones they added by name lead "Popular" and turn up in search.
    const own = Object.values(picked)
      .filter((x) => x.custom)
      .map(asService);
    if (query.trim()) return searchServices(query, [...own, ...here]);
    if (filter !== 'Popular') return here.filter((s) => s.category === filter);
    const popular = popularIn(country);
    const stray = here.filter((s) => picked[s.id] && !availableIn(s, country) && !popular.some((x) => x.id === s.id));
    return [...own, ...popular, ...stray];
  }, [filter, query, country, picked]);
  const total = SERVICES.filter((s) => availableIn(s, country)).length;
  const editPick = editing ? (picked[editing] ?? null) : null;
  const n = list.length;

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top, paddingHorizontal: f.edge }}>
        <StepHeaderSpace />
        {/* SE: 24pt keeps the title on one line, so the list shows a row more (audit Nov 20). */}
        <Txt
          v="title"
          accessibilityRole="header"
          style={[{ marginTop: f.tiny ? 10 : 16 }, f.tiny ? { fontSize: 22, lineHeight: 27, letterSpacing: -0.6 } : f.small ? { fontSize: 24, lineHeight: 30, letterSpacing: -0.7 } : null]}
        >
          {`What do you pay${NB}for?`}
        </Txt>
        <CountryLine onChange={() => setCountryOpen(true)} />
        <View
          style={{
            marginTop: 16,
            height: 48,
            borderRadius: 14,
            backgroundColor: p.chipBg,
            borderWidth: 1.5,
            borderColor: p.chipBorder,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 16,
          }}
        >
          <Search color={p.mute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${total} services`}
            placeholderTextColor={p.mute}
            accessibilityLabel={`Search ${total} services`}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={{ flex: 1, minWidth: 0, height: 44, paddingRight: 12, fontFamily: F.regular, fontSize: 16, color: p.fg, outlineStyle: 'none' } as object}
          />
        </View>
        {query.trim() ? null : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginHorizontal: -f.edge, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: f.edge }}>
            {FILTERS.map((x) => {
              const on = filter === x;
              return (
                <Pressable
                  key={x}
                  accessibilityRole="button"
                  accessibilityLabel={CHIP[x] ?? x}
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    if (!on) haptic.select();
                    setFilter(x);
                  }}
                  style={({ pressed }) => ({ height: 44, justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}
                >
                  <View
                    style={{
                      height: 36,
                      paddingHorizontal: 16,
                      borderRadius: radius.chip,
                      justifyContent: 'center',
                      backgroundColor: on ? p.chipOnBg : p.chipBg,
                      borderWidth: on ? 0 : 1.5,
                      borderColor: p.chipBorder,
                    }}
                  >
                    <Txt v="label" color={on ? p.chipOnFg : p.fg} maxFontSizeMultiplier={1.3}>
                      {CHIP[x] ?? x}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
        <FlatList
          style={{ flex: 1, marginTop: 4 }}
          data={data}
          keyExtractor={(s) => s.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: footerH + 8 }}
          renderItem={({ item, index }) => (
            <Row
              s={item}
              first={index === 0}
              pick={picked[item.id]}
              onToggle={() => {
                haptic.select();
                toggleService(item);
              }}
              onChange={(kind) => {
                setEditing(item.id);
                setSheet(kind);
              }}
            />
          )}
          ListEmptyComponent={
            query.trim() ? (
              // Not in our list: add it by name with their own price, right here (audit Nov 20: a dead end).
              <View>
                <Txt v="sub" tone="mute" style={{ marginTop: 12 }}>
                  {`No match for “${query.trim()}”. You can add anything by hand from your list later.`}
                </Txt>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${query.trim()} yourself`}
                  accessibilityHint="Type what you pay for it"
                  onPress={() => {
                    haptic.select();
                    setCustom(customPick(query, onboardingToday()));
                  }}
                  style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.6 : 1 })}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: p.chipBorder, backgroundColor: p.chipBg, alignItems: 'center', justifyContent: 'center' }}>
                    <Plus color={p.fg} size={18} />
                  </View>
                  <Txt v="bodyStrong" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
                    {`Add “${query.trim()}” yourself`}
                  </Txt>
                  <ChevronRight color={p.mute} size={16} />
                </Pressable>
              </View>
            ) : undefined
          }
        />
      </View>

      <View
        onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 12,
          paddingHorizontal: f.edge,
          paddingBottom: f.bottom,
          backgroundColor: p.bg,
          borderTopWidth: 1,
          borderTopColor: p.rule,
        }}
      >
        <PickBar list={list} onSkip={() => router.push('/onboarding/reminders')} />
        <WakeUp on={n > 0}>
          <Button label="See my total" disabled={n === 0} tapHaptic onPress={() => router.push('/onboarding/total')} />
        </WakeUp>
      </View>

      <CountrySheet
        visible={countryOpen}
        value={country}
        onClose={() => setCountryOpen(false)}
        onPick={(code) => {
          setCountry(code);
          setCountryOpen(false);
        }}
      />
      <PlanSheet pick={editPick} visible={sheet === 'plan'} onClose={() => setSheet(null)} onPick={(planId) => editing && setPlan(editing, planId)} onOwnPrice={() => setSheet('price')} />
      <PriceSheet
        sub={custom}
        visible={!!custom}
        onClose={() => setCustom(null)}
        onSave={(amount, currency, cycle) => {
          if (custom) addPicks([setOwnPrice(custom, amount, currency, cycle)]);
          setCustom(null);
          // Back to the list, where it now leads "Popular", ticked.
          setQuery('');
          setFilter('Popular');
        }}
      />
      <PriceSheet
        sub={editPick}
        visible={sheet === 'price'}
        onClose={() => setSheet(null)}
        onSave={(amount, currency, cycle) => {
          if (editing) setPrice(editing, amount, currency, cycle);
          setSheet(null);
        }}
      />
    </OnbRoot>
  );
}
