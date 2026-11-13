'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

import { CYCLE_WORD, formatMoney, monthlyMinor, yearlyMinor } from '@/lib/money';
import type { Pt } from '@/lib/tools';

import { CountrySelect, Loading, useCountry, usePoints } from './ToolBits';

type C = { code: string; name: string }[];
const base = (n: string) => n.replace(/\s*\((yearly|annual|monthly|year|month)\)\s*/gi, ' ').replace(/\b(yearly|annual|monthly)\b/gi, '').replace(/\s+/g, ' ').trim().toLowerCase();

function useCountryPick(countries: C, ok: (c: string) => boolean) {
  const guessed = useCountry();
  const [country, setCountry] = useState<string | null>(null);
  const want = country ?? guessed;
  const c = ok(want) ? want : countries.find((x) => ok(x.code))?.code ?? 'US';
  return [c, setCountry] as const;
}
function ServiceSelect({ value, onChange, list, label = 'Subscription' }: { value: string; onChange: (v: string) => void; list: { s: string; n: string }[]; label?: string }) {
  return (
    <label className="f">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {list.map((x) => (
          <option key={x.s} value={x.s}>
            {x.n}
          </option>
        ))}
      </select>
    </label>
  );
}
const services = (pts: Pt[]) => [...new Map(pts.map((p) => [p.s, { s: p.s, n: p.n }])).values()].sort((a, b) => a.n.localeCompare(b.n));
const prefer = (list: { s: string }[], ids: string[]) => ids.map((id) => list.find((x) => x.s === id)).find(Boolean)?.s ?? list[0]?.s;
const money = (a: number, p: { cur: string; c: string }) => formatMoney(a, p.cur, { country: p.c });

/* ---------- Monthly vs yearly ---------- */
export function MonthlyYearly({ countries, only }: { countries: C; only?: string }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <MonthlyYearlyInner points={loaded} countries={countries} only={only} />;
}

function MonthlyYearlyInner({ points, countries, only }: { points: Pt[]; countries: C; only?: string }) {
  const pairs = (c: string, s: string) => {
    const ps = points.filter((p) => p.c === c && p.s === s);
    return ps.filter((y) => y.cy === 'yearly').map((y) => ({ y, m: ps.find((m) => m.cy === 'monthly' && base(m.p) === base(y.p)) ?? (ps.filter((m) => m.cy === 'monthly').length === 1 && ps.filter((x) => x.cy === 'yearly').length === 1 ? ps.find((m) => m.cy === 'monthly') : undefined) })).filter((x) => x.m);
  };
  const okSvc = (c: string) => services(points.filter((p) => p.c === c && (!only || p.s === only))).filter((x) => pairs(c, x.s).length);
  const [c, setC] = useCountryPick(countries, (code) => okSvc(code).length > 0);
  const list = okSvc(c);
  const [svc, setSvc] = useState<string | null>(null);
  const s = list.some((x) => x.s === svc) ? svc! : prefer(list, ['amazon-prime', 'microsoft-365', 'youtube-premium', 'spotify']);
  const ps = s ? pairs(c, s) : [];
  return (
    <div>
      <div className="ins">
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries.filter((x) => okSvc(x.code).length)} />
        {only ? null : <ServiceSelect value={s ?? ''} onChange={setSvc} list={list} />}
      </div>
      </div>
      <div className="result" aria-live="polite">
        {ps.map(({ y, m }) => {
          const twelve = m!.a * 12;
          const diff = twelve - y.a;
          const months = diff / m!.a;
          return (
            <div key={y.p} style={{ marginBottom: 20 }}>
              <div className="cards2">
                <div className={diff < 0 ? 'win' : ''}>
                  <b>Monthly · {m!.p}</b>
                  <p className="v num">{money(twelve, y)}</p>
                  <small>{money(m!.a, y)} × 12</small>
                </div>
                <div className={diff > 0 ? 'win' : ''}>
                  <b>Yearly · {y.p}</b>
                  <p className="v num">{money(y.a, y)}</p>
                  <small>about {money(Math.round(y.a / 12), y)} a month</small>
                </div>
              </div>
              <p className="say">
                {diff > 0 ? (
                  <>Yearly costs <b>{money(diff, y)} less</b> than 12 months of monthly. That’s about {months >= 1 ? `${months.toFixed(1).replace('.0', '')} months free` : `${Math.round((diff / twelve) * 100)}% less`}.</>
                ) : diff < 0 ? (
                  <>Monthly is {money(-diff, y)} less over 12 months.</>
                ) : (
                  <>Same price over a year.</>
                )}
              </p>
            </div>
          );
        })}
        <p className="note-l">Yearly makes sense if you’re sure you’ll keep it all year. Monthly is easier to stop.</p>
      </div>
    </div>
  );
}

