import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { MonthlyYearly } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Monthly vs yearly calculator: is a yearly subscription cheaper?',
  description: 'See how much less a yearly plan costs than 12 months of the monthly one, for real subscriptions in your country.',
  alternates: { canonical: '/tools/monthly-vs-yearly' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/monthly-vs-yearly"
      title='Monthly vs yearly calculator'
      lead='Pick a subscription and see what a yearly plan costs compared with 12 months of the monthly one.'
      faq={[
        { q: 'Is a yearly subscription cheaper?', a: 'Usually, yes. Most yearly plans cost less than 12 months of the monthly plan. The catch: you pay it all up front, and it’s harder to stop halfway.' },
        { q: 'When is monthly better?', a: 'When you’re not sure you’ll keep it all year, or you only need it for a few months.' },
      ]}
    >
      <MonthlyYearly countries={countryList()} />
    </ToolPage>
  );
}
