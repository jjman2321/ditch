import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { TrialCalc } from '@/components/tools/TrialCalc';

export const metadata: Metadata = {
  title: 'Free trial end date calculator: when to cancel before it charges',
  description: 'Work out the day your free trial turns into a charge and the day to cancel by, then add two reminders to your calendar. Includes Apple’s 24-hour rule.',
  alternates: { canonical: '/tools/free-trial-calculator' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/free-trial-calculator"
      title="Free trial end date calculator"
      lead="Find the day your trial turns into a charge, and the day to cancel by. Then add 2 reminders to your calendar."
      cta="Get a reminder before every trial ends"
      faq={[
        { q: 'Can I cancel a free trial before it charges me?', a: 'Yes. Cancel before the trial ends and you won’t be charged. For trials you started in an iPhone app, Apple says to cancel at least 24 hours before the trial ends.' },
        { q: 'How do I cancel a free trial on iPhone?', a: 'Open Settings, tap your name, then Subscriptions. Tap the subscription, then Cancel Subscription.' },
        { q: 'How do I know it’s cancelled?', a: 'On iPhone, a cancelled subscription shows an expiration message in red and no Cancel button. Other services usually send a confirmation email.' },
        { q: 'What if my trial is “1 month”?', a: 'A month-long trial ends on the same date next month. If that date doesn’t exist (say, the 31st), it ends on the last day of that month.' },
      ]}
      more={
        <>
          <h2>How it works</h2>
          <p className="lead-s">Your trial ends the given number of days after it starts. The first charge is usually on that day. We tell you to cancel a day before, so you’re not caught by time zones or a 24-hour cut-off.</p>
          <h2>Worked example</h2>
          <p className="lead-s">A 7-day trial started on Monday, November 2 ends on Monday, November 9. If you started it in an iPhone app, cancel by Sunday, November 8.</p>
        </>
      }
    >
      <TrialCalc />
    </ToolPage>
  );
}
