import { COUNTRIES, formatDate, priceHubServices, publishedGuides, siteCounts, slugOf } from '@/lib/data';
import { APP_STORE_ID, PRO, SITE } from '@/lib/site';
import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';

// A plain map of the site for AI assistants (llms.txt). Cheap to keep; facts only.
export function GET() {
  const c = siteCounts();
  const body = `# Ditch: Subscription Tracker

> Ditch is an iPhone app that shows everything you pay for and reminds you 3 days and 1 day before each charge. Tracking is free forever; reminders are free on 3 subscriptions; Ditch Pro (${PRO.yearly}/year after a ${PRO.trialDays}-day trial, ${PRO.monthly}/month, or ${PRO.lifetime} once) adds reminders on all of them. No bank login, no account; the list stays on the phone. Ditch cannot cancel subscriptions for you and does not detect them automatically.\n\n${APP_STORE_ID ? `Download: https://apps.apple.com/app/id${APP_STORE_ID}` : `Ditch is not on the App Store yet. Join the waitlist: ${SITE}/#join`}

This site publishes hand-checked subscription prices for ${c.services} services in up to ${c.countries} countries (${COUNTRIES.map((x) => x.name).join(', ')}) and ${c.guides} cancel guides. Every price and guide shows the date it was checked and links to the official page. Last price check: ${formatDate(c.checked)}.

## Key pages\n- [Home](${SITE}/)\n- [All cancel guides](${SITE}/cancel)\n- [All prices](${SITE}/prices)\n- [How we check](${SITE}/how-we-check)\n\n## Free tools (run in the browser; nothing is sent)
${[...TOOLS.map((t) => `- [${t.name}](${SITE}/${t.slug}): ${t.desc}`), ...SERVICE_TOOLS.map((t) => `- [${t.name}](${SITE}/tools/${t.slug}): ${t.desc}`)].join('\n')}

## Cancel guides
${publishedGuides().map((g) => `- [How to cancel ${g.name}](${SITE}/cancel/${slugOf(g.id)})`).join('\n')}

## Prices
${priceHubServices().map((s) => `- [${s.name} prices by country](${SITE}/prices/${slugOf(s.id)})`).join('\n')}

## About
- [How we check prices and guides](${SITE}/how-we-check)
- [About Ditch](${SITE}/about)
- [Privacy](${SITE}/privacy)
- [Support](${SITE}/support)
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
