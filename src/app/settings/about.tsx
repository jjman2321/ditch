// About Ditch: terms, privacy, sources, version. (Rating lives in Settings → Feedback & help.)

import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import { Platform, View } from 'react-native';

import { openUrl } from '@/ditch/CancelHelp';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { SHORT_VERSION, updateLabel } from '@/settings/version';
import { DuckIcon, Txt, Wordmark } from '@/ui/sunflower';

/** Testers need to know which update they're on; App Store users don't (owner: no clutter). */
function onTestFlight(): boolean {
  if (Platform.OS === 'web') return false;
  try {
    return Updates.channel === 'testflight';
  } catch {
    return false;
  }
}

export default function About() {
  return (
    <SettingsPage title="About Ditch">
      {/* Tall phones: the brand block comes down a little and the version sits at the bottom, so the page
          doesn't end halfway with an empty half below (audit, Nov 20). */}
      <View style={{ flexGrow: 1, maxHeight: 64 }} />
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
      <View style={{ flexGrow: 1, minHeight: 24 }} />
      <Txt v="fine" tone="mute" style={{ textAlign: 'center' }}>
        Ditch {SHORT_VERSION} · Grasp Labs LLC
      </Txt>
      {onTestFlight() ? (
        <Txt v="fine" tone="mute" style={{ textAlign: 'center', marginTop: 4 }}>
          {updateLabel()}
        </Txt>
      ) : null}
    </SettingsPage>
  );
}
