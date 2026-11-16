// Add / edit a subscription, in a sheet that can open from anywhere
// (Home's +, quick add, a row tap, the calendar). Catalog search pre-fills
// the local price, marked as an estimate until the user changes it.
// The date uses the same calendar sheet as onboarding.

import { router } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, TextInput, View } from 'react-native';

import { catalogPrice, planChoices, priceRow } from '@/catalog/prices';
import { SERVICES, SERVICE_BY_ID, availableIn, popularIn, searchServices, type CatalogService } from '@/catalog/services';
import { shortDate, weekdayDate, weekdayShort, type DateOnly } from '@/domain/dates';
import { headsUpBody, reminderDaysFor, trialBody } from '@/domain/reminders';
import { now as clockNow } from '@/services/clock';
import { shortPlanName } from '@/domain/copy';
import { CYCLE_SHORT, CYCLE_WORDS, currencyDigits, formatMoney, parseAmountInput, type Cycle } from '@/domain/money';
import { leadsLabel, shortTimeLabel, effectiveLeads } from '@/domain/settings';
import { previousCharge } from '@/domain/charges';
import { FREE_REMINDERS, chargeOfSub, isActive, isProTrial, makeSub, remindedIds, type Sub } from '@/domain/subs';
import { rowLine, SubLogo } from '@/home/SubRow';
import { DateBody } from '@/onboarding/DateSheet';

import { ForgottenBody } from '@/home/Forgotten';

import { Picker } from './Picker';
import { useApp, useAppMoney } from '@/state/app';
import { chooseCycle, choosePlan, newPick, type Picked } from '@/state/picks';
import { ask } from '@/ui/alert';
import { suggestService } from '@/settings/feedback';
import { yearlySaving } from '@/domain/priceWatch';
import { Button, Card, ChevronRight, Chip, F, KEYBOARD_DONE, KeyboardDone, LogoTile, NotificationPreview, Search, Segmented, Sheet, SunSwitch, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

/**
 * add: the picker first; `custom` is a name typed there (the full form);
 * `catalogId` opens one service's form; `trial` opens the form as a free trial.
 */
type Open = { mode: 'add'; catalogId?: string; custom?: string; trial?: boolean } | { mode: 'edit'; id: string } | { mode: 'forgotten' };

const Ctx = createContext<{ openAdd: (catalogId?: string) => void; openEdit: (id: string) => void; openForgotten: () => void } | null>(null);

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
  const openForgotten = useCallback(() => {
    setOpen({ mode: 'forgotten' });
    setVisible(true);
  }, []);
  const app = useApp();
  const value = useMemo(() => ({ openAdd, openEdit, openForgotten }), [openAdd, openEdit, openForgotten]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <Sheet visible={visible} onClose={() => setVisible(false)} maxHeight={780} closeButton label={open?.mode === 'edit' ? 'Edit subscription' : open?.mode === 'forgotten' ? 'Find the ones you forgot' : 'Add a subscription'}>
        {open?.mode === 'forgotten' ? (
          <ForgottenBody
            onAdd={() => setOpen({ mode: 'add' })}
            onDone={() => {
              setVisible(false);
              if (!app.settings.forgottenDone) app.updateSettings({ forgottenDone: true });
            }}
          />
        ) : open?.mode === 'add' && !open.catalogId && open.custom === undefined ? (
          <Picker
            onCustom={(name) => setOpen({ mode: 'add', custom: name })}
            onTrial={() => setOpen({ mode: 'add', custom: '', trial: true })}
            onForgotten={() => setOpen({ mode: 'forgotten' })}
            onClose={() => setVisible(false)}
          />
        ) : open ? (
          <EditorBody key={JSON.stringify(open)} open={open} close={() => setVisible(false)} />
        ) : null}
      </Sheet>
    </Ctx.Provider>
  );
}

