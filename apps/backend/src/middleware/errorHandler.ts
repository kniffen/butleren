import { DiscordAPIError } from 'discord.js';
import type { NextFunction, Request, Response } from 'express';
import { logError } from '../modules/logs/logger';

export const errorHandler = function(error: unknown, req: Request, res: Response, next: NextFunction): void {
  const { path } = req;
  if (error instanceof DiscordAPIError) {
    switch (error.status) {
      case 404: {
        logError('', 'Not found', { path });
        res.sendStatus(404);
        next();
        return;
      }
      default: {
        logError('', error.message, { path, error });
        res.sendStatus(500);
        next();
        return;
      }
    }
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  logError('', message, { path, error });
  res.sendStatus(500);
  next();
};