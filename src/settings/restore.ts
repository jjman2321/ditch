// What "Restore purchases" says when it finds nothing. One line for Settings, Ditch Pro and the paywall,
// so they never drift apart. The usual cause is a purchase made on another Apple Account.

export const RESTORE_NONE_TITLE = 'Nothing to restore';
export const RESTORE_NONE = 'We couldn’t find a Ditch Pro purchase on this Apple Account.';

// When the App Store can't be reached (no connection, or Apple's sign-in was closed). Same words as the paywall.
export const RESTORE_FAILED_TITLE = 'Couldn’t reach the App Store';
export const RESTORE_FAILED = 'Try again in a moment.';
