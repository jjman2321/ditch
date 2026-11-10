import { releaseSlot, requestSlot, resetSlot } from '../modalSlot';

// iOS freezes if a new pop-up opens while the last one is still closing.
// The slot makes the next sheet wait until the screen is free.
describe('one sheet on screen at a time', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetSlot();
  });
  afterEach(() => jest.useRealTimers());

  it('opens straight away when nothing else is open', () => {
    const open = jest.fn();
    requestSlot(open);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('waits for the closing sheet, then opens', () => {
    const plan = jest.fn();
    const price = jest.fn();
    requestSlot(plan);
    requestSlot(price); // "Enter my own price" while the plan sheet closes
    expect(price).not.toHaveBeenCalled();
    releaseSlot(); // plan sheet finished closing
    expect(price).not.toHaveBeenCalled(); // iOS needs a beat first
    jest.advanceTimersByTime(60);
    expect(price).toHaveBeenCalledTimes(1);
  });

  it('skips a sheet that was cancelled while waiting', () => {
    const a = jest.fn();
    const b = jest.fn();
    const c = jest.fn();
    requestSlot(a);
    const cancelB = requestSlot(b);
    requestSlot(c);
    cancelB();
    releaseSlot();
    jest.advanceTimersByTime(60);
    expect(b).not.toHaveBeenCalled();
    expect(c).toHaveBeenCalledTimes(1);
  });

  it('frees the screen once the last sheet closes', () => {
    requestSlot(jest.fn());
    releaseSlot();
    jest.advanceTimersByTime(60);
    const next = jest.fn();
    requestSlot(next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
