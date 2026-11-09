// 2 · Tick everything you pay for

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORIES, SERVICES, type CatalogService, type Category } from '@/catalog/services';
import { PlusIcon, SearchIcon } from '@/components/icons';
import { OnboardingTopBar, TickCircle } from '@/components/onboarding';
import { Button, haptic, Screen, ServiceTile, Squish, T } from '@/components/ui';
import { CYCLE_SHORT, formatMoney, totalsByCurrency, yearlyMinor, type Cycle } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { radius, space, tabular, type, usePalette } from '@/theme/tokens';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];

export default function Tick() {
  const p = usePalette();
  const { picked, toggleService } = useOnboarding();
  const pickedList = usePickedList();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return SERVICES.filter((s) => s.name.toLowerCase().includes(q));
    if (filter === 'Popular') return SERVICES.filter((s) => s.popular);
    return SERVICES.filter((s) => s.category === filter);
  }, [filter, query]);

  const totals = totalsByCurrency(pickedList.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const count = pickedList.length;
  const totalLabel = totals.map((t) => formatMoney(t.amountMinor, t.currency, { trimWhole: true })).join(' + ');

  const next = () => router.push(count > 0 ? '/onboarding/reveal' : '/onboarding/reminders');

  const renderRow = ({ item }: { item: CatalogService }) => {
    const on = !!picked[item.id];
    return (
      <Squish
        scaleTo={0.985}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: on }}
        accessibilityLabel={`${item.name}, about ${formatMoney(item.amountMinor, item.currency)} ${cycleWord(item.cycle)}`}
        onPress={() => {
          haptic.tap();
          toggleService(item);
        }}
        style={[styles.row, { backgroundColor: on ? p.selectedSoft : p.surface }]}
      >
        <ServiceTile color={item.color} ink={item.ink} mono={item.mono} size={42} />
        <View style={{ flex: 1 }}>
          <T v="headline" numberOfLines={1}>
            {item.name}
          </T>
          <T v="subhead" tone="tertiary" style={tabular}>
            ~{formatMoney(item.amountMinor, item.currency)}
            {CYCLE_SHORT[item.cycle]}
          </T>
        </View>
        <TickCircle on={on} />
      </Squish>
    );
  };

  return (
    <Screen edges={['top']}>
      <OnboardingTopBar step={1} onSkip={() => router.push('/onboarding/reminders')} />

      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        renderItem={renderRow}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 140, gap: space.sm }}
        ListHeaderComponent={
          <View style={{ gap: space.md, paddingBottom: space.sm }}>
            <View style={{ gap: space.xs, paddingHorizontal: space.xs, paddingTop: space.sm }}>
              <T v="title1" accessibilityRole="header">
                Tick everything you pay for
              </T>
              <T v="subhead" tone="secondary">
                Typical US prices. You can fix any of them later.
              </T>
            </View>

            <View style={[styles.search, { backgroundColor: p.surfaceSunken }]}>
              <SearchIcon color={p.textTertiary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={`Search ${SERVICES.length} services`}
                placeholderTextColor={p.textTertiary}
                style={[type.body, { flex: 1, color: p.text, paddingVertical: 0 }]}
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCorrect={false}
                accessibilityLabel="Search services"
              />
            </View>

            {!query ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: space.sm, paddingRight: space.lg }}
                style={{ marginHorizontal: -space.lg, paddingLeft: space.lg }}
              >
                {FILTERS.map((f) => {
                  const on = f === filter;
                  return (
                    <Pressable
                      key={f}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: on }}
                      onPress={() => {
                        haptic.tap();
                        setFilter(f);
                      }}
                      style={[
                        styles.chip,
                        { backgroundColor: on ? p.text : p.surface, borderColor: on ? p.text : p.separator },
                      ]}
                    >
                      <T v="subhead" style={{ color: on ? p.bg : p.text, fontWeight: '600' }}>
                        {f}
                      </T>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: space.xl, alignItems: 'center', gap: space.sm }}>
            <T v="body" tone="secondary">
              No match for “{query}”.
            </T>
          </View>
        }
        ListFooterComponent={
          <Squish
            accessibilityRole="button"
            accessibilityLabel={query ? `Add ${query} as your own` : 'Add something else'}
            onPress={() => setCustomOpen(true)}
            style={[styles.row, styles.customRow, { borderColor: p.separator }]}
          >
            <View style={[styles.plus, { backgroundColor: p.surfaceSunken }]}>
              <PlusIcon color={p.text} />
            </View>
            <T v="headline" style={{ flex: 1 }}>
              {query ? `Add “${query}” as your own` : 'Something else?'}
            </T>
          </Squish>
        }
      />

      {/* sticky footer with the running total */}
      <View
        style={[
          styles.footer,
          { backgroundColor: p.scrim, borderTopColor: p.separator, paddingBottom: Math.max(insets.bottom, space.lg) + space.xs },
        ]}
      >
        <Animated.View layout={LinearTransition} style={{ flex: 1 }}>
          {count > 0 ? (
            <Animated.View key={totalLabel} entering={FadeIn.duration(180)}>
              <T v="caption" tone="tertiary">
                {count} ticked
              </T>
              <T v="headline" style={tabular} numberOfLines={1} adjustsFontSizeToFit>
                about {totalLabel} a year
              </T>
            </Animated.View>
          ) : (
            <T v="subhead" tone="tertiary">
              Tap what you pay for
            </T>
          )}
        </Animated.View>
        <Button
          label={count > 0 ? 'Next' : 'Skip for now'}
          kind={count > 0 ? 'primary' : 'secondary'}
          onPress={next}
          style={{ minWidth: 130 }}
        />
      </View>

      <CustomSheet visible={customOpen} initialName={query} onClose={() => setCustomOpen(false)} />
    </Screen>
  );
}

