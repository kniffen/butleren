import fetch from 'node-fetch'

import database from '../../../../database/index.js'

async function testLocation(location) {
  const zip = parseInt(location) || null
  const uri = zip
    ? `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zip)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`
    : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`

  const res = await fetch(uri).catch(() => null)

  return res?.ok
}

/**
 * @param {Object} interaction - Discord interaction object.
 */
export default async function setLocation(interaction) {
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