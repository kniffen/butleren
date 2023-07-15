import { ChannelType } from 'discord.js';

import { commands } from './commands';
import router from './routes';
import onInterval from './onInterval.js';

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
