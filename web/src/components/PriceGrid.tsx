"use client";

import { useState } from "react";

import { useCountry } from "./tools/ToolBits";

export type GridCol = { id: string; name: string; cy: string };
export type GridRow = {
  country: string;
  name: string;
  slug: string;
  note: string;
  cells: (string | null)[];
  low: number;
  lowBy: Record<string, number>;
};

const CY_LABEL: Record<string, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  quarterly: "3 months",
  weekly: "Weekly",
};
const CY_ORDER = ["weekly", "monthly", "quarterly", "yearly"];
const CY_SHORT: Record<string, string> = {
  monthly: "a month",
  yearly: "a year",
  quarterly: "every 3 months",
  weekly: "a week",
};

/**
 * Price by country as one table (owner, Nov 14: the list and the cards both read badly).
 * Countries are rows, plans are columns, like the compare tables on Craft, Tailscale and Replit (Mobbin).
 * Every price is in the HTML. The cycle switch only hides columns, and only shows when a service sells
 * more than one billing cycle and has too many plans to fit. The visitor's own country is marked.
 */
export function PriceGrid({
  service,
  cols,
  rows,
}: {
  service: string;
  cols: GridCol[];
  rows: GridRow[];
}) {
  const you = useCountry();
  const cycles = [...new Set(cols.map((c) => c.cy))].sort(
    (a, b) => CY_ORDER.indexOf(a) - CY_ORDER.indexOf(b),
  );
  const split = cycles.length > 1 && cols.length > 5;
  const [cy, setCy] = useState<string>(split ? cycles[0] : "all");
  const showCy = (c: string) => cy === "all" || c === cy;
  const shown = cols.filter((c) => showCy(c.cy));

  return (
    <div className="cgrid">
      {split ? (
        <div className="pg-cy" role="group" aria-label="Billing cycle">
          {[...cycles, "all"].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cy === c}
              onClick={() => setCy(c)}
            >
              {c === "all" ? "All" : (CY_LABEL[c] ?? c)}
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="pg-scroll"
        role="region"
        aria-label={`${service} prices by country`}
        tabIndex={0}
      >
        <table
          className="pg-t"
          style={{ "--cols": shown.length } as React.CSSProperties}
        >
          <caption className="sr">
            {service} prices by country. Each row is one country in its own
            currency. The cheapest plan in each country is marked.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="pg-c">
                Country
              </th>
              {cols.map((c) => (
                <th scope="col" key={c.id} hidden={!showCy(c.cy)}>
                  <span className="pg-pn">{c.name}</span>
                  {(split && cy !== "all") ||
                  c.name.toLowerCase() ===
                    (CY_LABEL[c.cy] ?? "").toLowerCase() ? null : (
                    <small>{CY_LABEL[c.cy] ?? c.cy}</small>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.country}
                id={r.slug}
                className={r.country === you ? "you" : undefined}
              >
                <th scope="row" className="pg-c">
                  <span className="pg-cn">
                    {r.name}
                    {r.country === you ? <em>You</em> : null}
                  </span>
                  <small>{r.note}</small>
                </th>
                {r.cells.map((v, i) => {
                  const low = cy === "all" ? r.low : r.lowBy[cy];
                  return (
                    <td
                      key={cols[i].id}
                      hidden={!showCy(cols[i].cy)}
                      className={i === low ? "low" : undefined}
                    >
                      {v ? (
                        <>
                          <span className="num">{v}</span>
                          {i === low ? (
                            <span className="sr"> (cheapest here)</span>
                          ) : null}
                          <span className="sr"> {CY_SHORT[cols[i].cy]}</span>
                        </>
                      ) : (
                        <span className="pg-na" aria-label="Not listed">
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pg-key">
        <i aria-hidden />{" "}
        {split && cy !== "all"
          ? `Cheapest ${({ monthly: "monthly", quarterly: "3-month", yearly: "yearly", weekly: "weekly" } as Record<string, string>)[cy] ?? cy} plan in that country`
          : "Cheapest plan in that country, counted per month"}
        <span> · – not sold there, or not on the page we checked</span>
        {shown.length > 3 ? (
          <span className="pg-swipe"> · Swipe the table for more plans</span>
        ) : null}
      </p>
    </div>
  );
}
