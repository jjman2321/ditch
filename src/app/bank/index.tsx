// Bank explainer (design/v32 screen 2, spec a2): what you get, what we read, what we can't do,
// and the price, all before anything opens. Three ticks, each one VoiceOver element.
// Outside the US and Canada it says so and points to screenshots and statements (spec k).

import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BankPage, BigTitle, TextLink, TickLine, WhatWeSee } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { setFindTarget } from '@/import/session';
import { planById } from '@/services/purchases';
import { Button, Txt } from '@/ui/sunflower';

export default function BankExplainer() {
  const flow = useBankFlow();
  const [see, setSee] = useState(false);
  const yearly = planById('yearly');

  if (!flow.on) {
    const go = (path: '/find/apple' | '/find/statement') => {
      setFindTarget(flow.onboarding ? 'onboarding' : 'app');
      router.replace(path);
    };
    return (
      <BankPage
        footer={
          <>
            <Button label="Screenshot my Apple list" onPress={() => go('/find/apple')} />
            <Button kind="secondary" label="Use a statement" onPress={() => go('/find/statement')} style={{ marginTop: 10 }} />
          </>
        }
      >
        <BigTitle style={{ marginTop: 8 }}>US and Canada for now.</BigTitle>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
          Bank sync works with US and Canadian banks for now. Screenshots and statements work anywhere.
        </Txt>
      </BankPage>
    );
  }

  return (
    <BankPage
      footer={
        <>
          <Button label="Choose my bank" tapHaptic onPress={() => router.push(`/bank/pick?${flow.q()}`)} />
          <Button kind="text" label="Not now" onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ marginTop: 4 }} />
          <Txt v="fine" tone="mute" center num style={{ marginTop: 2 }}>
            {flow.pro ? 'US & Canada. Part of your Pro.' : `US & Canada. Part of Pro: ${yearly.trialDays} days free, then ${yearly.priceString}/yr.`}
          </Txt>
        </>
      }
    >
      <BigTitle style={{ marginTop: 8 }}>{'Your bank\nalready knows.'}</BigTitle>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
        Connect it once. Ditch finds what you pay for, adds it to your list and spots new ones as they start.
      </Txt>
      <View style={{ marginTop: 18 }}>
        <TickLine>Read-only. Ditch can’t move money.</TickLine>
        <TickLine>You sign in with your bank. We never see your password.</TickLine>
        <TickLine>Disconnect any time in Settings.</TickLine>
      </View>
      <Txt v="fine" tone="mute" style={{ marginTop: 8 }}>
        Apple subscriptions show as one “Apple” charge. A screenshot of your Apple list names them.
      </Txt>
      <TextLink label="What we see" onPress={() => setSee(true)} hint="Opens a short note on what Ditch reads" />
      <WhatWeSee visible={see} onClose={() => setSee(false)} />
    </BankPage>
  );
}
