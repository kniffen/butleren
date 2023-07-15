import { ChannelType } from 'discord.js';

import onInterval from './onInterval';
import router from './routes';
import { BotModule } from '../../types/butleren';

export const youtubeModule: BotModule = {
  id: 'youtube',
  name: 'YouTube',
  description: 'YouTube integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  onInterval,
  router
};
