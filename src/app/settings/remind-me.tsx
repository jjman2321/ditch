// Remind me: how many days before a charge. Free keeps 3 days and 1 day;
// the other choices come with Pro. Plain words on the control, "heads-up"
// only in the voice (docs/research/settings.md).

import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { LEAD_CHOICES, cleanLeads, effectiveLeads, leadWord, shortTimeLabel } from '@/domain/settings';
import { Group, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { Check, NotificationPreview, Tag, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

export default function RemindMe() {
  const p = usePalette();
  const app = useApp();
  const { settings, pro, plan } = app;
  const leads = effectiveLeads(settings, pro);
  const example = plan.find((r) => r.kind === 'heads-up')?.body ?? 'Netflix renews in 3 days. $17.99. Still watching?';

  const toggle = (d: number) => {
    if (!pro) {
      haptic.select();
      router.push('/paywall?from=app');
      return;
    }
    const on = leads.includes(d);
    if (on && leads.length === 1) {
      haptic.warning();
      return; // keep at least one
    }
    haptic.select();
    app.updateSettings({ leadDays: cleanLeads(on ? leads.filter((x) => x !== d) : [...leads, d]) });
  };

  return (
    <SettingsPage title="Remind me" intro={`When should Ditch remind you? Every reminder lands at ${shortTimeLabel(settings.reminderTime)}.`}>
      <View style={{ marginTop: 18 }}>
        <NotificationPreview time="9:00 AM" message={example} />
      </View>
      <Group note={pro ? 'Pick as many as you like. Trial ends always get the 3 day and 1 day reminders.' : 'Custom timing comes with Pro. Free keeps 3 days and 1 day before.'}>
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
              {on ? <Check color={p.dark ? brand.sunflower : brand.ink} size={20} /> : <View style={{ width: 20 }} />}
            </Pressable>
          );
        })}
      </Group>
    </SettingsPage>
  );
}
