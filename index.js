/**
 * Butleren
 * Just another Discord bot.
 * 
 * @author Kniffen
 * @license MIT
 */

import discordClient from './discord/client.js'
import database from './database/index.js'

(async function init() {
  const db = await database

  await db.migrate()
  await discordClient.login(process.env.DISCORD_TOKEN)
})()