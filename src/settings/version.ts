import * as Application from 'expo-application';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Updates from 'expo-updates';

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

/**
 * Which JavaScript the phone is running (Nov 19: an update that failed to start rolled back silently
 * and nobody could tell). "Built in" = the code inside the build itself; otherwise the over-the-air
 * update's publish time, e.g. "Update Nov 19, 11:56 PM".
 */
export function updateLabel(): string {
  try {
    if (!Updates.isEnabled || Updates.isEmbeddedLaunch || !Updates.createdAt) return 'Built in';
    const d = Updates.createdAt;
    const month = d.toLocaleString('en-US', { month: 'short' });
    const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `Update ${month} ${d.getDate()}, ${time}`;
  } catch {
    return 'Built in';
  }
}
