// Opening the right cancel page, or the short how-to when we don't have
// an official link. Shared by the Ditched screen and the Ditched tab.

import { useState } from 'react';
import { Linking, View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL, cancelHelp, cancelSteps } from '@/catalog/cancel';
import { isProTrial, type Sub } from '@/domain/subs';
import { Button, F, Sheet, Txt, brand, usePalette } from '@/ui/sunflower';

export function openUrl(url: string) {
  Linking.openURL(url).catch(() => {});
}

export function helpFor(sub: Sub) {
  return cancelHelp({ name: sub.name, catalogId: sub.catalogId, proTrial: isProTrial(sub) });
}

/** Holds the how-to sheet; `open(sub)` follows the link or shows the steps. */
export function useCancelHelp() {
  const [sub, setSub] = useState<Sub | null>(null);
  const [visible, setVisible] = useState(false);
  const open = (s: Sub) => {
    const h = helpFor(s);
    if (h.kind === 'steps') {
      setSub(s);
      setVisible(true);
    } else {
      openUrl(h.url);
    }
  };
  const sheet = <HowToSheet sub={sub} visible={visible} onClose={() => setVisible(false)} />;
  return { open, sheet };
}

export function HowToSheet({ sub, visible, onClose }: { sub: Sub | null; visible: boolean; onClose: () => void }) {
  const p = usePalette();
  return (
    <Sheet visible={visible && !!sub} onClose={onClose} maxHeight={470} label={sub ? `How to cancel ${sub.name}` : 'How to cancel'}>
      {sub ? (
        <View style={{ flex: 1 }}>
          <Txt v="heading" accessibilityRole="header">
            How to cancel {sub.name}
          </Txt>
          <Txt v="body" tone="fg2" style={{ marginTop: 6 }}>
            Ditch can’t cancel for you. It takes about a minute:
          </Txt>
          <View style={{ marginTop: 16, gap: 14 }}>
            {cancelSteps(sub.name).map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: brand.sunflower, alignItems: 'center', justifyContent: 'center', borderWidth: p.dark ? 0 : 1.5, borderColor: brand.ink }}>
                  <Txt v="label" color={brand.ink} style={{ fontFamily: F.heavy, fontSize: 14 }}>
                    {i + 1}
                  </Txt>
                </View>
                <Txt v="leadS" style={{ flex: 1 }}>
                  {step}
                </Txt>
              </View>
            ))}
          </View>
          <Txt v="body" tone="fg2" style={{ marginTop: 18 }}>
            Paying through Apple? It’s in iPhone Settings → your name → Subscriptions.
          </Txt>
          <View style={{ flex: 1, minHeight: 12 }} />
          <Button kind="secondary" label="Open Apple subscriptions" onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} />
          <Button kind="text" label="Done" onPress={onClose} />
        </View>
      ) : null}
    </Sheet>
  );
}
