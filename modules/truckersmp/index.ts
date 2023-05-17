import { ChannelType } from 'discord.js';

import commands from './commands';

const truckersmpBotModule: BotModule = {
  id: 'truckersmp',
  name: 'TruckersMP',
  description: 'Adds TruckersMP related features',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands
};

export default truckersmpBotModule;