import { database } from '../database';
import { insertOrReplaceDBEntry } from './insertOrReplaceDBEntry';

describe('Database: insertOrReplaceDBEntry()', () => {
  beforeAll(async () => {
    const db = await database;

    // Create a test table
    await db.run(`
      CREATE TABLE IF NOT EXISTS testTable (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        isActive INTEGER
      )
    `);
  });

  afterAll(async () => {
    const db = await database;
    await db.run('DROP TABLE IF EXISTS testTable');
  });

  test('It should insert or replace an entry in the database', async () => {
    const entry = {
      id:       '123',
      name:     'John Doe',
      age:      30,
      isActive: 1
    };

    await insertOrReplaceDBEntry('testTable', entry);

    const db = await database;
    const row = await db.get('SELECT * FROM testTable WHERE id = ?', entry.id);

    expect(row).toEqual(entry);
  });
});