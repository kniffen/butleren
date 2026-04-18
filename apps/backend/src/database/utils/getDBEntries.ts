import { logDebug } from '../../modules/logs/logger';
import { database } from '../database';

export async function getDBEntries<T>(tableName: string, conditions: Record<string, string | number>): Promise<T[]> {
  const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
  const values      = Object.values(conditions);

  const db = await database;
  const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
  const rows = await db.all<T[]>(query, values );


  logDebug('Database', `Retrieved entries from table "${tableName}"`, { entries: rows });
  return rows;
}