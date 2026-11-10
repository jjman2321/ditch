import Constants from 'expo-constants';

/** "1.0.0 (1)" */
export const APP_VERSION = `${Constants.expoConfig?.version ?? '1.0.0'} (${Constants.expoConfig?.ios?.buildNumber ?? '1'})`;
/** "1.0 (1)" */
export const SHORT_VERSION = APP_VERSION.replace(/^(\d+\.\d+)\.0 /, '$1 ');
/** "1.0.0": the rating prompt is offered at most once per version. */
export const MARKETING_VERSION = Constants.expoConfig?.version ?? '1.0.0';
