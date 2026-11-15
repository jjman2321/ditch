import { DEFAULT_SETTINGS } from '@/domain/settings';
import { makeSub, type Sub } from '@/domain/subs';

import { memoryRepo, sqlRepo, type Repo } from '../repo';
import { rowToSub, SUB_COLUMNS, subToRow } from '../rows';
import { MIGRATIONS, migrate, schemaVersion, type Migration } from '../sql';
import { nodeSqlite } from '../testing/nodeSqlite';

const NOW = '2026-11-09T10:00:00.000Z';

function netflix(extra: Partial<Sub> = {}): Sub {
  return makeSub(
    {
      id: 'sub-netflix',
      name: 'Netflix',
      catalogId: 'netflix',
      category: 'Streaming',
      amountMinor: 1799,
      currency: 'USD',
      cycle: 'monthly',
      anchor: '2026-11-14',
      dateSource: 'next',
      planId: 'standard',
      planName: 'Standard',
      priceSource: 'catalog',
      priceCountry: 'US',
      amountIsEstimate: true,
      freePick: true,
      source: 'onboarding',
      ...extra,
    },
    NOW,
  );
}

describe('migrations', () => {
  it('a fresh database ends at the latest version with both tables', async () => {
    const db = nodeSqlite();
    expect(await schemaVersion(db)).toBe(0);
    const v = await migrate(db);
    expect(v).toBe(MIGRATIONS[MIGRATIONS.length - 1].version);
    expect(await schemaVersion(db)).toBe(v);
    const tables = await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name");
    expect(tables.map((t) => t.name)).toEqual(['settings', 'subscriptions']);
    const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(subscriptions)');
    expect(cols.map((c) => c.name)).toEqual(
      expect.arrayContaining(['amount_minor', 'currency', 'cycle', 'anchor_date', 'date_source', 'plan_id', 'price_source', 'price_country', 'free_pick', 'reminders_muted', 'status', 'ditched_on', 'cancel_by', 'confirmed_on', 'ditched_amount_minor']),
    );
    db.close();
  });

  it('running it again changes nothing', async () => {
    const db = nodeSqlite();
    await migrate(db);
    await db.runAsync("INSERT INTO settings (key, value) VALUES ('currency', 'GBP')");
    await migrate(db);
    expect(await db.getAllAsync('SELECT * FROM settings')).toEqual([{ key: 'currency', value: 'GBP' }]);
    db.close();
  });

  it('runs only the new ones, in number order', async () => {
    const db = nodeSqlite();
    await migrate(db);
    const extra: Migration[] = [
      ...MIGRATIONS,
      { version: 101, name: 'c', up: ['ALTER TABLE settings ADD COLUMN c TEXT'] },
      { version: 100, name: 'b', up: ['ALTER TABLE settings ADD COLUMN b TEXT'] },
    ];
    expect(await migrate(db, extra)).toBe(101);
    const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(settings)');
    expect(cols.map((c) => c.name)).toEqual(['key', 'value', 'b', 'c']);
    db.close();
  });

  it('migration 3 keeps every saved subscription and allows every 2 weeks and every 6 months (DECISIONS #57)', async () => {
    const db = nodeSqlite();
    await migrate(db, MIGRATIONS.filter((m) => m.version <= 2));
    const before = [netflix(), netflix({ id: 'sub-ditched', name: 'Hulu', status: 'ditched-pending', ditchedOn: '2026-11-10', snapAmountMinor: 1899, snapCurrency: 'USD', snapCycle: 'monthly' })];
    for (const sub of before) {
      const row = subToRow(sub);
      await db.runAsync(`INSERT INTO subscriptions (${SUB_COLUMNS.join(', ')}) VALUES (${SUB_COLUMNS.map(() => '?').join(', ')})`, ...SUB_COLUMNS.map((c) => row[c]));
    }
    // A biweekly row is refused before the migration…
    await expect(db.runAsync("UPDATE subscriptions SET cycle = 'biweekly' WHERE id = 'sub-netflix'")).rejects.toThrow();
    const repo = await sqlRepo(db); // …opening the app runs migration 3
    expect(await schemaVersion(db)).toBe(3);
    const byId = (list: Sub[]) => [...list].sort((a, b) => a.id.localeCompare(b.id));
    expect(byId(await repo.loadSubs())).toEqual(byId(before));
    await repo.saveSubs([netflix({ id: 'sub-gym', name: 'Gym', cycle: 'biweekly' }), netflix({ id: 'sub-car', name: 'Car insurance', cycle: 'semiannual' })]);
    expect((await repo.loadSubs()).map((x) => x.cycle).sort()).toEqual(['biweekly', 'monthly', 'monthly', 'semiannual']);
    await expect(db.runAsync("UPDATE subscriptions SET cycle = 'daily' WHERE id = 'sub-gym'")).rejects.toThrow();
    expect(await db.getAllAsync("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'subscriptions_status'")).toHaveLength(1);
    db.close();
  });

  it('a failing migration rolls back and leaves the version where it was', async () => {
    const db = nodeSqlite();
    await migrate(db);
    const latest = MIGRATIONS[MIGRATIONS.length - 1].version;
    const broken: Migration[] = [...MIGRATIONS, { version: 100, name: 'broken', up: ['ALTER TABLE settings ADD COLUMN ok TEXT', 'THIS IS NOT SQL'] }];
    await expect(migrate(db, broken)).rejects.toThrow();
    expect(await schemaVersion(db)).toBe(latest);
    const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(settings)');
    expect(cols.map((c) => c.name)).toEqual(['key', 'value']);
    db.close();
  });

  it('migration 2 turns old guessed dates into "No date yet" (DECISIONS #33)', async () => {
    const db = nodeSqlite();
    const repo = await sqlRepo(db);
    await repo.saveSubs([netflix()]);
    // Pretend it's a phone from before: a guessed date, schema version 1.
    await db.runAsync("UPDATE subscriptions SET date_source = 'guess'");
    await db.execAsync('PRAGMA user_version = 1');
    await migrate(db);
    const rows = await db.getAllAsync<{ date_source: string }>('SELECT date_source FROM subscriptions');
    expect(rows.map((r) => r.date_source)).toEqual(['none']);
    db.close();
  });

  it('the database refuses negative amounts and unknown cycles', async () => {
    const db = nodeSqlite();
    const repo = await sqlRepo(db);
    await expect(repo.saveSubs([netflix({ amountMinor: -5 })])).rejects.toThrow();
    await expect(repo.saveSubs([{ ...netflix(), cycle: 'daily' as never }])).rejects.toThrow();
    expect(await repo.loadSubs()).toEqual([]);
    db.close();
  });
});

