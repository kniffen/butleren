
import path from 'node:path';
import { ROOT_PATH } from '../constants';

export const DB_PATH         = path.resolve(ROOT_PATH, 'database/data.db');
export const MIGRATIONS_PATH = path.resolve(ROOT_PATH, 'database/migrations');