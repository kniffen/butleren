import { ChannelType } from 'discord.js'

export const id = 'truckersmp'
export const name = 'TruckersMP'
export const description = 'Adds TruckersMP related features'
export const allowedChannelTypes = [ChannelType.GuildText]
export const isLocked = false
export * as commands from './commands/index.js'