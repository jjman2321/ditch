// "Find the ones you forgot": the places subscriptions hide. Ditch doesn't
// scan anything (CLAUDE.md rule 5), so this is the honest version of
// "find my subscriptions": a short checklist, then add what you found.
// From review research (docs/research/reviews-niche-2026-11.md): "If I knew
// all the subscriptions I had, I wouldn't need the app."

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { showImport } from '@/config/features';
import { openUrl } from '@/ditch/CancelHelp';
import { useApp } from '@/state/app';
import { Button, External, Tick, Txt, haptic, usePalette } from '@/ui/sunflower';

type Place = { id: string; title: string; where: string; url?: string };

// Amazon's Memberships & Subscriptions page lives on each country's own store.
const AMAZON_HOST: Record<string, string> = { GB: 'amazon.co.uk', CA: 'amazon.ca', AU: 'amazon.com.au', DE: 'amazon.de', FR: 'amazon.fr', IT: 'amazon.it', ES: 'amazon.es', IN: 'amazon.in', JP: 'amazon.co.jp', MX: 'amazon.com.mx', BR: 'amazon.com.br', NL: 'amazon.nl', SE: 'amazon.se', PL: 'amazon.pl' };

/** The link for a place, on the right Amazon store for the user's country. */
export function placeUrl(pl: Place, country?: string | null): string | undefined {
  if (pl.id === 'amazon' && pl.url && country && AMAZON_HOST[country]) return pl.url.replace('amazon.com', AMAZON_HOST[country]);
  return pl.url;
}

export const PLACES: Place[] = [
  { id: 'apple', title: 'Apple subscriptions', where: 'Everything billed to your Apple Account', url: APPLE_SUBSCRIPTIONS_URL },
  { id: 'google', title: 'Google Play', where: 'Opens your subscriptions', url: 'https://play.google.com/store/account/subscriptions' },
  { id: 'paypal', title: 'PayPal', where: 'Opens your automatic payments', url: 'https://www.paypal.com/myaccount/autopay/' },
  { id: 'amazon', title: 'Amazon', where: 'Opens Memberships & Subscriptions', url: 'https://www.amazon.com/yourmembershipsandsubscriptions' },
  { id: 'bank', title: 'Your bank or card app', where: 'The same amount, the same day, each month' },
  { id: 'email', title: 'Your email', where: 'Search “renews”, “receipt” or “free trial”' },
];

function PlaceRow({ place, done, first, onPress }: { place: Place; done: boolean; first: boolean; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${place.title}. ${place.where}`}
      accessibilityHint={place.url ? 'Opens it and ticks it off' : 'Ticks it off'}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}
    >
      {first ? null : <View style={{ position: 'absolute', top: 0, left: 44, right: 0, height: 1, backgroundColor: p.hair }} />}
      <Tick on={done} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="bodyStrong" color={p.cardFg} style={done ? { opacity: 0.55 } : null}>
          {place.title}
        </Txt>
        <Txt v="sub" tone="mute">
          {place.where}
        </Txt>
      </View>
      {place.url ? <External color={p.mute} size={18} /> : null}
    </Pressable>
  );
}

export function ForgottenBody({ onAdd, onDone }: { onAdd: () => void; onDone: () => void }) {
  const p = usePalette();
  const country = useApp().settings.country;
  const [done, setDone] = useState<string[]>([]);
  const tap = (pl: Place) => {
    haptic.select();
    const url = placeUrl(pl, country);
    if (url) openUrl(url);
    setDone((d) => (d.includes(pl.id) ? (pl.url ? d : d.filter((x) => x !== pl.id)) : [...d, pl.id]));
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Txt v="title" accessibilityRole="header" style={{ fontSize: 26, lineHeight: 32, marginRight: 44 }}>
          Find the ones you forgot
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 6 }}>
          Subscriptions hide in a few places. Check each one, then add what you find.
        </Txt>
        {showImport() ? (
          <Button kind="secondary" label="Or let Ditch read a list for you" hint="From your Apple list or a bank statement" onPress={() => (onDone(), router.push('/find'))} style={{ marginTop: 14 }} />
        ) : null}
        <View style={{ marginTop: 16, backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 16 }}>
          {PLACES.map((pl, i) => (
            <PlaceRow key={pl.id} place={pl} first={i === 0} done={done.includes(pl.id)} onPress={() => tap(pl)} />
          ))}
        </View>
        <Txt v="sub" tone="mute" center style={{ marginTop: 10 }} num>
          {`${done.length} of ${PLACES.length} checked`}
        </Txt>
      </ScrollView>
      <View style={{ paddingTop: 10 }}>
        <Button label="Add what I found" onPress={onAdd} />
        <Button kind="text" label="Done" onPress={onDone} />
      </View>
    </View>
  );
}
