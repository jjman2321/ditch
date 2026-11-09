// 04 · When do they charge you? One screen, one date chip per sub.
// Every date starts as a labelled guess; tapping one opens the date sheet.

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { datesCtaLabel } from '@/domain/copy';
import { weekdayDate } from '@/domain/dates';
import { CYCLE_SHORT, formatMoney } from '@/domain/money';
import { DateSheet } from '@/onboarding/DateSheet';
import { byYearlyDesc, chargeOf, useOnboarding, usePickedList, type Picked } from '@/state/onboarding';
import { Button, Card, ChevronDown, GuessTag, LogoTile, RowDivider, Screen, SectionHeader, StepHeader, Txt, haptic, usePalette } from '@/ui/sunflower';

function DateChip({ p: sub, onPress }: { p: Picked; onPress: () => void }) {
  const p = usePalette();
  const guess = sub.dateSource === 'guess';
  const date = weekdayDate(chargeOf(sub));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${sub.name} next charge, ${guess ? 'guess: around ' : ''}${date}`}
      accessibilityHint="Opens a calendar to set the real date"
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={({ pressed }) => ({
        height: 36,
        paddingLeft: 12,
        paddingRight: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: guess ? 'transparent' : p.card,
        borderWidth: 1.5,
        borderColor: guess ? p.guessBorder : p.fg,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Txt v="label" num color={guess ? p.guessFg : p.cardFg} style={{ fontSize: 14.5 }} maxFontSizeMultiplier={1.3}>
        {date}
      </Txt>
      <ChevronDown color={guess ? p.guessFg : p.cardFg} size={13} />
    </Pressable>
  );
}

export default function Dates() {
  const { setDate, setCycle, revertToGuess } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const sub = editing ? (list.find((x) => x.id === editing) ?? null) : null;
  const confirmed = list.filter((x) => x.dateSource !== 'guess').length;
  const guesses = list.length - confirmed;
  const next = () => router.push('/onboarding/reminders');

  return (
    <Screen
      scroll
      footer={
        <>
          <Button label={datesCtaLabel(confirmed, guesses)} onPress={next} />
          {confirmed > 0 && guesses > 0 ? <Button kind="text" label="Do the rest later" onPress={next} /> : null}
        </>
      }
    >
      <StepHeader step={3} />
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 12 }}>
        When do they charge you?
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        Grey dates are guesses. Tap one to fix it. Your last receipt has the real day.
      </Txt>
      <SectionHeader title="Next charge" right={`${confirmed} of ${list.length} confirmed`} style={{ marginTop: 18, marginBottom: 8 }} />
      <Card style={{ paddingVertical: 2 }}>
        {sorted.map((x, i) => (
          <View key={x.id}>
            {i ? <RowDivider inset={64} /> : null}
            <View style={{ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 6 }}>
              <LogoTile id={x.id} size={38} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt v="bodyStrong" numberOfLines={1}>
                  {x.name}
                </Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                  <Txt v="sub" tone="mute" num>
                    {formatMoney(x.amountMinor, x.currency)}
                    {CYCLE_SHORT[x.cycle]}
                  </Txt>
                  {x.dateSource === 'guess' ? <GuessTag /> : null}
                </View>
              </View>
              <DateChip
                p={x}
                onPress={() => {
                  haptic.select();
                  setEditing(x.id);
                  setOpen(true);
                }}
              />
            </View>
          </View>
        ))}
      </Card>
      <View style={{ height: 16 }} />

      <DateSheet
        sub={sub}
        visible={open}
        onClose={() => setOpen(false)}
        onSave={(anchor, source, cycle) => {
          if (sub && cycle !== sub.cycle) setCycle(sub.id, cycle);
          if (sub) setDate(sub.id, anchor, source);
          setOpen(false);
        }}
        onGuess={() => {
          if (sub) revertToGuess(sub.id);
          setOpen(false);
        }}
      />
    </Screen>
  );
}
