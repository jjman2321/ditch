// 2 · What Ditch does (design/v16 1b–1d): three swipeable slides, like
// Orbit, Feenko and Subpilot open with. One idea each, one picture each:
//   1. what people pay (the hook), with a statement where Ditch marks the subs,
//   2. reminders before every charge, as the real notifications,
//   3. the Ditched moment: hold, DITCHED, then the money you won't pay.
// Skip goes straight to "Where should we look?". No sources on screen (owner, Nov 18).

import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { OnbRoot } from '@/onboarding/Parts';
import { Button, DitchedTag, F, LogoTile, NotificationPreview, Txt, brand, haptic, useFrame, usePalette } from '@/ui/sunflower';

const NB = ' ';

type Slide = {
  key: string;
  title: string;
  body: string;
  big?: string;
  art: 'statement' | 'notes' | 'ditch';
};

const SLIDES: Slide[] = [
  {
    key: 'pay',
    big: '$2,628',
    title: 'a year on subscriptions.',
    body: `That’s what the average person pays. Most guess less than half. Let’s${NB}find${NB}yours.`,
    art: 'statement',
  },
  {
    key: 'remind',
    title: 'A heads-up before every charge.',
    body: `3 days and 1 day before, at 9 AM. Free trials and price${NB}rises${NB}too.`,
    art: 'notes',
  },
  {
    key: 'ditch',
    title: 'Ditch what you don’t use.',
    body: `Hold to ditch. We show you exactly how to cancel${NB}it.`,
    art: 'ditch',
  },
];

function Statement() {
  const p = usePalette();
  const rows: [string, string, string, boolean][] = [
    ['DEC 08', 'PLANET FITNESS', '24.99', true],
    ['DEC 07', 'SHELL OIL 5741', '48.22', false],
    ['DEC 05', 'APPLE.COM/BILL', '27.97', true],
    ['DEC 03', 'SPOTIFY USA', '11.99', true],
    ['DEC 02', 'TRADER JOE’S #552', '64.10', false],
    ['DEC 01', 'NETFLIX.COM', '17.99', true],
  ];
  return (
    <View
      accessible
      accessibilityLabel="A bank statement with the subscriptions marked"
      style={{
        backgroundColor: p.card,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: p.dark ? 1 : 0,
        borderColor: p.cardBorder,
      }}
    >
      {rows.map(([d, m, a, sub]) => (
        <View
          key={m}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 8,
            paddingVertical: 7,
            borderRadius: 9,
            backgroundColor: sub ? (p.dark ? '#3A3220' : '#FFF1BC') : 'transparent',
            marginVertical: 1,
          }}
        >
          <Txt v="fine" tone="mute" num numberOfLines={1} style={{ width: 54, fontFamily: F.semi }}>
            {d}
          </Txt>
          <Txt
            v="fine"
            color={sub ? p.cardFg : p.mute}
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: sub ? F.semi : F.regular,
              letterSpacing: 0.2,
            }}
          >
            {m}
          </Txt>
          <Txt v="fine" num color={sub ? p.cardFg : p.mute} style={{ fontFamily: sub ? F.semi : F.regular }}>
            {a}
          </Txt>
        </View>
      ))}
    </View>
  );
}

function Notes() {
  return (
    <View style={{ gap: 10 }}>
      <NotificationPreview time="Sat 9 AM" message="Netflix renews Tuesday. $17.99. Still watching?" />
      <NotificationPreview time="Mon 9 AM" message="Your ChatGPT trial ends Friday. Then $20.00 a month." />
      <NotificationPreview time="Wed 9 AM" message="Spotify went up to $12.99. You were paying $11.99." faded />
    </View>
  );
}

