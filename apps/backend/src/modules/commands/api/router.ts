import { Router } from 'express';
import { getCommands } from './getCommands';
import { putCommand } from './putCommand';
import { postRestoreCommand } from './postRestoreCommand';

export const commandsRouter = Router();

commandsRouter.get('/:guild', getCommands);
commandsRouter.put('/:slug/:guild', putCommand);
commandsRouter.post('/:slug/:guild/restore', postRestoreCommand);
