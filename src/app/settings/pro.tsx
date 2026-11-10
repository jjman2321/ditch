// Ditch Pro: the plan, restore, manage. Purchases are stubbed until
// RevenueCat (Milestone 2), so this never charges anything.

import { router } from 'expo-router';
import { View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { weekdayDate } from '@/domain/dates';
import { isProTrial } from '@/domain/subs';
import { openUrl } from '@/ditch/CancelHelp';
import { planById, restorePurchases } from '@/services/purchases';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { tell } from '@/ui/alert';
import { Button, Card, DuckIcon, ProLockup, Txt, usePalette } from '@/ui/sunflower';

export default function ProPage() {
  const p = usePalette();
  const app = useApp();
  const { pro, settings, subs } = app;
  const trial = subs.find((s) => isProTrial(s) && s.status === 'active');
  const plan = settings.proPlan ? planById(settings.proPlan) : null;
  const restore = async () => {
    const r = await restorePurchases();
    tell(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };
  return (
    <SettingsPage title="Ditch Pro">
      <Card style={{ marginTop: 18, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <DuckIcon size={48} />
        <View style={{ flex: 1 }}>
          {pro ? <ProLockup size={18} suffix={plan?.title.toLowerCase()} color={p.cardFg} /> : <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }}>You’re on Free</Txt>}
          <Txt v="body" tone="mute" style={{ marginTop: 2 }}>
            {!pro ? 'Reminders on 3 subscriptions' : trial ? `Trial ends ${weekdayDate(trial.anchor)}. We’ll remind you before.` : settings.proPlan === 'lifetime' ? 'Paid once. Yours for good.' : 'Reminders on everything, on your timing'}
          </Txt>
        </View>
      </Card>
      {pro ? null : <Button label={`Try Pro free for ${planById('yearly').trialDays} days`} onPress={() => router.push('/paywall?from=app')} style={{ marginTop: 14 }} />}
      <Group note={`Lifetime is a one-time ${planById('lifetime').priceString} for Pro. Cancel a subscription anytime in iPhone Settings → your name → Subscriptions.`}>
        <Row label="Restore purchases" onPress={restore} />
        {pro && settings.proPlan !== 'lifetime' ? <Row label="Manage subscription" onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} /> : null}
      </Group>
    </SettingsPage>
  );
}
