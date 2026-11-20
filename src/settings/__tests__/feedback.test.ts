import { FEEDBACK_URL, buildFeedback, feedbackEmail, sendFeedback, type FeedbackPayload } from '../feedback';

const base = { kind: 'problem' as const, message: '  Reminder never came  ', email: '', appInfo: 'Reminders on · Free · 3 subs', includeAppInfo: true };

describe('buildFeedback', () => {
  it('trims, drops an empty email, and adds app info only when switched on', () => {
    expect(buildFeedback(base)).toEqual({ ok: true, payload: { kind: 'problem', message: 'Reminder never came', email: null, app_info: 'Reminders on · Free · 3 subs' } });
    const off = buildFeedback({ ...base, includeAppInfo: false });
    expect(off.ok && off.payload.app_info).toBe(null);
  });

  it('needs 3+ characters, at most 4000', () => {
    expect(buildFeedback({ ...base, message: '  hi ' })).toEqual({ ok: false, error: 'short' });
    expect(buildFeedback({ ...base, message: 'hey' }).ok).toBe(true);
    expect(buildFeedback({ ...base, message: 'x'.repeat(4001) })).toEqual({ ok: false, error: 'long' });
  });

  it('checks the email only when one is typed', () => {
    expect(buildFeedback({ ...base, email: 'nope' })).toEqual({ ok: false, error: 'email' });
    const ok = buildFeedback({ ...base, email: ' me@example.com ' });
    expect(ok.ok && ok.payload.email).toBe('me@example.com');
  });

  it('caps app info at 2000 characters', () => {
    const r = buildFeedback({ ...base, appInfo: 'a'.repeat(2500) });
    expect(r.ok && r.payload.app_info?.length).toBe(2000);
  });
});

describe('sendFeedback', () => {
  const payload: FeedbackPayload = { kind: 'idea', message: 'Dark widget', email: null, app_info: null };
  const reply = (status: number, body: unknown) => jest.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body });

  it('posts JSON to the site and is true only on {ok:true}', async () => {
    const f = reply(200, { ok: true });
    await expect(sendFeedback(payload, { fetch: f })).resolves.toBe(true);
    expect(f).toHaveBeenCalledWith(FEEDBACK_URL, expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }));
  });

  it('is false on a server error, a refusal or no connection', async () => {
    await expect(sendFeedback(payload, { fetch: reply(503, { ok: false }) })).resolves.toBe(false);
    await expect(sendFeedback(payload, { fetch: reply(200, { ok: false }) })).resolves.toBe(false);
    await expect(sendFeedback(payload, { fetch: jest.fn().mockRejectedValue(new TypeError('Network request failed')) })).resolves.toBe(false);
  });
});

describe('feedbackEmail (Email us instead)', () => {
  it('keeps what they typed, and the counts line only if they included it', () => {
    expect(feedbackEmail({ kind: 'service', message: 'Crunchyroll Mega Fan', email: null, app_info: null })).toEqual({ subject: 'Please add a subscription to Ditch', body: 'Crunchyroll Mega Fan\n' });
    expect(feedbackEmail({ kind: 'problem', message: 'No reminder', email: null, app_info: '3 subs' }).body).toContain('No reminder\n\n—\n3 subs');
  });
});
