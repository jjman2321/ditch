import { beforeEach, describe, expect, it, vi } from 'vitest';

const runs: unknown[][] = [];
let count = 0;
const DB = {
  prepare: (sql: string) => ({
    bind: (...v: unknown[]) => ({
      run: async () => {
        runs.push([sql, ...v]);
        return {};
      },
      first: async <T,>() => ({ n: count }) as T,
    }),
  }),
};
vi.mock('@/lib/env', () => ({ env: async () => ({ DB }) }));

const { POST } = await import('./route');

let ipN = 0;
function post(body: unknown, ip = `203.0.113.${++ipN}`) {
  return POST(new Request('https://ditchsubs.app/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: typeof body === 'string' ? body : JSON.stringify(body) }));
}

beforeEach(() => {
  runs.length = 0;
  count = 0;
});

describe('POST /api/feedback', () => {
  it('saves a valid message and answers {ok:true}', async () => {
    const res = await post({ kind: 'problem', message: '  No reminder for Netflix  ', email: 'Me@Example.com', app_info: 'Free · 3 subs' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(runs).toEqual([['INSERT INTO feedback (kind, message, email, app_info) VALUES (?, ?, ?, ?)', 'problem', 'No reminder for Netflix', 'Me@Example.com', 'Free · 3 subs']]);
  });

  it('email and app info are optional', async () => {
    expect((await post({ kind: 'idea', message: 'Dark widget' })).status).toBe(200);
    expect((await post({ kind: 'service', message: 'Crunchyroll', email: '', app_info: null })).status).toBe(200);
    expect(runs.map((r) => r.slice(3))).toEqual([
      [null, null],
      [null, null],
    ]);
  });

  it('refuses bad input', async () => {
    expect((await post({ kind: 'spam', message: 'hello' })).status).toBe(400);
    expect((await post({ kind: 'idea', message: 'hi' })).status).toBe(400);
    expect((await post({ kind: 'idea', message: 'x'.repeat(4001) })).status).toBe(400);
    expect((await post({ kind: 'idea', message: 'hello', email: 'nope' })).status).toBe(400);
    expect((await post({ kind: 'idea', message: 'hello', app_info: 'a'.repeat(2001) })).status).toBe(400);
    expect((await post('not json')).status).toBe(400);
    expect((await post([1, 2])).status).toBe(400);
    expect(runs).toEqual([]);
  });

  it('refuses bodies over 10 KB', async () => {
    const res = await post({ kind: 'idea', message: 'hello', app_info: 'é'.repeat(6000) });
    expect(res.status).toBe(413);
  });

  it('quietly drops the honeypot', async () => {
    const res = await post({ kind: 'idea', message: 'buy pills', website: 'http://spam.example' });
    expect(await res.json()).toEqual({ ok: true });
    expect(runs).toEqual([]);
  });

  it('allows 10 an hour per address', async () => {
    const ip = '198.51.100.7';
    for (let i = 0; i < 10; i++) expect((await post({ kind: 'idea', message: `idea ${i}` }, ip)).status).toBe(200);
    expect((await post({ kind: 'idea', message: 'one more' }, ip)).status).toBe(429);
    expect((await post({ kind: 'idea', message: 'someone else' })).status).toBe(200);
  });

  it('stops when the whole site has had too many this hour', async () => {
    count = 300;
    expect((await post({ kind: 'idea', message: 'hello' })).status).toBe(429);
    expect(runs).toEqual([]);
  });
});
