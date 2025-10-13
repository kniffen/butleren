import { logDebug } from '../../modules/logs/logger';
import { database } from '../database';

export async function getAllDBEntries<T>(tableName: string): Promise<T[]> {
  const db = await database;
  const rows = await db.all<T[]>(`SELECT * FROM ${tableName}`);

  logDebug('Database', `Retrieved entries from table "${tableName}"`, { entries: rows });
  return rows;
}