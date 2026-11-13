import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { Compare } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Subscription price comparison: compare two services side by side',
  description: 'Compare the plans and prices of two subscriptions side by side, in your country, from a hand-checked price list.',
  alternates: { canonical: '/tools/compare-prices' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/compare-prices"
      title='Subscription price comparison'
      lead='Put two subscriptions side by side, plan by plan, in your country.'
      faq={[
        { q: 'Where do these prices come from?', a: 'From each service’s own pricing pages, or Apple’s in-app price list for iPhone app prices, checked by hand with the date.' },
        { q: 'Are prices the same in every country?', a: 'No. Prices, plans and even what’s included change from country to country.' },
      ]}
    >
      <Compare countries={countryList()} />
    </ToolPage>
  );
}
