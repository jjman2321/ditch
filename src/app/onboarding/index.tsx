// 1 · Welcome (design/v12 render 01). The product in one picture: a real
// reminder for a Netflix charge next week and the days that lead to it.

import { router } from 'expo-router';
import { View } from 'react-native';

import { catalogPrice } from '@/catalog/prices';
import { SERVICE_BY_ID } from '@/catalog/services';
import { headsUpDates } from '@/domain/charges';
import { stillUsingIt } from '@/domain/copy';
import { addDays, weekdayDate, weekdayName, weekdayShort } from '@/domain/dates';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { onboardingToday, useMoney, useOnboarding } from '@/state/onboarding';
import { Button, Duck, HeadsUpTimeline, NotificationPreview, Txt, Wordmark, brand, paletteFor, useFrame, useIsDark } from '@/ui/sunflower';

export default function Welcome() {
  const dark = useIsDark();
  const p = paletteFor('sun', dark);
  const f = useFrame({ maxContent: 480, colH: 840 });
  const today = onboardingToday();
  // A charge next week, so the first reminder ("renews Thursday") is 3 days before it.
  const charge = addDays(today, 9);
  const [early, late] = headsUpDates(charge, today);
  const money = useMoney();
  const { country } = useOnboarding();
  const local = catalogPrice('netflix', country);
  const price = local ? money(local.amountMinor, local.currency) : null;

  // 70/64 on phones (60/56 on SE, 88/80 on iPad), never wider than the column:
  // "before it" is the longest line, 342pt wide at 70pt.
  const base = f.tablet ? 88 : f.small ? 60 : 70;
  const fs = Math.min(base, Math.floor((70 * f.content) / 342));
  const head = { fontSize: fs, lineHeight: Math.round((fs * 64) / 70 / 4) * 4, letterSpacing: -0.04 * fs };

  return (
    <OnbRoot surface="sun">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <View style={{ height: 28, marginTop: 16, justifyContent: 'center' }}>
          <Wordmark size={24} />
        </View>
        <Txt v="displayXL" accessibilityRole="header" accessibilityLabel="Ditch it before it renews." style={[{ marginTop: f.small ? 24 : 32 }, head]}>
          {'Ditch it\nbefore it\n'}
          <Txt v="displayXL" color={dark ? brand.sunflower : p.fg} style={head}>
            renews.
          </Txt>
        </Txt>
        <Txt v="lead" tone="fg2" style={[{ marginTop: 16, maxWidth: f.tablet ? 420 : 320 }, f.tablet && { fontSize: 20, lineHeight: 28 }]}>
          {'See everything you pay for. Get a reminder before every charge.'}
        </Txt>

        <View style={{ flex: 1, minHeight: f.small ? 24 : 96 }} />

        <View>
          {f.small ? null : <Duck width={f.tablet ? 160 : 136} right={16} sink={6} />}
          <View style={{ zIndex: 2 }}>
            <NotificationPreview
              time={`${weekdayShort(early)} 9:00 AM`}
              message={`Netflix renews ${weekdayName(charge)}.${price ? ` ${price}.` : ''} ${stillUsingIt(SERVICE_BY_ID['netflix'].category).replace(' ', ' ')}`}
            />
          </View>
          {/* The one stacked underneath, like the lock screen. */}
          <View
            style={{
              marginTop: -16,
              marginHorizontal: 12,
              height: 28,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              backgroundColor: dark ? '#1C1A16' : 'rgba(255,255,255,0.6)',
              borderWidth: dark ? 1 : 0,
              borderTopWidth: 0,
              borderColor: '#2C2924',
            }}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <HeadsUpTimeline
            behind={p.bg}
            stops={[
              { kind: 'bell', title: weekdayDate(early), sub: '9 AM reminder' },
              { kind: 'bell', title: weekdayDate(late), sub: '9 AM reminder' },
              { kind: 'charge', title: weekdayDate(charge), sub: price ? `${price} charge` : 'charge day' },
            ]}
          />
        </View>

        <View style={{ height: f.small ? 24 : 32 }} />
        <Button label="See what I pay" onPress={() => router.push('/onboarding/services')} />
        {/* The deal, before any work (review research: ~155 "told me after I typed it all"). */}
        <Txt v="sub" tone="fg2" center style={{ marginTop: 12 }}>
          {'Free forever for tracking. Reminders on\u00A03.'}
        </Txt>
      </FitScroll>
    </OnbRoot>
  );
}
