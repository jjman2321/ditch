import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { CostPerHour } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Cost per hour calculator: what each hour of a subscription costs',
  description: 'Work out what a subscription costs for each hour you use it. Pick a service, a plan and your hours a week.',
  alternates: { canonical: '/tools/cost-per-hour' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/cost-per-hour"
      title='Cost per hour calculator'
      lead='What a subscription costs for each hour you use it.'
      how={['Pick a service and plan.', 'Type how many hours a week you use it.', 'See the cost per hour.']}
      good={['Cost per hour = monthly price ÷ hours a month. A month is 52 weeks ÷ 12.']}
      faq={[{ q: 'What’s a good cost per hour?', a: 'There’s no right number. It’s a quick way to compare what you pay with what you use.' }]}
    >
      <CostPerHour countries={countryList()} />
    </ToolPage>
  );
}
