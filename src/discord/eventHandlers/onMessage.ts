import { ChannelType, Message } from 'discord.js';

import database from '../../database';
import { modules } from '../../modules';

export default async function onMessage(message: Message) {
  // Quit early if the message originates from a bot
  if (message.author.bot || ChannelType.DM === message.channel.type) return;

  const db = await database;

  const entries =
    await db.all<{id: string, isEnabled: boolean}[]>(
      'SELECT id, isEnabled FROM modules WHERE guildId = ?',
      [message.channel.guild.id]
    );

  if (1 > entries.length) return;

  modules
    .filter((mod) => {
      const entry = entries.find((entry) => entry.id === mod.id);
      return (mod.isLocked || (entry?.isEnabled && mod.allowedChannelTypes.includes(message.channel.type)));
    })
    .forEach((mod) => mod.onMessage && mod.onMessage(message));
}