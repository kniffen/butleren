import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const data =
  new SlashCommandBuilder()
    .setName('throw')
    .setDescription('Throws things!')
    .addStringOption(option =>
      option
        .setName('item')
        .setDescription('item to throw')
        .setRequired(true)
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply({ content: `(╯°□°）╯︵ ${interaction.options.get('item')?.value}` });
};

export const throwCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};
