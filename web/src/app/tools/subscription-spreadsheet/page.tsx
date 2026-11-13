import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { Spreadsheet } from '@/components/tools/PlanTools';
import { countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free subscription tracker spreadsheet (Excel, Numbers, Google Sheets)',
  description: 'Download a free subscription tracker spreadsheet with your subscriptions and prices for your country filled in. Opens in Excel, Numbers and Google Sheets.',
  alternates: { canonical: '/tools/subscription-spreadsheet' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/subscription-spreadsheet"
      title='Free subscription tracker spreadsheet'
      lead='Pick what you pay for and download a spreadsheet with prices for your country filled in.'
      faq={[
        { q: 'Which apps open the file?', a: 'It’s a .csv file. Excel, Numbers and Google Sheets all open it. In Google Sheets, use File → Import.' },
        { q: 'Why not just use a spreadsheet?', a: 'A spreadsheet doesn’t remind you. Ditch tells you 3 days and 1 day before each charge.' },
      ]}
    >
      <Spreadsheet countries={countryList()} />
    </ToolPage>
  );
}
