import type { BotCommand, BotModule } from '../../types';
import { commandsRouter } from './api/router';

export const commands: BotModule = {
  slug:                'commands',
  name:                'Commands',
  description:         'Manage commands for your server.',
  allowedChannelTypes: [],
  isLocked:            true,
  commands:            new Map<string, BotCommand>([]),
  router:              commandsRouter,
  defaultSettings:     { isEnabled: true },
};