/** The date sheet works on onboarding's Picked shape; a sub maps onto it 1:1. */
export function asPick(s: Sub): Picked {
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
const OTHER_CYCLES: { value: Cycle; label: string }[] = [
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'semiannual', label: 'Every 6 months' },
];

const COMMON = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'INR', 'JPY'];

/** One labelled line in "For when you cancel". Empty saves as nothing, not "". */
function DetailInput({ label, placeholder, value, onChange, keyboard, last }: { label: string; placeholder: string; value: string | null; onChange: (v: string | null) => void; keyboard?: 'email-address'; last?: boolean }) {
  const p = usePalette();
  return (
    <View style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: p.hair }}>
      <Txt v="label" style={{ width: 118 }}>
        {label}
      </Txt>
      <TextInput
        value={value ?? ''}
        onChangeText={(t) => onChange(t.trim() ? t : null)}
        placeholder={placeholder}
        placeholderTextColor={p.mute}
        accessibilityLabel={label}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize={keyboard ? 'none' : 'sentences'}
        autoCorrect={!keyboard}
        maxLength={keyboard ? 120 : 200}
        inputAccessoryViewID={KEYBOARD_DONE}
        style={{ flex: 1, minWidth: 0, minHeight: 48, fontFamily: F.regular, fontSize: 16, color: p.fg, textAlign: 'right', outlineStyle: 'none' } as object}
      />
    </View>
  );
}

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
    const custom = open.mode === 'add' ? open.custom?.trim() : undefined;
    const base = makeSub({ name: custom ?? '', cycle: 'monthly', anchor: today, dateSource: 'none', currency: settings.currency, source: 'manual' });
    const svc = open.mode === 'add' && open.catalogId ? SERVICE_BY_ID[open.catalogId] : undefined;
    const picked = svc ? withService(base, svc, country, today) : base;
    // New ones get a reminder when there's room in the free 3.
    const room = pro || remindedIds(app.subs, false).size < FREE_REMINDERS;
    const trial = open.mode === 'add' && !!open.trial;
    return { ...picked, isTrial: trial, freePick: !pro && room, currency: picked.currency ?? settings.currency };
  });
  const [query, setQuery] = useState(existing?.name ?? draft.name);
  const [searching, setSearching] = useState(open.mode === 'add' && !draft.catalogId && !draft.name);
  const [amount, setAmount] = useState(amountText(draft));
  const [step, setStep] = useState<'form' | 'date'>('form');

  const isNew = open.mode === 'add';
  const trialEntry = isProTrial(draft);
  const currency = draft.currency ?? settings.currency;
  // Over 99,999 per charge is almost always a typo, and it breaks every total.
  const MAX_MINOR = 99_999 * 10 ** currencyDigits(currency);
  const parsed = parseAmountInput(amount, currency);
  const typed = parsed !== null && parsed > MAX_MINOR ? null : parsed;
  const priceProblem = amount.trim() && typed === null;

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
    setDraft({ ...draft, name, catalogId: null, category: null });
    setSearching(false);
  };

  const setAmountText = (t: string) => {
    setAmount(t);
    const raw = parseAmountInput(t, currency);
    const v = raw !== null && raw > 99_999 * 10 ** currencyDigits(currency) ? null : raw;
    setDraft((d) => ({ ...d, amountMinor: v, currency, priceSource: v ? 'user' : d.priceSource === 'catalog' ? 'none' : d.priceSource, amountIsEstimate: false, planId: null, planName: null }));
  };

  const setCurrency = (c: string) => {
    haptic.select();
    // Rewrite the number for the new currency's decimals ("20.00" becomes "20" in yen).
    const before = parseAmountInput(amount, currency);
    const text = before === null ? amount : (before / 10 ** currencyDigits(currency)).toFixed(currencyDigits(c));
    if (text !== amount) setAmount(text);
    const v = parseAmountInput(text, c);
    setDraft((d) => ({ ...d, currency: c, amountMinor: v, priceSource: v ? 'user' : 'none', amountIsEstimate: false, planId: null, planName: null }));
  };

  const setCycle = (c: Cycle) => {
    if (draft.priceSource === 'catalog') {
      const moved = chooseCycle(asPick(draft), c);
      if (moved.cycle === c) {
        // A new cycle moves the charges, so a "skip this one" date no longer means anything.
        const next = { ...fromPick(draft, moved), skipCharge: null };
        setDraft(next);
        setAmount(amountText(next));
        return;
      }
    }
    setDraft({ ...draft, cycle: c, priceSource: draft.amountMinor ? 'user' : 'none', amountIsEstimate: false, planId: null, planName: null, skipCharge: null });
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
    // A stored date that has passed shows as the real next charge (or the receipt before it),
    // not the old day. Saving it unchanged keeps the original billing day (Jan 31 stays the 31st).
    const shown = asPick(draft);
    if (draft.dateSource !== 'none' && draft.anchor < today) {
      const next = chargeOfSub(draft, today);
      if (next) shown.anchor = draft.dateSource === 'receipt' ? previousCharge(next, draft.cycle) : next;
    }
    return (
      <View style={{ flex: 1 }}>
        <Button kind="text" label="Back" onPress={() => setStep('form')} style={{ alignSelf: 'flex-start', marginTop: -8, marginLeft: -12 }} />
        <DateBody
          sub={shown}
          trial={draft.isTrial}
          leads={effectiveLeads(settings, pro)}
          reminderTime={settings.reminderTime}
          off={remindOn || trialEntry ? undefined : atLimit ? 'No reminder: your free 3 are in use.' : 'Reminders are off for this one.'}
          onSave={(anchor, source, cycle) => {
            const moved = cycle !== draft.cycle ? fromPick(draft, chooseCycle(asPick(draft), cycle)) : draft;
            const same = anchor === shown.anchor && source === draft.dateSource && cycle === draft.cycle;
            setDraft(same ? draft : { ...moved, cycle, anchor, dateSource: source, skipCharge: null });
            setAmount(amountText(moved));
            setStep('form');
          }}
          onNotSure={() => {
            setDraft({ ...draft, anchor: today, dateSource: 'none' });
            setStep('form');
          }}
        />
      </View>
    );
  }

  const charge = chargeOfSub(draft, today);
  // When the reminders land, and a preview of the first one, worded like the real notification.
  const leadsNow = trialEntry ? [3, 1] : effectiveLeads(settings, pro);
  const heads = charge ? reminderDaysFor(charge, clockNow(), leadsNow, settings.reminderTime) : [];
  const previewName = (draft.name || query).trim();
  const preview =
    remindOn && charge && heads[0] && previewName && !trialEntry
      ? {
          time: `${weekdayShort(heads[0])} ${shortTimeLabel(settings.reminderTime)}`,
          body: (draft.isTrial ? trialBody : headsUpBody)({ ...draft, name: previewName }, charge, heads[0], (a, c) => formatMoney(a, c, { home: settings.currency })),
        }
      : null;
  const canSave = !!(draft.name || query).trim() && (!amount || typed !== null);
  // If our checked price for their plan has moved since they added it, say so plainly instead of "Typical".
  const current = draft.catalogId && draft.planId && draft.priceSource === 'catalog' ? catalogPrice(draft.catalogId, draft.priceCountry, draft.planId) : null;
  const moved = current && current.planId === draft.planId && current.currency === draft.currency && current.amountMinor !== draft.amountMinor ? current : null;
  const catalogLine =
    draft.priceSource === 'catalog' && draft.amountMinor && draft.currency
      ? moved
        ? `${draft.planName ?? 'This plan'} is ${money(moved.amountMinor, moved.currency)} now, checked ${shortDate(moved.checked)}. Change yours if it went up.`
        : `Typical ${draft.planName ? `${draft.planName} ` : ''}price. Change it if yours is different.`
      : null;
  const saving = trialEntry ? null : yearlySaving({ ...draft, currency: draft.currency ?? currency }, priceRow);

  return (
    <View style={{ flex: 1 }}>
      {/* Drag the form down, or tap Done, to put the keyboard away. */}
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {draft.catalogId || draft.name || trialEntry ? <SubLogo sub={{ ...draft, name: draft.name || query || '?' }} size={44} /> : <LogoTile id="?" size={44} mono="+" color={brand.sunflower} ink={brand.ink} />}
          <Txt v="heading" accessibilityRole="header" style={{ flex: 1, marginRight: 40 }} numberOfLines={2}>
            {isNew ? (open.mode === 'add' && open.trial ? (draft.catalogId ? `${draft.name} free trial` : 'Track a free trial') : draft.catalogId ? `Add ${draft.name}` : 'Add a subscription') : trialEntry ? 'Ditch Pro trial' : draft.name}
          </Txt>
        </View>

        {trialEntry ? null : (
          <>
            <FieldLabel>Name</FieldLabel>
            <View style={{ minHeight: 52, borderRadius: 14, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
              {isNew ? <Search color={p.mute} /> : null}
              <TextInput
                value={query}
                onChangeText={(t) => {
                  setQuery(t);
                  if (isNew) setSearching(true);
                  else setDraft({ ...draft, name: t });
                }}
                autoFocus={isNew && !draft.catalogId && !draft.name}
                placeholder="Netflix, gym, phone plan…"
                placeholderTextColor={p.mute}
                accessibilityLabel="Name"
                returnKeyType="done"
                onSubmitEditing={() => (searching ? (matches[0] && matches[0].name.toLowerCase() === query.trim().toLowerCase() ? pickService(matches[0]) : keepCustom()) : null)}
                maxFontSizeMultiplier={2}
                style={{ flex: 1, minWidth: 0, minHeight: 48, fontFamily: F.semi, fontSize: 17, color: p.fg, outlineStyle: 'none' } as object}
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
            {/* Only while searching in Add, and only when what they typed isn't already on the list. */}
            {searching && query.trim() && !matches.some((m) => m.name.toLowerCase() === query.trim().toLowerCase()) ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ask us to add ${query.trim()} to the list`}
                accessibilityHint="Opens an email"
                onPress={() => suggestService(query)}
                style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'center' }}
              >
                <Txt v="sub" tone="mute" center>
                  Not on our list? <Txt v="sub" style={{ textDecorationLine: 'underline' }}>Ask us to add it</Txt>
                </Txt>
              </Pressable>
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
                      label={`${shortPlanName(pl.name, draft.name, plans.map((x) => x.name)).replace(/\s*\((yearly|monthly|annual)\)$/i, '')} ${money(pl.amountMinor, draft.currency ?? settings.currency)}${CYCLE_SHORT[pl.cycle]}`}
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

            <FieldLabel>{draft.isTrial ? 'Price after the trial' : 'Price'}</FieldLabel>
            <View style={{ minHeight: 56, borderRadius: 14, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 6 }}>
              <Txt v="moneyL" tone="mute">
                {formatMoney(0, currency).replace(/[\d.,\s]/g, '') || currency}
              </Txt>
              <TextInput
                value={amount}
                onChangeText={setAmountText}
                editable={!trialEntry}
                keyboardType="decimal-pad"
                inputAccessoryViewID={KEYBOARD_DONE}
                placeholder={currencyDigits(currency) ? '0.00' : '0'}
                placeholderTextColor={p.mute}
                accessibilityLabel={`Price in ${currency}`}
                maxFontSizeMultiplier={1.6}
                style={{ flex: 1, minWidth: 0, minHeight: 52, fontFamily: F.wideHeavy, fontSize: 22, fontVariant: ['tabular-nums'], color: p.fg, outlineStyle: 'none' } as object}
              />
              <Txt v="sub" tone="mute">
                {currency}
              </Txt>
            </View>
            {priceProblem ? (
              <Txt v="sub" color={p.danger} style={{ marginTop: 6, marginHorizontal: 2 }} accessibilityLiveRegion="polite">
                {parsed !== null && parsed > MAX_MINOR ? 'That looks too big. Check the price.' : 'Check the price.'}
              </Txt>
            ) : catalogLine ? (
              <Txt v="sub" tone="mute" num style={{ marginTop: 6, marginHorizontal: 2 }}>
                {catalogLine}
              </Txt>
            ) : null}
            {/* Cheaper-plan check (Pro, DECISIONS #60): the same plan billed yearly, from our checked prices. */}
            {saving ? (
              app.pro ? (
                <Txt v="sub" num color={p.fg} style={{ marginTop: 6, marginHorizontal: 2 }}>
                  {`Paying yearly would be ${money(saving.yearlyMinor, saving.currency)} a year, ${money(saving.lessBy, saving.currency)} less than 12 months of this.`}
                </Txt>
              ) : (
                <Pressable accessibilityRole="button" accessibilityLabel="Yearly would cost less. See how much with Pro" onPress={() => router.push('/paywall?from=app')} style={{ minHeight: 44, justifyContent: 'center', marginHorizontal: 2 }}>
                  <Txt v="sub" tone="mute">
                    Yearly would cost less. <Txt v="sub" style={{ textDecorationLine: 'underline' }}>See how much with Pro</Txt>
                  </Txt>
                </Pressable>
              )
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
            {/* Less common cycles (Nov 15, DECISIONS #57): chips under the main four, so the switch stays readable. */}
            <View style={{ flexDirection: 'row', gap: 8, paddingTop: 10 }}>
              {OTHER_CYCLES.map((c) => (
                <Chip key={c.value} label={c.label} selected={draft.cycle === c.value} onPress={() => setCycle(c.value)} />
              ))}
            </View>

            <FieldLabel>{draft.isTrial ? 'Trial ends' : 'Next charge'}</FieldLabel>
            {/* No guesses (DECISIONS #33): a real date, or "Add date" and no reminder yet. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${draft.isTrial ? 'Trial ends' : 'Next charge'}, ${charge ? rowLine({ ...draft, status: 'active' }, charge, today) : 'no date yet. Add date'}`}
              accessibilityHint="Opens a calendar"
              disabled={trialEntry}
              onPress={() => setStep('date')}
              style={({ pressed }) => ({
                minHeight: 52,
                borderRadius: 14,
                backgroundColor: p.chipBg,
                borderWidth: 1.5,
                borderColor: charge ? p.chipBorder : p.fg,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                gap: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Txt v="label" num style={[{ fontSize: 16 }, charge ? null : { fontFamily: F.semi }]}>
                {charge ? rowLine({ ...draft, status: 'active', isTrial: false, kind: 'user', dateSource: 'next' }, charge, today) : 'Add date'}
              </Txt>
              <View style={{ flex: 1 }} />
              {trialEntry ? null : <ChevronRight color={p.mute} />}
            </Pressable>
            {!charge && !trialEntry ? (
              <Txt v="sub" tone="mute" style={{ marginTop: 6, marginHorizontal: 2 }}>
                {draft.isTrial ? 'No date, no reminder. It’s in the sign-up email.' : 'No date, no reminder. It’s on your bank app or the receipt email.'}
              </Txt>
            ) : null}

            <Card style={{ marginTop: 18, paddingHorizontal: 16, paddingVertical: 4 }}>
              {trialEntry ? null : (
                <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: p.hair }}>
                  <Txt v="label" style={{ flex: 1 }}>
                    It’s a free trial
                  </Txt>
                  <SunSwitch
                    label="It’s a free trial"
                    value={draft.isTrial}
                    onValueChange={(v) => setDraft({ ...draft, isTrial: v })}
                  />
                </View>
              )}
              <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Txt v="label">Remind me</Txt>
                  <Txt v="sub" tone="mute" num>
                    {atLimit
                      ? `Free covers ${FREE_REMINDERS}. Turn one off in Settings, or try Pro.`
                      : !charge && !trialEntry
                        ? 'Starts once it has a date'
                        : remindOn && heads.length
                          ? `${heads.slice(0, -1).map(weekdayDate).join(', ')}${heads.length > 1 ? ' and ' : ''}${weekdayDate(heads[heads.length - 1])} at ${shortTimeLabel(settings.reminderTime)}`
                          : remindOn && charge
                            ? 'Too close for a reminder this time. The next one gets them.'
                            : `${leadsLabel(leadsNow)}, at ${shortTimeLabel(settings.reminderTime)}`}
                  </Txt>
                </View>
                <SunSwitch label="Remind me" hint={atLimit ? 'Free covers 3 reminders' : !charge && !trialEntry ? 'Starts once it has a date' : undefined} value={!charge && !trialEntry ? false : remindOn} disabled={trialEntry || !charge} onValueChange={toggleRemind} />
              </View>
              {/* The exact notification they'll get (design/v14 option A). */}
              {preview ? (
                <View
                  accessible
                  accessibilityLabel={`Preview: ${preview.body}`}
                  style={{ marginBottom: 12, borderRadius: 18, padding: 10, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC' }}
                >
                  <View importantForAccessibility="no-hide-descendants">
                    <NotificationPreview time={preview.time} message={preview.body} />
                  </View>
                </View>
              ) : null}
              {atLimit ? (
                <Button
                  kind="text"
                  label="Try Pro for reminders on everything"
                  onPress={async () => {
                    // Keep what they typed: save it (no reminder yet), then show Pro.
                    const name = (draft.name || query).trim();
                    if (name && canSave) {
                      const final: Sub = { ...draft, name, freePick: false, currency: draft.amountMinor ? currency : draft.currency };
                      if (isNew) await app.addSub(final);
                      else await app.saveSub(final);
                    }
                    close();
                    router.push('/paywall?from=app');
                  }}
                  style={{ alignSelf: 'flex-start', marginLeft: -20, marginTop: -6 }}
                />
              ) : null}
            </Card>

            {/* Card, account email and notes (DECISIONS #60): what you need on the cancel page. */}
            {trialEntry ? null : (
              <>
                <FieldLabel>For when you cancel</FieldLabel>
                <Card style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
                  <DetailInput label="Paid with" placeholder="Visa ending 4821" value={draft.paidWith} onChange={(v) => setDraft({ ...draft, paidWith: v })} />
                  <DetailInput label="Account email" placeholder="you@email.com" value={draft.accountEmail} onChange={(v) => setDraft({ ...draft, accountEmail: v })} keyboard="email-address" />
                  <DetailInput label="Notes" placeholder="Shared with Sam, cancel in the app…" value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} last />
                </Card>
              </>
            )}

            {/* Skip this one: quiet the next charge's reminders once, without turning them off. */}
            {!trialEntry && remindOn && charge && !draft.isTrial ? (
              <Card style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Txt v="label">Skip the {weekdayDate(charge)} reminders</Txt>
                    <Txt v="sub" tone="mute">Already paid or sorted? The next charge gets them again.</Txt>
                  </View>
                  <SunSwitch label={`Skip the reminders for ${weekdayDate(charge)}`} value={draft.skipCharge === charge} onValueChange={(v) => setDraft({ ...draft, skipCharge: v ? charge : null })} />
                </View>
              </Card>
            ) : null}

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
      <KeyboardDone />
      {searching ? null : (
        <View style={{ paddingTop: 10 }}>
          <Button label={isNew ? (draft.isTrial ? 'Track trial' : `Add ${draft.name || query.trim() || 'it'}`) : 'Save'} disabled={!canSave} onPress={save} />
        </View>
      )}
    </View>
  );
}