/* ---------- Family plan split ---------- */
export function FamilySplit({ countries, only, all }: { countries: C; only?: string; all?: boolean }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <FamilySplitInner points={loaded} countries={countries} only={only} all={all} />;
}

function FamilySplitInner({ points, countries, only, all }: { points: Pt[]; countries: C; only?: string; all?: boolean }) {
  const fam = (p: Pt) => (all ? !/student/i.test(p.p) : /family|duo/i.test(p.p));
  const okSvc = (c: string) => services(points.filter((p) => p.c === c && fam(p) && (!only || p.s === only)));
  const [c, setC] = useCountryPick(countries, (code) => okSvc(code).length > 0);
  const list = okSvc(c);
  const [svc, setSvc] = useState<string | null>(null);
  const s = list.some((x) => x.s === svc) ? svc! : prefer(list, ['spotify', 'youtube-premium', 'apple-music']);
  const plans = points.filter((p) => p.c === c && p.s === s && fam(p)).sort((x, y) => Number(/duo/i.test(x.p)) - Number(/duo/i.test(y.p)) || Number(x.cy !== 'monthly') - Number(y.cy !== 'monthly') || y.a - x.a);
  const [planName, setPlan] = useState<string | null>(null);
  const plan = plans.find((p) => p.p === planName) ?? plans.find((p) => /family|premium/i.test(p.p) && !/duo/i.test(p.p)) ?? plans[0];
  const soloAll = all ? [] : points.filter((p) => p.c === c && p.s === s && !fam(p) && !/student/i.test(p.p) && p.cy === plan?.cy);
  // The one-person plan people would buy instead: Individual / Personal first, else the usual plan, else the dearest (Spotify's Individual).
  const solo = soloAll.find((p) => /individual|personal/i.test(p.p)) ?? soloAll.find((p) => p.d) ?? [...soloAll].sort((a, b) => b.a - a.a)[0];
  const maxPeople = plan && /duo/i.test(plan.p) ? 2 : 6;
  const [people, setPeople] = useState(4);
  const n = Math.min(people, maxPeople);
  const each = plan ? Math.round(plan.a / n) : 0;
  const per = plan?.cy === 'monthly' ? 'a month' : plan?.cy === 'yearly' ? 'a year' : CYCLE_WORD[plan?.cy ?? 'monthly'];
  // Exact maths, rounded once for display (CLAUDE.md money rule): a year each comes from the unrounded share.
  const yearEach = plan ? Math.round(yearlyMinor(plan.a, plan.cy) / n) : 0;
  const lessMonth = solo ? solo.a - plan!.a / n : 0;
  return (
    <div>
      <div className="ins">
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries.filter((x) => okSvc(x.code).length)} />
        {only ? null : <ServiceSelect value={s ?? ''} onChange={(v) => { setSvc(v); setPlan(null); }} list={list} />}
      </div>
      {plans.length > 1 && plans.length <= 3 ? (
        <div className="f">
          <span className="lbl">Plan</span>
          <div className={`seg fill${plans.length > 2 || plans.some((p) => p.p.length > 14) ? ' col' : ''}`} role="group" aria-label="Plan">
            {plans.map((p) => (
              <button key={p.p} type="button" aria-pressed={p.p === plan?.p} onClick={() => setPlan(p.p)}>
                {p.p.replace(/^premium\s+/i, '')} · {money(p.a, p)}
              </button>
            ))}
          </div>
        </div>
      ) : plans.length > 3 ? (
        <div className="row">
          <label className="f">
            Plan
            <select value={plan?.p} onChange={(e) => setPlan(e.target.value)}>
              {plans.map((p) => (
                <option key={p.p} value={p.p}>
                  {p.p} · {money(p.a, p)} {CYCLE_WORD[p.cy]}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
      <div className="f">
        <span className="lbl" id="people-l">People sharing</span>
        <div className="stepper" role="group" aria-labelledby="people-l">
          <button type="button" onClick={() => setPeople(Math.max(2, n - 1))} disabled={n <= 2} aria-label="One person fewer">−</button>
          <output>{n} people</output>
          <button type="button" onClick={() => setPeople(Math.min(maxPeople, n + 1))} disabled={n >= maxPeople} aria-label="One more person">+</button>
        </div>
      </div>
      </div>
      {plan ? (
        <div className="result" aria-live="polite">
          <p className="k">Each person pays</p>
          <p className="big num">
            {money(each, plan)} <span className="unit">{per}</span>
          </p>
          <p className="muted">
            {plan.cy === 'monthly' ? `${money(yearEach, plan)} a year each · ` : ''}
            {plan.n} {plan.p} is {money(plan.a, plan)} {per}
          </p>
          {solo && solo.a > each ? (
            <>
              <div className="bars" aria-hidden>
                <div><span>On their own</span><i style={{ width: '100%' }} /><b className="num">{money(solo.a, solo)}</b></div>
                <div><span>Shared</span><i className="s" style={{ width: `${Math.max(8, Math.round((each / solo.a) * 100))}%` }} /><b className="num">{money(each, plan)}</b></div>
              </div>
              <p className="say">
                <b>{money(Math.round(lessMonth), plan)} less</b> each {plan.cy === 'monthly' ? 'month' : 'year'} than {solo.p} on your own{plan.cy === 'monthly' ? `, or ${money(Math.round(lessMonth * 12), plan)} a year` : ''}.
              </p>
            </>
          ) : null}
          <p className="note-l">{all ? `${plan.n} accounts are for one household.` : 'Family plans usually need everyone at the same address.'} Check {plan.n}’s own rules.</p>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Compare two services ---------- */
export function Compare({ countries, first, second, fixed }: { countries: C; first?: string; second?: string; fixed?: boolean }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <CompareInner points={loaded} countries={countries} first={first} second={second} fixed={fixed} />;
}

function CompareInner({ points, countries, first = 'netflix', second = 'disney-plus', fixed = false }: { points: Pt[]; countries: C; first?: string; second?: string; fixed?: boolean }) {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const has = (code: string, sv: string) => points.some((p) => p.c === code && p.s === sv);
  const okC = (code: string) => fixed ? has(code, first) && has(code, second) : points.some((p) => p.c === code);
  const [c, setC] = useCountryPick(countries, okC);
  const list = services(points.filter((p) => p.c === c));
  const [yr, setYr] = useState(false);
  const A = list.some((x) => x.s === a) ? a! : list.find((x) => x.s === first)?.s ?? list[0]?.s;
  const B = list.some((x) => x.s === b) ? b! : list.find((x) => x.s === second && x.s !== A)?.s ?? list.find((x) => x.s !== A)?.s;
  const col = (sv?: string) => points.filter((p) => p.c === c && p.s === sv && !/student|bundle/i.test(p.p));
  const mo = (p: Pt) => monthlyMinor(p.a, p.cy);
  const rowsOf = (ps: Pt[]) => {
    const byMo = [...ps].sort((x, y) => mo(x) - mo(y));
    const monthly = byMo.filter((p) => p.cy === 'monthly');
    return {
      cheap: byMo[0],
      usual: ps.find((p) => p.d) ?? monthly[Math.floor((monthly.length - 1) / 2)] ?? byMo[0],
      yearly: byMo.find((p) => p.cy === 'yearly'),
    };
  };
  const ra = rowsOf(col(A));
  const rb = rowsOf(col(B));
  const same = ra.cheap && rb.cheap && ra.cheap.cur === rb.cheap.cur;
  const show = (p?: Pt) => (p ? (yr ? yearlyMinor(p.a, p.cy) : Math.round(mo(p))) : undefined);
  const ROWS: { key: 'cheap' | 'usual' | 'yearly'; label: string; none: string }[] = [
    { key: 'cheap', label: 'Cheapest plan', none: 'Not checked' },
    { key: 'usual', label: 'The usual plan', none: 'Not checked' },
    { key: 'yearly', label: 'Pay once a year', none: 'No yearly plan' },
  ];
  const name = (sv?: string) => list.find((x) => x.s === sv)?.n ?? '';
  const cell = (p: Pt | undefined, other: Pt | undefined, none: string, judge = true) => {
    if (!p) return <td className="v no">{none}</td>;
    const v = show(p)!, o = show(other);
    const win = judge && same && o !== undefined && v < o;
    return (
      <td className={`v${win ? ' win' : ''}`}>
        <b className="num">{money(v, p)}</b> <span className="per">{yr ? '/yr' : '/mo'}</span>
        {win ? <span className="sr"> (less)</span> : null}
        <small>
          {p.p}
          {p.cy === 'yearly' && !yr ? ` · billed ${money(p.a, p)} a year` : p.cy === 'monthly' && yr ? ` · ${money(p.a, p)} a month` : ''}
        </small>
      </td>
    );
  };
  const hasLogo = (sv?: string) => points.find((p) => p.s === sv)?.l;
  return (
    <div>
      <div className="ins">
      <div className="row bar">
        <CountrySelect value={c} onChange={setC} countries={countries.filter((x) => okC(x.code))} />
        {fixed ? null : (
          <>
            <ServiceSelect value={A ?? ''} onChange={setA} list={list} label="First" />
            <ServiceSelect value={B ?? ''} onChange={setB} list={list.filter((x) => x.s !== A)} label="Second" />
          </>
        )}
        <div className="f">
          <span className="lbl">Show prices</span>
          <div className="seg fill" role="group" aria-label="Show prices">
            <button type="button" aria-pressed={!yr} onClick={() => setYr(false)}>A month</button>
            <button type="button" aria-pressed={yr} onClick={() => setYr(true)}>A year</button>
          </div>
        </div>
      </div>
      </div>
      <div className="result vs" aria-live="polite">
        <table className="vst">
          <caption className="sr">{name(A)} and {name(B)} prices in {countries.find((x) => x.code === c)?.name}, {yr ? 'a year' : 'a month'}</caption>
          <thead>
            <tr>
              <td />
              {[A, B].map((sv, i) => (
                <th key={i} scope="col">
                  {hasLogo(sv) ? <img className="logo" src={`/logos/${sv}.png`} alt="" width={44} height={44} /> : null}
                  <span>{name(sv)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                {cell(ra[r.key], rb[r.key], r.none)}
                {cell(rb[r.key], ra[r.key], r.none)}
              </tr>
            ))}
          </tbody>
        </table>
        {same && ra.cheap && rb.cheap ? (
          <p className="say">
            Cheapest way in: <b>{name(A)} {money(Math.round(mo(ra.cheap)), ra.cheap)}</b> or <b>{name(B)} {money(Math.round(mo(rb.cheap)), rb.cheap)}</b> a month.{' '}
            {ra.yearly || rb.yearly ? 'Yearly plans are shown as a month so you can compare.' : ''}
          </p>
        ) : null}
        <p className="note-l">Student plans and bundles aren’t included. Prices are from each company’s own page.</p>
      </div>
    </div>
  );
}

/* ---------- Cost per hour ---------- */
export function CostPerHour({ countries }: { countries: C }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <CostPerHourInner points={loaded} countries={countries} />;
}

function CostPerHourInner({ points, countries }: { points: Pt[]; countries: C }) {
  const [c, setC] = useCountryPick(countries, () => true);
  const list = services(points.filter((p) => p.c === c));
  const [svc, setSvc] = useState<string | null>(null);
  const s = list.some((x) => x.s === svc) ? svc! : list.find((x) => x.s === 'netflix')?.s ?? list[0]?.s;
  const plans = points.filter((p) => p.c === c && p.s === s);
  const [planName, setPlan] = useState<string | null>(null);
  const plan = plans.find((p) => p.p === planName) ?? plans.find((p) => p.d) ?? plans[0];
  const [hours, setHours] = useState('5');
  const h = parseFloat(hours);
  const perMonth = plan ? monthlyMinor(plan.a, plan.cy) : 0;
  const hoursMonth = (h * 52) / 12;
  const perHour = h > 0 ? perMonth / hoursMonth : NaN;
  return (
    <div>
      <div className="ins">
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries} />
        <ServiceSelect value={s ?? ''} onChange={(v) => { setSvc(v); setPlan(null); }} list={list} />
      </div>
      <div className="row">
        <label className="f">
          Plan
          <select value={plan?.p} onChange={(e) => setPlan(e.target.value)}>
            {plans.map((p) => (
              <option key={p.p} value={p.p}>
                {p.p} · {money(p.a, p)} {CYCLE_WORD[p.cy]}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          Hours you use it a week
          <input type="number" inputMode="decimal" min={0} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} />
        </label>
      </div>
      </div>
      {plan ? (
        <div className="result" aria-live="polite">
          {Number.isFinite(perHour) ? (
            <>
              <p className="muted">
                {plan.n} {plan.p} at {h} hours a week costs
              </p>
              <p className="big num">
                {formatMoney(Math.round(perHour), plan.cur, { country: c })} <span style={{ fontSize: '.45em', letterSpacing: 0 }}>an hour</span>
              </p>
              <p className="say">
                That’s {money(Math.round(perMonth), plan)} a month for about {hoursMonth < 10 ? hoursMonth.toFixed(1).replace('.0', '') : Math.round(hoursMonth)} hours.
              </p>
            </>
          ) : (
            <p className="say">{hours.trim() === '' || h < 0 ? 'Type how many hours a week you use it.' : `Used 0 hours a week, every hour costs the whole ${money(Math.round(perMonth), plan)} a month. Worth a look?`}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Spreadsheet ---------- */
export function Spreadsheet({ countries }: { countries: C }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <SpreadsheetInner points={loaded} countries={countries} />;
}

function SpreadsheetInner({ points, countries }: { points: Pt[]; countries: C }) {
  const [c, setC] = useCountryPick(countries, () => true);
  const list = services(points.filter((p) => p.c === c));
  const [picked, setPicked] = useState<string[]>(['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'icloud']);
  const chosen = list.filter((x) => picked.includes(x.s));
  const rows = chosen.map((x) => {
    const ps = points.filter((p) => p.c === c && p.s === x.s);
    return ps.find((q) => q.d) ?? ps.find((q) => q.cy === 'monthly') ?? ps[0];
  });
  const download = () => {
    const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const head = ['Subscription', 'Plan', 'Price', 'Currency', 'Billed', 'A year', 'Next charge (date)', 'Remind me?', 'How to cancel'];
    const body = rows.map((p) => [p.n, p.p, (p.a / 100).toFixed(2), p.cur, CYCLE_WORD[p.cy], (yearlyMinor(p.a, p.cy) / 100).toFixed(2), '', 'yes', p.g ? `https://ditchsubs.app/cancel/${p.g}` : '']);
    const blank = Array.from({ length: 10 }, () => ['', '', '', rows[0]?.cur ?? '', '', '', '', '', '']);
    const csv = [head, ...body, ...blank].map((r) => r.map(esc).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'subscription-tracker.csv'; a.click(); URL.revokeObjectURL(a.href);
  };
  const toggle = (s: string) => setPicked(picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s]);
  return (
    <div>
      <div className="ins">
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries} />
      </div>
      <p className="f" style={{ marginTop: 16, fontWeight: 700, fontSize: 15 }}>Pick what you pay for</p>
      <div className="seg" role="group" aria-label="Subscriptions" style={{ marginTop: 8 }}>
        {list.map((x) => (
          <button key={x.s} type="button" aria-pressed={picked.includes(x.s)} onClick={() => toggle(x.s)}>
            {x.n}
          </button>
        ))}
      </div>
      </div>
      <div className="result">
        <p className="say">
          <b>{rows.length}</b> filled in, plus 10 empty rows for anything else.
        </p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={download}>
            Download the spreadsheet (.csv)
          </button>
        </div>
        <p className="note-l">Opens in Excel, Numbers and Google Sheets. Made on your device; nothing is sent anywhere.</p>
      </div>
    </div>
  );
}

/* ---------- Disney+ and Hulu bundle (US) ---------- */
export function DisneyBundle() {
  const loaded = usePoints();
  const [ads, setAds] = useState(true);
  if (!loaded) return <Loading />;
  const us = (s: string, re: RegExp) => loaded.find((p) => p.c === 'US' && p.s === s && p.cy === 'monthly' && re.test(p.p));
  const d = us('disney-plus', ads ? /with ads/i : /premium \(no ads\)/i);
  const h = us('hulu', ads ? /^hulu \(with ads\)$/i : /premium \(no ads\)/i);
  const b = us('disney-plus', ads ? /bundle \(with ads\)/i : /bundle premium/i);
  if (!d || !h || !b) return <p className="say">Bundle prices aren’t checked right now.</p>;
  const both = d.a + h.a;
  return (
    <div>
      <div className="ins">
      <div className="seg" role="group" aria-label="Ads">
        <button type="button" aria-pressed={ads} onClick={() => setAds(true)}>With ads</button>
        <button type="button" aria-pressed={!ads} onClick={() => setAds(false)}>No ads</button>
      </div>
      </div>
      <div className="result" aria-live="polite">
        <div className="cards2">
          <div>
            <b>Disney+ and Hulu separately</b>
            <p className="v num">{money(both, d)}<small style={{ display: 'inline', marginLeft: 4 }}>/mo</small></p>
            <small>{money(d.a, d)} + {money(h.a, h)}</small>
          </div>
          <div className="win">
            <b>{b.p}</b>
            <p className="v num">{money(b.a, b)}<small style={{ display: 'inline', marginLeft: 4 }}>/mo</small></p>
            <small>One subscription, both apps</small>
          </div>
        </div>
        <p className="say">The bundle is <b>{money(both - b.a, b)} a month less</b> than both, or {money((both - b.a) * 12, b)} a year. US prices, before tax.</p>
      </div>
    </div>
  );
}
