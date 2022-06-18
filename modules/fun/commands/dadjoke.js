import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = false
export const data =
  new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Posts a random dad joke')

/**
 * @param {Object} param 
 * @param {Object} param.interaction - Discord interaction object .
 */
export async function execute(interaction) {
  await fetch('https://icanhazdadjoke.com/', {headers: {'Accept': 'application/json'}})
    .then(res  => res.json())
    .then(data => interaction.reply({content: data.joke}))
    .catch((err) => {
      console.error(err)
      interaction.reply('Sorry, I was unable to fetch a dad joke for you.')
    })
}
