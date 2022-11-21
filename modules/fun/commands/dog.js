import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = false
export const data =
  new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Posts a random dog image')

/**
 * @param {Object} param 
 * @param {Object} param.interaction - Discord interaction object .
 */
export async function execute(interaction) {
  await interaction.deferReply()
  await fetch('https://dog.ceo/api/breeds/image/random')
    .then(res  => res.json())
    .then(data => interaction.editReply({files: [data.message]}))
    .catch((err) => {
      console.error(err)
      interaction.editReply({files: ['https://i.imgur.com/9oPUiCu.gif']})
    })
}