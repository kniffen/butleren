/**
 * Butleren
 * Just another Discord bot.
 *
 * @author Kniffen
 * @license MIT
 */

import discordClient from './discord/client';
import database from './database';
import modules from './modules';

import './routes';

async function runIntervals() {
  try {
    const date = new Date();

    if (0 < date.getSeconds()) return;

    const db = await database;
    const data = await db.all('SELECT id FROM guilds');
    const guilds = await Promise.all(data.map(({ id }) => discordClient.guilds.fetch(id)));

    await Promise.all(
      modules
        .filter(mod => mod.onInterval)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .map(mod => mod.onInterval({ guilds, date }))
    );

  } catch (err) { console.error(err); }
}

async function init() {
  const db = await database;

  await db.migrate();
  await discordClient.login(process.env.DISCORD_TOKEN);

  setInterval(runIntervals, 1000);
}

init();