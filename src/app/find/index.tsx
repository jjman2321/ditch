// Find your subscriptions (DECISIONS #63, design/find-subs): show us a list
// you already have and we read it on the phone. Free once, then Pro (#34).

import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { showBankSync } from '@/config/features';
import { FindPage, RouteCard } from '@/find/Parts';
import { PLACES, placeUrl } from '@/home/Forgotten';
import { openUrl } from '@/ditch/CancelHelp';
import { useApp } from '@/state/app';
import { Bank, External, PhoneList, StatementIcon, Txt, usePalette } from '@/ui/sunflower';

// Real logos for the usual places (CLAUDE.md: real service logos are the illustration). Google Play's mark
// from Google's brand files on white; PayPal and Amazon are their iPhone app icons.
const PLACE_LOGO: Record<string, number> = {
  google: require('../../../assets/places/google-play.png'),
  paypal: require('../../../assets/places/paypal.png'),
  amazon: require('../../../assets/places/amazon.png'),
};

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
      {/* The same cards as onboarding's "Where should we look?" (owner, Nov 21): one card style, one-line
          lines, most complete first. */}
      {bank ? <RouteCard icon={Bank} title="My bank or card" line="Finds them, spots new ones." tag={pro ? undefined : 'PRO · 7 DAYS FREE'} onPress={() => router.push('/bank?from=find')} /> : null}
      <RouteCard icon={PhoneList} title="Apple subscriptions" line="A screenshot of your list." tag={tag} onPress={() => go('/find/apple')} />
      <RouteCard icon={StatementIcon} title="A bank statement" line="PDF or CSV from any bank." tag={tag} onPress={() => go('/find/statement')} />

      {/* Settings-style link list (Mobbin: Luma, Craft, Mesh): small real logo, name, one quiet line, ↗.
          Only rows that open something (owner, Nov 21). Apple has its own card above. */}
      <Txt v="eyebrow" tone="mute" accessibilityRole="header" style={{ marginTop: 28, marginHorizontal: 4, marginBottom: 8 }}>
        Or check the usual places
      </Txt>
      <View style={{ backgroundColor: p.card, borderRadius: 20, borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder, overflow: 'hidden' }}>
        {PLACES.filter((x) => x.id !== 'apple' && x.url).map((pl, i) => (
          <Pressable
            key={pl.id}
            accessibilityRole="link"
            accessibilityLabel={`${pl.title}. ${pl.where}. Opens outside Ditch.`}
            onPress={() => pl.url && openUrl(placeUrl(pl, app.settings.country) ?? pl.url)}
            style={({ pressed }) => ({ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 16, opacity: pressed ? 0.6 : 1 })}
          >
            <Image
              source={PLACE_LOGO[pl.id]}
              style={{ width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: p.hair }}
              contentFit="cover"
              accessibilityIgnoresInvertColors
            />
            <View style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair, marginRight: -16, paddingRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 16 }}>
                    {pl.title}
                  </Txt>
                  <Txt v="sub" tone="mute" style={{ fontSize: 13.5, marginTop: 1 }}>
                    {pl.where}
                  </Txt>
                </View>
                <External color={p.mute} size={16} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </FindPage>
  );
}
