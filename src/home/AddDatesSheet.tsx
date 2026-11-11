// "Add dates ›" on Home: every sub with no date in one sheet, like the
// onboarding dates step (DECISIONS #33). Tap one → the same day picker,
// inside this sheet, then back to the list. A sub that gets a date also
// gets a free reminder if there's room in the 3. Closes when all are done.

import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { effectiveLeads, shortTimeLabel } from '@/domain/settings';
import { FREE_REMINDERS, remindedIds, undatedSubs, yearlyOfSub, type Sub } from '@/domain/subs';
import { asPick } from '@/editor/Editor';
import { DayBody } from '@/onboarding/DaySheet';
import { useApp } from '@/state/app';
import { Button, Sheet, Txt, haptic, usePalette } from '@/ui/sunflower';

import { SubLogo } from './SubRow';

const CYCLE_LABEL = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Every 3 months', yearly: 'Yearly' } as const;

function Row({ s, first, onPress }: { s: Sub; first: boolean; onPress: () => void }) {
  const p = usePalette();
  const ask = s.cycle === 'monthly' ? 'Pick day' : 'Pick date';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${s.name}, no date yet. ${ask}`}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}
    >
      {first ? null : <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} />}
      <SubLogo sub={s} size={40} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="bodyStrong" numberOfLines={1} color={p.cardFg}>
          {s.name}
        </Txt>
        <Txt v="sub" tone="mute" numberOfLines={1}>
          {CYCLE_LABEL[s.cycle]}
        </Txt>
      </View>
      <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1.5, borderColor: p.fg, alignItems: 'center', justifyContent: 'center' }}>
        <Txt v="label">{ask}</Txt>
      </View>
    </Pressable>
  );
}

function Body({ close }: { close: () => void }) {
  const p = usePalette();
  const app = useApp();
  const { settings, pro } = app;
  const list = undatedSubs(app.subs).sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a));
  const [editing, setEditing] = useState<string | null>(null);
  const sub = editing ? (app.subs.find((s) => s.id === editing) ?? null) : null;

  const save = async (s: Sub, anchor: string) => {
    // Room in the free 3? Then this one gets reminders now that it has a date.
    const room = !pro && remindedIds(app.subs.filter((x) => x.id !== s.id), false).size < FREE_REMINDERS;
    await app.saveSub({ ...s, anchor, dateSource: 'next', freePick: room });
    haptic.select();
    setEditing(null);
    if (list.length <= 1) close();
  };

  if (sub) {
    const room = pro || remindedIds(app.subs.filter((x) => x.id !== sub.id), false).size < FREE_REMINDERS;
    return (
      <DayBody
        pick={asPick(sub)}
        leads={effectiveLeads(settings, pro)}
        time={shortTimeLabel(settings.reminderTime)}
        reminderTime={settings.reminderTime}
        off={room ? undefined : 'No reminder: your free 3 are in use. Swap one in Settings.'}
        onClose={() => setEditing(null)}
        onNotSure={() => setEditing(null)}
        onDone={(anchor) => save(sub, anchor)}
      />
    );
  }

  return (
    <View>
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 16, fontSize: 26, lineHeight: 32 }}>
        Add the dates
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 6 }}>
        No date, no reminder. It’s on your bank app or the receipt email.
      </Txt>
      <ScrollView style={{ marginTop: 16, maxHeight: 420 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 16 }}>
          {list.map((s, i) => (
            <Row key={s.id} s={s} first={i === 0} onPress={() => setEditing(s.id)} />
          ))}
        </View>
      </ScrollView>
      <Button kind="text" label="Later" onPress={close} style={{ marginTop: 8 }} />
    </View>
  );
}

export function AddDatesSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} fit gap={0} maxContent={420} label="Add the dates">
      {visible ? <Body close={onClose} /> : null}
    </Sheet>
  );
}
