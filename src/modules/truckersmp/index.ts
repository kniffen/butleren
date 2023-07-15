import { ChannelType } from 'discord.js';

import { commands } from './commands';
import { BotModule } from '../../types/butleren';

export const truckersmpModule: BotModule = {
  id: 'truckersmp',
  name: 'TruckersMP',
  description: 'Adds TruckersMP related features',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands
};