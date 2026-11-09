// 2 · What do you pay for?

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORIES, SERVICES, type CatalogService, type Category } from '@/catalog/services';
import { PlusIcon, SearchIcon } from '@/components/icons';
import { Btn, Check, LogoTile, Option, Say, Screen, TopBar } from '@/components/kit';
import { haptic } from '@/components/ui';
import { CYCLE_SHORT, formatMoney, totalsByCurrency, yearlyMinor, type Cycle } from '@/domain/money';
import { useOnboarding, usePickedList } from '@/state/onboarding';
import { font, ink, num, text } from '@/theme/brand';

type Filter = 'Popular' | Category;
const FILTERS: Filter[] = ['Popular', ...CATEGORIES];

export default function TickScreen() {
  const insets = useSafeAreaInsets();
  const { picked, toggleService } = useOnboarding();
  const pickedList = usePickedList();
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [customOpen, setCustomOpen] = useState(false);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return SERVICES.filter((s) => s.name.toLowerCase().includes(q));
    if (filter === 'Popular') return SERVICES.filter((s) => s.popular);
    return SERVICES.filter((s) => s.category === filter);
  }, [filter, query]);

  const count = pickedList.length;
  const totals = totalsByCurrency(pickedList.map((x) => ({ currency: x.currency, amountMinor: yearlyMinor(x.amountMinor, x.cycle) })));
  const totalLabel = totals.map((t) => formatMoney(t.amountMinor, t.currency, { trimWhole: true }).replace(/\.\d\d$/, '')).join(' + ');
  const next = () => router.push(count > 0 ? '/onboarding/reveal' : '/onboarding/reminders');

  const renderRow = ({ item }: { item: CatalogService }) => {
    const on = !!picked[item.id];
    return (
      <Option selected={on} onPress={() => toggleService(item)} label={`${item.name}, about ${formatMoney(item.amountMinor, item.currency)}`}>
        <LogoTile id={item.id} color={item.color} ink={item.ink} mono={item.mono} size={42} />
        <View style={{ flex: 1 }}>
          <Text style={text.bodyStrong} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[text.small, num]}>
            ~{formatMoney(item.amountMinor, item.currency)}
            {CYCLE_SHORT[item.cycle]}
          </Text>
        </View>
        <Check on={on} />
      </Option>
    );
  };

  return (
    <Screen edges={['top']}>
      <TopBar progress={0.15 + Math.min(count, 6) * 0.025} onSkip={() => router.push('/onboarding/reminders')} />
      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        renderItem={renderRow}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 140 + insets.bottom, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 16, paddingBottom: 6 }}>
            <Say pose="wave" size={92}>
              What do you pay for? Tap them all!
            </Say>
            <View style={styles.search}>
              <SearchIcon color={ink.textFaint} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={`Search ${SERVICES.length} services`}
                placeholderTextColor={ink.textFaint}
                style={styles.searchInput}
                autoCorrect={false}
                clearButtonMode="while-editing"
                accessibilityLabel="Search services"
              />
            </View>
            {!query ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}>
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
                      style={[styles.chip, on && { backgroundColor: ink.tealSoft, borderColor: ink.teal }]}
                    >
                      <Text style={[text.label, { fontFamily: font.heavy, color: on ? ink.tealInk : ink.textSoft }]}>{f}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        }
        ListEmptyComponent={<Text style={[text.body, { textAlign: 'center', paddingVertical: 24 }]}>No match for “{query}”.</Text>}
        ListFooterComponent={
          <Option selected={false} onPress={() => setCustomOpen(true)} label="Add something else" style={{ borderStyle: 'dashed' }}>
            <View style={styles.plus}>
              <PlusIcon color={ink.textSoft} />
            </View>
            <Text style={text.bodyStrong}>{query ? `Add “${query}”` : 'Something else?'}</Text>
          </Option>
        }
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 2 }]}>
        <View style={{ flex: 1 }}>
          {count > 0 ? (
            <>
              <Text style={[text.small, { fontFamily: font.heavy }]}>{count} PICKED</Text>
              <Text style={[text.heading, num]} numberOfLines={1} adjustsFontSizeToFit>
                ~{totalLabel} a year
              </Text>
            </>
          ) : (
            <Text style={text.label}>Tap what you pay for</Text>
          )}
        </View>
        <Btn label={count > 0 ? 'Continue' : 'Skip'} kind={count > 0 ? 'primary' : 'secondary'} onPress={next} style={{ minWidth: 150 }} />
      </View>

      <CustomSheet visible={customOpen} initialName={query} onClose={() => setCustomOpen(false)} />
    </Screen>
  );
}

const CYCLES: Cycle[] = ['weekly', 'monthly', 'quarterly', 'yearly'];
const CYCLE_LABEL: Record<Cycle, string> = { weekly: 'Week', monthly: 'Month', quarterly: '3 months', yearly: 'Year' };

function CustomSheet({ visible, initialName, onClose }: { visible: boolean; initialName: string; onClose: () => void }) {
  const { addCustom } = useOnboarding();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const amountMinor = Math.round(parseFloat(price.replace(',', '.')) * 100);
  const valid = name.trim().length > 0 && Number.isFinite(amountMinor) && amountMinor > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onShow={() => setName(initialName)} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: ink.bg, padding: 20, gap: 14 }}>
        <Text style={[text.title, { marginTop: 8 }]}>Add your own</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Name (Gym, Patreon…)" placeholderTextColor={ink.textFaint} autoFocus style={styles.input} />
        <TextInput value={price} onChangeText={setPrice} placeholder="Price, e.g. 9.99" placeholderTextColor={ink.textFaint} keyboardType="decimal-pad" style={[styles.input, num]} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {CYCLES.map((c) => (
            <Pressable
              key={c}
              accessibilityRole="radio"
              accessibilityState={{ selected: c === cycle }}
              onPress={() => setCycle(c)}
              style={[styles.chip, { flex: 1, alignItems: 'center' }, c === cycle && { backgroundColor: ink.tealSoft, borderColor: ink.teal }]}
            >
              <Text style={[text.label, { fontFamily: font.heavy, color: c === cycle ? ink.tealInk : ink.textSoft }]}>{CYCLE_LABEL[c]}</Text>
            </Pressable>
          ))}
        </View>
        <Btn
          label="Add it"
          disabled={!valid}
          onPress={() => {
            haptic.success();
            addCustom({ name: name.trim(), amountMinor, cycle });
            setName('');
            setPrice('');
            onClose();
          }}
        />
        <Btn label="Cancel" kind="ghost" onPress={onClose} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: ink.line, backgroundColor: ink.soft },
  searchInput: { flex: 1, fontFamily: font.bold, fontSize: 16, color: ink.text },
  chip: { height: 40, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderBottomWidth: 3, borderColor: ink.line, backgroundColor: ink.white, justifyContent: 'center' },
  plus: { width: 42, height: 42, borderRadius: 12, backgroundColor: ink.soft, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingTop: 14, backgroundColor: ink.bg, borderTopWidth: 2, borderTopColor: ink.line },
  input: { height: 54, borderRadius: 16, borderWidth: 2, borderColor: ink.line, backgroundColor: ink.soft, paddingHorizontal: 16, fontFamily: font.bold, fontSize: 17, color: ink.text },
});
