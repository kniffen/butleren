import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../../types.ts';

const execute = (interaction: ChatInputCommandInteraction): void => {
  interaction.reply('Pong!');
  throw new Error('This is an error');
};

export const ping: Command = {
  name: 'ping',
  description: 'Latency check',
  execute
};