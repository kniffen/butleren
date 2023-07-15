import { ChannelType } from 'discord.js';

import { commands } from './commands';
import router from './routes';
import onInterval from './onInterval.js';
import { BotModule } from '../../types/butleren';

export const twitterModule: BotModule = {
  id: 'twitter',
  name: 'Twitter',
  description: 'Twitter integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands,
  onInterval,
  router,
};
