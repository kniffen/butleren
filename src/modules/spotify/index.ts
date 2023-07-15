import { ChannelType } from 'discord.js';

import { commands } from './commands';
import onInterval from './onInterval';
import router from './routes';

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
