import { logInfo } from '../../modules/logs/logger';
import { database } from '../database';

export async function deleteDBEntry(tableName: string, conditions: Record<string, string | number>): Promise<void> {
  const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
  const values      = Object.values(conditions);

  const db = await database;
  const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
  await db.run(query, values );

  logInfo('Database', `Deleted entry from table "${tableName}"`, { conditions });
}