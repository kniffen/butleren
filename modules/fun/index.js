import { ChannelType } from 'discord.js'

export const id = 'fun'
export const name = 'Fun'
export const allowedChannelTypes = [
  ChannelType.GuildText,
  ChannelType.DM
]
export const description = 'Adds some fun commands'
export const isLocked = false
export * as commands from './commands/index.js'
