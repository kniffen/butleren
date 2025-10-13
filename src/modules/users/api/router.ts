import { Router } from 'express';
import { getUsers } from './getUsers';

export const usersRouter = Router();

usersRouter.get('/', getUsers);
