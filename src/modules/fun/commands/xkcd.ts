import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
  .setName('xkcd')
  .setDescription('Posts XKCD comics')
  .addStringOption(option =>
    option
      .setName('id')
      .setDescription('XKCD comic id')
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  const id = interaction.options.get('id')?.value;

  await fetch(id ? `https://xkcd.com/${id}/info.0.json` : 'https://xkcd.com/info.0.json')
    .then(res => res.json())
    .then(data => {
      interaction.editReply({ files: [data.img] });
    })
    .catch(err => {
      console.error(err);
      interaction.editReply({ files: ['https://imgs.xkcd.com/comics/not_available.png'] });
    });
};

export const xkcdCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};