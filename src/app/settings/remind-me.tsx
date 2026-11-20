// Remind me: how many days before a charge. Free keeps 3 days and 1 day;
// the other choices come with Pro. Plain words on the control, "heads-up"
// only in the voice (docs/research/settings.md). The time in the intro is
// tappable: it opens the same time control as Settings → Time.

import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';

import { LEAD_CHOICES, cleanLeads, effectiveLeads, leadWord, shortTimeLabel, timeLabel } from '@/domain/settings';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { TimeField } from '@/settings/TimeField';
import { useApp } from '@/state/app';
import { Check, F, NotificationPreview, Tag, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

export default function RemindMe() {
  const p = usePalette();
  const app = useApp();
  const { settings, pro, plan } = app;
  const leads = effectiveLeads(settings, pro);
  const example = plan.find((r) => r.kind === 'heads-up')?.body ?? 'Netflix renews Saturday. $17.99. Still watching?';
  const [timeOpen, setTimeOpen] = useState(false);
  const time = shortTimeLabel(settings.reminderTime);
  const openTime = () => {
    haptic.select();
    setTimeOpen(true);
    AccessibilityInfo.announceForAccessibility('Reminder time is below. Change it there.');
  };

  const toggle = (d: number) => {
    if (!pro) {
      haptic.select();
      router.push('/paywall?from=remind');
      return;
    }
    const on = leads.includes(d);
    if (on && leads.length === 1) {
      haptic.warning();
      AccessibilityInfo.announceForAccessibility('Keep at least one reminder day.');
      return; // keep at least one
    }
    haptic.select();
    app.updateSettings({ leadDays: cleanLeads(on ? leads.filter((x) => x !== d) : [...leads, d]) });
  };

  return (
    <SettingsPage title="Remind me">
      {/* Same look as the page intro; the whole sentence is the tap target (≥ 44pt), the time is underlined. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`When should Ditch remind you? Reminders come at ${time}.`}
        accessibilityHint="Change the reminder time"
        onPress={openTime}
        style={({ pressed }) => ({ marginTop: 8, minHeight: 44, opacity: pressed ? 0.6 : 1 })}
      >
        <Txt v="leadS" tone="fg2">
          When should Ditch remind you? Reminders come at{' '}
          <Txt v="leadS" tone="fg2" style={{ fontFamily: F.semi, textDecorationLine: 'underline' }}>
            {time}
          </Txt>
          .
        </Txt>
      </Pressable>
      {timeOpen ? (
        <Group style={{ marginTop: 14 }}>
          <Row label="Time" right={<TimeField value={settings.reminderTime} onChange={(t) => app.updateSettings({ reminderTime: t })} />} a11yValue={`, ${time}`} />
        </Group>
      ) : null}
      <View style={{ marginTop: 18 }}>
        <NotificationPreview time={timeLabel(settings.reminderTime)} message={example} />
      </View>
      <Group note={pro ? 'Pick as many as you like (at least one). Trials you track always get a 3-day and 1-day reminder too.' : 'Custom timing comes with Pro. Free keeps 3 days and 1 day before.'}>
        {LEAD_CHOICES.map((d) => {
          const on = leads.includes(d);
          const locked = !pro && !on;
          return (
            <Pressable
              key={d}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: !pro && on }}
              accessibilityLabel={`${leadWord(d)}${d ? ' before' : ''}${locked ? ', comes with Pro' : ''}`}
              onPress={() => toggle(d)}
              style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: pressed ? 0.6 : 1 })}
            >
              <Txt v="leadS" color={p.cardFg} style={{ flex: 1, fontSize: 16.5 }}>
                {leadWord(d)}
                {d ? ' before' : ''}
              </Txt>
              {locked ? <Tag label="PRO" /> : null}
              {/* One trailing column: a tick, the PRO tag, or an empty tick-sized slot. */}
              {on ? <Check color={p.dark ? brand.sunflower : brand.ink} size={20} /> : locked ? null : <View style={{ width: 20 }} />}
            </Pressable>
          );
        })}
      </Group>
    </SettingsPage>
  );
}
