import database from '../../../database/index.js'

/**
 * @param {Object} interaction - Discord interaction
 * @returns {Promise<{location: string | void, isUserLocation: boolean}>}
 */
export const getLocation = async(interaction) => {
  let location = interaction.options.get('location')?.value;

  if (location) {
    return { location, isUserLocation: false };
  }

  const db = await database;
  const user = interaction.options.get('user')?.user || interaction.user;
  location = (await db.get('SELECT location FROM users WHERE id = ?', [user.id]))?.location;

  return {
    location: location || null,
    isUserLocation: true
  };
}