import { Request, Response } from 'express';

import router from './router';
import discordClient from '../../discord/client';
import { modules } from '../../modules';
import { APIBotCommand } from '../types';

router.get('/:guild', async function(req: Request, res: Response) {
  const handleError = (err: Error) => console.error(req.method, req.originalUrl, err);

  try {
    const guild = await discordClient.guilds.fetch(req.params.guild).catch(handleError);
    if (!guild) return res.sendStatus(404);

    const guildCommands = await guild.commands.fetch().catch(handleError);
    if (!guildCommands) return res.sendStatus(404);

    const commands = Object.entries(modules).reduce<APIBotCommand[]>(function(commands, [ modId, mod ]) {
      if (!mod.commands) return commands;

      return [
        ...commands,
        ...Object
          .entries(mod.commands)
          .map<APIBotCommand>(([ id, cmd ]) => ({
            id,
            name: cmd.data.name || '',
            description: cmd.data.description || '',
            isEnabled: !!guildCommands.find(c => c.name === cmd.data.name),
            isLocked: cmd.isLocked,
            module: {
              id: modId,
              name: mod.name
            }
          }))
      ];
    }, []);

    res.send(commands);

  } catch(err) {
    if (err instanceof Error) handleError(err);
    res.sendStatus(500);
  }
});
