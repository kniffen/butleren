import type { User, UserDBEntry } from '../../../types';
import type { NextFunction, Request, Response } from 'express';
import { getAllDBEntries } from '../../../database/utils/getAllDBEntries';
import { discordClient } from '../../../discord/client';
import { USERS_TABLE_NAME } from '../constants';

export const getUsers = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entries = await getAllDBEntries<UserDBEntry>(USERS_TABLE_NAME);

    const responseBody = await Promise.all(entries.map(async (user) => {
      const { id, ...settings } = user;
      const discordUser = await discordClient.users.fetch(user.id);

      return {
        id,
        displayName: discordUser.displayName,
        settings,
      } satisfies User;
    }));


    res.status(200).json(responseBody);

  } catch(error) {
    next(error);
  }
};