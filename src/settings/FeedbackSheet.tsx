// Feedback & help → one sheet for all three rows (owner, Nov 20: "you didn't do the form").
// Pattern from Substack's feedback sheet, Yami and Clue (Mobbin): pick what it's about,
// one big text box, an optional email, send without leaving the app.
// Sends only what they type, plus a line of counts if "Include app info" is on.
// The list itself never leaves the phone. Offline? The text stays, and Mail is the fallback.

import { useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, TextInput, View } from 'react-native';

import { effectiveLeads } from '@/domain/settings';
import { pendingCount } from '@/services/notifications';
import { useApp } from '@/state/app';
import { Button, Chip, Duck, F, KEYBOARD_DONE, KeyboardDone, Sheet, SunSwitch, Txt, haptic, usePalette, useSheetScroll } from '@/ui/sunflower';

import { FEEDBACK_MAX, buildFeedback, diagnosticsLine, emailFeedback, isEmail, sendFeedback, type FeedbackKind } from './feedback';

const KINDS: { value: FeedbackKind; label: string }[] = [
  { value: 'problem', label: 'Problem' },
  { value: 'idea', label: 'Idea' },
  { value: 'service', label: 'Missing subscription' },
];

const PLACEHOLDER: Record<FeedbackKind, string> = {
  problem: 'What happened?',
  idea: 'What would make Ditch better?',
  service: 'Which subscription? Add the plan and price if you know them.',
};

type Status = 'form' | 'sending' | 'failed' | 'sent';

type Draft = { message: string; email: string };
const EMPTY: Draft = { message: '', email: '' };

