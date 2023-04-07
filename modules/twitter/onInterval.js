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
    const db = await database
    const enabledGuilds =
      (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['twitter', true]))
        .map(({ guildId}) => guildId)

    const entries =
      (await db.all('SELECT * FROM twitterUsers'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId))

    // Consolidate ids so none are repeated
    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    if (1 > ids?.length) return

    const twitterUsers = await fetchTwitterUsers({ids})
    const twitterUsersTweets = await Promise.all(twitterUsers.map(async user => 
      (await fetchTwitterUserTweets(user.id))
        .filter(tweet => 1.8e+6 > date.valueOf() - (new Date(tweet.created_at)).valueOf())
    ))

    await Promise.all(entries.map((entry) => (async () => {
      const twitterUser = twitterUsers.find(user => user.id === entry.id)
      if (!twitterUser) return

      const tweets = twitterUsersTweets[twitterUsers.findIndex(user => user.id === entry.id)]
      if (1 > tweets.length) return

      const guild = guilds.find(({ id }) => id === entry.guildId)
      if (!guild) return

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) return

      const prefix = entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''
      await notificationChannel.send({
        content:
          1 < tweets.length
            ? `${prefix}${twitterUser.name} just posted some tweets\n${tweets.map(({ id }) => `https://twitter.com/${twitterUser.username}/status/${id}`).join('\n')}`
            : `${prefix}${twitterUser.name} just tweeted\nhttps://twitter.com/${twitterUser.username}/status/${tweets[0].id}`
      }).catch(console.error)
    })()))

  } catch(err) {
    console.error(err)
  }
}