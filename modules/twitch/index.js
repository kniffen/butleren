export const id = 'twitch'
export const name = 'Twitch'
export const description = 'Twitch.TV integration'
export const allowedChannelTypes = ['GUILD_TEXT']
export const isLocked = false
export * as commands from './commands/index.js'
export { default as onInterval } from './onInterval.js'
export { default as router } from './routes/index.js'