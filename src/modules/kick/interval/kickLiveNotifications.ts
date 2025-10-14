import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPILiveStream } from '../requests/getKickLiveStreams';
import { logDebug } from '../../../modules/logs/logger';
import { createKickStreamEmbed } from '../utils/createKickStreamEmbed';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';

export const kickLiveNotifications = async function(channelEntries: KickChannelDBEntry[], liveStreams: KickAPILiveStream[], guilds: Collection<string, Guild>): Promise<void> {
  for (const liveStream of liveStreams) {
    const entries = channelEntries.filter(entry => entry.broadcasterUserId === liveStream.broadcaster_user_id);
    logDebug('Kick', `Processing live channel ${liveStream.slug}`, { entries, liveStream });

    for (const { guildId, notificationChannelId, notificationRoleId } of entries) {
      logDebug('Kick', `Posting notification for ${liveStream.slug} in guild ${guildId} channel ${notificationChannelId} role ${notificationRoleId}`);
      const embed = createKickStreamEmbed(liveStream);

      const guild = guilds.get(guildId);
      const message: MessageCreateOptions = {
        content: `${notificationRoleId ? `<@&${notificationRoleId}> ` : ''}${liveStream.slug} is live on Kick!`,
        embeds:  [embed]
      };

      logDebug('Kick', `Posting live notification for ${liveStream.slug}`, { guildId, notificationChannelId, notificationRoleId } );
      sendDiscordMessage(notificationChannelId, guild, message);
    }
  }
};