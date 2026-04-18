import { ChannelType } from 'discord.js';
import type { BotModule, BotCommand } from '../../types';
import { twitchCommand } from './commands/twitch/twitchCommand';
import { onTwitchInterval } from './interval/onTwitchInterval';
import { twitchRouter } from './api/router';

const commands = new Map<string, BotCommand>([
  [twitchCommand.slashCommandBuilder.name, twitchCommand],
]);

export const twitch: BotModule = {
  slug:                'twitch',
  name:                'Twitch',
  description:         'Twitch.tv integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
  onInterval:          onTwitchInterval,
  router:              twitchRouter,
  defaultSettings:     { isEnabled: false },
};