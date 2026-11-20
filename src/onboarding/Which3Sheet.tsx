// 7b · "Change" on You're set → "Your 3 free reminders". Free covers 3
// (DECISIONS #11): the 3 biggest yearly charges come pre-picked. One list with
// a check on each row; tap to tick or untick, up to 3. Nothing is hidden or deleted.

import { useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';

import { namesLine } from '@/domain/copy';
import { weekdayDate } from '@/domain/dates';
import { byYearlyDesc, chargeOf, pickHasDate, usePickPrice, type Picked } from '@/state/onboarding';
import { Button, Check, F, LogoTile, Sheet, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

const FREE = 3;
const NB = ' ';

function Body({ list, initial, onKeep }: { list: Picked[]; initial: string[]; onKeep: (ids: string[]) => void }) {
  const p = usePalette();
  const priceOf = usePickPrice();
  // Only subs with a date can have reminders (DECISIONS #33).
  const sorted = useMemo(() => list.filter(pickHasDate).sort(byYearlyDesc), [list]);
  const undated = list.filter((x) => !pickHasDate(x));
  const [on, setOn] = useState<string[]>(initial.slice(0, FREE));
  const [full, setFull] = useState(false);
  // Breaks only at the " · ", so a date never splits.
  const line = (x: Picked) => {
    const next = chargeOf(x);
    return `${priceOf(x, 'short') ?? 'No price yet'}${next ? ` · ${weekdayDate(next).replace(/ /g, NB)}` : ''}`;
  };

  // One list, a check on each row, a counter on top (Apple's own pickers, Things, Duolingo on Mobbin).
  // Owner, Nov 20: the yellow pills with × plus "Swap in" links read as two different controls.
  const toggle = (x: Picked) => {
    if (on.includes(x.id)) {
      haptic.select();
      setOn(on.filter((id) => id !== x.id));
      setFull(false);
      AccessibilityInfo.announceForAccessibility(`${x.name}: no reminder.`);
      return;
    }
    if (on.length >= FREE) {
      // Full: say so, don't silently swap one out.
      haptic.warning();
      setFull(true);
      AccessibilityInfo.announceForAccessibility('All 3 are picked. Untick one first.');
      return;
    }
    haptic.select();
    setOn([...on, x.id]);
    AccessibilityInfo.announceForAccessibility(`${x.name} gets reminders.`);
  };

  return (
    <View>
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 14, paddingRight: 48 }}>
        {`Your 3 free${NB}reminders`}
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 6 }}>
        {`We started with your biggest. The rest stay on your${NB}list.`}
      </Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 8, paddingHorizontal: 4 }}>
        <Txt v="eyebrow" tone="mute">
          Reminders
        </Txt>
        <Txt v="sub" num color={full ? (p.dark ? '#FF9A6B' : '#B3410E') : p.mute} style={{ fontFamily: F.bold }} accessibilityLiveRegion="polite">
          {full ? 'Untick one first' : `${on.length} of ${FREE} picked`}
        </Txt>
      </View>
      <View style={{ backgroundColor: p.card, borderRadius: 20, overflow: 'hidden' }}>
        {sorted.map((x, i) => {
          const picked = on.includes(x.id);
          return (
            <Pressable
              key={x.id}
              onPress={() => toggle(x)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: picked }}
              accessibilityLabel={`${x.name}, ${line(x).replace(new RegExp(NB, 'g'), ' ')}`}
              style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, backgroundColor: pressed ? p.hair : 'transparent' })}
            >
              {i ? <View style={{ position: 'absolute', top: 0, left: 66, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
              <LogoTile id={x.id} size={40} />
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 10 }}>
                <Txt v="bodyStrong" color={p.cardFg} numberOfLines={1}>
                  {x.name}
                </Txt>
                <Txt v="sub" tone="mute" num numberOfLines={1}>
                  {line(x)}
                </Txt>
              </View>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: picked ? (p.dark ? brand.sunflower : brand.ink) : 'transparent',
                  borderWidth: picked ? 0 : 2,
                  borderColor: p.dark ? '#5A554C' : '#CFC7B6',
                }}
              >
                {picked ? <Check color={p.dark ? brand.ink : brand.sunflower} size={14} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      {/* Undated ones can't have reminders yet; say where they went (DECISIONS #33). */}
      {undated.length ? (
        <Txt v="sub" tone="mute" style={{ marginTop: 12, paddingHorizontal: 4 }}>
          {`${namesLine(undated.map((x) => x.name))} ${undated.length === 1 ? 'needs' : 'need'} a date${NB}first.`}
        </Txt>
      ) : null}
      <Button
        label={on.length === FREE ? 'Keep these 3' : on.length ? `Keep ${on.length === 1 ? 'this 1' : `these ${on.length}`}` : 'No reminders for now'}
        onPress={() => onKeep(on)}
        style={{ marginTop: 22 }}
      />
    </View>
  );
}

export function Which3Sheet({ visible, list, initial, onClose, onKeep }: { visible: boolean; list: Picked[]; initial: string[]; onClose: () => void; onKeep: (ids: string[]) => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} fit gap={0} label="Your 3 free reminders" closeButton>
      {visible ? <Body list={list} initial={initial} onKeep={onKeep} /> : null}
    </Sheet>
  );
}
