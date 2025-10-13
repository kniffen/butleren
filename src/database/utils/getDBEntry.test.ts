import { database } from '../database';
import { getDBEntry } from './getDBEntry';

describe('Database: getDBEntry()', () => {
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

    // Insert a test entry
    await db.run(
      'INSERT INTO testTable (id, name, age, isActive) VALUES (?, ?, ?, ?)',
      ['123', 'John Doe', 30, 1]
    );
  });

  afterAll(async () => {
    const db = await database;
    await db.run('DROP TABLE IF EXISTS testTable');
  });

  test('It should get an entry from the database', async () => {
    const entry = await getDBEntry('testTable', { id: '123' });
    expect(entry).toEqual({
      id:       '123',
      name:     'John Doe',
      age:      30,
      isActive: 1
    });
  });

  test('It should return null if the entry does not exist', async () => {
    const entry = await getDBEntry('testTable', { id: 'non-existent-id' });
    expect(entry).toBeNull();
  });
});