import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const data =
  new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Posts a random dog image');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  await fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(data => interaction.editReply({ files: [data.message] }))
    .catch((err) => {
      console.error(err);
      interaction.editReply({ files: ['https://i.imgur.com/9oPUiCu.gif'] });
    });
};

export const dogCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};