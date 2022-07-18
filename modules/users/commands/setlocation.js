import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'

import database from '../../../database/index.js'

export const isLocked = true

export const data =
  new SlashCommandBuilder()
    .setName('setlocation')
    .setDescription('Set your location')
    .addStringOption(option =>
      option
        .setName('location')
        .setDescription('Your location name or zip code')
        .setRequired(true)
    )

async function testLocation(location) {
  const zip = parseInt(location) || null
  const uri = 
    zip ? `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zip)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`

  const res = await fetch(uri).catch(() => null)

  return res && 200 === res.status ? true : false
}

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  let content = 'Sorry, I was unable to set your location.'

  try {
    const db = await database
    const userData = await db.get('SELECT location FROM users WHERE id = ?', [interaction.user.id])
    const location = interaction.options.get('location')?.value
    
    if (!(await testLocation(location))) {
      content = 'Sorry, I was unable to verify that location.'
      return
    }

    await db.run(
      !userData
        ? 'INSERT INTO users (location, id) VALUES (?,?)'
        : 'UPDATE users SET location = ? WHERE id = ?',
      [location, interaction.user.id]
    )

    content = `Your location is now set to \`${location}\`\nType \`/profile\` to view your updated profile.`

  } catch (err) {
    console.error(err)
  
  } finally {
    interaction.reply({content, ephemeral: true})
  }
}