function DitchRows() {
  const p = usePalette();
  const rows: {
    id: string;
    name: string;
    sub: string;
    price: string;
    ditched?: boolean;
  }[] = [
    { id: 'netflix', name: 'Netflix', sub: 'Tue, Dec 16', price: '$17.99' },
    {
      id: 'planet-fitness',
      name: 'Planet Fitness',
      sub: '$24.99/mo',
      price: '',
      ditched: true,
    },
    { id: 'spotify', name: 'Spotify', sub: 'Mon, Dec 22', price: '$11.99' },
  ];
  return (
    <View>
      <View
        style={{
          backgroundColor: p.card,
          borderRadius: 20,
          paddingHorizontal: 14,
          borderWidth: p.dark ? 1 : 0,
          borderColor: p.cardBorder,
        }}
      >
        {rows.map((r, i) => (
          <View
            key={r.id}
            style={{
              minHeight: 62,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderTopWidth: i ? 1 : 0,
              borderTopColor: p.hair,
            }}
          >
            <View style={{ opacity: r.ditched ? 0.45 : 1 }}>
              <LogoTile id={r.id} size={38} mono={r.name.slice(0, 1)} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyStrong" color={r.ditched ? p.mute : p.cardFg}>
                {r.name}
              </Txt>
              <Txt v="fine" tone="mute">
                {r.sub}
              </Txt>
            </View>
            {r.ditched ? (
              <DitchedTag />
            ) : (
              <Txt v="moneyS" num color={p.cardFg}>
                {r.price}
              </Txt>
            )}
          </View>
        ))}
      </View>
      <Txt v="moneyL" num center color={p.fg} style={{ marginTop: 16 }} numberOfLines={1} adjustsFontSizeToFit>
        $299.88 a year you won’t pay
      </Txt>
    </View>
  );
}

export default function How() {
  const p = usePalette();
  const f = useFrame({ maxContent: 480, colH: 820 });
  const scroller = useRef<{
    scrollTo: (o: { x: number; animated: boolean }) => void;
  } | null>(null);
  const [page, setPage] = useState(0);
  const last = page === SLIDES.length - 1;
  const next = () => router.push('/onboarding/where');

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / f.width);
    if (i !== page) haptic.select();
    setPage(i);
  };
  const go = () => {
    if (last) return next();
    scroller.current?.scrollTo({ x: (page + 1) * f.width, animated: true });
    setPage(page + 1);
  };

  return (
    <OnbRoot surface="cream">
      <View style={{ flex: 1, paddingTop: f.top }}>
        <View
          style={{
            height: 44,
            paddingHorizontal: f.edge,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip"
            onPress={next}
            hitSlop={10}
            style={({ pressed }) => ({
              minHeight: 44,
              minWidth: 44,
              alignItems: 'flex-end',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Txt v="label" tone="fg2">
              Skip
            </Txt>
          </Pressable>
        </View>

        <ScrollView ref={scroller as never} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onEnd} style={{ flex: 1 }}>
          {SLIDES.map((s) => (
            <View key={s.key} style={{ width: f.width, paddingHorizontal: f.edge, flex: 1 }}>
              {/* Picture and words stay together, centred in the page: spare height splits evenly above and below. */}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  paddingBottom: f.small ? 8 : 16,
                }}
              >
                <View style={{ marginBottom: f.small ? 20 : 36 }}>{s.art === 'statement' ? <Statement /> : s.art === 'notes' ? <Notes /> : <DitchRows />}</View>
                <View>
                  {s.big ? (
                    <Txt v="displayL" num color={p.fg} accessibilityRole="header" style={f.small ? { fontSize: 52, lineHeight: 52 } : null}>
                      {s.big}
                    </Txt>
                  ) : null}
                  <Txt v="title" accessibilityRole={s.big ? undefined : 'header'} style={[{ marginTop: s.big ? 2 : 0 }, f.small && { fontSize: 26, lineHeight: 31 }]}>
                    {s.title}
                  </Txt>
                  <Txt v="lead" tone="fg2" style={{ marginTop: 8 }}>
                    {s.body}
                  </Txt>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: f.edge, paddingBottom: f.bottom }}>
          <View
            accessible
            accessibilityLabel={`Slide ${page + 1} of ${SLIDES.length}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
              marginBottom: f.small ? 14 : 20,
            }}
          >
            {SLIDES.map((s, i) => (
              <View
                key={s.key}
                style={{
                  width: i === page ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === page ? (p.dark ? brand.sunflower : brand.ink) : p.dark ? '#3A3630' : '#D9D0BD',
                }}
              />
            ))}
          </View>
          <Button label={last ? 'Find my subscriptions' : 'Next'} onPress={go} />
        </View>
      </View>
    </OnbRoot>
  );
}
