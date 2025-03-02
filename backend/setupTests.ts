import { MIGRATIONS_PATH } from './src/database/constants';
import { database } from './src/database/database';

jest.mock('./src/logger/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
  logDebug: jest.fn(),
}));

jest.mock('./src/database/database', () => {
  const sqlite3 = require('sqlite3');
  const { open } = require('sqlite');

  return {
    database: open({
      filename: ':memory:',
      driver: sqlite3.Database,
    }),
    initDatabase: jest.fn(),
  }
});

beforeAll(async () => {
  const db = await database;
  await db.migrate({ migrationsPath: MIGRATIONS_PATH });
});

beforeEach(async () => {
  const db = await database;
  await db.run('DELETE FROM guilds');
  await db.run('DELETE FROM modules');
  await db.run('DELETE FROM users');
});