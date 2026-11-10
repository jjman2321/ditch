// Jest only: Node's built-in SQLite behind the same SqlDb shape the phone
// uses, so migrations and the repository run real SQL in tests.

import type { SqlDb, SqlParam } from '../sql';

export function nodeSqlite(): SqlDb & { close: () => void } {
  // Required lazily so the app bundle never sees it.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite');
  const db = new DatabaseSync(':memory:');
  let depth = 0;
  return {
    async execAsync(sql) {
      db.exec(sql);
    },
    async runAsync(sql, ...params: SqlParam[]) {
      return db.prepare(sql).run(...params);
    },
    async getAllAsync<T>(sql: string, ...params: SqlParam[]) {
      return db.prepare(sql).all(...params) as T[];
    },
    async getFirstAsync<T>(sql: string, ...params: SqlParam[]) {
      return (db.prepare(sql).get(...params) as T | undefined) ?? null;
    },
    async withTransactionAsync(task) {
      // Like expo-sqlite: BEGIN … COMMIT, ROLLBACK on error.
      const outer = depth === 0;
      if (outer) db.exec('BEGIN');
      depth += 1;
      try {
        await task();
        depth -= 1;
        if (outer) db.exec('COMMIT');
      } catch (e) {
        depth -= 1;
        if (outer) db.exec('ROLLBACK');
        throw e;
      }
    },
    close: () => db.close(),
  };
}
