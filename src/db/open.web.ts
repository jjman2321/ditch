// Web preview only. SQLite on the web needs extra server headers, so the
// preview keeps the same repository contract in memory (saved to
// localStorage). ?seed=demo|pro|off|ditched|empty|overlap loads example data; &pro=1 adds Pro.

import { demoData, type DemoName } from '@/dev/demo';
import { webParam } from '@/dev/webParams';
import { settingsToKv } from '@/domain/settings';
import { today } from '@/services/clock';

import { memoryRepo, type MemorySnapshot, type Repo } from './repo';

const KEY = 'ditch.web.v1';
let repo: Repo | null = null;

function fromStorage(): MemorySnapshot | undefined {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MemorySnapshot) : undefined;
  } catch {
    return undefined;
  }
}

export async function openRepo(): Promise<Repo> {
  if (repo) return repo;
  const seed = webParam('seed') as DemoName | null;
  if (seed) {
    const demo = demoData(seed, today());
    // ?pro=1 turns Pro on for any seed, for screenshots of the Pro version.
    if (webParam('pro') === '1') demo.settings = { ...demo.settings, proPlan: 'yearly' };
    const kv = Object.fromEntries(Object.entries(settingsToKv(demo.settings)).filter((e): e is [string, string] => e[1] !== null));
    repo = memoryRepo({ subs: demo.subs, kv });
  } else {
    repo = memoryRepo(fromStorage(), (snap) => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(snap));
      } catch {
        // Private mode: keep it in memory only.
      }
    });
  }
  return repo;
}
