import { ChannelType } from 'discord.js';
import type { BotCommand, BotModule } from '../../types';
import { youTubeRouter } from './api/youTubeRouter';
import { onYouTubeInterval } from './interval/onYouTubeInterval';

const commands = new Map<string, BotCommand>([]);

export const youTube: BotModule = {
  slug:                'youtube',
  name:                'YouTube',
  description:         'YouTube integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
  router:              youTubeRouter,
  onInterval:          onYouTubeInterval,
  defaultSettings:     { isEnabled: false },
};