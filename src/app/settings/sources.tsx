// Settings → About → Sources (DECISIONS #19). The studies behind the facts
// in onboarding, so the facts can stay short there with no inline
// citations. Only real, findable studies (docs/research/onboarding-v11.md).

import { Pressable, View } from 'react-native';

import { openUrl } from '@/ditch/CancelHelp';
import { SettingsPage } from '@/settings/Parts';
import { Card, External, F, Txt, usePalette } from '@/ui/sunflower';

type Source = { who: string; found: string; sample: string; where?: string; url: string; host: string };

const SOURCES: Source[] = [
  {
    who: 'C+R Research, 2022',
    found: 'People guessed they spent $86 a month on subscriptions. Added up line by line, it was $219: about 2.5× the guess.',
    sample: '1,000 US adults, April–May 2022',
    where: 'Your total: “the real total was 2.5× what people thought”',
    url: 'https://www.crresearch.com/blog/subscription-service-statistics-and-costs/',
    host: 'crresearch.com',
  },
  {
    who: 'Self Financial, 2026',
    found: '70% have forgotten to cancel a free trial at least once.',
    sample: '1,272 US adults, March 2026',
    where: 'Reminders: “7 in 10 people have paid for a forgotten free trial”',
    url: 'https://www.self.inc/info/cost-of-unused-paid-subscriptions/',
    host: 'self.inc',
  },
  {
    who: 'CNET and YouGov, 2025',
    found: 'About $90 a month goes on subscriptions, and about $205 a year on ones people don’t use.',
    sample: '2,440 US adults, April 2025 (reported by The Desk)',
    url: 'https://thedesk.net/2025/05/cnet-subscription-survey-2025/',
    host: 'thedesk.net',
  },
  {
    who: 'Chase and OnePoll, 2021',
    found: '60% forgot at least one recurring payment in the past year. 55% don’t know how much goes out each month.',
    sample: '2,000+ US adults',
    url: 'https://media.chase.com/news/survey-from-chase-reveals',
    host: 'media.chase.com',
  },
  {
    who: 'West Monroe, 2021',
    found: 'People spend $273 a month on subscriptions, and 66% guessed wrong by more than $200.',
    sample: '2,500 US adults, June 2021',
    url: 'https://www.westmonroe.com/press-releases/americans-are-spending-more-on-subscriptions-and-are-less-aware-of-spending',
    host: 'westmonroe.com',
  },
  {
    who: 'Exchange rates: Exchange Rate API',
    found: 'The rough “≈ in all” total, shown only when your list has more than one currency. Your real prices and reminders are never converted.',
    sample: 'Free daily rates, saved on your phone',
    url: 'https://www.exchangerate-api.com',
    host: 'exchangerate-api.com',
  },
];

export default function Sources() {
  const p = usePalette();
  return (
    <SettingsPage title="Sources" back="About Ditch" intro="The studies behind the numbers we show. All of them asked US adults, so outside the US we say “in one study”.">
      <View style={{ marginTop: 22, gap: 12 }}>
        {SOURCES.map((s) => (
          <Card key={s.who} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
            <Txt v="bodyStrong" color={p.cardFg} accessibilityRole="header">
              {s.who}
            </Txt>
            <Txt v="body" color={p.cardFg} style={{ marginTop: 4 }}>
              {s.found}
            </Txt>
            <Txt v="sub" tone="mute" style={{ marginTop: 4 }}>
              {s.sample}
            </Txt>
            {s.where ? (
              <Txt v="sub" tone="mute" style={{ marginTop: 4 }}>
                {`Used on ${s.where}`}
              </Txt>
            ) : null}
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open the study on ${s.host}`}
              onPress={() => openUrl(s.url)}
              style={({ pressed }) => ({ marginTop: 4, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 })}
            >
              <Txt v="sub" style={{ fontFamily: F.semi, color: p.cardFg, textDecorationLine: 'underline' }}>
                {s.host}
              </Txt>
              <External color={p.cardFg} size={14} />
            </Pressable>
          </Card>
        ))}
      </View>
    </SettingsPage>
  );
}
