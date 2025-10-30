import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '.';
import { join } from 'path';

export function createDatabasePath(path: string) {
  mkdirSync(dirname(path), { recursive: true });
}

export function runMigrations() {
  const path = join(__dirname, './database/generated');
  migrate(db, {
    migrationsFolder: path
  });
}
