import { ChannelType } from 'discord.js'

export const id = 'youtube'
export const name = 'YouTube'
export const description = 'YouTube integration'
export const allowedChannelTypes = [ChannelType.GuildText]
export const isLocked = false
export { default as onInterval } from './onInterval.js'
export { default as router } from './routes/index.js'