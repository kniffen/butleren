import { database } from '../database';
import { deleteDBEntry } from './deleteDBEntry';

describe('Database: deleteDBEntry()', () => {
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

  test('It should delete an entry from the database', async () => {
    await deleteDBEntry('testTable', { id: '123' });

    const db = await database;
    const row = await db.get('SELECT * FROM testTable WHERE id = ?', ['123']);
    expect(row).toBeUndefined();
  });

  test('It should handle an entry not existing gracefully', async () => {
    await expect(deleteDBEntry('testTable', { id: 'non-existent-id' })).resolves.toBeUndefined();
  });
});