import type { Metadata } from 'next';

import { Calculator } from '@/components/Calculator';
import { ToolPage } from '@/components/ToolPage';
import { calcData } from '@/lib/calc';
import { defaultPlan, priceFor } from '@/lib/data';
import { formatMoney, yearlyMinor } from '@/lib/money';

export const metadata: Metadata = {
  title: 'Subscription cost calculator: what you spend a month and a year',
  description: 'Tap the subscriptions you pay for and see the total a month and a year, with real prices for your country. Free, runs in your browser.',
  alternates: { canonical: '/tools/subscription-cost-calculator' },
};

export default function Page() {
  const { services, countries } = calcData();
  const ex = ['netflix', 'spotify', 'chatgpt-plus'].map((id) => defaultPlan(priceFor(id, 'US')!));
  const total = ex.reduce((t, p) => t + yearlyMinor(p.amountMinor, p.cycle), 0);
  return (
    <ToolPage
      raw
      slug="tools/subscription-cost-calculator"
      title="Subscription cost calculator"
      lead="Tap what you pay for. See what it all costs a month and a year."
      how={['Pick your country.', 'Tap each subscription you pay for.', 'Read your yearly total. Different currencies are never added together.']}
      good={[<>Netflix Standard, Spotify Premium and ChatGPT Plus come to <b>{formatMoney(total, 'USD')} a year</b> in the US, before tax.</>, 'Prices are each service’s usual plan, checked by hand with the date shown.']}
      faq={[
        { q: 'How do I work out what I spend on subscriptions?', a: 'Monthly price × 12, weekly × 52, every 3 months × 4, yearly as charged. Add them up per currency.' },
        { q: 'Are these prices right for my country?', a: 'They’re the usual plan in each country, from each service’s own pages. Your plan may differ.' },
      ]}
    >
      <Calculator services={services} countries={countries} />
    </ToolPage>
  );
}
