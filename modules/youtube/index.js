import './routes/index.js'

export const id = 'youtube'
export const name = 'YouTube'
export const description = 'YouTube integration'
export const allowedChannelTypes = ['GUILD_TEXT']
export const isLocked = false
export { default as onInterval } from './onInterval.js'