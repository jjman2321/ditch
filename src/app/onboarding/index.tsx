// 1 · Welcome (design/v12 render 01, cleaned Nov 18). Like the top finance apps
// on Mobbin and AppKittie (Monarch, Rocket Money, One, bunq): one picture, one
// headline, one button. The picture is the product: a real reminder, the duck behind it.

import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { catalogPrice } from '@/catalog/prices';
import { SERVICE_BY_ID } from '@/catalog/services';
import { headsUpDates } from '@/domain/charges';
import { stillUsingIt } from '@/domain/copy';
import { addDays, weekdayName, weekdayShort } from '@/domain/dates';
import { FitScroll, OnbRoot } from '@/onboarding/Parts';
import { onboardingToday, useMoney, useOnboarding } from '@/state/onboarding';
import { Button, Duck, LogoTile, NotificationPreview, Txt, Wordmark, brand, paletteFor, useFrame, useIsDark } from '@/ui/sunflower';

// Real service logos as the picture (CLAUDE.md rule 8), scattered like stickers around the duck.
// x and y are shares of the free space above the reminder; "row" 2 only shows when there's room.
const STICKERS = [
  { id: 'netflix', mono: 'N', x: 0.02, y: 0.06, size: 60, rot: -9, row: 1 },
  { id: 'spotify', mono: 'S', x: 0.6, y: 0.0, size: 54, rot: 8, row: 1 },
  { id: 'disney-plus', mono: 'D', x: 0.33, y: 0.3, size: 48, rot: 5, row: 1 },
  { id: 'chatgpt-plus', mono: 'C', x: 0.84, y: 0.36, size: 46, rot: -7, row: 2 },
  { id: 'youtube-premium', mono: 'Y', x: 0.08, y: 0.62, size: 44, rot: 6, row: 2 },
] as const;

function Stickers({ width, height }: { width: number; height: number }) {
  const reduce = useReducedMotion();
  if (height < 70) return null;
  const rows = height >= 170 ? 2 : 1;
  // Tall phones: the stickers stay one cluster (at most 240pt tall), sitting a little above the middle.
  const box = Math.min(height, 240);
  const off = Math.round((height - box) * 0.45);
  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}>
      {STICKERS.filter((x) => x.row <= rows).map((x, i) => {
        const size = rows === 1 ? Math.round(x.size * 0.85) : x.size;
        return (
          <Animated.View
            key={x.id}
            entering={reduce ? undefined : FadeIn.delay(120 + i * 70).duration(320)}
            style={{
              position: 'absolute',
              left: Math.min(x.x * width, width - size - 6),
              top: off + (rows === 1 ? Math.min(x.y * box, box - size - 8) : x.y * (box - size)),
              transform: [{ rotate: `${x.rot}deg` }],
              borderRadius: size * 0.28,
              borderWidth: 3,
              borderColor: '#FFFFFF',
              shadowColor: '#3A2A00',
              shadowOpacity: 0.18,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            <LogoTile id={x.id} size={size} mono={x.mono} />
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function Welcome() {
  const dark = useIsDark();
  const p = paletteFor('sun', dark);
  const f = useFrame({ maxContent: 480, colH: 840 });
  const today = onboardingToday();
  // A charge next week, so the first reminder ("renews Thursday") is 3 days before it.
  const charge = addDays(today, 9);
  const [early] = headsUpDates(charge, today);
  const money = useMoney();
  const { country } = useOnboarding();
  const local = catalogPrice('netflix', country);
  const price = local ? money(local.amountMinor, local.currency) : null;

  // 70/64 on phones (60/56 on SE, 88/80 on iPad), never wider than the column:
  // "before it" is the longest line, 342pt wide at 70pt.
  const base = f.tablet ? 88 : f.tiny ? 50 : f.small ? 60 : 70;
  const fs = Math.min(base, Math.floor((70 * f.content) / 342));
  const [art, setArt] = useState({ w: 0, h: 0 });
  const head = { fontSize: fs, lineHeight: Math.round((fs * 64) / 70 / 4) * 4, letterSpacing: -0.04 * fs };

  return (
    <OnbRoot surface="sun">
      <FitScroll style={{ paddingTop: f.top, paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
        <View style={{ height: 28, marginTop: 16, justifyContent: 'center' }}>
          <Wordmark size={24} />
        </View>
        <Txt v="displayXL" accessibilityRole="header" accessibilityLabel="Ditch it before it renews." style={[{ marginTop: f.tiny ? 14 : f.small ? 24 : 32 }, head]}>
          {'Ditch it\nbefore it\n'}
          <Txt v="displayXL" color={dark ? brand.sunflower : p.fg} style={head}>
            renews.
          </Txt>
        </Txt>
        {/* The picture fills the space under the headline (like One, bunq, Monarch): logos up top, the reminder below. */}
        <View style={{ flex: 1, minHeight: f.tiny ? 16 : 24, marginTop: f.small ? 12 : 20 }} onLayout={(e) => setArt({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
          <Stickers width={art.w} height={art.h - (f.small ? 8 : f.tablet ? 120 : 96)} />
        </View>

        <View>
          {f.small ? null : <Duck width={f.tablet ? 160 : 136} right={16} sink={6} />}
          <View style={{ zIndex: 2 }}>
            <NotificationPreview
              time={`${weekdayShort(early)} 9 AM`}
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

        <View style={{ height: f.tiny ? 14 : f.small ? 20 : 28 }} />
        <Button label="Find my subscriptions" onPress={() => router.push('/onboarding/how')} />
        {/* The deal, before any work (review research: ~155 "told me after I typed it all"). */}
        <Txt v="sub" tone="fg2" center style={{ marginTop: 12 }}>
          {'Free forever for tracking. No\u00A0account.'}
        </Txt>
      </FitScroll>
    </OnbRoot>
  );
}
