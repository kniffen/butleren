import { logDebug } from '../../modules/logs/logger';
import { database } from '../database';

export async function insertOrReplaceDBEntry<T extends Record<string, string | number | boolean | null>>(tableName: string, entry: T): Promise<void> {
  const columns = Object.keys(entry);
  const values  = columns.map((key) => `$${key}`);
  const params  = Object.fromEntries(columns.map((key) => [`$${key}`, entry[key]]));

  const db = await database;
  await db.run(
    `INSERT OR REPLACE INTO ${tableName} (${columns.join(',')}) VALUES (${values.join(',')})`,
    params
  );

  logDebug('Database', `Inserted or replaced entry in table "${tableName}"`, { entry });
}