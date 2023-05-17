import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

const data =
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Latency check');

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply('pong!');
}

export const pingCommand: BotCommand = {
  isLocked: true,
  data,
  execute
};
