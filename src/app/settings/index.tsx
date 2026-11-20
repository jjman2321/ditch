// 14 · Settings, Layout A (docs/research/settings.md): one health card that
// proves reminders work, then 8 rows in 4 short groups. No PRO tags, no
// appearance switch (follows the iPhone), iCloud backup hidden until it works.

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Linking, View } from 'react-native';

import { DEV_TOOLS } from '@/dev/flags';
import { weekdayDate, toDateOnly } from '@/domain/dates';
import { nextReminder } from '@/domain/reminders';
import { effectiveLeads, formatTime, leadsLabel, shortTimeLabel } from '@/domain/settings';
import { FREE_REMINDERS, hasDate, listedUserSubs, remindedIds, runningProTrial } from '@/domain/subs';
import { useEditor } from '@/editor/Editor';
import { pendingCount } from '@/services/notifications';
import { planById, restorePurchases, usePlans } from '@/services/purchases';
import { ordinal } from '@/domain/copy';
import { Group, Row, SettingsPage } from '@/settings/Parts';
import { RESTORE_FAILED, RESTORE_FAILED_TITLE, RESTORE_NONE, RESTORE_NONE_TITLE } from '@/settings/restore';
import { rateDitch, type FeedbackKind } from '@/settings/feedback';
import { FeedbackSheet } from '@/settings/FeedbackSheet';
import { SHORT_VERSION } from '@/settings/version';
import { TimeField } from '@/settings/TimeField';
import { useApp } from '@/state/app';
import { useBank } from '@/state/bank';
import { needsSignIn } from '@/state/bankLogic';
import { ask, tell } from '@/ui/alert';
import { Bang, Bell, Button, Card, Check, F, ProLockup, SunSwitch, Txt, brand, haptic, usePalette } from '@/ui/sunflower';

/** Non-breaking space: keeps "at 9 AM" (the real time) together on one line. */
const NB = '\u00A0';

