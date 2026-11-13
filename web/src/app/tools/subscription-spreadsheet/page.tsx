import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { Spreadsheet } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free subscription tracker spreadsheet (Excel, Numbers, Google Sheets)',
  description: 'Download a free subscription tracker spreadsheet with prices for your country filled in. Opens in Excel, Numbers and Google Sheets.',
  alternates: { canonical: '/tools/subscription-spreadsheet' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/subscription-spreadsheet"
      title='Subscription tracker spreadsheet'
      lead='A free spreadsheet with your subscriptions and prices filled in.'
      how={['Pick your country.', 'Tap what you pay for.', 'Download the file and open it in Excel, Numbers or Google Sheets.']}
      good={['It’s a .csv file. In Google Sheets, use File → Import.', 'A spreadsheet won’t remind you before a charge. Ditch does.']}
      faq={[{ q: 'Is the spreadsheet free?', a: 'Yes. It’s made on your device; nothing is sent anywhere.' }]}
    >
      <Spreadsheet countries={countryList()} />
    </ToolPage>
  );
}