describe('rows', () => {
  it('a sub survives the trip to a row and back', () => {
    const s = netflix({ status: 'ditched-pending', ditchedOn: '2026-11-09', cancelBy: '2026-11-14', snapAmountMinor: 1799, snapCurrency: 'USD', snapCycle: 'monthly' });
    expect(rowToSub(subToRow(s))).toEqual(s);
  });

  it('refuses money that is not whole minor units', () => {
    expect(() => subToRow(netflix({ amountMinor: 17.99 }))).toThrow(/minor units/);
  });

  it('broken values fall back safely', () => {
    const r = { ...subToRow(netflix()), status: 'weird', date_source: 'x', kind: '?' };
    const s = rowToSub(r);
    expect([s.status, s.dateSource, s.kind]).toEqual(['active', 'none', 'user']);
  });
});

async function contract(name: string, make: () => Promise<Repo>) {
  describe(`repository: ${name}`, () => {
    it('saves, updates and loads subs (deleted ones stay out)', async () => {
      const repo = await make();
      await repo.saveSubs([netflix(), netflix({ id: 'sub-spotify', name: 'Spotify', amountMinor: 1199, catalogId: 'spotify' })]);
      await repo.saveSubs([netflix({ amountMinor: 1999, updatedAt: '2026-11-10T00:00:00.000Z' })]);
      let subs = await repo.loadSubs();
      expect(subs.map((s) => [s.name, s.amountMinor])).toEqual([
        ['Netflix', 1999],
        ['Spotify', 1199],
      ]);
      await repo.saveSubs([{ ...subs[1], status: 'deleted' }]);
      subs = await repo.loadSubs();
      expect(subs.map((s) => s.name)).toEqual(['Netflix']);
    });

    it('settings start at the defaults and keep what was saved', async () => {
      const repo = await make();
      expect(await repo.loadSettings()).toEqual(DEFAULT_SETTINGS);
      await repo.saveSettings({ reminderTime: '18:30', leadDays: [1, 7, 7], currency: 'GBP', onboardingDone: true, proPlan: 'yearly' });
      await repo.saveSettings({ proPlan: null });
      const s = await repo.loadSettings();
      expect(s).toEqual({ ...DEFAULT_SETTINGS, reminderTime: '18:30', leadDays: [7, 1], currency: 'GBP', onboardingDone: true, proPlan: null });
    });

    it('wipe deletes everything', async () => {
      const repo = await make();
      await repo.saveSubs([netflix()]);
      await repo.saveSettings({ onboardingDone: true });
      await repo.wipe();
      expect(await repo.loadSubs()).toEqual([]);
      expect((await repo.loadSettings()).onboardingDone).toBe(false);
    });
  });
}

contract('SQLite', () => sqlRepo(nodeSqlite()));

it('SQLite: quick writes one after another never overlap their transactions', async () => {
  const repo = await sqlRepo(nodeSqlite());
  await Promise.all([
    repo.saveSubs([netflix()]),
    repo.saveSettings({ currency: 'GBP' }),
    repo.saveSubs([netflix({ id: 'b', name: 'B' })]),
    repo.saveSettings({ reminderTime: '08:15' }),
  ]);
  expect((await repo.loadSubs()).map((s) => s.id).sort()).toEqual(['b', 'sub-netflix']);
  expect((await repo.loadSettings()).reminderTime).toBe('08:15');
});
contract('memory', async () => memoryRepo());

it('memory repo hands every change to persist', async () => {
  const snaps: number[] = [];
  const repo = memoryRepo(undefined, (snap) => snaps.push(snap.subs.length));
  await repo.saveSubs([netflix()]);
  await repo.saveSettings({ currency: 'EUR' });
  expect(snaps).toEqual([1, 1]);
});
