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
import { chargesSoonLine, shortPlanName } from '@/domain/copy';
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
import {
  Bang,
  Button,
  Card,
  ChevronRight,
  Chip,
  F,
  KEYBOARD_DONE,
  Bell,
  KeyboardDone,
  LogoTile,
  NotificationPreview,
  Search,
  Segmented,
  Sheet,
  SunSwitch,
  Txt,
  brand,
  haptic,
  useFrame,
  usePalette,
  useSheetScroll,
} from '@/ui/sunflower';

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
      <Sheet
        visible={visible}
        onClose={() => setVisible(false)}
        maxHeight={780}
        closeButton
        label={open?.mode === 'edit' ? 'Edit subscription' : open?.mode === 'forgotten' ? 'Find the ones you forgot' : 'Add a subscription'}
      >
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

/** Joins the last two words with a no-break space, so a note never ends on one word alone. */
const keepLastTwo = (t: string | null) => (t ? t.replace(/ (\S+)$/, '\u00A0$1') : t);

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

/** Up to this many plans wrap onto lines; more scroll sideways. */
const WRAP_PLANS = 4;

const COMMON = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'INR', 'JPY'];

/** One labelled line in "For when you cancel". Empty saves as nothing, not "". */
function DetailInput({
  label,
  placeholder,
  value,
  onChange,
  keyboard,
  last,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  onChange: (v: string | null) => void;
  keyboard?: 'email-address';
  last?: boolean;
}) {
  const p = usePalette();
  return (
    <View style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: p.hair }}>
      {/* "(optional)" under the name, so the field keeps its width on small phones. */}
      <View style={{ width: 92 }}>
        <Txt v="label">{label}</Txt>
        <Txt v="sub" tone="mute" style={{ fontSize: 13, lineHeight: 16 }}>
          (optional)
        </Txt>
      </View>
      <TextInput
        value={value ?? ''}
        onChangeText={(t) => onChange(t.trim() ? t : null)}
        // A short instruction, never made-up data that could pass for theirs (owner, Nov 19).
        placeholder={placeholder}
        // iOS's own placeholder grey (placeholderText), light and dark.
        placeholderTextColor={p.dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)'}
        accessibilityLabel={`${label}, optional`}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize={keyboard ? 'none' : 'sentences'}
        autoCorrect={!keyboard}
        maxLength={keyboard ? 120 : 200}
        inputAccessoryViewID={KEYBOARD_DONE}
        // Long card names and notes wrap instead of being cut mid-letter on small phones.
        multiline={!keyboard}
        submitBehavior="blurAndSubmit"
        style={{ flex: 1, minWidth: 0, minHeight: 48, paddingVertical: 12, fontFamily: F.regular, fontSize: 16, color: p.fg, textAlign: 'right', outlineStyle: 'none' } as object}
      />
    </View>
  );
}

/** A field's problem, under it: "!" and one short line in the error colour (audit, Nov 20: grey text didn't read as an error). */
function FieldError({ children }: { children: string }) {
  const p = usePalette();
  return (
    <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginHorizontal: 2 }}>
      <Bang size={16} bg={p.danger} color={p.dark ? brand.ink : brand.white} />
      <Txt v="sub" color={p.danger} style={{ flex: 1, fontFamily: F.semi, fontSize: 14 }}>
        {children}
      </Txt>
    </View>
  );
}

