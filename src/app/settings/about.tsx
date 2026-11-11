// About Ditch: terms, privacy, sources, version. (Rating lives in Settings → Feedback & help.)

import { router } from 'expo-router';
import { View } from 'react-native';

import { openUrl } from '@/ditch/CancelHelp';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { APP_VERSION } from '@/settings/version';
import { DuckIcon, Txt, Wordmark } from '@/ui/sunflower';

export default function About() {
  return (
    <SettingsPage title="About Ditch">
      <View style={{ alignItems: 'center', marginTop: 24, gap: 10 }}>
        <DuckIcon size={76} />
        <Wordmark size={30} />
        <Txt v="leadS" tone="fg2">
          Ditch it before it renews.
        </Txt>
      </View>
      <Group>
        <Row label="Terms" onPress={() => openUrl('https://ditchsubs.app/terms')} />
        <Row label="Privacy" onPress={() => openUrl('https://ditchsubs.app/privacy')} />
        <Row label="Sources" hint="The studies behind the numbers in Ditch" onPress={() => router.push('/settings/sources')} />
      </Group>
      <Txt v="fine" tone="mute" style={{ textAlign: 'center', marginTop: 24 }}>
        Version {APP_VERSION} · Grasp Labs LLC
      </Txt>
    </SettingsPage>
  );
}
