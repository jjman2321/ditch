// 02 · What do you pay for? Tick everything; the running monthly total
// sits right above the button. Prices are the local ones for the iPhone's
// Region ("Prices for 🇬🇧 UK · Change"). Ticked rows get an inline plan
// chip; services with no checked local price say "Add your price".

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';

import { catalogPrice, planChoices } from '@/catalog/prices';
import { CATEGORIES, SERVICES, availableIn, popularIn, searchServices, type CatalogService, type Category } from '@/catalog/services';
import { CYCLE_WORDS } from '@/domain/money';
import { CountrySheet } from '@/onboarding/CountrySheet';
import { PriceSheet } from '@/onboarding/PriceSheet';
import { isPriced, totalsFor, useCountry, useMoney, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, Chip, ChevronRight, EDGE, F, LogoTile, RowDivider, Screen, Search, StepHeader, Tick, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];

/** Plan pills under a ticked row: one tap switches plan. */
function PlanPills({ pick }: { pick: Picked }) {
  const p = usePalette();
  const money = useMoney();
  const { setPlan } = useOnboarding();
  const plans = planChoices(pick.id, pick.priceCountry);
  if (pick.priceSource !== 'catalog' || plans.length < 2) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginLeft: 52, marginRight: -EDGE, marginTop: -4, marginBottom: 10, flexGrow: 0 }}
      contentContainerStyle={{ gap: 6, paddingRight: EDGE }}
      accessibilityRole="radiogroup"
      accessibilityLabel={`${pick.name} plan`}
    >
      {plans.map((plan) => {
        const on = plan.id === pick.planId;
        const price = `${money(plan.amountMinor, pick.currency!)}${plan.cycle === 'yearly' ? '/yr' : plan.cycle === 'monthly' ? '/mo' : ''}`;
        return (
          <Pressable
            key={plan.id}
            accessibilityRole="radio"
            accessibilityLabel={`${plan.name}, ${price}`}
            accessibilityState={{ selected: on }}
            hitSlop={{ top: 6, bottom: 6 }}
            onPress={() => {
              if (on) return;
              haptic.select();
              setPlan(pick.id, plan.id);
            }}
            style={({ pressed }) => ({
              height: 32,
              borderRadius: 16,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: on ? p.chipOnBg : p.chipBg,
              borderWidth: on ? 0 : 1.5,
              borderColor: p.chipBorder,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Txt v="label" color={on ? p.chipOnFg : p.fg} style={{ fontSize: 13.5 }} maxFontSizeMultiplier={1.3}>
              {plan.name}
            </Txt>
            <Txt v="sub" num color={on ? p.chipOnFg : p.mute} style={{ fontSize: 13 }} maxFontSizeMultiplier={1.3}>
              {price}
            </Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Row({ s, pick, onToggle, onAddPrice }: { s: CatalogService; pick: Picked | undefined; onToggle: () => void; onAddPrice: () => void }) {
  const p = usePalette();
  const money = useMoney();
  const { country } = useOnboarding();
  const on = !!pick;
  // Ticked: its chosen plan or own price. Not ticked: the local default plan.
  const shown = pick
    ? isPriced(pick)
      ? { amount: pick.amountMinor, currency: pick.currency, cycle: pick.cycle, own: pick.priceSource === 'user' }
      : null
    : (() => {
        const c = catalogPrice(s.id, country);
        return c ? { amount: c.amountMinor, currency: c.currency, cycle: c.cycle, own: false } : null;
      })();
  const priceText = shown ? `${shown.own ? '' : 'about '}${money(shown.amount, shown.currency)} ${CYCLE_WORDS[shown.cycle]}` : 'Add your price';
  return (
    <View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`${s.name}, ${shown ? priceText : 'no local price yet'}`}
        accessibilityState={{ checked: on }}
        onPress={onToggle}
        style={({ pressed }) => ({ minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
      >
        <LogoTile id={s.id} size={40} />
        <View style={{ flex: 1, paddingVertical: 8 }}>
          <Txt v="bodyStrong" numberOfLines={1}>
            {s.name}
          </Txt>
          {shown || !on ? (
            <Txt v="sub" tone="mute" style={{ marginTop: 1 }}>
              {priceText}
            </Txt>
          ) : null}
        </View>
        <Tick on={on} />
      </Pressable>
      {on && !shown ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add your price for ${s.name}`}
          onPress={onAddPrice}
          style={({ pressed }) => ({ marginLeft: 52, marginTop: -14, marginBottom: 6, minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1 })}
        >
          <Txt v="label" color={p.fg} style={{ fontSize: 13.5, textDecorationLine: 'underline' }}>
            Add your price
          </Txt>
          <ChevronRight color={p.fg} size={12} />
        </Pressable>
      ) : null}
      {pick ? <PlanPills pick={pick} /> : null}
    </View>
  );
}

/** Hook for the free screenshot import (DECISIONS #16). Routes to a placeholder for now. */
function ImportLink() {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Import from a screenshot"
      onPress={() => router.push('/onboarding/import')}
      style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="label" tone="fg">
        Import from a screenshot
      </Txt>
      <ChevronRight color={p.fg} size={14} />
    </Pressable>
  );
}

/** "Prices for 🇬🇧 UK · Change" */
function CountryLine({ onChange }: { onChange: () => void }) {
  const country = useCountry();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={country ? `Prices for ${country.name}. Change` : 'No local prices for your region. Choose a country'}
      onPress={onChange}
      hitSlop={{ top: 8, bottom: 8 }}
      style={({ pressed }) => ({ marginTop: 6, minHeight: 28, flexDirection: 'row', alignItems: 'center', opacity: pressed ? 0.6 : 1 })}
    >
      <Txt v="body" tone="fg2" style={{ fontSize: 14 }}>
        {country ? `Prices for ${country.flag} ${country.name} · ` : 'No local prices for your region · '}
        <Txt v="body" style={{ fontSize: 14, fontFamily: F.semi, textDecorationLine: 'underline' }}>
          {country ? 'Change' : 'Choose'}
        </Txt>
      </Txt>
    </Pressable>
  );
}

function List() {
  const p = usePalette();
  const { picked, toggleService, country, setCountry, setPrice } = useOnboarding();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [priceFor, setPriceFor] = useState<string | null>(null);
  const [priceOpen, setPriceOpen] = useState(false);

  const data = useMemo(() => {
    const here = SERVICES.filter((s) => availableIn(s, country));
    if (query.trim()) return searchServices(query, here);
    return filter === 'Popular' ? popularIn(country) : here.filter((s) => s.category === filter);
  }, [filter, query, country]);
  const total = SERVICES.filter((s) => availableIn(s, country)).length;

  return (
    <>
      <StepHeader step={1} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        What do you pay for?
      </Txt>
      <CountryLine onChange={() => setCountryOpen(true)} />
      <View
        style={{
          marginTop: 10,
          height: 46,
          borderRadius: 14,
          backgroundColor: p.chipBg,
          borderWidth: 1.5,
          borderColor: p.chipBorder,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 14,
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
          style={{ flex: 1, minWidth: 0, height: 44, fontFamily: F.regular, fontSize: 16.5, color: p.fg, outlineStyle: 'none' } as object}
        />
      </View>
      {query.trim() ? null : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12, marginRight: -EDGE, flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, paddingRight: EDGE, paddingVertical: 4 }}
        >
          {FILTERS.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      )}
      <View style={{ flex: 1, marginTop: 4 }}>
        <FlatList
          data={data}
          keyExtractor={(s) => s.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <RowDivider inset={52} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Row
              s={item}
              pick={picked[item.id]}
              onToggle={() => {
                haptic.select();
                toggleService(item);
              }}
              onAddPrice={() => {
                setPriceFor(item.id);
                setPriceOpen(true);
              }}
            />
          )}
          ListEmptyComponent={
            <Txt v="leadS" tone="fg2" style={{ marginTop: 16 }}>
              No match for “{query.trim()}”. You can add anything by hand from Home later.
            </Txt>
          }
          ListFooterComponent={<ImportLink />}
        />
        <LinearGradient pointerEvents="none" colors={[p.bg + '00', p.bg]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 26 }} />
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
      <PriceSheet
        sub={priceFor ? (picked[priceFor] ?? null) : null}
        visible={priceOpen}
        onClose={() => setPriceOpen(false)}
        onSave={(amount, currency, cycle) => {
          if (priceFor) setPrice(priceFor, amount, currency, cycle);
          setPriceOpen(false);
        }}
      />
    </>
  );
}

export default function Services() {
  const list = usePickedList();
  const money = useMoney();
  const home = useCountry()?.currency;
  const n = list.length;
  const unpriced = list.filter((x) => !isPriced(x)).length;
  const monthly = totalsFor(list, home).map((t) => money(t.monthlyMinor, t.currency));

  return (
    <Screen
      footer={
        <>
          {n > 0 ? (
            <View
              accessible
              accessibilityLabel={`${n} picked${monthly.length ? `, ${monthly.join(' plus ')} a month` : ''}${unpriced ? `, ${unpriced} without a price yet` : ''}`}
              style={{
                backgroundColor: brand.sunflower,
                borderRadius: 18,
                minHeight: 56,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
                paddingVertical: 6,
                marginBottom: 6,
                gap: 12,
              }}
            >
              <View>
                <Txt v="label" color={brand.ink}>
                  {n} picked
                </Txt>
                {unpriced ? (
                  <Txt v="sub" color={brand.ink} style={{ fontSize: 12.5 }}>
                    {unpriced} need{unpriced === 1 ? 's' : ''} a price
                  </Txt>
                ) : null}
              </View>
              {monthly.length ? (
                <View style={{ alignItems: 'flex-end', flexShrink: 1 }}>
                  <Txt v="label" color={brand.ink} num numberOfLines={1}>
                    <Txt v="moneyL" color={brand.ink} num>
                      {monthly[0]}
                    </Txt>
                    {'  a month'}
                  </Txt>
                  {monthly.length > 1 ? (
                    <Txt v="sub" color={brand.ink} num numberOfLines={1}>
                      + {monthly.slice(1).join(' + ')} a month
                    </Txt>
                  ) : null}
                </View>
              ) : null}
            </View>
          ) : null}
          <Button label="See my total" disabled={n === 0} onPress={() => router.push('/onboarding/total')} />
          {n === 0 ? <Button kind="text" label="Skip for now" onPress={() => router.push('/onboarding/reminders')} /> : null}
        </>
      }
    >
      <List />
    </Screen>
  );
}
