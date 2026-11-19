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
  {
    version: 3,
    name: 'every 2 weeks and every 6 months (DECISIONS #57)',
    // SQLite can't change a CHECK in place: build the new table, copy every row, swap. Runs in one transaction.
    up: [
      `CREATE TABLE subscriptions_v3 (
        id TEXT PRIMARY KEY NOT NULL,
        kind TEXT NOT NULL DEFAULT 'user',
        catalog_id TEXT,
        name TEXT NOT NULL,
        category TEXT,
        amount_minor INTEGER CHECK (amount_minor IS NULL OR amount_minor >= 0),
        currency TEXT,
        cycle TEXT NOT NULL CHECK (cycle IN ('weekly','biweekly','monthly','quarterly','semiannual','yearly')),
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
      `INSERT INTO subscriptions_v3 (id, kind, catalog_id, name, category, amount_minor, currency, cycle, amount_is_estimate, plan_id, plan_name, price_source, price_country, anchor_date, date_source, is_trial, free_pick, reminders_muted, status, ditched_on, cancel_by, confirmed_on, ditched_amount_minor, ditched_currency, ditched_cycle, source, created_at, updated_at) SELECT id, kind, catalog_id, name, category, amount_minor, currency, cycle, amount_is_estimate, plan_id, plan_name, price_source, price_country, anchor_date, date_source, is_trial, free_pick, reminders_muted, status, ditched_on, cancel_by, confirmed_on, ditched_amount_minor, ditched_currency, ditched_cycle, source, created_at, updated_at FROM subscriptions`,
      `DROP TABLE subscriptions`,
      `ALTER TABLE subscriptions_v3 RENAME TO subscriptions`,
      `CREATE INDEX subscriptions_status ON subscriptions (status)`,
    ],
  },
  {
    version: 4,
    name: 'card, account email, notes, skip this one (DECISIONS #60)',
    // New columns only, all nullable: every saved row stays as it was.
    up: [
      `ALTER TABLE subscriptions ADD COLUMN paid_with TEXT`,
      `ALTER TABLE subscriptions ADD COLUMN account_email TEXT`,
      `ALTER TABLE subscriptions ADD COLUMN notes TEXT`,
      `ALTER TABLE subscriptions ADD COLUMN skip_charge TEXT`,
    ],
  },
  {
    version: 5,
    name: 'bank sync on the phone (DECISIONS #67, #70)',
    // The day a sub was added from the bank ("FOUND IN YOUR BANK" for 7 days), and a small
    // key/value table for the bank side: connected banks, the charges the phone keeps (the
    // server never stores them), what was handled, dismissed cards. Values are JSON text.
    up: [`ALTER TABLE subscriptions ADD COLUMN found_in_bank_on TEXT`, `CREATE TABLE IF NOT EXISTS bank_state (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)`],
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
