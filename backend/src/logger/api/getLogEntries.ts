import path from 'node:path';
import fs from 'node:fs';
import type { Request, Response } from 'express';
import type { LogEntry } from '../../types';

const LOGS_DIR_PATH = path.join(__dirname, '../../../logs');

export const getLogEntries = async function(req: Request, res: Response): Promise<void> {
  try {
    const date = req.query.date;
    if (!date) {
      res.status(400).send('Missing date parameter');
      return;
    }

    const logFilePath  = path.join(LOGS_DIR_PATH, `debug-${date}.log`);
    const logContents = fs.existsSync(logFilePath) ? fs.readFileSync(logFilePath, 'utf-8') : null;

    if (!logContents) {
      res.status(404).send('Log file not found');
      return;
    }

    const matches = logContents.match(/({[\s\S]*?}\s*)(?=\n{|\s*$)/g);
    if (!matches) {
      res.json([]);
      return;
    }

    const logEntries =
      matches
        .map<LogEntry>(entry => {
          try {
            return JSON.parse(entry);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

    res.json(logEntries);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(message);
  }
};