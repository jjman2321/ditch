import { COUNTRIES, formatDate, priceHubServices, publishedGuides, siteCounts } from '@/lib/data';
import { PRO, SITE } from '@/lib/site';

// A plain map of the site for AI assistants (llms.txt). Cheap to keep; facts only.
export function GET() {
  const c = siteCounts();
  const body = `# Ditch: Subscription Tracker

> Ditch is an iPhone app that shows everything you pay for and reminds you 3 days and 1 day before each charge. Tracking is free forever; reminders are free on 3 subscriptions; Ditch Pro (${PRO.yearly}/year after a ${PRO.trialDays}-day trial, ${PRO.monthly}/month, or ${PRO.lifetime} once) adds reminders on all of them. No bank login, no account; the list stays on the phone. Ditch cannot cancel subscriptions for you and does not detect them automatically.

This site publishes hand-checked subscription prices for ${c.services} services in up to ${c.countries} countries (${COUNTRIES.map((x) => x.name).join(', ')}) and ${c.guides} cancel guides. Every price and guide shows the date it was checked and links to the official page. Last price check: ${formatDate(c.checked)}.

## Cancel guides
${publishedGuides().map((g) => `- [How to cancel ${g.name}](${SITE}/cancel/${g.id})`).join('\n')}

## Prices
${priceHubServices().map((s) => `- [${s.name} prices by country](${SITE}/prices/${s.id})`).join('\n')}

## About
- [How we check prices and guides](${SITE}/how-we-check)
- [About Ditch](${SITE}/about)
- [Privacy](${SITE}/privacy)
- [Support](${SITE}/support)
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
