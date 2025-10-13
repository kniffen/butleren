import { Router } from 'express';
import { getLogEntries } from './getLogEntries';

export const logsRouter = Router();

logsRouter.get('/', getLogEntries);
