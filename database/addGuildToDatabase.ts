import database from './';
import modules from '../modules';
import { Guild } from 'discord.js';

export default async function addGuildToDatabase(guild: Guild) {
  const db = await database;

  await db
    .run('INSERT OR IGNORE INTO guilds (id) VALUES (?)', [guild.id])
    .catch(console.error);

  const mods = modules.filter((mod) => !mod.isLocked);
  const results = await Promise.allSettled(mods.map((mod) =>
    db.run('INSERT OR IGNORE INTO modules (id, guildId) VALUES (?,?)', [mod.id, guild.id])
  ));

  results.forEach(({ status }, i) => {
    if ('fulfilled' === status) {
      console.log(`${mods[i].name} was added to the database`);
    } else {
      console.error(`Was uable to add ${mods[i].name} to the database`);
    }
  });
}