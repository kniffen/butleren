import type { Request, Response } from 'express';
import { modules } from '../modules';
import { database } from '../../database/database';
import type { ModuleSettings } from '../../types';
import { logError, logInfo, logWarn } from '../../logger/logger';
import { client as discordClient } from '../../discord/client';

export const putModuleSettings = async function(req: Request, res: Response): Promise<void> {
  try{
    const guildId = req.params['guild'];
    const slug = req.params['slug'];
    logInfo('API', `Requesting modules with path: ${req.path}`);

    const mod = modules.get(slug);
    if (!mod) {
      logWarn('API', `Module not found with slug: ${slug}`);
      res.sendStatus(404);
      return;
    }

    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      logWarn('Discord', `Guild not found with id: ${guildId}`);
      res.sendStatus(404);
      return;
    }

    const settings = req.body as ModuleSettings;
    if (settings.isEnabled === undefined) {
      // TODO: validate request body with Zod
      logWarn('API', `Invalid settings for module "${mod.name}"`, { settings });
      res.sendStatus(400);
      return;
    }

    if (settings.isEnabled) {
      logInfo('Discord', `Adding commands for module "${mod.name}" to guild "${guild.name}"`);
      await Promise.all([...mod.commands.values()].map(command => guild.commands.create(command.slashCommandBuilder)));

    } else {
      const applicationCommands =
        await guild.commands
          .fetch()
          .then((commands) => commands.filter(command => mod.commands.has(command.name)));

      logInfo('Discord', `Removing commands for module "${mod.name}" from guild "${guild.name}"`);
      await Promise.all(applicationCommands.map((command) => guild.commands.delete(command)));
    }

    const db = await database;
    await db.run('UPDATE modules SET settings = ? WHERE guildId = ? AND slug = ?', JSON.stringify(settings), guildId, slug);
    logInfo('API', `Updated settings for module "${mod.name}"`, { settings });
    res.sendStatus(204);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('API', message, { error });
    res.sendStatus(500);
  }
};