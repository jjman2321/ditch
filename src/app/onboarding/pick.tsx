// 7 · Pick 3 for reminders (free plan, more than 3 subs).

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { formatMoney, yearlyMinor } from '@/domain/money';
import { byYearlyDesc, useOnboarding, usePickedList } from '@/state/onboarding';
import { AppLogo } from '@/ui/ditch';
import { Btn, C, F, Option, RaccoonSays, Screen, Small, tap } from '@/ui/kit';

export default function Pick() {
  const { setReminderPicks } = useOnboarding();
  const list = usePickedList();
  const sorted = useMemo(() => [...list].sort(byYearlyDesc), [list]);
  const [sel, setSel] = useState<string[]>(() => sorted.slice(0, 3).map((x) => x.id));
  const [nudge, setNudge] = useState(false);
  const toggle = (id: string) => {
    if (sel.includes(id)) return (setSel(sel.filter((x) => x !== id)), setNudge(false));
    if (sel.length < 3) return (setSel([...sel, id]), setNudge(false));
    tap('error');
    setNudge(true);
  };
  return (
    <Screen
      footer={
        <>
          <Small center style={{ color: nudge ? C.ink : C.ink2, fontFamily: F.semi }}>
            {nudge ? 'That’s 3. Untick one to swap.' : `${sel.length} of 3 picked`}
          </Small>
          <Btn
            label="Done"
            disabled={sel.length === 0}
            onPress={() => {
              setReminderPicks(sel);
              router.replace('/onboarding/done');
            }}
          />
        </>
      }
    >
      <RaccoonSays text="Free it is! I picked your 3 biggest. Swap any time." pose="talk" />
      {sorted.map((x) => (
        <Option
          key={x.id}
          multi
          label={x.name}
          sub={`${formatMoney(yearlyMinor(x.amountMinor, x.cycle), x.currency)} a year`}
          state={sel.includes(x.id) ? 'selected' : 'idle'}
          onPress={() => toggle(x.id)}
          left={<AppLogo id={x.id} color={x.color} ink={x.ink} mono={x.mono} size={40} />}
        />
      ))}
      <Text style={{ display: 'none' }} />
    </Screen>
  );
}
