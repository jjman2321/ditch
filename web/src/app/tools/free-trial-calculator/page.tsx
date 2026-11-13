import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { TrialCalc } from '@/components/tools/TrialCalc';

export const metadata: Metadata = {
  title: 'Free trial calculator: when it charges and when to cancel',
  description: 'Find the day your free trial turns into a charge and the day to cancel by, with Apple’s 24-hour rule. Add two reminders to your calendar.',
  alternates: { canonical: '/tools/free-trial-calculator' },
};

export default function Page() {
  return (
    <ToolPage
      checked={[]}
      slug="tools/free-trial-calculator"
      title="Free trial calculator"
      lead="The day your trial turns into a charge, and the day to cancel by."
      cta="Never miss a trial end"
      how={['Pick the day the trial started.', 'Pick how long it lasts.', 'Add 2 reminders to your calendar: 3 days and 1 day before.']}
      good={['Started in an iPhone app? Apple says to cancel at least 24 hours before the trial ends.', 'A 1-month trial from Jan 31 ends Feb 28, because February is shorter.']}
      sources={['https://support.apple.com/en-us/118428']}
      faq={[
        { q: 'Can I cancel a free trial before it charges me?', a: 'Yes. Cancel before the trial ends and you won’t be charged. For iPhone app trials, Apple says to cancel at least 24 hours before it ends.' },
        { q: 'How do I cancel a free trial on iPhone?', a: 'Open Settings, tap your name, then Subscriptions. Tap the trial, then Cancel Subscription.' },
        { q: 'How do I know it’s cancelled?', a: 'On iPhone, a cancelled subscription shows an expiry message in red and no Cancel button.' },
      ]}
    >
      <TrialCalc />
    </ToolPage>
  );
}
