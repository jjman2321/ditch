// "Add dates ›" on Home: straight into the day picker for each sub with no
// date, biggest first, "1 of 4" on top, like the onboarding dates step
// (DECISIONS #33; owner, Nov 20: no list step first). A sub that gets a date also
// gets a free reminder if there's room in the 3. Closes when all are done.
// The day sheet starts on today (it charged today) (src/domain/paidToday.ts).

import { useState } from 'react';

import { effectiveLeads, shortTimeLabel } from '@/domain/settings';
import { FREE_REMINDERS, remindedIds, undatedSubs, yearlyOfSub, type Sub } from '@/domain/subs';
import { asPick } from '@/editor/Editor';
import { DayBody } from '@/onboarding/DaySheet';
import { useApp } from '@/state/app';
import { Sheet, haptic } from '@/ui/sunflower';

function Body({ close }: { close: () => void }) {
  const app = useApp();
  const { settings, pro } = app;
  // Straight to the day picker (owner, Nov 20: no list step first), one after the other like onboarding.
  // The order is fixed when the sheet opens, so saving one doesn't reshuffle the rest.
  const [order] = useState(() =>
    undatedSubs(app.subs)
      .sort((a, b) => yearlyOfSub(b) - yearlyOfSub(a))
      .map((s) => s.id),
  );
  const [idx, setIdx] = useState(0);
  const sub = app.subs.find((s) => s.id === order[idx]) ?? null;
  const next = () => (idx + 1 < order.length ? setIdx(idx + 1) : close());

  const save = async (s: Sub, anchor: string, dateSource: 'next' | 'receipt') => {
    // Room in the free 3? Then this one gets reminders now that it has a date.
    const room =
      !pro &&
      remindedIds(
        app.subs.filter((x) => x.id !== s.id),
        false,
      ).size < FREE_REMINDERS;
    // Not saved: the app has said so; stay on this one.
    if (!(await app.storeSub({ ...s, anchor, dateSource, freePick: room }, { isNew: false }))) return;
    haptic.select();
    next();
  };

  if (!sub) return null;
  const room =
    pro ||
    remindedIds(
      app.subs.filter((x) => x.id !== sub.id),
      false,
    ).size < FREE_REMINDERS;
  return (
    <DayBody
      key={sub.id}
      pick={asPick(sub)}
      progress={order.length > 1 ? `${idx + 1} of ${order.length}` : undefined}
      leads={effectiveLeads(settings, pro)}
      time={shortTimeLabel(settings.reminderTime)}
      reminderTime={settings.reminderTime}
      off={room ? undefined : 'No reminder: your free 3 are in use. Swap one in Settings.'}
      onClose={close}
      onNotSure={next}
      onDone={(anchor, source) => save(sub, anchor, source)}
    />
  );
}

export function AddDatesSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} fit gap={0} maxContent={420} label="Add the dates">
      {visible ? <Body close={onClose} /> : null}
    </Sheet>
  );
}
