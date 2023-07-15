import { ChannelType } from 'discord.js';

import { commands } from './commands';
import onInterval from './onInterval';
import router from './routes';
import { BotModule } from '../../types/butleren';

export const spotifyModule: BotModule = {
  id: 'spotify',
  name: 'Spotify',
  description: 'Spotify integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands,
  onInterval,
  router
};
