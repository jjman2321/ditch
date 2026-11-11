// The phone's database: one SQLite file, migrated on open.

import * as SQLite from 'expo-sqlite';

import { sqlRepo, type Repo } from './repo';

let opening: Promise<Repo> | null = null;

export function openRepo(): Promise<Repo> {
  opening ??= SQLite.openDatabaseAsync('ditch.db')
    .then((db) => sqlRepo(db))
    .catch((e) => {
      // Let "Try again" really try again instead of reusing the failure.
      opening = null;
      throw e;
    });
  return opening;
}
