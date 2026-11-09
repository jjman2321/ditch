// 02 · What do you pay for? Tick everything; the running monthly total
// sits right above the button.

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';

import { CATEGORIES, POPULAR, SERVICES, type CatalogService, type Category } from '@/catalog/services';
import { CYCLE_WORDS, formatMoney, spendTotals } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { Button, Chip, ChevronRight, EDGE, F, LogoTile, RowDivider, Screen, Search, StepHeader, Tick, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];

function Row({ s, on, onPress }: { s: CatalogService; on: boolean; onPress: () => void }) {
  const price = `about ${formatMoney(s.amountMinor, s.currency)} ${CYCLE_WORDS[s.cycle]}`;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${s.name}, ${price}`}
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
    >
      <LogoTile id={s.id} size={40} />
      <View style={{ flex: 1, paddingVertical: 8 }}>
        <Txt v="bodyStrong" numberOfLines={1}>
          {s.name}
        </Txt>
        <Txt v="sub" tone="mute" num style={{ marginTop: 1 }}>
          {price}
        </Txt>
      </View>
      <Tick on={on} />
    </Pressable>
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

function List() {
  const p = usePalette();
  const { picked, toggleService } = useOnboarding();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return SERVICES.filter((s) => s.name.toLowerCase().includes(q));
    return filter === 'Popular' ? POPULAR : SERVICES.filter((s) => s.category === filter);
  }, [filter, query]);

  return (
    <>
      <StepHeader step={1} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        What do you pay for?
      </Txt>
      <View
        style={{
          marginTop: 16,
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
          placeholder={`Search ${SERVICES.length} services`}
          placeholderTextColor={p.mute}
          accessibilityLabel={`Search ${SERVICES.length} services`}
          returnKeyType="search"
          autoCorrect={false}
          style={{ flex: 1, height: 44, fontFamily: F.regular, fontSize: 16.5, color: p.fg, outlineStyle: 'none' } as object}
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
              on={!!picked[item.id]}
              onPress={() => {
                haptic.select();
                toggleService(item);
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
        <LinearGradient
          pointerEvents="none"
          colors={[p.bg + '00', p.bg]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 26 }}
        />
      </View>
    </>
  );
}

export default function Services() {
  const list = usePickedList();
  const n = list.length;
  const monthly = spendTotals(list)
    .map((t) => formatMoney(t.monthlyMinor, t.currency))
    .join(' + ');

  return (
    <Screen
      footer={
        <>
          {n > 0 ? (
            <View
              accessible
              accessibilityLabel={`${n} picked, ${monthly} a month`}
              style={{
                backgroundColor: brand.sunflower,
                borderRadius: 18,
                minHeight: 56,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
                marginBottom: 6,
              }}
            >
              <Txt v="label" color={brand.ink}>
                {n} picked
              </Txt>
              <Txt v="label" color={brand.ink} num>
                <Txt v="moneyL" color={brand.ink} num>
                  {monthly}
                </Txt>
                {'  a month'}
              </Txt>
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
