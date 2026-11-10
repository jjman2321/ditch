// The slice of a SQLite database the app uses. expo-sqlite's
// SQLiteDatabase fits it as-is; Jest uses Node's built-in SQLite through
// the same shape, so the real SQL is tested.

export type SqlParam = string | number | null;

export interface SqlDb {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: SqlParam[]): Promise<unknown>;
  getAllAsync<T>(sql: string, ...params: SqlParam[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, ...params: SqlParam[]): Promise<T | null>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
}

export type Migration = { version: number; name: string; up: string[] };

/**
 * Numbered migrations, run in order. Never edit one that has shipped:
 * add a new one with the next number.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'subscriptions and settings',
    up: [
      `CREATE TABLE subscriptions (
        id TEXT PRIMARY KEY NOT NULL,
        kind TEXT NOT NULL DEFAULT 'user',
        catalog_id TEXT,
        name TEXT NOT NULL,
        category TEXT,
        amount_minor INTEGER CHECK (amount_minor IS NULL OR amount_minor >= 0),
        currency TEXT,
        cycle TEXT NOT NULL CHECK (cycle IN ('weekly','monthly','quarterly','yearly')),
        amount_is_estimate INTEGER NOT NULL DEFAULT 0,
        plan_id TEXT,
        plan_name TEXT,
        price_source TEXT NOT NULL DEFAULT 'none',
        price_country TEXT,
        anchor_date TEXT NOT NULL,
        date_source TEXT NOT NULL DEFAULT 'guess',
        is_trial INTEGER NOT NULL DEFAULT 0,
        free_pick INTEGER NOT NULL DEFAULT 0,
        reminders_muted INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','ditched-pending','ditched-confirmed','deleted')),
        ditched_on TEXT,
        cancel_by TEXT,
        confirmed_on TEXT,
        ditched_amount_minor INTEGER,
        ditched_currency TEXT,
        ditched_cycle TEXT,
        source TEXT NOT NULL DEFAULT 'manual',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE INDEX subscriptions_status ON subscriptions (status)`,
      `CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)`,
    ],
  },
  {
    version: 2,
    name: 'no guessed dates (DECISIONS #33)',
    // Guessed dates were never the user's: they become "No date yet".
    up: [`UPDATE subscriptions SET date_source = 'none' WHERE date_source = 'guess'`],
  },
];

export async function schemaVersion(db: SqlDb): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

/**
 * Bring the database up to the latest version. Each migration runs in its
 * own transaction together with the version bump, so a failure leaves the
 * database exactly as it was before that migration.
 */
export async function migrate(db: SqlDb, migrations: Migration[] = MIGRATIONS): Promise<number> {
  const sorted = [...migrations].sort((a, b) => a.version - b.version);
  let current = await schemaVersion(db);
  for (const m of sorted) {
    if (m.version <= current) continue;
    await db.withTransactionAsync(async () => {
      for (const stmt of m.up) await db.execAsync(stmt);
      await db.execAsync(`PRAGMA user_version = ${m.version}`);
    });
    current = m.version;
  }
  return current;
}
