// "Time": every reminder lands at this wall-clock time. On iPhone it's the
// inline iOS time pill. Elsewhere (web preview, Android) a small sheet with
// hour and minute steppers.

import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { formatTime, parseTime, timeLabel } from '@/domain/settings';
import { Button, F, IconButton, Sheet, Txt, usePalette } from '@/ui/sunflower';

export function TimeField({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const p = usePalette();
  const { h, m } = parseTime(value);
  const [open, setOpen] = useState(false);
  if (Platform.OS === 'ios') {
    const d = new Date(2026, 0, 1, h, m);
    return (
      <DateTimePicker
        value={d}
        mode="time"
        display="compact"
        accessibilityLabel={`Reminder time, ${timeLabel(value)}`}
        themeVariant={p.dark ? 'dark' : 'light'}
        onChange={(_, date) => {
          if (date) onChange(formatTime(date.getHours(), date.getMinutes()));
        }}
      />
    );
  }
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Reminder time, ${timeLabel(value)}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({ minHeight: 36, paddingHorizontal: 12, borderRadius: 9, backgroundColor: p.segBg, justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
        hitSlop={4}
      >
        <Txt v="label" num style={{ fontSize: 16 }}>
          {timeLabel(value)}
        </Txt>
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)} maxHeight={330} label="Reminder time">
        <Stepper value={value} onChange={onChange} onDone={() => setOpen(false)} />
      </Sheet>
    </>
  );
}

function Stepper({ value, onChange, onDone }: { value: string; onChange: (t: string) => void; onDone: () => void }) {
  const p = usePalette();
  const { h, m } = parseTime(value);
  const set = (nh: number, nm: number) => onChange(formatTime((nh + 24) % 24, (nm + 60) % 60));
  const col = (label: string, shown: string, dec: () => void, inc: () => void) => (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Txt v="eyebrow" tone="mute">
        {label}
      </Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <IconButton label={`Earlier ${label}`} onPress={dec} bg={p.segBg}>
          <Txt v="heading">−</Txt>
        </IconButton>
        <Txt v="moneyL" num style={{ minWidth: 48, textAlign: 'center', fontFamily: F.wideHeavy }}>
          {shown}
        </Txt>
        <IconButton label={`Later ${label}`} onPress={inc} bg={p.segBg}>
          <Txt v="heading">+</Txt>
        </IconButton>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <Txt v="heading" accessibilityRole="header">
        Remind me at {timeLabel(value)}
      </Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
        {col('hour', String(h % 12 === 0 ? 12 : h % 12) + (h < 12 ? 'a' : 'p'), () => set(h - 1, m), () => set(h + 1, m))}
        {col('minute', String(m).padStart(2, '0'), () => set(h, m - 1), () => set(h, m + 1))}
      </View>
      <View style={{ flex: 1 }} />
      <Button label="Done" onPress={onDone} />
    </View>
  );
}
