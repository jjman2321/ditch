// Find your subscriptions (DECISIONS #63, design/find-subs): show us a list
// you already have and we read it on the phone. Free once, then Pro (#34).

import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { BankHero } from '@/bank/Entry';
import { showBankSync } from '@/config/features';
import { FindPage, RouteCard } from '@/find/Parts';
import { PLACES, placeUrl } from '@/home/Forgotten';
import { openUrl } from '@/ditch/CancelHelp';
import { useApp } from '@/state/app';
import { External, PhoneList, StatementIcon, Txt, usePalette } from '@/ui/sunflower';

export function useFindGate() {
  const app = useApp();
  const free = !app.pro && !app.settings.freeFindUsed;
  const go = (path: '/find/apple' | '/find/statement') => (app.pro || free ? router.push(path) : router.push('/paywall?from=import'));
  return { free, go, pro: app.pro };
}

export default function FindHub() {
  const p = usePalette();
  const { free, go, pro } = useFindGate();
  // Same tag as onboarding's "Where should we look?"; once the free one is used it says PRO.
  const tag = pro ? undefined : free ? 'FIRST ONE FREE' : 'PRO';
  const app = useApp();
  // Bank sync first (DECISIONS #70): test builds, US/Canada only.
  const bank = showBankSync(app.settings.country, app.settings.currency);
  return (
    <FindPage
      title="Find your subscriptions"
      back="Home"
      intro={bank ? 'Connect your bank, or show us a list you already have. You pick what stays.' : 'Show us a list you already have. You pick what goes in.'}
    >
      {bank ? <BankHero title="Your bank or card" line="Finds them, spots new ones." tag={pro ? undefined : 'PRO · 7 DAYS FREE'} onPress={() => router.push('/bank?from=find')} /> : null}
      <RouteCard icon={PhoneList} title="Apple subscriptions" line="Every App Store subscription and free trial, with dates. Banks can’t name these." tag={tag} onPress={() => go('/find/apple')} />
      <RouteCard icon={StatementIcon} title="A bank statement" line="A PDF or CSV from your bank. We find the charges that repeat." tag={tag} onPress={() => go('/find/statement')} />

      <Txt v="eyebrow" tone="mute" style={{ marginTop: 24, marginHorizontal: 4, marginBottom: 8 }}>
        Or check the usual places
      </Txt>
      <View style={{ backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 16, borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
        {PLACES.filter((x) => x.id !== 'apple').map((pl, i) => (
          <Pressable
            key={pl.id}
            accessibilityRole={pl.url ? 'link' : 'text'}
            accessibilityLabel={`${pl.title}. ${pl.where}`}
            disabled={!pl.url}
            onPress={() => pl.url && openUrl(placeUrl(pl, app.settings.country) ?? pl.url)}
            style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}
          >
            <View style={{ flex: 1 }}>
              <Txt v="bodyStrong" color={p.cardFg}>
                {pl.title}
              </Txt>
              <Txt v="sub" tone="mute">
                {pl.where}
              </Txt>
            </View>
            {pl.url ? <External color={p.mute} size={18} /> : null}
          </Pressable>
        ))}
      </View>
    </FindPage>
  );
}
