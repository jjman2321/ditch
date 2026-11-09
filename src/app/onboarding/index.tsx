// 01 · Welcome. Shows the product in one picture: a real-looking heads-up
// for a charge 5 days from today, and the timeline that leads to it.

import { router } from 'expo-router';
import { useColorScheme, View } from 'react-native';

import { SERVICE_BY_ID } from '@/catalog/services';
import { headsUpDates } from '@/domain/charges';
import { addDays, toDateOnly, weekdayDate, weekdayName, weekdayShort } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { stillUsingIt } from '@/domain/copy';
import { Button, Duck, HeadsUpTimeline, NotificationPreview, Screen, Txt, Wordmark, brand, paletteFor } from '@/ui/sunflower';

export default function Welcome() {
  const dark = useColorScheme() === 'dark';
  const p = paletteFor('sun', dark);
  const today = toDateOnly();
  const netflix = SERVICE_BY_ID['netflix'];
  const charge = addDays(today, 5);
  const [early, late] = headsUpDates(charge, today);
  const price = formatMoney(netflix.amountMinor, netflix.currency);

  return (
    <Screen
      surface="sun"
      scroll
      footer={
        <>
          <Button label="See what I pay" onPress={() => router.push('/onboarding/services')} />
          <Txt v="fine" tone="fg2" center style={{ marginTop: 10 }}>
            Free forever for tracking · Your list stays on your phone
          </Txt>
        </>
      }
    >
      <View style={{ height: 44, justifyContent: 'center', marginTop: 4 }}>
        <Wordmark />
      </View>
      <Txt v="displayXL" accessibilityRole="header" style={{ marginTop: 26 }}>
        {'Ditch it\nbefore it\n'}
        <Txt v="displayXL" color={dark ? brand.sunflower : p.fg}>
          renews.
        </Txt>
      </Txt>
      <Txt v="lead" tone="fg2" style={{ marginTop: 16, maxWidth: 330 }}>
        See everything you pay for. Get a heads&#8209;up before every charge.
      </Txt>

      <View style={{ flex: 1, minHeight: 96 }} />

      <View style={{ marginBottom: 12 }}>
        <Duck width={140} right={16} sink={6} />
        {/* The notification stacked underneath, like the lock screen. */}
        <View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: -12,
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor: dark ? '#1C1A16' : 'rgba(255,255,255,0.6)',
            borderWidth: dark ? 1 : 0,
            borderColor: '#2C2924',
          }}
        />
        <NotificationPreview time={`${weekdayShort(early)} 9:00 AM`} message={`Netflix renews ${weekdayName(charge)}. ${price}. ${stillUsingIt(netflix.category)}`} />
      </View>

      <View style={{ marginTop: 18, marginHorizontal: 2 }}>
        <HeadsUpTimeline
          behind={p.bg}
          stops={[
            { kind: 'bell', title: weekdayDate(early), sub: '9 AM heads-up' },
            { kind: 'bell', title: weekdayDate(late), sub: '9 AM heads-up' },
            { kind: 'charge', title: weekdayDate(charge), sub: `${price} charge` },
          ]}
        />
      </View>
      <View style={{ height: 24 }} />
    </Screen>
  );
}
