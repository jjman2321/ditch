// Where a bank flow started (onboarding's "Where should we look?", the Find hub, Settings) and
// whether Pro is already on, so each screen knows where to go next.

import { useLocalSearchParams } from 'expo-router';

import { showBankSync } from '@/config/features';
import { useApp } from '@/state/app';
import { useOnboarding } from '@/state/onboarding';

export type BankFrom = 'onboarding' | 'find' | 'settings' | 'home';

export function useBankFlow() {
  const params = useLocalSearchParams<{ from?: string; bank?: string; link?: string }>();
  const app = useApp();
  const ob = useOnboarding();
  // Onboarding is decided by whether it's done, never by the link (like the paywall).
  const onboarding = !app.settings.onboardingDone;
  const from: BankFrom = onboarding ? 'onboarding' : params.from === 'settings' || params.from === 'home' ? params.from : 'find';
  const pro = app.pro || (onboarding && ob.pro !== null);
  const country = onboarding ? (ob.country ?? app.settings.country) : app.settings.country;
  const on = showBankSync(country, app.settings.currency);
  return { from, onboarding, pro, on, country, bankId: params.bank ?? null, linkId: params.link ?? null, q: (extra: Record<string, string> = {}) => new URLSearchParams({ from, ...extra }).toString() };
}
