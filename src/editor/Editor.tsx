// Add / edit a subscription, in a sheet that can open from anywhere
// (Home's +, quick add, a row tap, the calendar). Catalog search pre-fills
// the local price, marked as an estimate until the user changes it.
// The date uses the same calendar sheet as onboarding.

import { router } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, TextInput, View } from 'react-native';

import { catalogPrice, planChoices } from '@/catalog/prices';
import { SERVICES, SERVICE_BY_ID, availableIn, popularIn, searchServices, type CatalogService } from '@/catalog/services';
import { guessNextCharge } from '@/domain/charges';
import { type DateOnly } from '@/domain/dates';
import { CYCLE_WORDS, currencyDigits, formatMoney, parseAmountInput, type Cycle } from '@/domain/money';
import { leadsLabel, shortTimeLabel, effectiveLeads } from '@/domain/settings';
import { FREE_REMINDERS, chargeOfSub, isActive, isProTrial, makeSub, remindedIds, type Sub } from '@/domain/subs';
import { rowLine, SubLogo } from '@/home/SubRow';
import { DateBody } from '@/onboarding/DateSheet';
import { useApp, useAppMoney } from '@/state/app';
import { chooseCycle, choosePlan, newPick, type Picked } from '@/state/picks';
import { ask } from '@/ui/alert';
import { Button, Card, ChevronRight, Chip, F, GuessTag, LogoTile, Search, Segmented, Sheet, SunSwitch, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

type Open = { mode: 'add'; catalogId?: string } | { mode: 'edit'; id: string };

const Ctx = createContext<{ openAdd: (catalogId?: string) => void; openEdit: (id: string) => void } | null>(null);

export function useEditor() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useEditor must be inside EditorProvider');
  return v;
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open | null>(null);
  const [visible, setVisible] = useState(false);
  const openAdd = useCallback((catalogId?: string) => {
    setOpen({ mode: 'add', catalogId });
    setVisible(true);
  }, []);
  const openEdit = useCallback((id: string) => {
    setOpen({ mode: 'edit', id });
    setVisible(true);
  }, []);
  const value = useMemo(() => ({ openAdd, openEdit }), [openAdd, openEdit]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <Sheet visible={visible} onClose={() => setVisible(false)} maxHeight={780} label={open?.mode === 'edit' ? 'Edit subscription' : 'Add a subscription'}>
        {open ? <EditorBody key={JSON.stringify(open)} open={open} close={() => setVisible(false)} /> : null}
      </Sheet>
    </Ctx.Provider>
  );
}

/** The date sheet works on onboarding's Picked shape; a sub maps onto it 1:1. */
function asPick(s: Sub): Picked {
  const svc = s.catalogId ? SERVICE_BY_ID[s.catalogId] : undefined;
  return {
    id: s.catalogId ?? s.id,
    name: s.name,
    category: s.category ?? undefined,
    color: svc?.color ?? '#6B6559',
    ink: svc?.ink,
    mono: svc?.mono ?? (s.name.trim().slice(0, 1).toUpperCase() || '?'),
    cycle: s.cycle,
    amountMinor: s.amountMinor,
    currency: s.currency,
    planId: s.planId,
    planName: s.planName,
    priceSource: s.priceSource,
    priceCountry: s.priceCountry,
    amountIsEstimate: s.amountIsEstimate,
    anchor: s.anchor,
    dateSource: s.dateSource,
  };
}

function fromPick(s: Sub, p: Picked): Sub {
  return {
    ...s,
    cycle: p.cycle,
    amountMinor: p.amountMinor,
    currency: p.currency,
    planId: p.planId,
    planName: p.planName,
    priceSource: p.priceSource,
    priceCountry: p.priceCountry,
    amountIsEstimate: p.amountIsEstimate,
    anchor: p.anchor,
    dateSource: p.dateSource,
  };
}

