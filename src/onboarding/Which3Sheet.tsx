// 7b · "Change" on You're set → "Your 3 free reminders" (design/v12 render
// 07b). Free covers 3 (DECISIONS #11): the 3 biggest yearly charges come
// pre-picked. × frees a slot; "Swap in" fills one (or, when all 3 are full,
// takes the smallest one's place). Nothing is hidden or deleted.

import { useMemo, useState } from 'react';
import { AccessibilityInfo, ScrollView, View } from 'react-native';

import { weekdayDate } from '@/domain/dates';
import { byYearlyDesc, chargeOf, usePickPrice, type Picked } from '@/state/onboarding';
import { Button, Close, IconButton, LogoTile, Sheet, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

import { TextLink } from './Parts';

const FREE = 3;
const NB = ' ';

function Body({ list, initial, onKeep }: { list: Picked[]; initial: string[]; onKeep: (ids: string[]) => void }) {
  const p = usePalette();
  const priceOf = usePickPrice();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [on, setOn] = useState<string[]>(initial.slice(0, FREE));
  const slots = sorted.filter((x) => on.includes(x.id));
  const rest = sorted.filter((x) => !on.includes(x.id));
  // Breaks only at the " · ", so a date never splits.
  const line = (x: Picked) => `${priceOf(x, 'short') ?? 'No price yet'} · ${`${x.dateSource === 'guess' ? 'around ' : ''}${weekdayDate(chargeOf(x))}`.replace(/ /g, NB)}`;

  const remove = (x: Picked) => {
    haptic.select();
    setOn(on.filter((id) => id !== x.id));
    AccessibilityInfo.announceForAccessibility(`${x.name} has no reminder now. ${FREE - on.length + 1} free.`);
  };
  const swapIn = (x: Picked) => {
    haptic.select();
    if (on.length < FREE) {
      setOn([...on, x.id]);
      AccessibilityInfo.announceForAccessibility(`${x.name} gets reminders.`);
      return;
    }
    // Full: the smallest of the 3 makes room.
    const out = slots[slots.length - 1];
    setOn([...on.filter((id) => id !== out.id), x.id]);
    AccessibilityInfo.announceForAccessibility(`${x.name} gets reminders instead of ${out.name}.`);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 24 }}>
          {`Your 3 free${NB}reminders`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          {`We picked your biggest charges. Swap any of${NB}them.`}
        </Txt>
        <View style={{ gap: 8, marginTop: 24 }}>
          {slots.map((x) => (
            <View
              key={x.id}
              style={{ minHeight: 64, borderRadius: 20, backgroundColor: brand.sunflower, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12, paddingRight: 4 }}
            >
              <LogoTile id={x.id} size={40} />
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 10 }}>
                <Txt v="label" color={brand.ink} numberOfLines={1} style={{ fontSize: 16 }}>
                  {x.name}
                </Txt>
                <Txt v="sub" num color="#4B4220" numberOfLines={1}>
                  {line(x)}
                </Txt>
              </View>
              <IconButton label={`Remove ${x.name}`} onPress={() => remove(x)} size={32} bg="rgba(22,20,15,0.12)">
                <Close color={brand.ink} size={11} />
              </IconButton>
            </View>
          ))}
          {Array.from({ length: Math.max(0, Math.min(FREE, list.length) - slots.length) }, (_, i) => (
            <View
              key={`free-${i}`}
              accessible
              accessibilityLabel="Free slot. Swap one in below."
              style={{ minHeight: 64, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: p.chipBorder, alignItems: 'center', justifyContent: 'center' }}
            >
              <Txt v="sub" tone="mute">
                Free slot · swap one in below
              </Txt>
            </View>
          ))}
        </View>
        {rest.length ? (
          <>
            <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 32 }}>
              On your list, no reminder
            </Txt>
            <View style={{ marginTop: 4 }}>
              {rest.map((x, i) => (
                <View key={x.id} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {i ? <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
                  <LogoTile id={x.id} size={40} />
                  <View style={{ flex: 1, minWidth: 0, paddingVertical: 8 }}>
                    <Txt v="bodyStrong" numberOfLines={1}>
                      {x.name}
                    </Txt>
                    <Txt v="sub" tone="mute" num>
                      {line(x)}
                    </Txt>
                  </View>
                  <TextLink label="Swap in" a11y={`Swap in ${x.name}`} onPress={() => swapIn(x)} style={{ fontSize: 15 }} />
                </View>
              ))}
            </View>
            <Txt v="sub" tone="mute" style={{ marginTop: 8 }}>
              {`These stay on your list with their totals and${NB}dates.`}
            </Txt>
          </>
        ) : null}
      </ScrollView>
      <Button label={on.length === FREE ? 'Keep these 3' : on.length ? `Keep ${on.length === 1 ? 'this 1' : `these ${on.length}`}` : 'No reminders for now'} onPress={() => onKeep(on)} />
    </View>
  );
}

export function Which3Sheet({ visible, list, initial, onClose, onKeep }: { visible: boolean; list: Picked[]; initial: string[]; onClose: () => void; onKeep: (ids: string[]) => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} maxHeight={2000} gap={0} topGap={10} label="Your 3 free reminders">
      {visible ? <Body list={list} initial={initial} onKeep={onKeep} /> : null}
    </Sheet>
  );
}
