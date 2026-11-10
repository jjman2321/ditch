// Your data: export a spreadsheet, or delete everything on this phone.
// iCloud backup stays hidden until it works (SPEC §3.5).

import { File, Paths } from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { currencyDigits } from '@/domain/money';
import { toCsv } from '@/domain/subs';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { ask, tell } from '@/ui/alert';

export default function DataPage() {
  const app = useApp();

  const exportCsv = async () => {
    const csv = toCsv(app.subs, app.today, currencyDigits);
    const name = `ditch-${app.today}.csv`;
    try {
      if (Platform.OS === 'web') {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = name;
        a.click();
        return;
      }
      const file = new File(Paths.cache, name);
      if (file.exists) file.delete();
      file.create();
      file.write(csv);
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text', dialogTitle: 'Your Ditch list' });
    } catch {
      tell('Couldn’t export', 'Something went wrong making the file. Try again in a moment.');
    }
  };

  const deleteAll = () =>
    ask('Delete everything?', 'Your list, ditched subs and settings go from this phone, and all reminders stop. This doesn’t cancel any subscriptions, including Ditch Pro.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await app.deleteAll();
          router.replace('/onboarding');
        },
      },
    ]);

  return (
    <SettingsPage title="Your data" intro="Your list stays on your phone. No account, no bank link.">
      <Group>
        <Row label="Export as spreadsheet (CSV)" onPress={exportCsv} hint="Opens the share sheet" />
      </Group>
      <Group note="Deletes your list from this phone. It doesn’t cancel any subscriptions, including Ditch Pro." style={{ marginTop: 34 }}>
        <Row label="Delete all my data" danger onPress={deleteAll} chevron={false} />
      </Group>
    </SettingsPage>
  );
}