function cycleWord(c: Cycle) {
  return { weekly: 'a week', monthly: 'a month', quarterly: 'every 3 months', yearly: 'a year' }[c];
}

// ---------- quick custom add ----------
const CYCLES: Cycle[] = ['weekly', 'monthly', 'quarterly', 'yearly'];
const CYCLE_LABEL: Record<Cycle, string> = { weekly: 'Week', monthly: 'Month', quarterly: '3 mo', yearly: 'Year' };

function CustomSheet({ visible, initialName, onClose }: { visible: boolean; initialName: string; onClose: () => void }) {
  const p = usePalette();
  const { addCustom } = useOnboarding();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState<Cycle>('monthly');

  const amountMinor = Math.round(parseFloat(price.replace(',', '.')) * 100);
  const valid = name.trim().length > 0 && Number.isFinite(amountMinor) && amountMinor > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={() => setName(initialName)}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: p.bg }}>
        <View style={styles.sheetHeader}>
          <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8} style={styles.sheetBtn}>
            <T v="body" tone="secondary">
              Cancel
            </T>
          </Pressable>
          <T v="headline">Add your own</T>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !valid }}
            disabled={!valid}
            onPress={() => {
              haptic.success();
              addCustom({ name: name.trim(), amountMinor, cycle });
              setName('');
              setPrice('');
              setCycle('monthly');
              onClose();
            }}
            hitSlop={8}
            style={[styles.sheetBtn, { alignItems: 'flex-end' }]}
          >
            <T v="headline" tone="accent" style={{ opacity: valid ? 1 : 0.35 }}>
              Add
            </T>
          </Pressable>
        </View>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <View style={[styles.field, { backgroundColor: p.surface }]}>
            <T v="footnote" tone="tertiary">
              Name
            </T>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Gym, Patreon"
              placeholderTextColor={p.textTertiary}
              autoFocus
              style={[type.body, { color: p.text }]}
              returnKeyType="next"
            />
          </View>
          <View style={[styles.field, { backgroundColor: p.surface }]}>
            <T v="footnote" tone="tertiary">
              Price (US$)
            </T>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="9.99"
              placeholderTextColor={p.textTertiary}
              keyboardType="decimal-pad"
              style={[type.body, tabular, { color: p.text }]}
            />
          </View>
          <View style={[styles.segment, { backgroundColor: p.surfaceSunken }]}>
            {CYCLES.map((c) => {
              const on = c === cycle;
              return (
                <Pressable
                  key={c}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => setCycle(c)}
                  style={[styles.segmentItem, on && { backgroundColor: p.surface }]}
                >
                  <T v="subhead" style={{ fontWeight: on ? '600' : '400' }}>
                    {CYCLE_LABEL[c]}
                  </T>
                </Pressable>
              );
            })}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    minHeight: 68,
  },
  customRow: { borderWidth: 1.5, borderStyle: 'dashed', marginTop: space.xs },
  plus: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    minHeight: 44,
    borderRadius: radius.md,
  },
  chip: {
    paddingHorizontal: space.lg,
    minHeight: 38,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    height: 56,
  },
  sheetBtn: { minWidth: 64, minHeight: 44, justifyContent: 'center' },
  field: { borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm, gap: 2 },
  segment: { flexDirection: 'row', borderRadius: radius.md, padding: 3 },
  segmentItem: { flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
