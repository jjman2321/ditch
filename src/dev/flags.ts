// Test-build switches. On in development (Expo Go) and in builds made with
// EXPO_PUBLIC_DEV_TOOLS=1 (set it on an EAS "preview" profile only).
// Never on in the App Store build.

// The production profile in eas.json sets EXPO_PUBLIC_APP_ENV=production, and that wins
// over everything: even if EXPO_PUBLIC_DEV_TOOLS=1 were set by mistake, the App Store build
// never shows "Preview Pro" (a free Pro unlock) or the test settings.
const PRODUCTION = process.env.EXPO_PUBLIC_APP_ENV === 'production';
export const DEV_TOOLS = !PRODUCTION && (__DEV__ || process.env.EXPO_PUBLIC_DEV_TOOLS === '1');
