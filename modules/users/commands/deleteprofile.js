import { SlashCommandBuilder } from '@discordjs/builders'

import database from '../../../database/index.js'

export const isLocked = true

export const data =
  new SlashCommandBuilder()
    .setName('deleteprofile')
    .setDescription('Remove all your data from the Bot\'s database')

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  let content = 'Sorry, I was unable to delete your data from the bot\'s database.'
  
  try {
    const db = await database
    const userData = await db.get('SELECT location FROM users WHERE id = ?', [interaction.user.id])
  
    if (!userData) {
      content = 'You currently do not have any data stored in the bot\'s database.'
      return
    }

    await db.run('DELETE FROM users WHERE id = ?', interaction.user.id)
    
    content = 'Your data has been deleted from the bot\'s database.'
      
  } catch(err) {
    console.error(err)
  
  } finally {
    interaction.reply({content, ephemeral: true})
  }
}