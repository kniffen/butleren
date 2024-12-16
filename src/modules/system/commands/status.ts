import { memoryUsage, uptime} from 'node:process';
import { uptime as osUptime } from 'node:os';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { parseSeconds } from '../../../utils/utils.ts';
import { COLOR } from '../../../constants.ts';
import type { Command } from '../../../types.ts';

const execute = (interaction: ChatInputCommandInteraction): void => {
  const botUptime    = parseSeconds(uptime());
  const systemUptime = parseSeconds(osUptime());
  const mem          = memoryUsage();

  const embed = new EmbedBuilder()
    .setTitle('Status')
    .setColor(COLOR)
    .addFields(
      {name: 'System time',   value: new Date().toUTCString()},
      {name: 'System uptime', value: systemUptime},
      {name: 'Bot uptime',    value: botUptime},
      {name: 'Memory Usage',  value: `${(mem.heapUsed / 1024 / 1024).toFixed(0)}MB`},
    );

  interaction.reply({embeds: [embed]});
};



export const status: Command = {
  name: 'status',
  description: 'Current status of the bot.',
  execute
};