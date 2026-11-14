'use client';

import { useEffect, useRef, useState } from 'react';

export type StoryStep = { title: string; body: string; screen: React.ReactNode };

/**
 * "Add it, get reminded, ditch it" as a scroll story (owner, Nov 14; after Bevel/Monologue on Mobbin).
 * Laptop: the phone stays put while the three steps scroll past, and its screen cross-fades to match.
 * Phone: plain stacked cards, each with its own picture. All text is in the HTML for search.
 */
export function ScrollStory({ steps }: { steps: StoryStep[] }) {
  const [on, setOn] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="story">
      <ol className="story-steps">
        {steps.map((s, i) => (
          <li key={s.title} data-i={i} ref={(el) => { refs.current[i] = el; }} className={on === i ? 'on' : undefined}>
            <span className="n">{i + 1}</span>
            <h3 className="h3">{s.title}</h3>
            <p>{s.body}</p>
            <div className="story-shot-m">{s.screen}</div>
          </li>
        ))}
      </ol>
      <div className="story-side" aria-hidden>
        <div className="story-phone">
          <div className="story-notch" />
          {steps.map((s, i) => (
            <div key={s.title} className={`story-screen${on === i ? ' on' : ''}`}>
              {s.screen}
            </div>
          ))}
          <div className="story-dots">
            {steps.map((s, i) => (
              <i key={s.title} className={on === i ? 'on' : undefined} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
