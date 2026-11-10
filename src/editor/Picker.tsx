// "Add a subscription" (design/v13-dates screen 5): the same picker as
// onboarding. Search, category chips, tick what you pay for, "Add 2".
// Ticked ones take the local default plan and price, with no date yet
// (they show "Add date" on Home, DECISIONS #33). Not in the list? "Add
// 'name' as your own" opens the full form. Import rows sit on top once
// import works (hidden until then, src/config/features.ts).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';

import { CHIP, FILTERS, type Filter } from '@/catalog/filters';
import { defaultPlan, planChoices, priceRow } from '@/catalog/prices';
import { SERVICES, availableIn, popularIn, searchServices, type CatalogService } from '@/catalog/services';
import { showImport } from '@/config/features';
import { shortPlanName } from '@/domain/copy';
import { CYCLE_SHORT } from '@/domain/money';
import { FREE_REMINDERS, isActive, isPending, remindedIds } from '@/domain/subs';
import { subFromPick } from '@/state/fromOnboarding';
import { useApp, useAppMoney } from '@/state/app';
import { newPick } from '@/state/picks';
import { Bell, Button, Camera, ChevronRight, F, LogoTile, Search, Tick, Txt, haptic, radius, usePalette } from '@/ui/sunflower';

function ImportRow({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${sub}. Pro`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: p.card,
        borderWidth: 1.5,
        borderColor: p.chipBorder,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
        <Camera color={p.fg} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="label" color={p.cardFg}>
          {title}
        </Txt>
        <Txt v="sub" tone="mute">
          {sub}
        </Txt>
      </View>
      <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: p.dark ? '#FFCC2E' : '#16140F', alignItems: 'center', justifyContent: 'center' }}>
        <Txt v="fine" color={p.dark ? '#16140F' : '#FFCC2E'} style={{ fontFamily: F.wideHeavy, fontSize: 11 }}>
          PRO
        </Txt>
      </View>
    </Pressable>
  );
}

/** "Track a free trial": the form with the trial switch already on (DECISIONS #39). */
function TrialRow({ onPress }: { onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Track a free trial. We'll remind you before it ends"
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={({ pressed }) => ({
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: p.card,
        borderWidth: 1.5,
        borderColor: p.chipBorder,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
        <Bell color={p.fg} size={20} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="label" color={p.cardFg}>
          Track a free trial
        </Txt>
        <Txt v="sub" tone="mute">
          We’ll remind you before it ends
        </Txt>
      </View>
      <ChevronRight color={p.mute} />
    </Pressable>
  );
}

export function Picker({ onCustom, onTrial, onClose }: { onCustom: (name: string) => void; onTrial: () => void; onClose: () => void }) {
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const { settings, today, pro } = app;
  const country = settings.country;
  const [filter, setFilter] = useState<Filter>('Popular');
  const [query, setQuery] = useState('');
  const [ticked, setTicked] = useState<string[]>([]);
  const onList = useMemo(() => new Set(app.subs.filter((s) => (isActive(s) || isPending(s)) && s.catalogId).map((s) => s.catalogId!)), [app.subs]);

  const here = useMemo(() => SERVICES.filter((s) => availableIn(s, country)), [country]);
  const data = useMemo(() => {
    const list = query.trim() ? searchServices(query, here).slice(0, 30) : filter === 'Popular' ? popularIn(country) : here.filter((s) => s.category === filter);
    // Ones already on the list go last, so the top shows what you can still add.
    return [...list.filter((s) => !onList.has(s.id)), ...list.filter((s) => onList.has(s.id))];
  }, [filter, query, country, here, onList]);

  /** "Standard · $19.99/mo", "$14.99/mo" or "Add your price". */
  const lineOf = (s: CatalogService) => {
    const row = priceRow(s.id, country);
    if (!row) return 'Add your price';
    const d = defaultPlan(row);
    const plans = planChoices(s.id, country);
    const amount = `${money(d.amountMinor, row.currency)}${CYCLE_SHORT[d.cycle]}`;
    return plans.length > 1 ? `${shortPlanName(d.name, s.name, plans.map((x) => x.name))} · ${amount}` : amount;
  };

  const toggle = (id: string) => {
    haptic.select();
    setTicked((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  };

  const add = async () => {
    const nowIso = new Date().toISOString();
    // Free reminder slots go to the first ones ticked while there's room (they need a date to fire).
    let room = pro ? 0 : FREE_REMINDERS - remindedIds(app.subs, false).size;
    const subs = ticked.map((id) => {
      const svc = SERVICES.find((s) => s.id === id)!;
      const sub = subFromPick(newPick(svc, country, today), { freePick: !pro && room > 0, nowIso });
      room -= 1;
      return { ...sub, source: 'catalog' as const };
    });
    await app.addSubs(subs);
    haptic.select();
    onClose();
  };

  const header = (
    <View>
      <Txt v="title" accessibilityRole="header" style={{ fontSize: 26, lineHeight: 32 }}>
        Add a subscription
      </Txt>
      {showImport() ? (
        <View style={{ marginTop: 14 }}>
          {/* One button: it asks Photo library (screenshots) or Files (statements). */}
          <ImportRow title="From a screenshot or statement" sub="We fill in the prices and dates" onPress={() => (onClose(), router.push('/paywall?from=import'))} />
        </View>
      ) : null}
      <View style={{ marginTop: 14 }}>
        <TrialRow onPress={onTrial} />
      </View>
      <View
        style={{
          marginTop: 14,
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
          placeholder={`Search ${here.length} services`}
          placeholderTextColor={p.mute}
          accessibilityLabel={`Search ${here.length} services`}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={{ flex: 1, minWidth: 0, height: 44, paddingRight: 12, fontFamily: F.regular, fontSize: 16, color: p.fg, outlineStyle: 'none' } as object}
        />
      </View>
      {query.trim() ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${query.trim()} as your own`}
          onPress={() => onCustom(query.trim())}
          style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1, marginTop: 4 })}
        >
          <LogoTile id="custom" size={40} mono={query.trim().slice(0, 1).toUpperCase()} color="#6B6559" />
          <Txt v="label" numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
            {`Add “${query.trim()}” as your own`}
          </Txt>
        </Pressable>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, flexGrow: 0 }} contentContainerStyle={{ gap: 8 }} keyboardShouldPersistTaps="handled">
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
                <View style={{ height: 36, paddingHorizontal: 16, borderRadius: radius.chip, justifyContent: 'center', backgroundColor: on ? p.chipOnBg : p.chipBg, borderWidth: on ? 0 : 1.5, borderColor: p.chipBorder }}>
                  <Txt v="label" color={on ? p.chipOnFg : p.fg} style={{ fontSize: 15 }}>
                    {CHIP[x] ?? x}
                  </Txt>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        renderItem={({ item, index }) => {
          const already = onList.has(item.id);
          const on = ticked.includes(item.id);
          const line = already ? 'On your list' : lineOf(item);
          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={`${item.name}, ${line}`}
              accessibilityState={{ checked: on, disabled: already }}
              disabled={already}
              onPress={() => toggle(item.id)}
              style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: already ? 0.45 : pressed ? 0.7 : 1 })}
            >
              {index ? <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
              <LogoTile id={item.id} size={40} />
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 10 }}>
                <Txt v="bodyStrong" numberOfLines={1}>
                  {item.name}
                </Txt>
                <Txt v="sub" tone="mute" num numberOfLines={1}>
                  {line}
                </Txt>
              </View>
              <View style={{ width: 44, height: 44, marginRight: -8, alignItems: 'center', justifyContent: 'center' }}>{already ? null : <Tick on={on} />}</View>
            </Pressable>
          );
        }}
      />
      <View style={{ paddingTop: 10 }}>
        <Button label={ticked.length ? `Add ${ticked.length}` : 'Tick what you pay for'} disabled={!ticked.length} onPress={add} />
      </View>
    </View>
  );
}
