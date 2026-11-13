import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { MonthlyYearly } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Monthly vs yearly calculator: is a yearly plan cheaper?',
  description: 'See what a yearly subscription costs next to 12 months of the monthly plan, for real services in your country.',
  alternates: { canonical: '/tools/monthly-vs-yearly' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/monthly-vs-yearly"
      title='Monthly vs yearly calculator'
      lead='What a yearly plan costs next to 12 months of monthly.'
      how={['Pick your country.', 'Pick a subscription that sells both.', 'See which costs less over a year.']}
      good={['Yearly is usually less, but you pay it all up front.', 'Monthly is easier to stop if you change your mind.']}
      faq={[{ q: 'Is a yearly subscription cheaper?', a: 'Usually. Most yearly plans cost less than 12 months of monthly.' }, { q: 'When is monthly better?', a: 'When you’re not sure you’ll keep it all year.' }]}
    >
      <MonthlyYearly countries={countryList()} />
    </ToolPage>
  );
}
