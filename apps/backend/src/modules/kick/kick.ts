import { ChannelType } from 'discord.js';
import type { BotModule, BotCommand } from '../../types';
import { kickStreamCommand } from './commands/kickStream';
import { onKickInterval } from './interval/onKickInterval';
import { kickRouter } from './api/router';

const commands = new Map<string, BotCommand>([
  [kickStreamCommand.slashCommandBuilder.name, kickStreamCommand],
]);

export const kick: BotModule = {
  slug:                'kick',
  name:                'Kick',
  description:         'Kick.tv integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
  onInterval:          onKickInterval,
  router:              kickRouter,
  defaultSettings:     { isEnabled: false },
};