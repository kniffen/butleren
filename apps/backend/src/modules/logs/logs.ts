import type { BotCommand, BotModule } from '../../types';
import { logsRouter } from './api/router';

const commands = new Map<string, BotCommand>([]);

export const logs: BotModule = {
  slug:                'logs',
  name:                'Logs',
  description:         'Logging of bot activities and errors',
  allowedChannelTypes: [],
  isLocked:            true,
  commands,
  router:              logsRouter,
  defaultSettings:     { isEnabled: true },
};