export default function Settings() {
  const app = useApp();
  const { settings, pro, subs } = app;
  const listed = listedUserSubs(subs);
  const reminded = remindedIds(subs, pro);
  const trial = runningProTrial(subs, app.today);
  const leadWords = leadsLabel(effectiveLeads(settings, pro)).replace(/ and (?=[^,]*$)/, ', ');
  // Under 350pt wide (or with large text) the row puts this under its label, so it's never cut.
  const remindValue = leadWords;

  // Feedback & help: one in-app form, opened on the row they tapped.
  const [feedback, setFeedback] = useState<{ visible: boolean; kind: FeedbackKind; session: number }>({ visible: false, kind: 'problem', session: 0 });
  const openFeedback = (kind: FeedbackKind) => setFeedback((f) => ({ visible: true, kind, session: f.session + 1 }));

  // Health check every time Settings opens.
  const { recheck } = app;
  const { cardFg, amber } = usePalette();
  useFocusEffect(
    useCallback(() => {
      recheck();
    }, [recheck]),
  );

  // Free counts against the free allowance ("2 of 3 free"); Pro has no allowance, so it's just how many are on ("4 on").
  // Pro: "All on" unless they switched one off. Subs with no date can't be reminded, so they don't count as off.
  const allOn = !listed.some((s) => hasDate(s) && s.muted);
  const whichValue = pro ? (allOn ? 'All on' : `${reminded.size} on`) : `${reminded.size} of ${FREE_REMINDERS} free`;
  const whichSpoken = pro ? (allOn ? ', reminders on for all of them' : `, reminders on for ${reminded.size}`) : `, ${reminded.size} of ${FREE_REMINDERS} free reminders picked`;
  const proValue = !pro
    ? null
    : trial
      ? `Trial, ends ${weekdayDate(trial.anchor).split(', ')[1]}`
      : settings.proPlan === 'lifetime'
        ? 'Lifetime'
        : settings.proPlan === 'weekly'
          ? 'Weekly'
          : settings.proPlan === 'monthly'
            ? 'Monthly'
            : 'Yearly';
  // VoiceOver hears the plan and its price, not just the row name (prices from PLANS, never typed here).
  usePlans();
  const yearly = planById('yearly');
  const proPlan = settings.proPlan && settings.proPlan !== 'monthly' ? planById(settings.proPlan) : null;
  const proSpoken = !pro
    ? yearly.trialDays > 0
      ? `, try free for ${yearly.trialDays} days, then ${yearly.priceString} a year`
      : `, ${yearly.priceString} a year`
    : proPlan?.id === 'lifetime'
      ? `, Lifetime, paid once`
      : `, ${proValue}${proPlan ? `, ${proPlan.priceString} a ${proPlan.period}` : ''}`;
  // Bank connections (DECISIONS #70): test builds in the US/Canada. "Chase" / "Chase + 1"; an amber dot when one needs a sign-in.
  const bank = useBank();
  const links = bank.state.links;
  const broken = links.some(needsSignIn);
  const bankValue = links.length ? (links.length === 1 ? links[0].name : `${links[0].name} + ${links.length - 1}`) : 'None';
  // Pro itself follows the App Store (src/state/app.tsx), so this only says what it found.
  const restore = async () => {
    let r: Awaited<ReturnType<typeof restorePurchases>>;
    try {
      r = await restorePurchases();
    } catch {
      tell(RESTORE_FAILED_TITLE, RESTORE_FAILED);
      return;
    }
    tell(r.restored ? 'Restored' : RESTORE_NONE_TITLE, r.restored ? 'Ditch Pro is back on.' : RESTORE_NONE);
  };

  return (
    <SettingsPage title="Settings" back="Home">
      <HealthCard />

      <Group header="Reminders" note={pro ? undefined : 'Free reminds you about 3 subscriptions. Pro reminds you about all of them, when you like.'}>
        <Row label="Remind me" value={remindValue} onPress={() => router.push('/settings/remind-me')} />
        <Row label="Time" right={<TimeField value={settings.reminderTime} onChange={(t) => app.updateSettings({ reminderTime: t })} />} a11yValue={`, ${shortTimeLabel(settings.reminderTime)}`} />
        <Row label="Which subscriptions" value={whichValue} a11yValue={whichSpoken} onPress={() => router.push('/settings/which')} />
      </Group>

      <Group header="Your plan">
        <Row
          label="Ditch Pro"
          labelNode={<ProLockup size={19} color={cardFg} />}
          onPress={() => (pro ? router.push('/settings/pro') : router.push('/paywall?from=app'))}
          a11yValue={proSpoken}
          right={
            pro ? (
              <Txt v="leadS" tone="mute">
                {proValue}
              </Txt>
            ) : (
              // "Try free" only while this Apple Account can still get the intro trial (StoreKit's
              // isEligibleForIntroOffer, via planById); otherwise "See Pro".
              <View style={{ backgroundColor: brand.sunflower, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Txt v="label" color={brand.ink} style={{ fontFamily: F.bold, fontSize: 15 }}>
                  {yearly.trialDays > 0 ? 'Try free' : 'See Pro'}
                </Txt>
              </View>
            )
          }
        />
        {/* Restore is always one tap away for anyone not on Pro (App Review 3.1.1), same as on the paywall. */}
        {pro ? null : <Row label="Restore purchases" onPress={() => void restore()} chevron={false} />}
      </Group>

      <Group header="Your list">
        <Row label="Currency" value={`${settings.currency} ${symbolOf(settings.currency)}`} onPress={() => router.push('/settings/currency')} />
        <Row label="Payday" value={settings.payday ? `The ${ordinal(settings.payday)}` : 'Off'} onPress={() => router.push('/settings/payday')} />
        {bank.on ? (
          <Row
            label="Bank connections"
            onPress={() => router.push('/settings/banks')}
            a11yValue={`, ${bankValue}${broken ? ', one needs a sign-in' : ''}`}
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {broken ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: amber }} /> : null}
                <Txt v="leadS" tone="mute" numberOfLines={1} style={{ fontSize: 16 }}>
                  {bankValue}
                </Txt>
              </View>
            }
          />
        ) : null}
        <Row label="Your data" onPress={() => router.push('/settings/data')} />
      </Group>

      {/* Feedback & help: a person reads every one (reviews: a developer who answers turns 1★ into 5★). */}
      <Group header="Feedback & help" note="A real person reads every one.">
        <Row label="Report a problem" hint="Opens a short form" onPress={() => openFeedback('problem')} />
        <Row label="Suggest a feature" hint="Opens a short form" onPress={() => openFeedback('idea')} />
        <Row label="Suggest a subscription" hint="Missing one? We’ll add it to the list" onPress={() => openFeedback('service')} />
        {/* Hidden until the App Store listing exists: Apple's own prompt is never tied to a button (DECISIONS #38). */}
        <Row label="Rate Ditch" hint="Opens the App Store" onPress={rateDitch} />
      </Group>
      <FeedbackSheet {...feedback} onClose={() => setFeedback((f) => ({ ...f, visible: false }))} />

      <Group>
        <Row label="About Ditch" onPress={() => router.push('/settings/about')} />
      </Group>

      {DEV_TOOLS ? <DevTools /> : null}

      <View style={{ alignItems: 'center', marginTop: 26, gap: 2 }}>
        <Txt v="fine" tone="mute">
          Your list stays on your phone.
        </Txt>
        <Txt v="fine" tone="mute">
          Ditch {SHORT_VERSION}
        </Txt>
      </View>
    </SettingsPage>
  );
}

