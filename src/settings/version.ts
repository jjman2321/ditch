import * as Application from 'expo-application';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// The installed app's own version and build (set by EAS at build time), so support
// can tell builds apart. Expo Go and the web preview fall back to app.json.
// In Expo Go the native values are Expo Go's own, so use app.json there.
const expoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const version = (!expoGo && Application.nativeApplicationVersion) || Constants.expoConfig?.version || '1.0.0';
const build = (!expoGo && Application.nativeBuildVersion) || Constants.expoConfig?.ios?.buildNumber || '1';

/** "1.0.0 (12)" */
export const APP_VERSION = `${version} (${build})`;
/** "1.0 (12)" */
export const SHORT_VERSION = APP_VERSION.replace(/^(\d+\.\d+)\.0 /, '$1 ');
/** "1.0.0": the rating prompt is offered at most once per version. */
export const MARKETING_VERSION = version;
