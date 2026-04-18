import { logDebug, logWarn } from '../../modules/logs/logger';
import { database } from '../database';

export async function getDBEntry<T>(tableName: string, conditions: Record<string, string | number>): Promise<T | null> {
  const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
  const values      = Object.values(conditions);

  const db = await database;
  const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
  const row = await db.get<T>(query, values );

  if (!row) {
    logWarn('Database', `Entry not found in table "${tableName}" with query: ${query} and values: ${values.join(', ')}`);
    return null;
  }

  logDebug('Database', `Retrieved entry from table "${tableName}"`, { entry: row });
  return row;
}