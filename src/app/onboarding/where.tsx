// 3 · Where should we look? (design/v16 screen 2). Every way to find them in
// one place; you check everything before it's added (find/review). The first
// find is free (#34). The bank scan (#64) shows as "Coming soon" in test builds
// only: Apple rejects buttons for features that don't exist yet (2.1). The
// bank's name is never shown (owner, Nov 18).

import { router } from 'expo-router';
import { View } from 'react-native';

import { showImport } from '@/config/features';
import { DEV_TOOLS } from '@/dev/flags';
import { FindPage, RouteCard } from '@/find/Parts';
import { setFindTarget } from '@/import/session';
import { Txt, usePalette } from '@/ui/sunflower';

export default function Where() {
  const p = usePalette();
  const find = (path: '/find/apple' | '/find/statement') => {
    setFindTarget('onboarding');
    router.push(path);
  };
  return (
    <FindPage title="Where should we look?" intro="Use one or all of them. You check everything before it’s added.">
      {DEV_TOOLS ? (
        <View style={{ opacity: 0.55 }} accessibilityState={{ disabled: true }}>
          <RouteCard icon="🏦" title="My bank" line="Finds them in about a minute. Read-only, and we disconnect right after." tag="COMING SOON" onPress={() => {}} />
        </View>
      ) : null}
      {showImport() ? (
        <>
          <RouteCard icon="📱" title="Apple subscriptions" line="A screenshot of your list names every app and trial. Banks only see APPLE.COM/BILL." tag="FREE" onPress={() => find('/find/apple')} />
          <RouteCard icon="🧾" title="A bank statement" line="A PDF or CSV from any bank, any country. We show what repeats." tag="FREE" onPress={() => find('/find/statement')} />
        </>
      ) : null}
      <RouteCard icon="✋" title="Pick them myself" line="Tick them from the services we know." onPress={() => router.push('/onboarding/services')} />
      <Txt v="sub" tone="mute" center style={{ marginTop: 20, color: p.mute }}>
        Read on your iPhone. Screenshots and statements aren’t uploaded.
      </Txt>
    </FindPage>
  );
}
