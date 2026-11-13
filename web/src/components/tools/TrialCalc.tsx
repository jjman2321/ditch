'use client';

import { useState, useSyncExternalStore } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s: string) => new Date(`${s}T00:00:00Z`);
const add = (s: string, n: number) => { const d = parse(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
/** Add months, clamping to the month's last day (Jan 31 + 1 month = Feb 28/29). */
const addMonths = (s: string, n: number) => {
  const d = parse(s); const day = d.getUTCDate();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(day, last)); return iso(t);
};
const pad = (n: number) => String(n).padStart(2, '0');
/** Today on the visitor's own calendar (not UTC), so late-evening visitors get the right day. */
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const noop = () => () => {};
const nice = (s: string) => { const d = parse(s); return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };
/** iCalendar text: escape \\ ; , and new lines (RFC 5545). */
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const LENGTHS = [{ id: '3d', label: '3 days', d: 3 }, { id: '7d', label: '7 days', d: 7 }, { id: '14d', label: '14 days', d: 14 }, { id: '30d', label: '30 days', d: 30 }, { id: '1m', label: '1 month', m: 1 }, { id: '3m', label: '3 months', m: 3 }];

function ics(name: string, ends: string) {
  const ev = (day: string, title: string, uid: string) => ['BEGIN:VEVENT', `UID:${uid}@ditchsubs.app`, `DTSTAMP:${iso(new Date()).replace(/-/g, '')}T000000Z`, `DTSTART;VALUE=DATE:${day.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${add(day, 1).replace(/-/g, '')}`, `SUMMARY:${esc(title)}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'TRIGGER:PT9H', 'END:VALARM', 'END:VEVENT'];
  const label = name.trim() || 'Free trial';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ditch//Free trial//EN', ...ev(add(ends, -3), `${label} trial ends in 3 days`, `t3-${ends}`), ...ev(add(ends, -1), `${label} trial ends tomorrow. Cancel today if you don't want it.`, `t1-${ends}`), 'END:VCALENDAR'];
  return lines.join('\r\n');
}

export function TrialCalc() {
  const today = useSyncExternalStore(noop, localToday, () => '');
  const [picked, setStart] = useState<string | null>(null);
  const start = picked ?? today;
  const [len, setLen] = useState('7d');
  const [custom, setCustom] = useState('');
  const [biller, setBiller] = useState<'apple' | 'other'>('apple');
  const [name, setName] = useState('');
  const L = LENGTHS.find((x) => x.id === len);
  const days = len === 'custom' ? Math.min(366, parseInt(custom, 10)) : undefined;
  const ends = !start ? '' : L?.m ? addMonths(start, L.m) : L?.d ? add(start, L.d) : Number.isFinite(days) && days! > 0 ? add(start, days!) : '';
  const cancelBy = ends ? add(ends, -1) : '';
  const download = () => {
    const blob = new Blob([ics(name, ends)], { type: 'text/calendar' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'free-trial-reminders.ics'; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div>
      <div className="ins">
      <div className="row">
        <label className="f">
          Trial started
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="f">
          What’s the trial for? <small>Optional, for the calendar</small>
          <input type="text" placeholder="e.g. Spotify" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>How long is the trial?</span>
          <div className="seg" role="group" aria-label="Trial length">
            {LENGTHS.map((x) => (
              <button key={x.id} type="button" aria-pressed={len === x.id} onClick={() => setLen(x.id)}>
                {x.label}
              </button>
            ))}
            <button type="button" aria-pressed={len === 'custom'} onClick={() => setLen('custom')}>
              Other
            </button>
          </div>
          {len === 'custom' ? <input type="number" min={1} max={366} placeholder="Number of days" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Trial length in days" style={{ maxWidth: 220, marginTop: 8 }} /> : null}
        </div>
      </div>
      <div className="row">
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>Where did you sign up?</span>
          <div className="seg" role="group" aria-label="Where you signed up">
            <button type="button" aria-pressed={biller === 'apple'} onClick={() => setBiller('apple')}>In an iPhone app (Apple)</button>
            <button type="button" aria-pressed={biller === 'other'} onClick={() => setBiller('other')}>On a website or Android</button>
          </div>
        </div>
      </div>
      </div>
      <div className="result" aria-live="polite">
        {ends ? (
          <>
            <p className="muted">Your trial turns into a charge on</p>
            <p className="big">{nice(ends)}</p>
            <p className="say">
              {biller === 'apple' ? (
                <>Apple says to cancel <b>at least 24 hours before the trial ends</b>, so cancel by <b>{nice(cancelBy)}</b>.</>
              ) : (
                <>To be safe, cancel by <b>{nice(cancelBy)}</b>. Each company sets its own cut-off, so check its terms.</>
              )}
            </p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={download}>
                Add 2 reminders to my calendar
              </button>
            </div>
            <p className="note-l">Adds 3 days before and 1 day before, at 9:00. The file is made on your device.</p>
          </>
        ) : (
          <p className="muted">Pick a start date and a trial length.</p>
        )}
      </div>
    </div>
  );
}
