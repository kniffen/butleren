import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPIChannel } from '../requests/getKickChannels';
import { logDebug } from '../../../modules/logs/logger';
import { createKickStreamEmbed } from '../utils/createKickStreamEmbed';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';

export const kickLiveNotifications = async function(date: Date, channelEntries: KickChannelDBEntry[], kickChannels: KickAPIChannel[], guilds: Collection<string, Guild>): Promise<void> {
  for (const kickChannel of kickChannels) {
    if (!kickChannel?.stream.is_live) {
      continue;
    }

    const timeSinceLive = date.valueOf() - (new Date(kickChannel.stream.start_time)).valueOf();
    if (300_000 < timeSinceLive) {
      logDebug('Kick', `Channel ${kickChannel.slug} has been live for more than 5 minutes (${Math.floor(timeSinceLive / 1000)}s), skipping notification`);
      continue;
    }

    const entries = channelEntries.filter(entry => entry.broadcasterUserId === kickChannel.broadcaster_user_id);
    logDebug('Kick', `Processing live channel ${kickChannel.slug}`, { entries, kickChannel });
    for (const { guildId, notificationChannelId, notificationRoleId } of entries) {
      logDebug('Kick', `Posting notification for ${kickChannel.slug} in guild ${guildId} channel ${notificationChannelId} role ${notificationRoleId}`);
      const embed = createKickStreamEmbed(kickChannel);

      const guild = guilds.get(guildId);
      const message: MessageCreateOptions = {
        content: `${notificationRoleId ? `<@&${notificationRoleId}> ` : ''}${kickChannel.slug} is live on Kick!`,
        embeds:  [embed]
      };

      logDebug('Kick', `Posting live notification for ${kickChannel.slug}`, { guildId, notificationChannelId, notificationRoleId } );
      sendDiscordMessage(notificationChannelId, guild, message);
    }
  }
};