function withService(s: Sub, svc: CatalogService, country: string | null, today: DateOnly): Sub {
  const p = newPick(svc, country, today);
  return fromPick({ ...s, catalogId: svc.id, name: svc.name, category: svc.category, source: 'catalog' }, p);
}

const amountText = (s: Sub) => (s.amountMinor === null || !s.currency ? '' : (s.amountMinor / 10 ** currencyDigits(s.currency)).toFixed(currencyDigits(s.currency)));

const CYCLES: { value: Cycle; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: '3 months' },
  { value: 'yearly', label: 'Yearly' },
];

const COMMON = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'INR', 'JPY'];

function FieldLabel({ children }: { children: string }) {
  return (
    <Txt v="eyebrow" tone="mute" style={{ marginTop: 18, marginBottom: 8, marginHorizontal: 2 }}>
      {children}
    </Txt>
  );
}

function EditorBody({ open, close }: { open: Open; close: () => void }) {
  const p = usePalette();
  const app = useApp();
  const money = useAppMoney();
  const { settings, today, pro } = app;
  const country = settings.country;

  const existing = open.mode === 'edit' ? app.subs.find((s) => s.id === open.id) ?? null : null;
  const [draft, setDraft] = useState<Sub>(() => {
    if (existing) return existing;
    const base = makeSub({ name: '', cycle: 'monthly', anchor: today, dateSource: 'guess', currency: settings.currency, source: 'manual' });
    const svc = open.mode === 'add' && open.catalogId ? SERVICE_BY_ID[open.catalogId] : undefined;
    const picked = svc ? withService(base, svc, country, today) : base;
    // New ones get a reminder when there's room in the free 3.
    const room = pro || remindedIds(app.subs, false).size < FREE_REMINDERS;
    return { ...picked, freePick: !pro && room, currency: picked.currency ?? settings.currency };
  });
  const [query, setQuery] = useState(existing?.name ?? draft.name);
  const [searching, setSearching] = useState(open.mode === 'add' && !draft.catalogId);
  const [amount, setAmount] = useState(amountText(draft));
  const [step, setStep] = useState<'form' | 'date'>('form');

  const isNew = open.mode === 'add';
  const trialEntry = isProTrial(draft);
  const currency = draft.currency ?? settings.currency;
  const typed = parseAmountInput(amount, currency);

  const matches = useMemo(() => {
    if (!query.trim()) return popularIn(country, 6);
    return searchServices(query, SERVICES.filter((s) => availableIn(s, country))).slice(0, 6);
  }, [query, country]);

  if (open.mode === 'edit' && !existing) return null;

  const pickService = (svc: CatalogService) => {
    haptic.select();
    const next = withService(draft, svc, country, today);
    setDraft(next);
    setQuery(svc.name);
    setAmount(amountText(next));
    setSearching(false);
  };

  const keepCustom = () => {
    const name = query.trim();
    if (!name) return;
    setDraft({ ...draft, name, catalogId: null, category: null, anchor: guessNextCharge(name, draft.cycle, today), dateSource: 'guess' });
    setSearching(false);
  };

  const setAmountText = (t: string) => {
    setAmount(t);
    const v = parseAmountInput(t, currency);
    setDraft((d) => ({ ...d, amountMinor: v, currency, priceSource: v ? 'user' : d.priceSource === 'catalog' ? 'none' : d.priceSource, amountIsEstimate: false, planId: null, planName: null }));
  };

  const setCurrency = (c: string) => {
    haptic.select();
    const v = parseAmountInput(amount, c);
    setDraft((d) => ({ ...d, currency: c, amountMinor: v, priceSource: v ? 'user' : 'none', amountIsEstimate: false, planId: null, planName: null }));
  };

  const setCycle = (c: Cycle) => {
    if (draft.priceSource === 'catalog') {
      const moved = chooseCycle(asPick(draft), c);
      if (moved.cycle === c) {
        const next = fromPick(draft, moved);
        setDraft(next);
        setAmount(amountText(next));
        return;
      }
    }
    setDraft({ ...draft, cycle: c, priceSource: draft.amountMinor ? 'user' : 'none', amountIsEstimate: false, planId: null, planName: null });
  };

  const plans = draft.catalogId && draft.priceSource === 'catalog' ? planChoices(draft.catalogId, draft.priceCountry) : [];

  // Reminders: free covers 3 (the Pro trial entry is always on).
  const othersOn = remindedIds(app.subs.filter((s) => s.id !== draft.id), false).size;
  const remindOn = trialEntry || (pro ? !draft.muted : draft.freePick);
  const atLimit = !pro && !draft.freePick && othersOn >= FREE_REMINDERS;
  const toggleRemind = (v: boolean) => {
    if (v && atLimit) {
      haptic.warning();
      AccessibilityInfo.announceForAccessibility('Free covers 3 reminders. Turn one off first, or try Pro.');
      return;
    }
    haptic.select();
    setDraft(pro ? { ...draft, muted: !v } : { ...draft, freePick: v });
  };

  const save = async () => {
    const name = (draft.name || query).trim();
    if (!name) return;
    const final: Sub = { ...draft, name, currency: draft.amountMinor ? currency : draft.currency };
    if (isNew) await app.addSub(final);
    else await app.saveSub(final);
    haptic.select();
    close();
  };

  const remove = () =>
    ask(`Delete ${draft.name}?`, 'It comes off your list and its reminders stop. This doesn’t cancel the subscription itself.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await app.removeSub(draft.id);
          close();
        },
      },
    ]);

  const ditchIt = async () => {
    close();
    await app.ditch(draft.id);
    router.push(`/ditch/${draft.id}?fresh=1`);
  };

  if (step === 'date') {
    return (
      <View style={{ flex: 1 }}>
        <Button kind="text" label="Back" onPress={() => setStep('form')} style={{ alignSelf: 'flex-start', marginTop: -8, marginLeft: -12 }} />
        <DateBody
          sub={asPick(draft)}
          onSave={(anchor, source, cycle) => {
            const moved = cycle !== draft.cycle ? fromPick(draft, chooseCycle(asPick(draft), cycle)) : draft;
            setDraft({ ...moved, cycle, anchor, dateSource: source });
            setAmount(amountText(moved));
            setStep('form');
          }}
          onGuess={() => {
            setDraft({ ...draft, anchor: guessNextCharge(draft.catalogId ?? draft.name, draft.cycle, today), dateSource: 'guess' });
            setStep('form');
          }}
        />
      </View>
    );
  }

  const charge = chargeOfSub(draft, today);
  const canSave = !!(draft.name || query).trim() && (!amount || typed !== null);
  const catalogLine =
    draft.priceSource === 'catalog' && draft.amountMinor && draft.currency ? `Typical ${draft.planName ? `${draft.planName} ` : ''}price. Change it if yours is different.` : null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {draft.catalogId || draft.name || trialEntry ? <SubLogo sub={{ ...draft, name: draft.name || query || '?' }} size={44} /> : <LogoTile id="?" size={44} mono="+" color={brand.sunflower} ink={brand.ink} />}
          <Txt v="heading" accessibilityRole="header" style={{ flex: 1 }} numberOfLines={2}>
            {isNew ? (draft.catalogId ? `Add ${draft.name}` : 'Add a subscription') : trialEntry ? 'Ditch Pro trial' : draft.name}
          </Txt>
        </View>

        {trialEntry ? null : (
          <>
            <FieldLabel>Name</FieldLabel>
            <View style={{ height: 52, borderRadius: 14, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
              {isNew ? <Search color={p.mute} /> : null}
              <TextInput
                value={query}
                onChangeText={(t) => {
                  setQuery(t);
                  if (isNew) setSearching(true);
                  else setDraft({ ...draft, name: t });
                }}
                autoFocus={isNew && !draft.catalogId}
                placeholder="Netflix, gym, phone plan…"
                placeholderTextColor={p.mute}
                accessibilityLabel="Name"
                returnKeyType="done"
                onSubmitEditing={() => (searching ? (matches[0] && matches[0].name.toLowerCase() === query.trim().toLowerCase() ? pickService(matches[0]) : keepCustom()) : null)}
                style={{ flex: 1, minWidth: 0, height: 48, fontFamily: F.semi, fontSize: 17, color: p.fg, outlineStyle: 'none' } as object}
              />
            </View>
            {searching ? (
              <Card style={{ marginTop: 8, paddingVertical: 4 }}>
                {matches.map((svc) => {
                  const c = catalogPrice(svc.id, country);
                  return (
                    <Pressable
                      key={svc.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${svc.name}${c ? `, about ${formatMoney(c.amountMinor, c.currency)} ${CYCLE_WORDS[c.cycle]}` : ''}`}
                      onPress={() => pickService(svc)}
                      style={({ pressed }) => ({ minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, opacity: pressed ? 0.7 : 1 })}
                    >
                      <LogoTile id={svc.id} size={32} />
                      <Txt v="label" style={{ flex: 1 }} numberOfLines={1}>
                        {svc.name}
                      </Txt>
                      {c ? (
                        <Txt v="sub" tone="mute" num>
                          about {money(c.amountMinor, c.currency)}
                        </Txt>
                      ) : null}
                    </Pressable>
                  );
                })}
                {query.trim() ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${query.trim()} as your own`}
                    onPress={keepCustom}
                    style={({ pressed }) => ({ minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, opacity: pressed ? 0.7 : 1 })}
                  >
                    <LogoTile id="custom" size={32} mono={query.trim().slice(0, 1).toUpperCase()} color="#6B6559" />
                    <Txt v="label" style={{ flex: 1 }} numberOfLines={1}>
                      Add “{query.trim()}” as your own
                    </Txt>
                  </Pressable>
                ) : null}
              </Card>
            ) : null}
          </>
        )}

        {searching ? null : (
          <>
            {plans.length ? (
              <>
                <FieldLabel>Plan</FieldLabel>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {plans.map((pl) => (
                    <Chip
                      key={pl.id}
                      label={pl.name}
                      selected={pl.id === draft.planId}
                      onPress={() => {
                        haptic.select();
                        const next = fromPick(draft, choosePlan(asPick(draft), pl.id));
                        setDraft(next);
                        setAmount(amountText(next));
                      }}
                    />
                  ))}
                </ScrollView>
              </>
            ) : null}

            <FieldLabel>Price</FieldLabel>
            <View style={{ height: 56, borderRadius: 14, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 6 }}>
              <Txt v="moneyL" tone="mute">
                {formatMoney(0, currency).replace(/[\d.,\s]/g, '') || currency}
              </Txt>
              <TextInput
                value={amount}
                onChangeText={setAmountText}
                editable={!trialEntry}
                keyboardType="decimal-pad"
                placeholder={currencyDigits(currency) ? '0.00' : '0'}
                placeholderTextColor={p.mute}
                accessibilityLabel={`Price in ${currency}`}
                style={{ flex: 1, minWidth: 0, height: 52, fontFamily: F.wideHeavy, fontSize: 22, color: p.fg, outlineStyle: 'none' } as object}
              />
              <Txt v="sub" tone="mute">
                {currency}
              </Txt>
            </View>
            {catalogLine ? (
              <Txt v="sub" tone="mute" style={{ marginTop: 6, marginHorizontal: 2 }}>
                {catalogLine}
              </Txt>
            ) : null}
            {trialEntry ? null : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 10 }}>
                {[...new Set([settings.currency, currency, ...COMMON])].map((c) => (
                  <Chip key={c} label={c} selected={c === currency} onPress={() => setCurrency(c)} />
                ))}
              </ScrollView>
            )}

            <FieldLabel>How often</FieldLabel>
            <Segmented label="How often it charges" value={draft.cycle} onChange={setCycle} options={CYCLES} fontSize={13.5} />

            <FieldLabel>{draft.isTrial ? 'Trial ends' : 'Next charge'}</FieldLabel>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${draft.isTrial ? 'Trial ends' : 'Next charge'}, ${draft.dateSource === 'guess' ? 'guess: around ' : ''}${rowLine({ ...draft, status: 'active' }, charge, today)}`}
              accessibilityHint="Opens a calendar"
              disabled={trialEntry}
              onPress={() => setStep('date')}
              style={({ pressed }) => ({
                minHeight: 52,
                borderRadius: 14,
                backgroundColor: p.chipBg,
                borderWidth: 1.5,
                borderColor: draft.dateSource === 'guess' ? p.guessBorder : p.chipBorder,
                borderStyle: draft.dateSource === 'guess' ? 'dashed' : 'solid',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                gap: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Txt v="label" num style={{ fontSize: 16 }}>
                {rowLine({ ...draft, status: 'active', isTrial: false, kind: 'user', dateSource: 'next' }, charge, today)}
              </Txt>
              {draft.dateSource === 'guess' ? <GuessTag /> : null}
              <View style={{ flex: 1 }} />
              {trialEntry ? null : <ChevronRight color={p.mute} />}
            </Pressable>
            {draft.dateSource === 'guess' && !trialEntry ? (
              <Txt v="sub" tone="mute" style={{ marginTop: 6, marginHorizontal: 2 }}>
                A guess for now. Tap it to set the real day, so reminders are exact.
              </Txt>
            ) : null}

            <Card style={{ marginTop: 18, paddingHorizontal: 16, paddingVertical: 4 }}>
              {trialEntry ? null : (
                <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: p.hair }}>
                  <Txt v="label" style={{ flex: 1 }}>
                    It’s a free trial
                  </Txt>
                  <SunSwitch label="It’s a free trial" value={draft.isTrial} onValueChange={(v) => setDraft({ ...draft, isTrial: v })} />
                </View>
              )}
              <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Txt v="label">Remind me</Txt>
                  <Txt v="sub" tone="mute">
                    {atLimit
                      ? `Free covers ${FREE_REMINDERS}. Turn one off in Settings, or try Pro.`
                      : `${leadsLabel(trialEntry ? [3, 1] : effectiveLeads(settings, pro))}, at ${shortTimeLabel(settings.reminderTime)}`}
                  </Txt>
                </View>
                <SunSwitch label="Remind me" hint={atLimit ? 'Free covers 3 reminders' : undefined} value={remindOn} disabled={trialEntry} onValueChange={toggleRemind} />
              </View>
              {atLimit ? (
                <Button
                  kind="text"
                  label="Try Pro for reminders on everything"
                  onPress={() => {
                    close();
                    router.push('/paywall?from=app');
                  }}
                  style={{ alignSelf: 'flex-start', marginLeft: -20, marginTop: -6 }}
                />
              ) : null}
            </Card>

            {!isNew && existing && isActive(existing) ? (
              <View style={{ marginTop: 18, gap: 4 }}>
                <Button kind="secondary" label={trialEntry ? 'Ditch the trial' : `Ditch ${existing.name}`} onPress={ditchIt} />
                <Button kind="text" danger label="Delete from my list" onPress={remove} />
              </View>
            ) : !isNew ? (
              <Button kind="text" danger label="Delete from my list" onPress={remove} style={{ marginTop: 12 }} />
            ) : null}
            <View style={{ height: 12 }} />
          </>
        )}
      </ScrollView>
      {searching ? null : (
        <View style={{ paddingTop: 10 }}>
          <Button label={isNew ? `Add ${draft.name || query.trim() || 'it'}` : 'Save'} disabled={!canSave} onPress={save} />
        </View>
      )}
    </View>
  );
}
