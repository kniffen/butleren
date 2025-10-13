import type { Guild, MessageCreateOptions } from 'discord.js';
import { logError } from '../../modules/logs/logger';

export const sendDiscordMessage = async function(channelId: string, guild: Guild | undefined, message: MessageCreateOptions): Promise<void> {
  try {
    if (!guild) {
      logError('Discord', `Guild is undefined, cannot send message to channel with id ${channelId}`);
      return;
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      throw new Error(`Channel with id "${channelId}" not found in guild ${guild.name}`);
    }

    if (!channel.isTextBased()) {
      throw new Error(`Channel with id "${channelId}" is not a text channel in guild ${guild.name}`);
    }

    await channel.send(message);

  } catch (error) {
    logError('Discord', `Failed to send message to channel with id ${channelId}`, { error });
  }
};