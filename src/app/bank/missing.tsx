// Didn't find your bank? (design/v32 screen 15, spec k). Reached from "Bank not here?" before
// paying, or by closing the bank sign-in. Always a next step: another bank, a statement, or
// picking them by hand. With a trial already running it says the trial still covers reminders.

import { router } from 'expo-router';
import { View } from 'react-native';

import { BankPage } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { shortDate } from '@/domain/dates';
import { runningProTrial } from '@/domain/subs';
import { setFindTarget } from '@/import/session';
import { useApp } from '@/state/app';
import { Button, Card, Txt } from '@/ui/sunflower';

export default function BankMissing() {
  const flow = useBankFlow();
  const app = useApp();
  const trial = runningProTrial(app.subs, app.today);
  const statement = () => {
    setFindTarget(flow.onboarding ? 'onboarding' : 'app');
    router.replace('/find/statement');
  };
  const note = trial
    ? `Your trial still covers reminders on everything. Cancel by ${shortDate(trial.anchor)} to pay nothing.`
    : flow.pro
      ? 'Your Apple list and bank statements work without connecting anything.'
      : 'Your Apple list and bank statements work without connecting anything. You haven’t paid anything.';
  return (
    <BankPage
      brand
      footer={
        <>
          <Button label="Try another bank or card" onPress={() => router.replace(`/bank/pick?${flow.q()}`)} />
          <Button kind="secondary" label="Use a statement" onPress={statement} style={{ marginTop: 10 }} />
          <Button kind="text" label="Pick them myself" onPress={() => (flow.onboarding ? router.replace('/onboarding/services') : router.replace('/add'))} style={{ marginTop: 4 }} />
        </>
      }
    >
      {/* An empty state: centred text, the ditch wordmark in the top bar (owner, Nov 20: plain screens get the
          brand mark, the text logo at the top, not the app icon). */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
        <Txt v="title" accessibilityRole="header" center style={{ fontSize: 30, lineHeight: 34 }}>
          {'Didn’t find\nyour bank?'}
        </Txt>
        <Txt v="leadS" tone="fg2" center style={{ marginTop: 10, maxWidth: 340 }}>
          Some banks and credit unions can’t connect yet. The card you pay subscriptions with might work.
        </Txt>
        <Card style={{ marginTop: 18, padding: 16, alignSelf: 'stretch' }}>
          <Txt v="bodyS" tone="fg2" center>
            {note}
          </Txt>
        </Card>
      </View>
    </BankPage>
  );
}
