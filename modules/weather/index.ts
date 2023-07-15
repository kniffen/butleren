import { ChannelType } from 'discord.js'
import * as commands from './commands'

export default {
  id: 'weather',
  name: 'Weather',
  description: 'Provides weather reports',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands
} satisfies BotModule