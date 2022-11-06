import { ChannelType } from 'discord.js'

export const id = 'users'
export const name = 'Users'
export const description = 'Adds user related features'
export const allowedChannelTypes = [ChannelType.GuildText]
export const isLocked = true
export * as commands from './commands/index.js'