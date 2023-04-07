import { ChannelType } from 'discord.js'

import database from '../../database/index.js'
import * as modules from '../../modules/index.js'

/**
 * Discord message event handler.
 * 
 * @param {Object} message - Discord message object
 * @returns {Promise<void>}
 */
export default async function onMessage(message) {
  // Quit early if the message originates from a bot
  if (message.author.bot || ChannelType.DM === message.channel.type) return

  const db = await database

  await Promise.all(await Object.values(modules).reduce(async (_promises, mod) => {
    const promises = (await _promises)
    if (!mod.onMessage || !mod.allowedChannelTypes?.includes(message.channel.type)) return promises

    const entries = (await db.all('SELECT id, isEnabled FROM modules WHERE guildId = ?', [message.channel.guild.id]))
    if (1 > entries.length) return promises

    const settings = entries.find(entry => entry.id === mod.id)
    return (!settings || settings.isEnabled) ? [...promises, mod.onMessage(message)] : promises
  }, []))
}