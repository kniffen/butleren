import { Router } from 'express';
import { getSearchHandler } from './getSearchHandler';

export const searchRouter = Router();

searchRouter.get('/:service', getSearchHandler);
