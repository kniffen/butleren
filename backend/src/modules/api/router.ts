import { Router } from 'express';
import { getModules } from './getModules';
import { putModuleSettings } from './putModuleSettings';

export const modulesRouter = Router();

modulesRouter.get('/:guild', getModules);
modulesRouter.put('/:guild/:slug/settings', putModuleSettings);
