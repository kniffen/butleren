import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const DBPATH = path.resolve(fileURLToPath(import.meta.url), '../../data.db')

// Ensures the database file exists
if (!fs.existsSync(DBPATH))
  fs.writeFileSync(DBPATH, '')

export default open({
  filename: 'data.db',
  driver: sqlite3.Database,
})