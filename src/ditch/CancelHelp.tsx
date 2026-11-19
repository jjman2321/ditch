// Opening the right cancel page, or the how-to (official steps for the top
// 50, generic ones otherwise). Shared by the Ditched screen and the Ditched tab.

import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL, cancelHelp } from '@/catalog/cancel';
import { RIGHTS_CHECKED, RIGHTS_DISCLAIMER, rightsFor, rightsPlace } from '@/catalog/rights';
import { shortDate } from '@/domain/dates';
import { isProTrial, type Sub } from '@/domain/subs';
import { useApp } from '@/state/app';
import { Button, ChevronRight, External, F, Sheet, Txt, brand, usePalette } from '@/ui/sunflower';

export function openUrl(url: string) {
  Linking.openURL(url).catch(() => {});
}

export function helpFor(sub: Sub) {
  return cancelHelp({ name: sub.name, catalogId: sub.catalogId, proTrial: isProTrial(sub) });
}

/**
 * Holds the how-to sheet. `open(sub)` always shows the steps (with the
 * official page one tap away); `go(sub)` goes straight to the official page
 * when there is one, else shows the steps.
 */
export function useCancelHelp() {
  const [sub, setSub] = useState<Sub | null>(null);
  const [visible, setVisible] = useState(false);
  const open = (s: Sub) => {
    setSub(s);
    setVisible(true);
  };
  const go = (s: Sub) => {
    const h = helpFor(s);
    if (h.kind !== 'steps' && h.url) openUrl(h.url);
    else open(s);
  };
  const sheet = <HowToSheet sub={sub} visible={visible} onClose={() => setVisible(false)} />;
  return { open, go, sheet };
}

export function HowToSheet({ sub, visible, onClose }: { sub: Sub | null; visible: boolean; onClose: () => void }) {
  const p = usePalette();
  const h = sub ? helpFor(sub) : null;
  // The page button: the cancel page, Apple's page, or the service's help article.
  const page = h?.url ? (h.kind === 'steps' ? `Open ${sub!.name} help` : h.label) : null;
  return (
    <Sheet visible={visible && !!sub} onClose={onClose} fit label={sub ? `How to cancel ${sub.name}` : 'How to cancel'}>
      {sub && h ? (
        <View>
          <Txt v="heading" accessibilityRole="header">
            How to cancel {sub.name}
          </Txt>
          <Txt v="body" tone="fg2" style={{ marginTop: 6 }}>
            Ditch can’t cancel for you, but it’s quick:
          </Txt>
          <View style={{ marginTop: 16, gap: 14 }}>
            {h.steps.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: brand.sunflower,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: p.dark ? 0 : 1.5,
                    borderColor: brand.ink,
                  }}
                >
                  <Txt v="label" color={brand.ink} style={{ fontFamily: F.heavy, fontSize: 14 }}>
                    {i + 1}
                  </Txt>
                </View>
                <Txt v="leadS" style={{ flex: 1, paddingTop: 2 }}>
                  {step.replace(/ (\S+)$/, '\u00A0$1')}
                </Txt>
              </View>
            ))}
          </View>
          {h.checked ? (
            <Txt v="sub" tone="mute" style={{ marginTop: 12 }}>
              {`Steps checked ${shortDate(h.checked)}`}
            </Txt>
          ) : null}
          {h.appleNote ? (
            <Txt v="body" tone="fg2" style={{ marginTop: 18 }}>
              Paying through Apple? Cancel it in Apple subscriptions below.
            </Txt>
          ) : null}
          <YourRights />
          <View style={{ marginTop: 20, gap: 8 }}>
            {page && h.url ? <Button label={page} hint="Opens outside Ditch" right={<External color={p.ctaFg} size={19} />} onPress={() => openUrl(h.url!)} /> : null}
            {h.appleNote ? <Button kind={page ? 'text' : 'secondary'} label="Open Apple subscriptions" hint="Opens outside Ditch" onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} /> : null}
            <Button kind="text" label="Done" onPress={onClose} />
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

/**
 * "Your rights in the US": closed by default so the steps stay first. The law
 * as we read it, with a source and a date; never a promise (CLAUDE.md rule 5).
 */
function YourRights() {
  const p = usePalette();
  const country = useApp().settings.country;
  const [open, setOpen] = useState(false);
  const regions = rightsFor(country);
  if (!country || !regions.length) return null;
  const title = `Your rights in ${rightsPlace(country)}`;
  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderColor: p.rule }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Txt v="label" style={{ fontFamily: F.bold }}>
          {title}
        </Txt>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <ChevronRight color={p.fg2} size={18} />
        </View>
      </Pressable>
      {open ? (
        <View style={{ gap: 14, paddingBottom: 4 }}>
          {regions.map((r) => (
            <View key={r.id}>
              <Txt v="body">
                <Txt v="body" style={{ fontFamily: F.bold }}>
                  {r.title}:{' '}
                </Txt>
                {r.text}
              </Txt>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16 }}>
                {r.sources.map((src, i) => (
                  <Link key={src.url} label={r.sources.length > 1 ? `Source ${i + 1}` : 'Source'} spoken={`Source: ${src.label}`} url={src.url} />
                ))}
                {r.help ? <Link label={r.help.label} url={r.help.url} /> : null}
              </View>
            </View>
          ))}
          <Txt v="sub" tone="mute">
            {`${RIGHTS_DISCLAIMER} Checked ${shortDate(RIGHTS_CHECKED)}.`}
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

function Link({ label, spoken, url }: { label: string; spoken?: string; url: string }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={spoken ?? label} accessibilityHint="Opens outside Ditch" onPress={() => openUrl(url)} style={{ minHeight: 44, justifyContent: 'center' }}>
      <Txt v="sub" tone="fg2" style={{ textDecorationLine: 'underline' }}>
        {label}
      </Txt>
    </Pressable>
  );
}
