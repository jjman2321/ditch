'use client';

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
export function MonthlyYearly({ countries }: { countries: C }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <MonthlyYearlyInner points={loaded} countries={countries} />;
}

function MonthlyYearlyInner({ points, countries }: { points: Pt[]; countries: C }) {
  const pairs = (c: string, s: string) => {
    const ps = points.filter((p) => p.c === c && p.s === s);
    return ps.filter((y) => y.cy === 'yearly').map((y) => ({ y, m: ps.find((m) => m.cy === 'monthly' && base(m.p) === base(y.p)) ?? (ps.filter((m) => m.cy === 'monthly').length === 1 ? ps.find((m) => m.cy === 'monthly') : undefined) })).filter((x) => x.m);
  };
  const okSvc = (c: string) => services(points.filter((p) => p.c === c)).filter((x) => pairs(c, x.s).length);
  const [c, setC] = useCountryPick(countries, (code) => okSvc(code).length > 0);
  const list = okSvc(c);
  const [svc, setSvc] = useState<string | null>(null);
  const s = list.some((x) => x.s === svc) ? svc! : prefer(list, ['amazon-prime', 'microsoft-365', 'youtube-premium', 'spotify']);
  const ps = s ? pairs(c, s) : [];
  return (
    <div>
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries.filter((x) => okSvc(x.code).length)} />
        <ServiceSelect value={s ?? ''} onChange={setSvc} list={list} />
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
export function FamilySplit({ countries }: { countries: C }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <FamilySplitInner points={loaded} countries={countries} />;
}

function FamilySplitInner({ points, countries }: { points: Pt[]; countries: C }) {
  const fam = (p: Pt) => /family|duo/i.test(p.p);
  const okSvc = (c: string) => services(points.filter((p) => p.c === c && fam(p)));
  const [c, setC] = useCountryPick(countries, (code) => okSvc(code).length > 0);
  const list = okSvc(c);
  const [svc, setSvc] = useState<string | null>(null);
  const s = list.some((x) => x.s === svc) ? svc! : prefer(list, ['spotify', 'youtube-premium', 'apple-music']);
  const plans = points.filter((p) => p.c === c && p.s === s && fam(p));
  const [planName, setPlan] = useState<string | null>(null);
  const plan = plans.find((p) => p.p === planName) ?? plans[0];
  const solo = points.filter((p) => p.c === c && p.s === s && !fam(p) && !/student/i.test(p.p) && p.cy === plan?.cy).sort((a, b) => b.a - a.a)[0];
  const maxPeople = plan && /duo/i.test(plan.p) ? 2 : 6;
  const [people, setPeople] = useState(4);
  const n = Math.min(people, maxPeople);
  const each = plan ? Math.round(plan.a / n) : 0;
  return (
    <div>
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries.filter((x) => okSvc(x.code).length)} />
        <ServiceSelect value={s ?? ''} onChange={(v) => { setSvc(v); setPlan(null); }} list={list} />
      </div>
      <div className="row">
        {plans.length > 1 ? (
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
        ) : null}
        <label className="f">
          People sharing
          <select value={n} onChange={(e) => setPeople(parseInt(e.target.value, 10))}>
            {Array.from({ length: maxPeople - 1 }, (_, i) => i + 2).map((k) => (
              <option key={k} value={k}>
                {k} people
              </option>
            ))}
          </select>
        </label>
      </div>
      {plan ? (
        <div className="result" aria-live="polite">
          <p className="muted">
            {plan.n} {plan.p} is {money(plan.a, plan)} {CYCLE_WORD[plan.cy]}. Split {n} ways:
          </p>
          <p className="big num">
            {money(each, plan)} <span style={{ fontSize: '.45em', letterSpacing: 0 }}>each, {CYCLE_WORD[plan.cy]}</span>
          </p>
          {solo ? (
            <p className="say">
              On their own, each person would pay {money(solo.a, solo)} for {solo.p}. Sharing is <b>{money(solo.a - each, plan)} less each {plan.cy === 'monthly' ? 'month' : 'year'}</b>
              {plan.cy === 'monthly' ? `, or ${money((solo.a - each) * 12, plan)} a year` : ''}.
            </p>
          ) : null}
          <p className="note-l">Family plans usually need everyone in the same household. Check {plan.n}’s own rules.</p>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Compare two services ---------- */
export function Compare({ countries }: { countries: C }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <CompareInner points={loaded} countries={countries} />;
}

function CompareInner({ points, countries }: { points: Pt[]; countries: C }) {
  const [c, setC] = useCountryPick(countries, () => true);
  const list = services(points.filter((p) => p.c === c));
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const A = list.some((x) => x.s === a) ? a! : list.find((x) => x.s === 'netflix')?.s ?? list[0]?.s;
  const B = list.some((x) => x.s === b) ? b! : list.find((x) => x.s === 'disney-plus' && x.s !== A)?.s ?? list.find((x) => x.s !== A)?.s;
  const col = (s?: string) => points.filter((p) => p.c === c && p.s === s).sort((x, y) => monthlyMinor(x.a, x.cy) - monthlyMinor(y.a, y.cy));
  const ca = col(A);
  const cb = col(B);
  const cheapest = (ps: Pt[]) => ps[0];
  return (
    <div>
      <div className="row">
        <CountrySelect value={c} onChange={setC} countries={countries} />
      </div>
      <div className="row">
        <ServiceSelect value={A ?? ''} onChange={setA} list={list} label="First" />
        <ServiceSelect value={B ?? ''} onChange={setB} list={list} label="Second" />
      </div>
      <div className="result" aria-live="polite">
        <div className="cards2">
          {[ca, cb].map((ps, i) => (
            <div key={i}>
              <b>{ps[0]?.n}</b>
              {ps.map((p) => (
                <p key={p.p} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8, fontSize: 15 }}>
                  <span>{p.p}</span>
                  <b className="num" style={{ display: 'inline' }}>
                    {money(p.a, p)}
                    <span style={{ fontWeight: 400, color: 'var(--mute)' }}>{p.cy === 'monthly' ? '/mo' : p.cy === 'yearly' ? '/yr' : ''}</span>
                  </b>
                </p>
              ))}
              {ps[0] ? <small>A year on the cheapest plan: {money(yearlyMinor(ps[0].a, ps[0].cy), ps[0])}</small> : null}
            </div>
          ))}
        </div>
        {cheapest(ca) && cheapest(cb) && ca[0].cur === cb[0].cur ? (
          <p className="say">
            Cheapest way in: <b>{ca[0].n} {money(monthlyMinor(ca[0].a, ca[0].cy), ca[0])}</b> vs <b>{cb[0].n} {money(monthlyMinor(cb[0].a, cb[0].cy), cb[0])}</b> a month.
          </p>
        ) : null}
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
                That’s {money(Math.round(perMonth), plan)} a month for about {Math.round(hoursMonth)} hours.
              </p>
            </>
          ) : (
            <p className="say">Used 0 hours a week, every hour costs the whole {money(Math.round(perMonth), plan)} a month. Worth a look?</p>
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
