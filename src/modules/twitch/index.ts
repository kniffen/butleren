import { ChannelType } from 'discord.js';

import { commands } from './commands';
import onInterval from './onInterval';
import router from './routes';
import { BotModule } from '../../types/butleren';

export const twitchModule: BotModule = {
  id: 'twitch',
  name: 'Twitch',
  description: 'Twitch.TV integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands,
  onInterval,
  router
};

