import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DBPATH = path.resolve(__dirname, '../../../data.db');

// Ensures the database file exists
if (!fs.existsSync(DBPATH))
  fs.writeFileSync(DBPATH, '');

export default open({
  filename: 'data.db',
  driver: sqlite3.Database,
});