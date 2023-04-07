import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = false
export const data =
  new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Posts a random cat image')

/**
 * @param {Object} param 
 * @param {Object} param.interaction - Discord interaction object .
 */
export async function execute(interaction) {
  await interaction.deferReply()
  await fetch('https://aws.random.cat/meow')
    .then(res  => res.json())
    .then(data => interaction.editReply({files: [data.file]}))
    .catch((err) => {
      console.error(err)
      interaction.editReply({files: ['http://i.imgur.com/Bai6JTL.jpg']})
    })
}
