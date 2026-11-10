// The repository: everything the app saves goes through here.
// sqlRepo runs on SQLite (the phone, and Node's SQLite in Jest).
// memoryRepo keeps the same contract in memory (web preview, tests).

import { parseSettings, settingsToKv, type Settings } from '@/domain/settings';
import type { Sub } from '@/domain/subs';

import { SUB_COLUMNS, rowParams, rowToSub, subToRow, type SubRow } from './rows';
import { migrate, type SqlDb } from './sql';

export interface Repo {
  /** Every saved sub except deleted ones. */
  loadSubs(): Promise<Sub[]>;
  /** Insert or replace, all in one transaction. */
  saveSubs(subs: Sub[]): Promise<void>;
  loadSettings(): Promise<Settings>;
  saveSettings(patch: Partial<Settings>): Promise<void>;
  /** Delete everything on this phone. */
  wipe(): Promise<void>;
}

const UPSERT = `INSERT OR REPLACE INTO subscriptions (${SUB_COLUMNS.join(', ')}) VALUES (${SUB_COLUMNS.map(() => '?').join(', ')})`;

export async function sqlRepo(db: SqlDb): Promise<Repo> {
  await migrate(db);
  return {
    async loadSubs() {
      const rows = await db.getAllAsync<SubRow>(`SELECT * FROM subscriptions WHERE status != 'deleted' ORDER BY created_at, id`);
      return rows.map(rowToSub);
    },
    async saveSubs(subs) {
      if (!subs.length) return;
      await db.withTransactionAsync(async () => {
        for (const s of subs) await db.runAsync(UPSERT, ...rowParams(subToRow(s)));
      });
    },
    async loadSettings() {
      const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
      return parseSettings(Object.fromEntries(rows.map((r) => [r.key, r.value])));
    },
    async saveSettings(patch) {
      const kv = settingsToKv(patch);
      await db.withTransactionAsync(async () => {
        for (const [key, value] of Object.entries(kv)) {
          if (value === null) await db.runAsync('DELETE FROM settings WHERE key = ?', key);
          else await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
        }
      });
    },
    async wipe() {
      await db.withTransactionAsync(async () => {
        await db.execAsync('DELETE FROM subscriptions');
        await db.execAsync('DELETE FROM settings');
      });
    },
  };
}

export type MemorySnapshot = { subs: Sub[]; kv: Record<string, string> };

/** Same contract, kept in memory. `persist` is called after every change. */
export function memoryRepo(initial: MemorySnapshot = { subs: [], kv: {} }, persist?: (snap: MemorySnapshot) => void): Repo {
  const subs = new Map(initial.subs.map((s) => [s.id, s]));
  let kv = { ...initial.kv };
  const save = () => persist?.({ subs: [...subs.values()], kv });
  return {
    async loadSubs() {
      return [...subs.values()].filter((s) => s.status !== 'deleted').map((s) => ({ ...s }));
    },
    async saveSubs(list) {
      for (const s of list) subs.set(s.id, { ...s });
      save();
    },
    async loadSettings() {
      return parseSettings(kv);
    },
    async saveSettings(patch) {
      for (const [key, value] of Object.entries(settingsToKv(patch))) {
        if (value === null) delete kv[key];
        else kv[key] = value;
      }
      save();
    },
    async wipe() {
      subs.clear();
      kv = {};
      save();
    },
  };
}
