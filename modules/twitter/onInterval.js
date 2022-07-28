import database from '../../database/index.js'
import fetchTwitterUsers from './utils/fetchTwitterUsers.js'
import fetchTwitterUserTweets from './utils/fetchTwitterUserTweets.js'

/**
 * 
 * @param {Object}   param
 * @param {Object[]} param.guilds - Discord.js guild objects.
 * @param {Object}   param.date - JS date object for the current date and time.
 * @returns Void
 */
export default async function twitterOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every half hour on the hour and half hour
  // For example 12:00, 12:30, 13:00 etc...
  if (0 !== date.getMinutes() % 30) return

  try {
    const db      = await database
    const entries = await db.all('SELECT * FROM twitterUsers')

    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    
    const twitterUsers = await fetchTwitterUsers({ids})
    const twitterUsersTweets = await Promise.all(twitterUsers.map(async user => {
      return (await fetchTwitterUserTweets(user.id))
              .filter(tweet => date.valueOf() - (new Date(tweet.created_at)).valueOf() < 1.8e+6)
    }))

    for (const entry of entries) {
      const user = twitterUsers.find(user => user.id === entry.id)
      const tweets = twitterUsersTweets[twitterUsers.findIndex(user => user.id === entry.id)]
      if (1 > tweets.length) continue

      const guild = guilds.find(({ id }) => id == entry.guildId)
      if (!guild) continue

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) continue

      await Promise.all(tweets.map(tweet => notificationChannel.send({
        content:
          `${entry.notificationRoleId 
            ? `<@&${entry.notificationRoleId}> `
            : ''}${user.name} just tweeted\nhttps://twitter.com/${user.username}/status/${tweet.id}`
      }))).catch(console.error)
    }

  } catch(err) {
    console.error(err)
  }
}