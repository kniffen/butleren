import { database } from '../database';
import { getDBEntries } from './getDBEntries';

describe('Database: getDBEntries()', () => {
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

    // Insert test entries
    await db.run(
      'INSERT INTO testTable (id, name, age, isActive) VALUES (?, ?, ?, ?)',
      ['123', 'John Doe', 30, 1]
    );
    await db.run(
      'INSERT INTO testTable (id, name, age, isActive) VALUES (?, ?, ?, ?)',
      ['456', 'John Smith', 30, 0]
    );
    await db.run(
      'INSERT INTO testTable (id, name, age, isActive) VALUES (?, ?, ?, ?)',
      ['789', 'John Cena', 32, 0]
    );

  });

  afterAll(async () => {
    const db = await database;
    await db.run('DROP TABLE IF EXISTS testTable');
  });

  test('It should get entries from the database', async () => {
    const entries = await getDBEntries('testTable', { age: 30 });
    expect(entries).toEqual([
      { id: '123', name: 'John Doe',   age: 30, isActive: 1 },
      { id: '456', name: 'John Smith', age: 30, isActive: 0 }
    ]);
  });

  test('It should return an empty array if no entries exist', async () => {
    const entries = await getDBEntries('testTable', { age: 99 });
    expect(entries).toEqual([]);
  });
});