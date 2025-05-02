import { ChannelType } from 'discord.js';

export const id = 'kick';
export const name = 'Kick';
export const description = 'Kick integration';
export const allowedChannelTypes = [ChannelType.GuildText];
export const isLocked = false;
export * as commands from './commands/index.js';
export { kickOnInterval as onInterval } from './onInterval.js';
export { router } from './routes/index.js';
