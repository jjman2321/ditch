// Bigger pieces used by onboarding and the paywall.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { LogoTile } from '@/components/kit';
import { font, ink, text } from '@/theme/brand';

// ---------- lock-screen preview with real reminders ----------
export function LockScreen({
  items,
}: {
  items: { id: string; title: string; body: string; color: string; ink?: string; mono: string; when: string }[];
}) {
  return (
    <View style={styles.phone} accessible accessibilityLabel={`Example reminders: ${items.map((i) => i.title).join('. ')}`}>
      <Text allowFontScaling={false} style={styles.time}>
        9:00
      </Text>
      <Text allowFontScaling={false} style={styles.date}>
        Thursday, November 12
      </Text>
      <View style={{ gap: 8, marginTop: 18 }}>
        {items.map((it, i) => (
          <Animated.View key={it.title} entering={FadeInDown.delay(350 + i * 420).springify().duration(450).dampingRatio(0.8)} style={styles.notif}>
            <View style={styles.appIcon}>
              <Text allowFontScaling={false} style={{ color: ink.white, fontFamily: font.black, fontSize: 15 }}>
                D
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text allowFontScaling={false} style={styles.nTitle}>
                  {it.title}
                </Text>
                <Text allowFontScaling={false} style={styles.nWhen}>
                  {it.when}
                </Text>
              </View>
              <Text allowFontScaling={false} style={styles.nBody}>
                {it.body}
              </Text>
            </View>
            <LogoTile id={it.id} color={it.color} ink={it.ink} mono={it.mono} size={32} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// ---------- trial timeline ----------
export function Timeline({
  rows,
}: {
  rows: { emoji: string; when: string; title: string; body: string; action?: { label: string; onPress: () => void }; hot?: boolean }[];
}) {
  return (
    <View>
      {rows.map((r, i) => (
        <View key={r.when} style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ alignItems: 'center', width: 40 }}>
            <View style={[styles.dot, r.hot && { backgroundColor: ink.teal, borderColor: ink.tealEdge }]}>
              <Text allowFontScaling={false} style={{ fontSize: 18 }}>
                {r.emoji}
              </Text>
            </View>
            {i < rows.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: i < rows.length - 1 ? 16 : 0, paddingTop: 1 }}>
            <Text style={[text.small, { fontFamily: font.heavy, color: ink.teal, letterSpacing: 0.4 }]}>{r.when.toUpperCase()}</Text>
            <Text style={text.bodyStrong}>{r.title}</Text>
            <Text style={text.label}>{r.body}</Text>
            {r.action ? (
              <Pressable accessibilityRole="button" onPress={r.action.onPress} style={{ minHeight: 40, justifyContent: 'center' }}>
                <Text style={[text.label, { fontFamily: font.heavy, color: ink.teal }]}>{r.action.label}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    borderRadius: 36,
    paddingTop: 22,
    paddingHorizontal: 12,
    paddingBottom: 22,
    backgroundColor: '#1D5C55',
    borderWidth: 6,
    borderColor: '#2B2F2E',
  },
  time: { fontFamily: font.black, fontSize: 58, lineHeight: 62, color: ink.white, textAlign: 'center', letterSpacing: -1 },
  date: { fontFamily: font.bold, fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  appIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: ink.teal, alignItems: 'center', justifyContent: 'center' },
  nTitle: { fontFamily: font.heavy, fontSize: 14, color: ink.text, flexShrink: 1 },
  nWhen: { fontFamily: font.regular, fontSize: 12, color: ink.textFaint },
  nBody: { fontFamily: font.regular, fontSize: 13, color: ink.textSoft },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: ink.line,
    backgroundColor: ink.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 3, flex: 1, backgroundColor: ink.line, borderRadius: 2, marginVertical: 2 },
});
