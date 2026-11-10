// Test-build switches. On in development (Expo Go) and in builds made with
// EXPO_PUBLIC_DEV_TOOLS=1 (set it on an EAS "preview" profile only).
// Never on in the App Store build.

export const DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_DEV_TOOLS === '1';
