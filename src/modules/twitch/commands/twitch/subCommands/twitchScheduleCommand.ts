import type { ChatInputCommandInteraction } from 'discord.js';
import type { TwitchUser } from '../../../requests/getTwitchUsers';
import { getTwitchSchedule } from '../../../requests/getTwitchSchedule';
import { createTwitchScheduleEmbed } from '../../../utils/createTwitchScheduleEmbed';

export const twitchScheduleCommand = async function(commandInteraction: ChatInputCommandInteraction, user: TwitchUser): Promise<void> {
  const schedule = await getTwitchSchedule(user.id);
  const embed = createTwitchScheduleEmbed(user, schedule);

  commandInteraction.editReply({ embeds: [embed] });
};