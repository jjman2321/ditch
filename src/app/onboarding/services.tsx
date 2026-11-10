// 2 · What do you pay for? (design/v12 render 02). Tick each one; a tick
// takes the local default plan ("Standard · $19.99/mo · Change"), and
// "Change" opens the plan sheet. The running monthly total sits above the
// button. Prices are the local ones for the iPhone's Region (DECISIONS #17);
// no checked local price means "Add your price", never a converted one.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';

import { catalogPrice, planChoices } from '@/catalog/prices';
import { CATEGORIES, SERVICES, availableIn, popularIn, searchServices, type CatalogService, type Category } from '@/catalog/services';
import { shortPlanName } from '@/domain/copy';
import { CYCLE_SHORT, yearlyMinor } from '@/domain/money';
import { CountrySheet } from '@/onboarding/CountrySheet';
import { LinkButton, OnbRoot, TextLink } from '@/onboarding/Parts';
import { PlanSheet } from '@/onboarding/PlanSheet';
import { PriceSheet } from '@/onboarding/PriceSheet';
import { isPriced, totalsFor, useCountry, useMoney, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, F, LogoTile, Search, StepHeader, Tick, Txt, haptic, radius, useFrame, usePalette } from '@/ui/sunflower';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];
/** Short chip names, so the first four fit on an iPhone 12 (design/v12 render 02). */
const CHIP: Partial<Record<Filter, string>> = {
  'Music & audio': 'Music',
  'News & reading': 'News',
  'Shopping & food': 'Shopping',
  'Cloud & security': 'Cloud',
  'Health & fitness': 'Fitness',
};
const NB = ' ';

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
      const name = pick.planName ? shortPlanName(pick.planName, s.name, plans.map((x) => x.name)) : null;
      return { text: name ? `${name} · ${amount}` : amount, link: plans.length > 1 ? 'plan' : null };
    }
    const plans = planChoices(s.id, country);
    if (plans.length > 1) {
      const c = catalogPrice(s.id, country)!;
      // The cheapest plan billed the same way as the default one.
      const same = plans.filter((x) => x.cycle === c.cycle);
      const low = same.reduce((a, b) => (yearlyMinor(b.amountMinor, b.cycle) < yearlyMinor(a.amountMinor, a.cycle) ? b : a), same[0]);
      return { text: `from ${money(low.amountMinor, c.currency)}${CYCLE_SHORT[low.cycle]}`, link: null };
    }
    const c = catalogPrice(s.id, country);
    return { text: c ? `${money(c.amountMinor, c.currency)}${CYCLE_SHORT[c.cycle]}` : 'Add your price', link: null };
  };
}

function Row({
  s,
  pick,
  first,
  onToggle,
  onChange,
}: {
  s: CatalogService;
  pick: Picked | undefined;
  first: boolean;
  onToggle: () => void;
  onChange: (kind: 'plan' | 'price') => void;
}) {
  const p = usePalette();
  const line = useRowLine()(s, pick);
  const on = !!pick;
  const spoken = line.text || 'no local price yet';
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${s.name}, ${spoken}`}
      accessibilityState={{ checked: on }}
      onPress={onToggle}
      style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
    >
      {first ? null : <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} />}
      <LogoTile id={s.id} size={40} />
      <View style={{ flex: 1, minWidth: 0, paddingVertical: 12 }}>
        <Txt v="bodyStrong" numberOfLines={1}>
          {s.name}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 4 }}>
          {line.text ? (
            <Txt v="sub" tone="mute" num>
              {line.text}
              {line.link ? ' ·' : ''}
            </Txt>
          ) : null}
          {line.link ? (
            <TextLink
              label={line.text ? 'Change' : 'Add your price'}
              a11y={line.link === 'plan' ? `Change ${s.name} plan` : `${line.text ? 'Change' : 'Add'} your price for ${s.name}`}
              onPress={() => onChange(line.link!)}
            />
          ) : null}
        </View>
      </View>
      <View style={{ width: 44, height: 44, marginRight: -8, alignItems: 'center', justifyContent: 'center' }}>
        <Tick on={on} />
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
      <Txt v="label">
        {n === 0 ? 'Tick what you pay for' : `${n} picked`}
        {unpriced ? <Txt v="sub" tone="mute">{` · ${unpriced} need${unpriced === 1 ? 's' : ''} a price`}</Txt> : null}
      </Txt>
      {totals.length ? (
        <Txt v="label" num numberOfLines={1} style={{ flexShrink: 1, fontFamily: F.medium }}>
          <Txt v="moneyS" num>
            {money(totals[0].monthlyMinor, totals[0].currency)}
          </Txt>
          {totals.length > 1 ? ` + ${totals.slice(1).map((t) => money(t.monthlyMinor, t.currency)).join(' + ')}` : ''}
          {' a month'}
        </Txt>
      ) : n === 0 ? (
        <LinkButton label="Skip for now" onPress={onSkip} />
      ) : null}
    </View>
  );
}

export default function Services() {
  const p = usePalette();
  const f = useFrame();
  const list = usePickedList();
  const { picked, toggleService, country, setCountry, setPrice, setPlan } = useOnboarding();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'plan' | 'price' | null>(null);
  const [footerH, setFooterH] = useState(140);

  const data = useMemo(() => {
    const here = SERVICES.filter((s) => availableIn(s, country));
    if (query.trim()) return searchServices(query, here);
    return filter === 'Popular' ? popularIn(country) : here.filter((s) => s.category === filter);
  }, [filter, query, country]);
  const total = SERVICES.filter((s) => availableIn(s, country)).length;
  const editPick = editing ? (picked[editing] ?? null) : null;
  const n = list.length;

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top, paddingHorizontal: f.edge }}>
        <StepHeader step={1} />
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8, marginHorizontal: -f.edge, flexGrow: 0 }}
            contentContainerStyle={{ gap: 8, paddingHorizontal: f.edge }}
          >
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
            <Txt v="leadS" tone="fg2" style={{ marginTop: 16 }}>
              {`No match for “${query.trim()}”. You can add anything by hand from your list later.`}
            </Txt>
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
        <Button label="See my total" disabled={n === 0} onPress={() => router.push('/onboarding/total')} />
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
      <PlanSheet
        pick={editPick}
        visible={sheet === 'plan'}
        onClose={() => setSheet(null)}
        onPick={(planId) => editing && setPlan(editing, planId)}
        onOwnPrice={() => setSheet('price')}
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
