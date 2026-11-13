import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { FamilySplit } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Family plan split calculator: what each person pays',
  description: 'Split a Spotify, Apple Music, YouTube or other family or duo plan and see what each person pays, compared with paying alone.',
  alternates: { canonical: '/tools/family-plan-split' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/family-plan-split"
      title='Family plan split calculator'
      lead='Pick a family or duo plan and how many people share it. See what each person pays.'
      faq={[
        { q: 'How do I split a family plan fairly?', a: 'Divide the plan price by the number of people. The calculator also shows what each person would pay on their own plan.' },
        { q: 'Can anyone join my family plan?', a: 'Each service has its own rules. Many family plans need everyone to live at the same address.' },
      ]}
    >
      <FamilySplit countries={countryList()} />
    </ToolPage>
  );
}
