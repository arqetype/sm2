import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import Sqlite, { type Database } from 'better-sqlite3';
import { DATABASE_PATH } from '../../config/db';
import { createDatabasePath, runMigrations } from './utils';
import * as schema from './schema';

export let db: BetterSQLite3Database<typeof schema>;
export let sqlite: Database;

export function initDatabase() {
  createDatabasePath(DATABASE_PATH);
  sqlite = new Sqlite(DATABASE_PATH);
  db = drizzle(sqlite, { schema });
  runMigrations();
}
