import type { Metadata } from 'next';

import { Calculator } from '@/components/Calculator';
import { ToolPage } from '@/components/ToolPage';
import { calcData } from '@/lib/calc';
import { defaultPlan, priceFor } from '@/lib/data';
import { formatMoney, yearlyMinor } from '@/lib/money';
import { STATS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Subscription cost calculator: how much do you spend a year?',
  description: 'Tap the subscriptions you pay for and see what they cost a month and a year, with real prices for your country. Free, nothing is sent anywhere.',
  alternates: { canonical: '/tools/subscription-cost-calculator' },
};

export default function Page() {
  const { services, countries } = calcData();
  const ex = ['netflix', 'spotify', 'chatgpt-plus'].map((id) => defaultPlan(priceFor(id, 'US')!));
  const total = ex.reduce((t, p) => t + yearlyMinor(p.amountMinor, p.cycle), 0);
  return (
    <ToolPage
      slug="tools/subscription-cost-calculator"
      title="Subscription cost calculator"
      lead="Tap what you pay for and see what it all costs in a year. Prices fill in for your country."
      faq={[
        { q: 'How much do people spend on subscriptions?', a: `In a 2025 CNET survey, Americans said they spend ${STATS.wasted.text} on ${STATS.wasted.on}. The only way to know your own number is to add up what you pay.` },
        { q: 'How do I work out the yearly cost?', a: 'Monthly price × 12. Weekly × 52. Every 3 months × 4. Yearly plans as charged. Add them up per currency.' },
        { q: 'Are these prices right for my country?', a: 'They’re the usual plan in each country, checked by hand on each service’s own pages, with the date shown. Your plan may differ.' },
      ]}
      more={
        <>
          <h2>Worked example</h2>
          <p className="lead-s">
            Netflix Standard ({formatMoney(ex[0].amountMinor, 'USD')}), Spotify Premium ({formatMoney(ex[1].amountMinor, 'USD')}) and ChatGPT Plus ({formatMoney(ex[2].amountMinor, 'USD')}) in the US come to <b>{formatMoney(total, 'USD')} a year</b> before tax.
          </p>
        </>
      }
    >
      <Calculator services={services} countries={countries} />
    </ToolPage>
  );
}
