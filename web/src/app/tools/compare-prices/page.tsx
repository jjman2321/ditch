import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { Compare } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Subscription price comparison: two services side by side',
  description: 'Compare two subscriptions plan by plan, in your country, from prices checked by hand.',
  alternates: { canonical: '/tools/compare-prices' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/compare-prices"
      title='Subscription price comparison'
      lead='Two services side by side, plan by plan.'
      how={['Pick your country.', 'Pick two services.', 'Compare every plan and the yearly cost.']}
      good={['Prices come from each service’s own pages, or Apple’s in-app price list for iPhone app prices.']}
      faq={[{ q: 'Are prices the same in every country?', a: 'No. Prices and plans change from country to country.' }]}
    >
      <Compare countries={countryList()} />
    </ToolPage>
  );
}
