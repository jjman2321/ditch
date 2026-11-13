'use client';

import { useState } from 'react';

import { formatMoney } from '@/lib/money';
import type { Pt } from '@/lib/tools';

import { CountrySelect, Loading, useCountry, usePoints } from './ToolBits';

type Need = { music: boolean; tv: boolean; arcade: boolean; fitness: boolean; news: boolean; storage: '' | '50 GB' | '200 GB' | '2 TB'; family: boolean };
const find = (pts: Pt[], c: string, s: string, p?: string) => pts.find((x) => x.c === c && x.s === s && (!p || x.p === p) && x.cy === 'monthly');

/** Apple One vs paying for each service. Tiers from apple.com/apple-one (checked Nov 13, 2026). */
export function AppleOne({ countries }: { countries: { code: string; name: string }[] }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <AppleOneInner points={loaded} countries={countries} />;
}

function AppleOneInner({ points, countries }: { points: Pt[]; countries: { code: string; name: string }[] }) {
  const guessed = useCountry();
  const [country, setCountry] = useState<string | null>(null);
  const [n, setN] = useState<Need>({ music: true, tv: true, arcade: false, fitness: false, news: false, storage: '200 GB', family: false });
  const have = countries.filter((x) => points.some((p) => p.c === x.code && p.s === 'apple-one'));
  const c = have.some((x) => x.code === (country ?? guessed)) ? (country ?? guessed) : 'US';
  const cur = points.find((p) => p.c === c && p.s === 'apple-one')?.cur ?? 'USD';
  const lines: { label: string; a: number | null }[] = [];
  if (n.music) lines.push({ label: `Apple Music ${n.family ? 'Family' : 'Individual'}`, a: find(points, c, 'apple-music', n.family ? 'Family' : 'Individual')?.a ?? null });
  if (n.tv) lines.push({ label: 'Apple TV', a: find(points, c, 'apple-tv')?.a ?? null });
  if (n.arcade) lines.push({ label: 'Apple Arcade', a: find(points, c, 'apple-arcade')?.a ?? null });
  if (n.fitness) lines.push({ label: 'Apple Fitness+', a: find(points, c, 'apple-fitness')?.a ?? null });
  if (n.news) lines.push({ label: 'Apple News+', a: find(points, c, 'apple-news')?.a ?? null });
  if (n.storage) lines.push({ label: `iCloud+ ${n.storage}`, a: find(points, c, 'icloud', n.storage)?.a ?? null });
  const missing = lines.filter((l) => l.a === null).map((l) => l.label);
  const separate = lines.reduce((t, l) => t + (l.a ?? 0), 0);
  const tiers = [
    { id: 'Individual', ok: !n.family && !n.fitness && !n.news && (n.storage === '' || n.storage === '50 GB'), what: 'Music, TV, Arcade, iCloud+ 50 GB. Just you.' },
    { id: 'Family', ok: !n.fitness && !n.news && n.storage !== '2 TB', what: 'Music, TV, Arcade, iCloud+ 200 GB. Share with up to 5 people.' },
    { id: 'Premier', ok: true, what: 'Everything in Family, plus Fitness+, News+ and iCloud+ 2 TB. Share with up to 5 people.' },
  ].map((t) => ({ ...t, a: find(points, c, 'apple-one', t.id)?.a ?? null }));
  const best = tiers.filter((t) => t.ok && t.a !== null).sort((a, b) => a.a! - b.a!)[0];
  const tog = (k: keyof Need) => setN({ ...n, [k]: !n[k] });
  const m = (a: number) => formatMoney(a, cur, { country: c });
  return (
    <div>
      <div className="row">
        <CountrySelect value={c} onChange={setCountry} countries={have} />
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>Who’s it for?</span>
          <div className="seg" role="group" aria-label="Who it is for">
            <button type="button" aria-pressed={!n.family} onClick={() => setN({ ...n, family: false })}>Just me</button>
            <button type="button" aria-pressed={n.family} onClick={() => setN({ ...n, family: true })}>My family</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>What would you pay for anyway?</span>
          <div className="seg" role="group" aria-label="Apple services">
            {(['music', 'tv', 'arcade', 'fitness', 'news'] as const).map((k) => (
              <button key={k} type="button" aria-pressed={n[k]} onClick={() => tog(k)}>
                {{ music: 'Apple Music', tv: 'Apple TV', arcade: 'Apple Arcade', fitness: 'Fitness+', news: 'News+' }[k]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>iCloud+ storage</span>
          <div className="seg" role="group" aria-label="iCloud+ storage">
            {(['', '50 GB', '200 GB', '2 TB'] as const).map((k) => (
              <button key={k || 'none'} type="button" aria-pressed={n.storage === k} onClick={() => setN({ ...n, storage: k })}>
                {k || 'None'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="result" aria-live="polite">
        {!lines.length ? (
          <p className="muted">Pick at least one service.</p>
        ) : (
          <>
            <div className="cards2">
              <div className={best && best.a! >= separate ? 'win' : ''}>
                <b>Pay for each one</b>
                <p className="v num">{m(separate)}<small style={{ display: 'inline', marginLeft: 4 }}>/mo</small></p>
                <small>{lines.map((l) => l.label).join(' + ')}</small>
              </div>
              {best ? (
                <div className={best.a! < separate ? 'win' : ''}>
                  <b>Apple One {best.id}</b>
                  <p className="v num">{m(best.a!)}<small style={{ display: 'inline', marginLeft: 4 }}>/mo</small></p>
                  <small>{best.what}</small>
                </div>
              ) : null}
            </div>
            {best ? (
              <p className="say">
                {best.a! < separate ? (
                  <>Apple One {best.id} is <b>{m(separate - best.a!)} a month less</b>, or {m((separate - best.a!) * 12)} a year.</>
                ) : best.a! === separate ? (
                  <>It’s the same price either way.</>
                ) : (
                  <>Paying for each one is <b>{m(best.a! - separate)} a month less</b> for what you picked.</>
                )}
              </p>
            ) : null}
            {missing.length ? <p className="note-l">Not sold or not checked in this country: {missing.join(', ')}.</p> : null}
            <p className="note-l">Monthly prices from Apple, checked by hand. Apple One plans from apple.com/apple-one.</p>
          </>
        )}
      </div>
    </div>
  );
}
