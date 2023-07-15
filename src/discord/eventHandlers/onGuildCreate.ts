import addGuildToDatabase from '../../database/addGuildToDatabase';
import { modules } from '../../modules';
import { Guild } from 'discord.js';

/**
 * Handler for the Discord client's guildCreate event.
 */
export default async function onGuildCreate(guild: Guild) {
  await addGuildToDatabase(guild);

  try {

    type CmdPromise = ReturnType<typeof guild.commands.create>;

    await Promise.all(modules.reduce<CmdPromise[]>((promises, mod) => {
      if (!mod.commands) return promises;

      return [
        ...promises,
        ...Object.values(mod.commands).reduce<CmdPromise[]>((cmdPromises, cmd) =>
          cmd.data.toJSON
            ? [...cmdPromises, guild.commands.create(cmd.data.toJSON())]
            : cmdPromises
        , [])
      ];
    }, []));

  } catch (err) {
    console.error(err);
  }
}