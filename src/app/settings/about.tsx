// About Ditch: rate, terms, privacy, version.

import { View } from 'react-native';

import { openUrl } from '@/ditch/CancelHelp';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { APP_VERSION } from '@/settings/version';
import { tell } from '@/ui/alert';
import { DuckIcon, Txt, Wordmark } from '@/ui/sunflower';

/** Filled in once the app has an App Store listing (Milestone 5). */
const APP_STORE_ID: string | null = null;

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
        <Row
          label="Rate Ditch"
          onPress={() =>
            APP_STORE_ID ? openUrl(`https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`) : tell('Not yet', 'Rating opens once Ditch is in the App Store. Thanks for wanting to!')
          }
        />
        <Row label="Terms" onPress={() => openUrl('https://ditchsubs.app/terms')} />
        <Row label="Privacy" onPress={() => openUrl('https://ditchsubs.app/privacy')} />
      </Group>
      <Txt v="fine" tone="mute" style={{ textAlign: 'center', marginTop: 24 }}>
        Version {APP_VERSION} · Grasp Labs LLC
      </Txt>
    </SettingsPage>
  );
}
