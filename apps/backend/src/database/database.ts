import fs from 'node:fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { logInfo, logError } from '../modules/logs/logger';
import { DB_PATH, MIGRATIONS_PATH } from './constants';


// Ensures the database file exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '');
}

export const database = open({
  filename: DB_PATH,
  driver:   sqlite3.Database,
});

export const initDatabase = async (): Promise<void> => {
  try {
    const db = await database;
    await db.migrate({ migrationsPath: MIGRATIONS_PATH });
    logInfo('Database', 'Database initialized');

  } catch (err) {
    if (err instanceof Error) {
      logError('Database', err.message, err);
    }
  }
};