function Body({ initialKind, draft, setDraft, onDone }: { initialKind: FeedbackKind; draft: Draft; setDraft: (d: Draft) => void; onDone: () => void }) {
  const p = usePalette();
  const app = useApp();
  const onScroll = useSheetScroll();
  const [kind, setKind] = useState<FeedbackKind>(initialKind);
  const { message, email } = draft;
  // On for a problem (it's how we find out why a reminder didn't come), off otherwise,
  // until they flip it themselves.
  const [infoChoice, setInfoChoice] = useState<boolean | null>(null);
  const includeInfo = infoChoice ?? kind === 'problem';
  const [status, setStatus] = useState<Status>('form');

  // Counts only (see diagnosticsLine). Worked out once, when the sheet opens.
  const { subs, settings, pro, notif } = app;
  const [pending, setPending] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    pendingCount()
      .then((n) => live && setPending(n))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const appInfo = diagnosticsLine({ subs, settings, pro, notif, pending, leads: effectiveLeads(settings, pro) });

  const form = { kind, message, email, appInfo, includeAppInfo: includeInfo };
  const check = buildFeedback(form);
  const badEmail = email.trim().length > 0 && !isEmail(email.trim());
  const sending = status === 'sending';
  const iosGrey = p.dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const box = { borderRadius: 14, backgroundColor: p.chipBg, borderWidth: 1.5, borderColor: p.chipBorder } as const;

  const send = async () => {
    if (!check.ok || sending) return;
    setStatus('sending');
    const ok = await sendFeedback(check.payload);
    if (ok) {
      haptic.success();
      setDraft(EMPTY);
      setStatus('sent');
      AccessibilityInfo.announceForAccessibility('Sent. Thanks! A real person reads every one.');
    } else {
      haptic.warning();
      setStatus('failed');
      AccessibilityInfo.announceForAccessibility('Couldn’t send. Check your connection and try again.');
    }
  };

  if (status === 'sent') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Duck width={92} bottom={0} delay={120} style={{ position: 'relative' }} />
        </View>
        <Txt v="titleXS" center accessibilityRole="header" style={{ marginTop: 16 }}>
          Thanks!
        </Txt>
        <Txt v="leadS" tone="fg2" center style={{ marginTop: 8 }}>
          A real person reads every one.
        </Txt>
        <Button label="Done" onPress={onDone} style={{ marginTop: 28 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Drag the form down, or tap Done above the keyboard, to put the keyboard away.
          The scroll view makes room for the keyboard, so Send is always reachable (iPhone SE). */}
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={onScroll}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <Txt v="titleXS" accessibilityRole="header" style={{ marginTop: 8, marginRight: 44 }}>
          Write to us
        </Txt>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {KINDS.map((k) => (
            <Chip
              key={k.value}
              label={k.label}
              selected={kind === k.value}
              onPress={() => {
                if (kind === k.value) return;
                haptic.select();
                setKind(k.value);
              }}
            />
          ))}
        </View>

        <TextInput
          value={message}
          onChangeText={(t) => setDraft({ ...draft, message: t })}
          multiline
          maxLength={FEEDBACK_MAX}
          placeholder={PLACEHOLDER[kind]}
          placeholderTextColor={iosGrey}
          accessibilityLabel={PLACEHOLDER[kind]}
          accessibilityHint="Type your message"
          inputAccessoryViewID={KEYBOARD_DONE}
          editable={!sending}
          textAlignVertical="top"
          style={{ ...box, marginTop: 16, minHeight: 120, maxHeight: 220, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, fontFamily: F.regular, fontSize: 16, lineHeight: 22, color: p.fg }}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', marginTop: 16, marginHorizontal: 2 }}>
          <Txt v="label">Email </Txt>
          <Txt v="sub" tone="mute">
            (optional), only if you want a reply
          </Txt>
        </View>
        <TextInput
          value={email}
          onChangeText={(t) => setDraft({ ...draft, email: t })}
          placeholder="you@example.com"
          placeholderTextColor={iosGrey}
          accessibilityLabel="Email, optional. Only if you want a reply"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={254}
          inputAccessoryViewID={KEYBOARD_DONE}
          editable={!sending}
          style={{ ...box, marginTop: 8, height: 48, paddingHorizontal: 14, fontFamily: F.regular, fontSize: 16, color: p.fg }}
        />
        {badEmail ? (
          <Txt v="sub" color={p.danger} style={{ marginTop: 6, marginHorizontal: 2 }} accessibilityLiveRegion="polite">
            That email doesn’t look right.
          </Txt>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, minHeight: 44 }}>
          <View style={{ flex: 1 }}>
            <Txt v="label">Include app info</Txt>
            <Txt v="fine" tone="mute" style={{ marginTop: 2 }}>
              Counts and settings only. No names or prices.
            </Txt>
          </View>
          <SunSwitch value={includeInfo} onValueChange={setInfoChoice} label="Include app info" hint="Adds counts and settings, never names or prices" disabled={sending} />
        </View>
        {includeInfo ? (
          // Show exactly what's added, so nobody has to take our word for it.
          <Txt v="fine" tone="mute" style={{ marginTop: 6 }} accessibilityLabel={`Adds: ${appInfo}`}>
            {appInfo}
          </Txt>
        ) : null}

        {status === 'failed' ? (
          <View style={{ marginTop: 16 }} accessibilityLiveRegion="polite">
            <Txt v="sub" color={p.danger}>
              Couldn’t send. Check your connection and try again.
            </Txt>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Email us instead"
              accessibilityHint="Opens Mail with your message"
              onPress={() => check.ok && emailFeedback(check.payload)}
              style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
            >
              <Txt v="sub" style={{ textDecorationLine: 'underline' }}>
                Email us instead
              </Txt>
            </Pressable>
          </View>
        ) : null}

        <Button
          label={sending ? 'Sending…' : status === 'failed' ? 'Try again' : 'Send'}
          disabled={!check.ok || sending}
          hint={!check.ok && check.error === 'short' ? 'Type a few words first' : undefined}
          onPress={send}
          style={{ marginTop: status === 'failed' ? 4 : 20 }}
        />
        <Txt v="fine" tone="mute" center style={{ marginTop: 12 }}>
          Sent to Ditch only. Your subscription list stays on your phone.
        </Txt>
      </ScrollView>
      <KeyboardDone />
    </View>
  );
}

/**
 * The feedback form. `session` changes each time it opens, so it starts on the row
 * they tapped (`kind`; they can switch at the top). What they typed survives an
 * accidental close and is cleared once it's sent.
 */
export function FeedbackSheet({ visible, kind, session, onClose }: { visible: boolean; kind: FeedbackKind; session: number; onClose: () => void }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  return (
    <Sheet visible={visible} onClose={onClose} maxHeight={640} closeButton label="Write to us">
      <Body key={session} initialKind={kind} draft={draft} setDraft={setDraft} onDone={onClose} />
    </Sheet>
  );
}
