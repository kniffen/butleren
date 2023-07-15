import { ChannelType } from 'discord.js';
import Cleverbot from 'cleverbot-node';

import onMessage from './onMessage';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const cleverbot = new Cleverbot();

if (!process.env.CLEVERBOT_API_KEY)
  throw new Error('Missing Cleverbot API key');

cleverbot.configure({ botapi: process.env.CLEVERBOT_API_KEY });

export const cleverbotModule: BotModule = {
  id: 'cleverbot',
  name: 'Cleverbot',
  allowedChannelTypes: [ChannelType.GuildText],
  description: 'Talk to the artificial intelligence known as Cleverbot',
  isLocked: false,
  onMessage: (message) => onMessage(message, cleverbot)
};