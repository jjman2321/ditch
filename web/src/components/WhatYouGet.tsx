import { Logo } from './Logo';

export type Head = { name: string; logo?: string };
export type FactRow = { label: string; a: string; b: string };

/**
 * "What you get", side by side (owner, Nov 15: the AI comparison pages work, make more).
 * Only what each company's own page says; a side the page doesn't mention reads "Not stated", never a guess.
 * A real table in the HTML (good for readers, Google and AI answers). On phones each row stacks:
 * the label on top, the two answers next to each other underneath.
 */
export function WhatYouGet({ title, heads, rows, note }: { title: string; heads: [Head, Head]; rows: FactRow[]; note: string }) {
  const na = (v: string) => !v || /^not stated$/i.test(v.trim());
  return (
    <section className="v4-sec wyg" aria-labelledby="wyg-h">
      <h2 id="wyg-h">{title}</h2>
      <table className="wyg-t">
        <thead>
          <tr>
            <td className="wyg-blank" />
            {heads.map((h) => (
              <th key={h.name} scope="col">
                {h.logo ? <Logo id={h.logo} size={32} /> : null}
                <span>{h.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {[r.a, r.b].map((v, i) => (
                <td key={i} className={na(v) ? 'na' : undefined} data-who={heads[i].name}>
                  {na(v) ? 'Not stated' : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="g-src">{note}</p>
    </section>
  );
}
