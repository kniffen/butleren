import { ChannelType } from 'discord.js'

import { BotModule } from '../'
import onInterval from './onInterval'
import router from './routes'

const youtubeModule: BotModule = {
  id: 'youtube',
  name: 'YouTube',
  description: 'YouTube integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  onInterval,
  router
}

export default youtubeModule