import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const data =
  new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Posts a random dad joke');

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
    .then(res => res.json())
    .then(data => interaction.editReply({ content: data.joke }))
    .catch((err) => {
      console.error(err);
      interaction.editReply('Sorry, I was unable to fetch a dad joke for you.');
    });
};


export const dadjokeCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};
