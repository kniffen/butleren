import { ChannelType } from 'discord.js'

export const id = 'weather'
export const name = 'Weather'
export const description = 'Provides weather reports'
export const allowedChannelTypes = [ChannelType.GuildText]
export const isLocked = false
export * as commands from './commands/index.js'