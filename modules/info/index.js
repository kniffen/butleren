import { ChannelType } from 'discord.js'

export const id = 'info'
export const name = 'Info'
export const description = 'Adds various informative commands'
export const allowedChannelTypes = [ChannelType.GuildText]
export const isLocked = true
export * as commands from './commands/index.js'