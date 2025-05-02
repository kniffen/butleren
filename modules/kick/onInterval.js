import DiscordJS from 'discord.js';
import database from '../../database/index.js';
import { getKickChannels } from './utils/getKickChannels.js';
import { logger } from '../../logger/logger.js'

/**
 * @param {Object}   param
 * @param {Object[]} param.guilds - Discord.js guild objects.
 * @param {Object}   param.date - JS date object for the current date and time.
 * @returns Void
 */
export async function kickOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every 5 min, on the 5 min mark
  // For example 12:00, 12:05, 12:10 etc...
  if (0 !== date.getMinutes() % 5) {
    return;
  }

  try {
    logger.info('Kick: Running interval');

    const db = await database;
    const enabledGuilds =
      (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['kick', true]))
        .map(({ guildId}) => guildId);

    const entries =
      (await db.all('SELECT * FROM kickChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId));
    logger.debug('Kick: Entries', {entries});

    const broadcasterUserIds = entries.reduce((ids, entry) => ids.includes(entry.broadcasterUserId) ? ids : [...ids, entry.broadcasterUserId], []);
    logger.debug('Kick: Broadcaster user ids', {broadcasterUserIds});

    const kickChannels = await getKickChannels({broadcasterUserIds});
    logger.debug('Kick: Channels', {kickChannels});
    const liveKickChannels = kickChannels.filter(({ stream }) => stream.is_live);
    logger.debug('Kick: live channels', {liveKickChannels});

    await Promise.all(entries.map((entry) => (async () => {
      const kickChannel = liveKickChannels.find(({ broadcaster_user_id }) => broadcaster_user_id.toString() === entry.broadcasterUserId);
      if (!kickChannel) {
        return;
      }

      if (300_000 < date.valueOf() - (new Date(kickChannel.stream.start_time)).valueOf()) {
        return;
      }

      const guild = guilds.find(({ id }) => id === entry.guildId);
      if (!guild) {
        return;
      }

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error);
      if (!notificationChannel) {
        return;
      }

      const embed = new DiscordJS.EmbedBuilder();

      embed.setTitle(`${kickChannel.slug} is streaming on Kick`);
      embed.setURL(`https://kick.com/${kickChannel.slug}`);
      embed.setColor('#53FC18'); // Kick green
      embed.setDescription(`**${kickChannel.stream_title}**`);
      embed.setImage(`${kickChannel.stream.thumbnail}?t=${date.valueOf()}`);
      embed.addFields({
        name:  'Category',
        value: kickChannel.category.name || 'Unknown'
      })

      await notificationChannel.send({
        content: `${entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''}${kickChannel.slug} is live on Kick!`,
        embeds: [embed]
      }).catch(console.error)
    })()))

  } catch(err) {
    logger.error('Kick: Interval', err);
    console.error(err)
  }
}