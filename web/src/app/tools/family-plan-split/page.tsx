import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { FamilySplit } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Family plan split calculator: what each person pays',
  description: 'Split a family or duo plan and see what each person pays, next to paying alone. Spotify, Apple Music, YouTube and more.',
  alternates: { canonical: '/tools/family-plan-split' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/family-plan-split"
      title='Family plan split calculator'
      lead='What each person pays on a family or duo plan.'
      how={['Pick your country and the service.', 'Pick the plan and how many people share it.', 'See each person’s share next to paying alone.']}
      good={['Most family plans need everyone at the same address. Check the service’s rules.']}
      faq={[{ q: 'How do I split a family plan fairly?', a: 'Divide the price by the number of people. The tool shows each share.' }]}
    >
      <FamilySplit countries={countryList()} />
    </ToolPage>
  );
}
