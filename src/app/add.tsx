// "Add to Ditch" links from ditchsubs.app (DECISIONS #60, item 6):
// ditch://add?service=netflix opens Home with that service picked in the Add
// sheet. Universal Links (https://ditchsubs.app/add/netflix) come with the dev
// build; this route already handles both. Unknown ids just open Add.

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { SERVICE_BY_ID } from '@/catalog/services';
import { useEditor } from '@/editor/Editor';
import { useApp } from '@/state/app';

export default function AddLink() {
  const { ready, settings } = useApp();
  const editor = useEditor();
  const { service } = useLocalSearchParams<{ service?: string }>();
  const id = typeof service === 'string' && SERVICE_BY_ID[service] ? service : undefined;
  const go = ready && settings.onboardingDone;
  useEffect(() => {
    if (!go) return;
    // After Home has mounted, so the sheet opens over it. No cleanup: this
    // screen redirects away at once, and the editor lives above the router.
    setTimeout(() => editor.openAdd(id), 350);
  }, [go, id, editor]);
  if (!ready) return null;
  // Mid-onboarding: their list comes first; the link just starts the app.
  return <Redirect href={settings.onboardingDone ? '/(tabs)' : '/'} />;
}
