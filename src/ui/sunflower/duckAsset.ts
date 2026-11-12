// The duck art (assets/brand/duck*.png), cut by scripts/brand/cut-duck.py.
// Both files are 600×350 with 36px of air above and beside the head, so
// nothing gets sliced off. The bottom edge is flush: it tucks behind cards.

export const DUCK_LIGHT = require('../../../assets/brand/duck.png');
export const DUCK_DARK = require('../../../assets/brand/duck-dark.png');
/** The home-screen app icon (assets/images/icon.png at 256px), for in-app copies of the icon. */
export const APP_ICON = require('../../../assets/brand/app-icon.png');

export const DUCK_W = 600;
export const DUCK_H = 350;
/** Air around the head, in file pixels. */
export const DUCK_PAD = 36;
/** Share of the file's width the duck itself fills. */
export const DUCK_INK = (DUCK_W - 2 * DUCK_PAD) / DUCK_W;
