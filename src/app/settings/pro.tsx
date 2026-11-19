// Ditch Pro: the plan, restore, manage. Purchases go through StoreKit 2
// directly (DECISIONS #59, no RevenueCat) once Milestone 2 lands; until then
// they're stubbed, so this never charges anything. Prices and the trial come
// from PLANS (DECISIONS #66: Weekly $6.99, Yearly $49.99 with 7 days free,
// Lifetime $99.99), never typed here.

import { router } from 'expo-router';
import { View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { weekdayDate } from '@/domain/dates';
import { listedUserSubs, runningProTrial } from '@/domain/subs';
import { openUrl } from '@/ditch/CancelHelp';
import { billedLabel, planById, restorePurchases } from '@/services/purchases';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { useApp } from '@/state/app';
import { tell } from '@/ui/alert';
import { Button, Card, Check, DuckIcon, ProLockup, Txt, brand, usePalette } from '@/ui/sunflower';

export default function ProPage() {
  const p = usePalette();
  const app = useApp();
  const { pro, settings, subs } = app;
  const trial = runningProTrial(subs, app.today);
  const plan = settings.proPlan && settings.proPlan !== 'monthly' ? planById(settings.proPlan) : null;
  const yearly = planById('yearly');
  const n = listedUserSubs(subs).length;
  const tick = <Check color={p.dark ? brand.sunflower : brand.ink} size={18} />;
  const restore = async () => {
    const r = await restorePurchases();
    tell(r.restored ? 'Restored' : 'Nothing to restore', r.restored ? 'Ditch Pro is back on.' : 'We couldn’t find a Ditch Pro purchase on this Apple Account.');
  };
  return (
    <SettingsPage title="Ditch Pro">
      <Card style={{ marginTop: 18, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <DuckIcon size={48} />
        <View style={{ flex: 1 }}>
          {pro ? (
            <ProLockup size={18} suffix={plan?.title.toLowerCase()} color={p.cardFg} />
          ) : (
            <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17 }}>
              You’re on Free
            </Txt>
          )}
          <Txt v="body" tone="mute" style={{ marginTop: 2 }}>
            {!pro
              ? 'Reminders on 3 subscriptions'
              : trial
                ? `Trial ends ${weekdayDate(trial.anchor)}. We’ll remind you before.`
                : settings.proPlan === 'lifetime'
                  ? 'Paid once. Yours for good.'
                  : 'Reminders on everything, on your timing'}
          </Txt>
        </View>
      </Card>
      {pro ? null : (
        <>
          {/* What Pro adds, in the user's own numbers (same rows as the paywall table). */}
          <Group header="With Pro">
            <Row label={n > 3 ? `Reminders on all ${n}` : 'Reminders on everything'} right={tick} />
            <Row label="Pick your reminder days" right={tick} />
            <Row label="Price hike alerts" right={tick} />
          </Group>
          <Button label={`Try Pro free for ${yearly.trialDays} days`} onPress={() => router.push('/paywall?from=app')} style={{ marginTop: 18 }} />
          <Txt v="fine" tone="mute" num center style={{ marginTop: 8, fontSize: 13.5 }}>
            {`${yearly.trialDays} days free, then ${billedLabel(yearly)}`}
          </Txt>
        </>
      )}
      <Group note={`Lifetime is a one-time ${planById('lifetime').priceString} for Pro. Cancel a subscription anytime in iPhone Settings → your name → Subscriptions.`}>
        {pro && trial ? <Row label="Trial ends" value={weekdayDate(trial.anchor)} /> : null}
        {pro && settings.proPlan !== 'lifetime' ? <Row label="Manage" hint="Opens your Apple subscriptions" onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} /> : null}
        <Row label="Restore purchases" onPress={restore} chevron={false} />
      </Group>
    </SettingsPage>
  );
}
