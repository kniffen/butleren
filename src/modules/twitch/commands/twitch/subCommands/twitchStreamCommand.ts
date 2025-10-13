import type { ChatInputCommandInteraction } from 'discord.js';
import type { TwitchUser } from '../../../requests/getTwitchUsers';
import { getTwitchStreams } from '../../../requests/getTwitchStreams';
import { createTwitchStreamEmbed } from '../../../utils/createTwitchStreamEmbed';

export const twitchStreamCommand = async function(commandInteraction: ChatInputCommandInteraction, user: TwitchUser): Promise<void> {
  const streams = await getTwitchStreams([user.id]);
  const embed = createTwitchStreamEmbed(user, streams.at(0));

  commandInteraction.editReply({ embeds: [embed] });
};