function symbolOf(currency: string): string {
  try {
    const s = (0).toLocaleString('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).replace(/[\d.,\s]/g, '');
    return s === currency ? '' : s;
  } catch {
    return '';
  }
}

type Health = {
  icon: 'ok' | 'bell' | 'warn';
  title: string;
  line: string;
  button?: { label: string; onPress: () => void };
  test: boolean;
};

function HealthCard() {
  const p = usePalette();
  const app = useApp();
  const editor = useEditor();
  const { notif, plan, subs, pro } = app;
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 6000);
    return () => clearTimeout(t);
  }, [sent]);

  const next = nextReminder(plan, subs);
  const listed = listedUserSubs(subs);
  const anyDated = listed.some(hasDate);
  const nonePicked = !pro && remindedIds(subs, false).size === 0 && anyDated;
  const openPhone = () => Linking.openSettings().catch(() => {});

  let h: Health;
  if (notif === 'denied') {
    h = { icon: 'warn', title: 'Reminders are off', line: 'Your iPhone is blocking them, so nothing can reach you.', button: { label: 'Turn on in iPhone Settings', onPress: openPhone }, test: false };
  } else if (notif === 'undetermined') {
    h = { icon: 'bell', title: 'Reminders aren’t on yet', line: 'Ditch needs your OK to send them.', button: { label: 'Turn on reminders', onPress: () => app.askNotif() }, test: false };
  } else if (notif === 'quiet') {
    h = {
      icon: 'warn',
      title: 'On, but quiet',
      line: 'Banners are off, so reminders slip into Notification Center without a sound.',
      button: { label: 'Change in iPhone Settings', onPress: openPhone },
      test: true,
    };
  } else if (!listed.length) {
    h = {
      icon: 'ok',
      title: 'All set up',
      line: 'Nothing on your list yet. Add a subscription and reminders start once it has a date.',
      button: { label: 'Add a subscription', onPress: () => editor.openAdd() },
      test: true,
    };
  } else if (!anyDated) {
    h = {
      icon: 'bell',
      title: 'No dates yet',
      line: 'Reminders start once a subscription has a date. Add them from your list.',
      button: { label: 'Go to my list', onPress: () => router.back() },
      test: true,
    };
  } else if (nonePicked) {
    h = {
      icon: 'bell',
      title: 'No reminders picked',
      line: 'Pick up to 3 and you’ll hear before they charge.',
      button: { label: 'Pick 3', onPress: () => router.push('/settings/which') },
      test: true,
    };
  } else if (next) {
    h = {
      icon: 'ok',
      title: 'All good',
      // Name on line 1, "Wed, Nov 11 at 9 AM" on line 2, held together so it never splits mid-date.
      line: `Next one: ${next.name}, ${weekdayDate(toDateOnly(next.fireAt)).replace(/ (\d+)$/, `${NB}$1`)} at${NB}${shortTimeLabel(formatTime(next.fireAt.getHours(), next.fireAt.getMinutes()))}`,
      test: true,
    };
  } else {
    h = { icon: 'ok', title: 'All good', line: 'Nothing to remind you about yet. Add a next charge date to start.', test: true };
  }

  const test = async () => {
    // One at a time: the last one is still on its way.
    if (sent) return;
    haptic.select();
    const ok = await app.sendTest();
    if (ok) {
      setSent(true);
      AccessibilityInfo.announceForAccessibility('Sent. It arrives in a second.');
    } else
      ask('Couldn’t send it', 'Check that notifications for Ditch are on in iPhone Settings.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => void Linking.openSettings().catch(() => {}) },
      ]);
  };

  return (
    <Card style={{ marginTop: 18, padding: 16, gap: 14 }}>
      <View
        style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}
        accessible
        accessibilityLabel={`${h.title}. ${sent ? 'Sent. Check the top of your screen.' : h.line}`}
        accessibilityLiveRegion="polite"
      >
        {h.icon === 'warn' ? (
          <Bang color={brand.ink} bg={brand.bill} size={36} />
        ) : (
          <View
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center', borderWidth: p.dark ? 0 : 1.5, borderColor: brand.ink }}
          >
            {h.icon === 'ok' ? <Check color={brand.ink} size={17} /> : <Bell color={brand.ink} fill={brand.ink} size={16} />}
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 17, fontFamily: F.bold }}>
            {h.title}
          </Txt>
          <Txt v="body" tone="mute" num style={{ marginTop: 2 }}>
            {sent ? 'Sent. Check the top of your screen.' : h.line}
          </Txt>
        </View>
      </View>
      {h.button ? <Button label={h.button.label} onPress={h.button.onPress} style={{ minHeight: 48, borderRadius: 24 }} /> : null}
      {h.test ? <Button kind="secondary" label="Send me a test reminder" hint="Arrives in a second" onPress={test} style={{ minHeight: 46, borderRadius: 23 }} /> : null}
    </Card>
  );
}

/** Test builds only (Expo Go, or EXPO_PUBLIC_DEV_TOOLS=1). Never in the App Store build. */
function DevTools() {
  const app = useApp();
  const [pending, setPending] = useState<number | null>(null);
  const { plan } = app;
  useEffect(() => {
    const t = setTimeout(() => pendingCount().then(setPending), 600);
    return () => clearTimeout(t);
  }, [plan]);
  const inOneMinute = () => {
    const d = new Date(Date.now() + 60_000);
    app.updateSettings({ reminderTime: formatTime(d.getHours(), d.getMinutes()) });
    tell('Reminder time moved', `Reminders now land at ${shortTimeLabel(formatTime(d.getHours(), d.getMinutes()))}. Any reminder due today will go off then. Set it back when you’re done.`);
  };
  return (
    <Group header="Test build only" note={`Planned: ${plan.length} · waiting on this iPhone: ${pending ?? '…'}`}>
      <Row label="Preview Pro" right={<SunSwitch label="Preview Pro" value={app.pro} onValueChange={(v) => app.setPro(v ? 'yearly' : null, { startTrial: v, preview: true })} />} />
      <Row label="Reminder time: 1 minute from now" onPress={inOneMinute} chevron={false} />
    </Group>
  );
}
