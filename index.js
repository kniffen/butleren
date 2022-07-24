/**
 * Butleren
 * Just another Discord bot.
 * 
 * @author Kniffen
 * @license MIT
 */

import discordClient from './discord/client.js'
import database from './database/index.js'
import * as modules from './modules/index.js'

import './routes/index.js'

async function runIntervals() {
  try {
    const date = new Date()

    if (0 < date.getSeconds()) return

    const db     = await database
    const data   = await db.all('SELECT id FROM guilds')
    const guilds = await Promise.all(data.map(({ id }) => discordClient.guilds.fetch(id)))

    await Promise.all(
      Object
        .values(modules)
        .filter(mod => mod.onInterval)
        .map(mod => mod.onInterval({guilds, date}))
    )

  } catch(err) { console.error(err)}
}

async function init() {
  const db = await database

  await db.migrate()
  await discordClient.login(process.env.DISCORD_TOKEN)

  setInterval(runIntervals, 1000)
}

init()