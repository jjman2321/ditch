// Shared by the screenshot scripts: every device shape and the fit check.

// Every iPhone and iPad shape in points (safe areas from Apple's device specs).
// shoot-v12's default run uses i12, se, max and ipad; `--dev=all` runs the lot.
export const DEVICES = {
  i12: { width: 390, height: 844, top: 47, bot: 34 }, // 12–14, 16e, 17e
  se: { width: 375, height: 667, top: 20, bot: 0 }, // SE 2nd/3rd gen
  max: { width: 430, height: 932, top: 59, bot: 34 }, // 14 Pro Max, 15 Plus/Pro Max, 16 Plus
  ipad: { width: 834, height: 1194, top: 24, bot: 20 }, // iPad Pro 11"
  mini: { width: 375, height: 812, top: 50, bot: 34 }, // 12/13 mini (375 pt wide in the app), 11 Pro, XS
  i16: { width: 393, height: 852, top: 59, bot: 34 }, // 14 Pro, 15, 16
  i17: { width: 402, height: 874, top: 62, bot: 34 }, // 16 Pro, 17, 17 Pro, 18 Pro
  xr: { width: 414, height: 896, top: 48, bot: 34 }, // 11, XR, 11 Pro Max
  air: { width: 420, height: 912, top: 68, bot: 34 }, // iPhone Air
  pm12: { width: 428, height: 926, top: 47, bot: 34 }, // 12/13 Pro Max, 14 Plus
  pm17: { width: 440, height: 956, top: 62, bot: 34 }, // 16/17/18 Pro Max
  duo: { width: 466, height: 678, top: 47, bot: 20 }, // iPhone Duo, folded (outer screen)
  duoOpen: { width: 626, height: 890, top: 32, bot: 20 }, // iPhone Duo, open (inner screen)
  ipadMini: { width: 744, height: 1133, top: 24, bot: 20 }, // iPad mini
  ipadAir: { width: 820, height: 1180, top: 24, bot: 20 }, // iPad 10th gen, Air 11"
  ipad13: { width: 1024, height: 1366, top: 24, bot: 20 }, // iPad Pro 13", Air 13"
  ipadLand: { width: 1194, height: 834, top: 24, bot: 20 }, // iPad Pro 11" landscape
  ipadSplit: { width: 507, height: 1194, top: 24, bot: 20 }, // iPad half-screen Split View
  ipadSlide: { width: 320, height: 1194, top: 24, bot: 20 }, // iPad Slide Over / narrowest window
};

/**
 * Text that's cut off, past the 24pt side edges, under the status bar or the
 * home indicator, or a lone last word on a line. Text that's scrolled out of
 * view or covered by a pinned footer is skipped (it isn't on screen).
 */
export async function audit(page, dev) {
  return page.evaluate(({ dev }) => {
    const issues = [];
    const W = window.innerWidth;
    const H = window.innerHeight;
    const scrollers = [...document.querySelectorAll('div')].filter((el) => {
      const cs = getComputedStyle(el);
      return (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 300;
    });
    const overflow = scrollers.map((el) => el.scrollHeight - el.clientHeight);
    /** The part of a rect that its clipping ancestors let through. */
    const visible = (el, r) => {
      let { left, right, top, bottom } = r;
      for (let a = el.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
          const c = a.getBoundingClientRect();
          left = Math.max(left, c.left); right = Math.min(right, c.right); top = Math.max(top, c.top); bottom = Math.min(bottom, c.bottom);
        }
      }
      return right - left > 1 && bottom - top > 1 ? { left, right, top, bottom } : null;
    };
    const covered = (el, r) => {
      const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
      if (x < 0 || y < 0 || x > W || y > H) return true;
      const hit = document.elementFromPoint(x, y);
      return hit && hit !== el && !el.contains(hit) && !hit.contains(el);
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      let hidden = false;
      for (let a = el; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') hidden = true;
      }
      if (hidden) continue;
      const big = parseFloat(getComputedStyle(el).fontSize) >= 60;
      // Chips in a sideways scroller run off the edge on purpose.
      let sideways = false;
      for (let a = el.parentElement; a; a = a.parentElement) if (['auto', 'scroll'].includes(getComputedStyle(a).overflowX) && a.scrollWidth > a.clientWidth + 1) sideways = true;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const raw of range.getClientRects()) {
        const r = visible(el, raw);
        if (!r || covered(el, r)) continue;
        // The hero number sits 4pt into the edge on purpose (optical alignment).
        if (r.left < 23.5 && W < 600 && !(big && r.left > 18)) issues.push(`edge-left ${Math.round(r.left)}: ${text.slice(0, 30)}`);
        if (r.right > W - 23.5 && W < 600 && !sideways) issues.push(`edge-right ${Math.round(W - r.right)}: ${text.slice(0, 30)}`);
        if (r.top < dev.top - 1) issues.push(`under status bar: ${text.slice(0, 30)}`);
        if (dev.bot && r.bottom > H - dev.bot + 1) issues.push(`under home indicator: ${text.slice(0, 30)}`);
      }
      const cs = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && (cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis')) issues.push(`clipped: ${text.slice(0, 30)}`);
      // A lone last word: group each word by its line.
      const words = [...node.textContent.matchAll(/\S+/g)];
      if (words.length > 2) {
        const tops = words.map((m) => {
          const wr = document.createRange();
          wr.setStart(node, m.index);
          wr.setEnd(node, m.index + m[0].length);
          return Math.round(wr.getBoundingClientRect().top);
        });
        const lines = [...new Set(tops)];
        if (lines.length > 1 && tops.filter((t) => t === lines[lines.length - 1]).length === 1 && !node.textContent.includes('\n')) issues.push(`lone last word: …${words[words.length - 1][0]}`);
      }
    }
    return { issues: [...new Set(issues)], overflow };
  }, { dev });
}
