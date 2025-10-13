import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import type { Command, CommandDBEntry } from '../../../types';
import { discordClient } from '../../../discord/client';
import { commands } from '../../modules';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { COMMANDS_TABLE_NAME } from '../constants';

export const getCommands = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Commands', `Requesting commands with path: ${req.path}`);

    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);

    const responseBody: Command[] = await Promise.all([...commands.entries()].map(async ([slug, cmd]) => {
      const commandDBEntry = await getDBEntry<CommandDBEntry>(COMMANDS_TABLE_NAME, { slug, guildId: guild.id });

      return {
        slug,
        description: cmd.slashCommandBuilder.description,
        isEnabled:   commandDBEntry ? !!commandDBEntry.isEnabled : false,
        isLocked:    cmd.isLocked,
      };
    }));

    res.status(200).json(responseBody);

  } catch (error) {
    next(error);
  }
};