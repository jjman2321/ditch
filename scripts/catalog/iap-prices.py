"""Turn App Store In-App Purchase lists (iap-2026-11.json) into price rows.

Usage: python3 -I scripts/catalog/iap-prices.py [--write]

Each rule below names a service's plans and the In-App Purchase names that
match them. For each storefront the matching prices are read straight from
Apple's list (an official price for plans billed through Apple). A plan is
kept only when the list gives one clear price for it:

  'one'      exactly one distinct price matches a name that says the period
             ("Standard Monthly", "100 GB Annual")
  'low'      the lower of exactly two distinct prices under one name (the
  'high'     list repeats a name for the monthly and yearly product; the
             higher must be at least 6x the lower)
  'implied'  exactly one distinct price under a name that doesn't say the
             period; used only where the plan is sold monthly (noted)

A plan can list several (regex, pick) options; the first that gives a price
wins, so one rule covers storefronts that name products differently.
A row is written only when its default plan is found. Without --write it
prints what it would add. With --write it merges the rows into
docs/research/prices-2026-11.json, never replacing a verified row that came
from somewhere else.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IAP = ROOT / 'scripts/catalog/iap-2026-11.json'
PRICES = ROOT / 'docs/research/prices-2026-11.json'
CUR = {'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'IE': 'EUR', 'NZ': 'NZD', 'DE': 'EUR', 'NL': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'IN': 'INR'}
SYMBOL = {'USD': '$', 'CAD': '$', 'AUD': '$', 'NZD': '$', 'GBP': '£', 'EUR': '€', 'INR': '₹'}
NOTE = "Apple billing: read from the App Store's In-App Purchases list for this country (what you pay when you subscribe in the iPhone app; the service's own website can charge a different price)."
IMPLIED = ' Some names in this list don\u2019t say the period; those plans are monthly.'
UNNAMED = ' Where one name has two prices and the list doesn’t say which is which, the lower one is taken as monthly and the one at least 6x higher as yearly.'
M, Y = 'monthly', 'yearly'


def P(pid, name, cycle, *alts):
    opts = [(a, 'one') if isinstance(a, str) else a for a in alts]
    return {'id': pid, 'name': name, 'cycle': cycle, 'alts': [(re.compile(rx, re.I), pick) for rx, pick in opts]}


# service id -> (plans, default plan id). Regexes match the whole IAP name.
RULES = {}


def rule(sid, default, *plans):
    RULES[sid] = (list(plans), default)


def parse_price(text, currency):
    """'£11.99' / '10,99 €' / '₹ 1,999' -> minor units, or None if the symbol is wrong."""
    t = text.replace(' ', ' ').strip()
    if SYMBOL[currency] not in t or (currency != 'USD' and 'US$' in t):
        return None
    num = re.sub(r'[^\d.,]', '', t)
    if not num:
        return None
    m = re.match(r'^(.*?)[.,](\d{2})$', num)
    whole, cents = (m.group(1), m.group(2)) if m else (num, '00')
    whole = re.sub(r'[.,]', '', whole)
    return int(whole or '0') * 100 + int(cents)


def plan_price(plan, items, currency):
    """(amount, how) for the first option that gives one clear price, else (None, None)."""
    for rx, pick in plan['alts']:
        prices = sorted({p for n, t in items if rx.fullmatch(n.strip()) for p in [parse_price(t, currency)] if p})
        if pick in ('one', 'implied'):
            if len(prices) == 1:
                return prices[0], pick
        elif len(prices) == 2 and prices[1] >= 6 * prices[0]:
            return (prices[0] if pick == 'low' else prices[1]), pick
    return None, None


def build():
    iap = json.loads(IAP.read_text())
    rows = []
    for sid, (plans, default) in RULES.items():
        for cc, page in sorted(iap.get(sid, {}).items()):
            if not page['items']:
                continue
            cur = CUR[cc]
            found, hows = [], set()
            for plan in plans:
                amount, how = plan_price(plan, page['items'], cur)
                if amount:
                    found.append({'id': plan['id'], 'name': plan['name'], 'amountMinor': amount, 'cycle': plan['cycle'], **({'default': True} if plan['id'] == default else {})})
                    hows.add(how)
            if not any(p.get('default') for p in found):
                continue
            rows.append(
                {
                    'serviceId': sid,
                    'country': cc,
                    'currency': cur,
                    'status': 'verified',
                    'plans': found,
                    'source': page['url'],
                    'checked': page['checked'],
                    'note': NOTE + (UNNAMED if hows & {'low', 'high'} else '') + (IMPLIED if 'implied' in hows else ''),
                }
            )
    return rows


def main():
    rows = build()
    if '--write' not in sys.argv:
        for r in rows:
            print(r['serviceId'], r['country'], ', '.join(f"{p['name']} {p['amountMinor']}/{p['cycle'][0]}{'*' if p.get('default') else ''}" for p in r['plans']))
        print(len(rows), 'rows (dry run; pass --write to merge)')
        return
    text = PRICES.read_text()
    data = json.loads(text)
    idx = {(r['serviceId'], r['country']): i for i, r in enumerate(data['prices'])}
    n = 0
    for r in rows:
        k = (r['serviceId'], r['country'])
        if k in idx:
            old = data['prices'][idx[k]]
            if old['status'] == 'verified' and not old.get('note', '').startswith('Apple billing'):
                continue  # a check on the service's own page wins
            data['prices'][idx[k]] = r
        else:
            idx[k] = len(data['prices'])
            data['prices'].append(r)
        n += 1
    PRICES.write_text(json.dumps(data, indent=1, ensure_ascii=False))
    print(f'merged {n} rows into {PRICES.relative_to(ROOT)}')


# ---- rules (checked by hand against the lists in iap-2026-11.json) ----
# ChatGPT: 'ChatGPT Plus' also appears at the Pro price, so Plus is the lower one.
rule('chatgpt-plus', 'plus', P('go', 'Go', M, (r'ChatGPT Go', 'implied')), P('plus', 'Plus', M, (r'ChatGPT Plus', 'low')), P('pro', 'Pro', M, (r'ChatGPT Pro 200', 'implied')))
rule(
    'google-one',
    '100gb',
    P('100gb', '100 GB', M, r'100 GB Month', (r'100 GB', 'low')),
    P('100gb-yearly', '100 GB (yearly)', Y, r'100 GB Annual', (r'100 GB', 'high')),
    P('200gb', '200 GB', M, r'200 GB Month', (r'200 GB', 'low')),
    P('200gb-yearly', '200 GB (yearly)', Y, r'200 GB Annual', (r'200 GB', 'high')),
    P('ai-plus', 'AI Plus (2 TB)', M, (r'Google AI Plus \(2 TB\)', 'implied')),
)
rule(
    'max',
    'standard',
    P('basic-ads', 'Basic with Ads', M, r'Basic With Ads Monthly', (r'Basic with Ads', 'low'), (r'Basic with Ads', 'implied')),
    P('standard', 'Standard', M, r'Standard Monthly', (r'Standard', 'low'), (r'Standard', 'implied')),
    P('premium', 'Premium', M, r'Premium Monthly', (r'Premium', 'low'), (r'Premium', 'implied')),
    P('basic-ads-yearly', 'Basic with Ads (yearly)', Y, r'Basic With Ads Yearly', (r'Basic with Ads', 'high')),
    P('standard-yearly', 'Standard (yearly)', Y, r'Standard Yearly', (r'Standard', 'high')),
    P('premium-yearly', 'Premium (yearly)', Y, r'Premium Yearly', (r'Premium', 'high')),
)
rule(
    'google-ai-pro',
    'pro',
    P('pro', 'Google AI Pro', M, (r'Google AI Pro \(.*\)', 'low'), (r'Google AI Pro \(.*\)', 'implied')),
    P('plus', 'Google AI Plus', M, (r'Google AI Plus \((200 ?GB|400 GB)\)', 'low'), (r'Google AI Plus \((200 ?GB|400 GB)\)', 'implied')),
    P('plus-yearly', 'Google AI Plus (yearly)', Y, (r'Google AI Plus \((200 ?GB|400 GB)\)', 'high')),
)
rule('crunchyroll', 'fan', P('fan', 'Fan', M, (r'Fan', 'implied')), P('mega-fan', 'Mega Fan', M, (r'Mega Fan', 'implied')))
rule('amazon-music', 'individual', P('individual', 'Unlimited Individual', M, (r'Individual', 'implied')), P('family', 'Unlimited Family', M, (r'Family', 'implied')))
rule('claude-pro', 'monthly', P('monthly', 'Pro (monthly)', M, r'Claude Pro - Monthly'), P('yearly', 'Pro (yearly)', Y, r'Claude Pro - Annual'), P('max', 'Max', M, r'Claude Max - Monthly'))
rule('perplexity', 'pro', P('pro', 'Pro', M, (r'Perplexity Pro', 'low')), P('pro-yearly', 'Pro (yearly)', Y, (r'Perplexity Pro', 'high')), P('max', 'Max', M, (r'Perplexity Max', 'implied')))
rule('grok', 'supergrok', P('lite', 'SuperGrok Lite', M, (r'SuperGrok Lite', 'implied')), P('supergrok', 'SuperGrok', M, (r'SuperGrok', 'low')), P('supergrok-yearly', 'SuperGrok (yearly)', Y, (r'SuperGrok', 'high')), P('heavy', 'SuperGrok Heavy', M, (r'SuperGrok Heavy', 'implied')))
# Copilot Pro became Microsoft 365 Premium; the Microsoft Copilot (Microsoft 365) app sells it.
rule('copilot-pro', 'premium', P('premium', 'Microsoft 365 Premium', M, r'Microsoft 365 Premium Monthly'), P('premium-yearly', 'Microsoft 365 Premium (yearly)', Y, r'Microsoft 365 Premium Annual'))
rule('notion', 'plus', P('plus', 'Plus (monthly)', M, r'Notion – Plus Monthly'), P('plus-yearly', 'Plus (yearly)', Y, r'Notion – Plus Yearly'), P('business', 'Business (monthly)', M, (r'Notion Business', 'low')), P('business-yearly', 'Business (yearly)', Y, (r'Notion Business', 'high')))
rule('dropbox', 'plus', P('plus', 'Plus (monthly)', M, r'Dropbox Plus - Monthly'), P('plus-yearly', 'Plus (yearly)', Y, r'Dropbox Plus - Annual'), P('simple', 'Simple (monthly)', M, r'Dropbox Simple [-–] Monthly'), P('professional', 'Professional (monthly)', M, r'Dropbox Professional - Monthly'))
rule('strava', 'yearly', P('monthly', 'Monthly', M, (r'Strava Subscription', 'low')), P('yearly', 'Yearly', Y, (r'Strava Subscription', 'high')))
rule('headspace', 'monthly', P('monthly', 'Monthly', M, r'Monthly Subscription'), P('yearly', 'Yearly', Y, r'Annual Subscription'))
rule('myfitnesspal', 'yearly', P('monthly', 'Premium (monthly)', M, r'MyFitnessPal Monthly Premium'), P('yearly', 'Premium (yearly)', Y, r'MyFitnessPal Yearly Premium'))
rule('linkedin-premium', 'career', P('career', 'Premium Career', M, (r'Premium Career', 'implied')), P('business', 'Premium Business', M, (r'Premium Business', 'implied')))
rule('snapchat-plus', 'monthly', P('monthly', 'Snapchat+ (monthly)', M, r'Snapchat\+ \(?Monthly Plan\)?'), P('yearly', 'Snapchat+ (yearly)', Y, r'Snapchat\+ \(?Annual Plan\)?'))
rule('discord-nitro', 'nitro', P('nitro', 'Nitro', M, r'Nitro Monthly'), P('basic', 'Nitro Basic', M, r'Nitro Basic Monthly'), P('nitro-yearly', 'Nitro (yearly)', Y, r'Nitro Yearly'))
rule('1password', 'individual-yearly', P('individual', 'Individual (monthly)', M, r'1Password Individual Monthly'), P('individual-yearly', 'Individual (yearly)', Y, r'1Password Individual Annual'), P('family', 'Families (monthly)', M, r'1Password Family Monthly'), P('family-yearly', 'Families (yearly)', Y, r'1Password Family Annual'))
rule('deezer', 'premium', P('premium', 'Premium', M, (r'Deezer Premium', 'implied')), P('family', 'Family', M, (r'Deezer Family', 'implied')))
rule('tidal', 'individual', P('individual', 'Individual', M, (r'TIDAL Individual', 'implied')), P('family', 'Family', M, (r'TIDAL Family', 'implied')))
rule('nyt', 'all-access', P('all-access', 'All Access (monthly)', M, r'All Access - Monthly'), P('all-access-yearly', 'All Access (yearly)', Y, r'All Access - Annual'), P('news', 'News (monthly)', M, r'News - Monthly'), P('games', 'Games (monthly)', M, r'Games - Monthly'))
rule('roblox', 'premium-450', P('premium-450', 'Premium 450', M, r'Roblox Premium 450 One Month'), P('premium-1000', 'Premium 1000', M, r'Roblox Premium 1000 One Month'), P('premium-2200', 'Premium 2200', M, r'Roblox Premium 2200 One Month'))

if __name__ == '__main__':
    main()