/** A field with a problem: a 2pt border in the error colour and a light tint of it. */
const problemField = (p: { danger: string }) => ({ borderWidth: 2, borderColor: p.danger, backgroundColor: `${p.danger}14` });

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
  const onSheetScroll = useSheetScroll();
  // The sheet's side margin: chip rows bleed to the screen edge so no price is cut mid-word.
  const { edge } = useFrame();
  const { settings, today, pro } = app;
  const country = settings.country;

  const existing = open.mode === 'edit' ? (app.subs.find((s) => s.id === open.id) ?? null) : null;
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
  // What's wrong with the typed price, in their currency: "Has to be more than $0", "That's over $99,999".
  const digitsTyped = amount.replace(/[^\d]/g, '');
  const priceProblem: string | null = !amount.trim()
    ? null
    : (parsed !== null && parsed > MAX_MINOR) || (parsed === null && /^\s*\d{6,}\s*$/.test(amount))
      ? `That’s over ${money(MAX_MINOR, currency, { whole: true })}. Extra zero?`
      : typed !== null
        ? null
        : digitsTyped && /^0+$/.test(digitsTyped)
          ? `Has to be more than ${money(0, currency, { whole: true })}. Leave it empty if it’s free.`
          : `Use a price like ${currencyDigits(currency) ? '12.99' : '1500'}.`;
  // Edit: the name can't be cleared (the header keeps the saved one meanwhile).
  const nameProblem = open.mode === 'edit' && !trialEntry && !query.trim() ? 'Add a name.' : null;

  const matches = useMemo(() => {
    if (!query.trim()) return popularIn(country, 6);
    return searchServices(
      query,
      SERVICES.filter((s) => availableIn(s, country)),
    ).slice(0, 6);
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

  // Plans stay on screen after the price is edited (audit, Nov 16), so a plan can always be re-picked.
  const planRow = draft.catalogId && draft.priceCountry ? priceRow(draft.catalogId, draft.priceCountry) : null;
  const plans = draft.catalogId ? planChoices(draft.catalogId, draft.priceCountry) : [];
  // The plan they picked, or the one their price matches.
  const planSelected = (pl: (typeof plans)[number]) =>
    draft.planId ? pl.id === draft.planId : pl.amountMinor === draft.amountMinor && pl.cycle === draft.cycle && planRow?.currency === draft.currency;

  // "With Ads $12.49/mo", "With Ads $124.99/yr": the plan, then its price.
  const planLabel = (pl: (typeof plans)[number]) =>
    `${shortPlanName(
      pl.name,
      draft.name,
      plans.map((x) => x.name),
    )
      .replace(/\s*\((yearly|monthly|annual)\)$/i, '')
      // "With Ads, yearly" + "/yr" says it twice: the price's "/yr" is enough.
      .replace(/,?\s+(yearly|monthly|annual)$/i, '')} ${money(pl.amountMinor, planRow?.currency ?? draft.currency ?? settings.currency)}${CYCLE_SHORT[pl.cycle]}`;
  const planChips = plans.map((pl) => (
    <Chip
      key={pl.id}
      label={planLabel(pl)}
      selected={planSelected(pl)}
      onPress={() => {
        haptic.select();
        const next = fromPick(draft, choosePlan(asPick(draft), pl.id));
        setDraft(next);
        setAmount(amountText(next));
      }}
    />
  ));

  // Reminders: free covers 3 (the Pro trial entry is always on).
  const othersOn = remindedIds(
    app.subs.filter((s) => s.id !== draft.id),
    false,
  ).size;
  const remindOn = trialEntry || (pro ? !draft.muted : draft.freePick);
  const atLimit = !pro && !draft.freePick && othersOn >= FREE_REMINDERS;
  const toggleRemind = (v: boolean) => {
    if (v && atLimit) {
      haptic.warning();
      AccessibilityInfo.announceForAccessibility('Your 3 free reminders are in use. Pro reminds you about all of them.');
      return;
    }
    haptic.select();
    setDraft(pro ? { ...draft, muted: !v } : { ...draft, freePick: v });
  };

  const save = async () => {
    const name = (draft.name || query).trim();
    if (!name) return;
    const final: Sub = { ...draft, name, currency: draft.amountMinor ? currency : draft.currency };
    // Not saved: the app has said so; the sheet stays open with what they typed.
    const ok = await app.storeSub(final, { isNew });
    if (!ok) return;
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
    if (await app.ditch(draft.id)) router.push(`/ditch/${draft.id}?fresh=1`);
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
      // Scrolls when the sheet is shorter than the calendar (SE, Display Zoom, big text), so the Set button is always reachable.
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} scrollEventThrottle={32} onScroll={onSheetScroll}>
        {/* 10pt under Back keeps the sheet's × clear of the Monthly/Yearly switch on the right. */}
        <Button kind="text" label="Back" onPress={() => setStep('form')} style={{ alignSelf: 'flex-start', marginTop: -8, marginLeft: -12, marginBottom: 10 }} />
        <DateBody
          sub={shown}
          trial={draft.isTrial}
          leads={effectiveLeads(settings, pro)}
          reminderTime={settings.reminderTime}
          off={remindOn || trialEntry ? undefined : atLimit ? 'No reminder. Your 3 free reminders are in use.' : 'Reminders are off for this one.'}
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
      </ScrollView>
    );
  }

  const charge = chargeOfSub(draft, today);
  // When the reminders land, and a preview of the first one, worded like the real notification.
  const leadsNow = trialEntry ? [3, 1] : effectiveLeads(settings, pro);
  // Skipped this one: no reminders for this charge, so say so instead of listing days.
  const skippedNow = !!charge && draft.skipCharge === charge && !draft.isTrial;
  const heads = charge && !skippedNow ? reminderDaysFor(charge, clockNow(), leadsNow, settings.reminderTime) : [];
  const previewName = (draft.name || query).trim();
  const preview =
    remindOn && charge && heads[0] && previewName && !trialEntry
      ? {
          time: `${weekdayShort(heads[0])} ${shortTimeLabel(settings.reminderTime)}`,
          body: (draft.isTrial ? trialBody : headsUpBody)({ ...draft, name: previewName }, charge, heads[0], (a, c) => formatMoney(a, c, { home: settings.currency })),
        }
      : null;
  // Edit: Save wakes up once something changed, so an untouched sheet doesn't look like it needs saving.
  const changed = isNew || !existing || JSON.stringify(draft) !== JSON.stringify(existing);
  const canSave = !!(draft.name || query).trim() && (!amount || typed !== null);
  // If our checked price for their plan has moved since they added it, say so plainly instead of "Typical".
  const current = draft.catalogId && draft.priceSource === 'catalog' ? catalogPrice(draft.catalogId, draft.priceCountry, draft.planId) : null;
  const samePlan = !!current && !!draft.planId && current.planId === draft.planId && current.currency === draft.currency;
  // Price watch is Pro (DECISIONS #60): free users don't get the 'is $X now' line here either.
  const moved = pro && samePlan && current!.amountMinor !== draft.amountMinor ? current : null;
  // "Typical" only when it really is our checked price for that plan (audit, Nov 16: it showed for $17.99 Netflix, which matches no plan).
  const typical = !!current && current.currency === draft.currency && current.amountMinor === draft.amountMinor && (!draft.planId || samePlan);
  const catalogLine =
    draft.priceSource === 'catalog' && draft.amountMinor && draft.currency
      ? moved
        ? `${draft.planName ?? 'This plan'} is ${money(moved.amountMinor, moved.currency)} now, checked ${shortDate(moved.checked)}. Change yours if it went up.`
        : typical
          ? 'Typical price.'
          : null
      : null;
  const saving = trialEntry ? null : yearlySaving({ ...draft, currency: draft.currency ?? currency }, priceRow);
  // One grey note under the price, not two: "Typical price. Yearly is $124.99, $24.89 less."
  const yearlyLine = saving ? `Yearly is ${money(saving.yearlyMinor, saving.currency)}, ${money(saving.lessBy, saving.currency)} less.` : null;
  // The last two words share a line, so the note never ends on one word alone.
  const priceNote = keepLastTwo(
    yearlyLine ? (catalogLine ? `${catalogLine} ${yearlyLine}` : yearlyLine) : catalogLine && typical && !moved ? `${catalogLine} Change it if yours is different.` : catalogLine,
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Drag the form down, or tap Done, to put the keyboard away. */}
      {/* Edge to edge with the padding inside, so the chip rows can scroll out to the screen edge instead of being cut at the margin. */}
      <ScrollView
        style={{ flex: 1, marginHorizontal: -edge }}
        contentContainerStyle={{ paddingHorizontal: edge }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={onSheetScroll}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {draft.catalogId || draft.name || trialEntry ? (
            <SubLogo sub={{ ...draft, name: draft.name || query || '?' }} size={44} />
          ) : (
            <LogoTile id="?" size={44} mono="+" color={brand.sunflower} ink={brand.ink} />
          )}
          <Txt v="heading" accessibilityRole="header" style={{ flex: 1, marginRight: 40 }} numberOfLines={2}>
            {isNew
              ? open.mode === 'add' && open.trial
                ? draft.catalogId
                  ? `${draft.name} free trial`
                  : 'Track a free trial'
                : draft.catalogId
                  ? `Add ${draft.name}`
                  : query.trim()
                    ? `Add ${query.trim()}`
                    : 'Add a subscription'
              : trialEntry
                ? 'Ditch Pro trial'
                : draft.name.trim() || existing?.name}
          </Txt>
        </View>

        {trialEntry ? null : (
          <>
            <FieldLabel>Name</FieldLabel>
            <View
              style={{
                minHeight: 52,
                borderRadius: 14,
                backgroundColor: p.chipBg,
                borderWidth: 1.5,
                borderColor: p.chipBorder,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                gap: 8,
                ...(nameProblem ? problemField(p) : null),
              }}
            >
              {isNew && searching ? <Search color={p.mute} /> : null}
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
            {nameProblem ? <FieldError>{nameProblem}</FieldError> : null}
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
                  Not on our list?{' '}
                  <Txt v="sub" style={{ textDecorationLine: 'underline' }}>
                    Ask us to add it
                  </Txt>
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
                {plans.length <= WRAP_PLANS ? (
                  // Up to 4 plans (most services): wrapped, so every price is in view and none is cut at the edge.
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{planChips}</View>
                ) : (
                  // Long lists (Hulu's bundles, Disney+): one sideways row, so the form doesn't turn into a wall of chips.
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -edge }} contentContainerStyle={{ gap: 8, paddingHorizontal: edge }}>
                    {planChips}
                  </ScrollView>
                )}
                {!isNew && draft.amountMinor && !plans.some(planSelected) ? (
                  <Txt v="sub" tone="mute" style={{ marginTop: 6, marginHorizontal: 2 }}>
                    Doesn’t match a plan. Fine if yours differs.
                  </Txt>
                ) : null}
              </>
            ) : null}

            <FieldLabel>{draft.isTrial ? 'Price after the trial' : 'Price'}</FieldLabel>
            <View
              style={{
                minHeight: 56,
                borderRadius: 14,
                backgroundColor: p.chipBg,
                borderWidth: 1.5,
                borderColor: p.chipBorder,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                gap: 6,
                ...(priceProblem ? problemField(p) : null),
              }}
            >
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
              <FieldError>{priceProblem}</FieldError>
            ) : priceNote ? (
              // Typical price and the cheaper-plan check (DECISIONS #60: the same plan billed yearly, from our checked prices, same currency only) share one line.
              // Free too: the yearly price is already on a plan chip, so hiding the difference behind Pro hid nothing (audit, Nov 19).
              <Txt v="sub" tone="mute" num style={{ marginTop: 6, marginHorizontal: 2 }}>
                {priceNote}
              </Txt>
            ) : null}

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
                {draft.isTrial ? 'No date, no reminder. It’s in the sign-up\u00A0email.' : 'No date, no reminder. Find it in your bank app or receipt\u00A0email.'}
              </Txt>
            ) : null}

            {trialEntry ? null : (
              <>
                <FieldLabel>Currency</FieldLabel>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -edge }} contentContainerStyle={{ gap: 8, paddingHorizontal: edge }}>
                  {[...new Set([settings.currency, currency, ...COMMON])].map((c) => (
                    <Chip key={c} label={c} selected={c === currency} onPress={() => setCurrency(c)} />
                  ))}
                </ScrollView>
              </>
            )}

            <FieldLabel>How often</FieldLabel>
            <Segmented label="How often it charges" value={draft.cycle} onChange={setCycle} options={CYCLES} fontSize={13.5} />
            {/* Less common cycles (Nov 15, DECISIONS #57): chips under the main four, so the switch stays readable. */}
            <View style={{ flexDirection: 'row', gap: 8, paddingTop: 10 }}>
              {OTHER_CYCLES.map((c) => (
                <Chip key={c.value} label={c.label} selected={draft.cycle === c.value} onPress={() => setCycle(c.value)} />
              ))}
            </View>

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
                  <Txt v="sub" tone="mute" num>
                    {atLimit
                      ? `Your ${FREE_REMINDERS} free reminders are in use.`
                      : !charge && !trialEntry
                        ? 'Starts once it has a date'
                        : skippedNow && remindOn
                          ? `Skipping ${weekdayDate(charge)}. Back on for the next one.`
                          : remindOn && heads.length
                            ? `${heads.slice(0, -1).map(weekdayDate).join(', ')}${heads.length > 1 ? ' and ' : ''}${weekdayDate(heads[heads.length - 1])} at ${shortTimeLabel(settings.reminderTime)}`
                            : remindOn && charge
                              ? `${chargesSoonLine(charge, today)}, so no reminder this time. The next one gets them.`
                              : `${leadsLabel(leadsNow)}, at ${shortTimeLabel(settings.reminderTime)}`}
                  </Txt>
                </View>
                <SunSwitch
                  label="Remind me"
                  hint={atLimit ? 'Your 3 free reminders are in use' : !charge && !trialEntry ? 'Starts once it has a date' : undefined}
                  value={!charge && !trialEntry ? false : remindOn}
                  disabled={trialEntry || !charge}
                  onValueChange={toggleRemind}
                />
              </View>
              {/* The exact notification they'll get (design/v14 option A). */}
              {preview ? (
                <View accessible accessibilityLabel={`Preview: ${preview.body}`} style={{ marginBottom: 12, borderRadius: 18, padding: 10, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC' }}>
                  <View importantForAccessibility="no-hide-descendants">
                    <NotificationPreview time={preview.time} message={preview.body} />
                  </View>
                </View>
              ) : null}
              {atLimit ? (
                // The upsell where it matters (owner, Nov 20): this one can't get a reminder on free.
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reminders on everything with Pro. Try Pro."
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
                  style={({ pressed }) => ({
                    marginBottom: 12,
                    minHeight: 52,
                    borderRadius: 16,
                    paddingLeft: 14,
                    paddingRight: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: p.dark ? '#2A2721' : '#FFF1BC',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Bell color={p.dark ? brand.sunflower : brand.ink} fill={p.dark ? brand.sunflower : brand.ink} size={16} />
                  <Txt v="label" color={p.dark ? p.fg : brand.ink} style={{ flex: 1, fontSize: 15 }}>
                    Reminders on everything
                  </Txt>
                  <View style={{ paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: p.dark ? brand.sunflower : brand.ink, alignItems: 'center', justifyContent: 'center' }}>
                    <Txt v="label" color={p.dark ? brand.ink : brand.sunflower} style={{ fontFamily: F.bold, fontSize: 14 }} maxFontSizeMultiplier={1.3}>
                      Try Pro
                    </Txt>
                  </View>
                </Pressable>
              ) : null}
            </Card>

            {/* Card, account email and notes (DECISIONS #60): what you need on the cancel page. */}
            {trialEntry ? null : (
              <>
                <FieldLabel>For when you cancel</FieldLabel>
                <Card style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
                  <DetailInput label="Paid with" placeholder="Card or account" value={draft.paidWith} onChange={(v) => setDraft({ ...draft, paidWith: v })} />
                  <DetailInput label="Email" placeholder="Email you signed up with" value={draft.accountEmail} onChange={(v) => setDraft({ ...draft, accountEmail: v })} keyboard="email-address" />
                  <DetailInput label="Notes" placeholder="Add a note" value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} last />
                </Card>
              </>
            )}

            {/* Skip this one: quiet the next charge's reminders once, without turning them off. */}
            {!trialEntry && remindOn && charge && !draft.isTrial ? (
              <Card style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Txt v="label">Already paid this one?</Txt>
                    <Txt v="sub" tone="mute">
                      Skip its reminders. The next charge gets them again.
                    </Txt>
                  </View>
                  <SunSwitch
                    label={`Already paid this one? Skip the reminders for ${weekdayDate(charge)}`}
                    value={draft.skipCharge === charge}
                    onValueChange={(v) => setDraft({ ...draft, skipCharge: v ? charge : null })}
                  />
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
          {/* Edit, nothing changed yet: a plain "Close" (a greyed-out Save looked broken, and an outlined Done looked like
              the "Ditch X" button above it). The first change turns it into Save. */}
          {changed ? (
            <Button label={isNew ? (draft.isTrial ? 'Track trial' : `Add ${draft.name || query.trim() || 'it'}`) : 'Save'} disabled={!canSave} onPress={save} />
          ) : (
            <Button kind="text" label="Close" hint="Closes without changes" height={56} onPress={close} />
          )}
        </View>
      )}
    </View>
  );
}
