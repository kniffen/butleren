import { Router } from 'express';
import { getLogEntries } from './getLogEntries';

export const loggerRouter = Router();

loggerRouter.get('/entries', getLogEntries);
