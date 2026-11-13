import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { CostPerHour } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Cost per hour calculator: is your subscription worth it?',
  description: 'Work out what a subscription costs for each hour you use it. Pick a service and plan, add your hours a week.',
  alternates: { canonical: '/tools/cost-per-hour' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/cost-per-hour"
      title='Cost per hour calculator'
      lead='Pick a subscription and how many hours a week you use it. See what each hour costs.'
      faq={[
        { q: 'How is cost per hour worked out?', a: 'Monthly price ÷ hours you use it in a month. We count a month as 52 weeks ÷ 12.' },
        { q: 'What’s a good cost per hour?', a: 'There’s no right number. It’s a quick way to compare subscriptions with each other and with what you use.' },
      ]}
    >
      <CostPerHour countries={countryList()} />
    </ToolPage>
  );
}
