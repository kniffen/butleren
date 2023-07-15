import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { BotCommand } from '../../../types/butleren';

const data =
  new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Posts a random cat image');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  await fetch('https://aws.random.cat/meow')
    .then(res => res.json())
    .then(data => interaction.editReply({ files: [data.file] }))
    .catch((err) => {
      console.error(err);
      interaction.editReply({ files: ['http://i.imgur.com/Bai6JTL.jpg'] });
    });
};

export const catCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};
