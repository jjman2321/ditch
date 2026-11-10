// One sheet on screen at a time. A sheet asks for the slot before it opens
// and gives it back once it has fully closed; anyone waiting goes next.
// iOS needs a beat after one pop-up goes before it can show another, hence
// the short pause on release.

type Waiter = () => void;

let busy = false;
const queue: Waiter[] = [];
const GAP_MS = 60;

/** Calls `onTurn` when the screen is free. Returns a cancel function. */
export function requestSlot(onTurn: Waiter): () => void {
  if (!busy && queue.length === 0) {
    busy = true;
    onTurn();
    return () => {};
  }
  queue.push(onTurn);
  return () => {
    const i = queue.indexOf(onTurn);
    if (i >= 0) queue.splice(i, 1);
  };
}

export function releaseSlot() {
  setTimeout(() => {
    const next = queue.shift();
    if (next) next();
    else busy = false;
  }, GAP_MS);
}

/** Tests only. */
export function resetSlot() {
  busy = false;
  queue.length = 0;
}
