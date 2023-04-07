import fetchTwitterUsers from '../../utils/fetchTwitterUsers.js'
import fetchTwitterUserTweets from '../../utils/fetchTwitterUserTweets.js'

/**
 * 
 * @param {Object} interaction - Discord.JS interaction object
 * @returns Void
 */
export default async function latesttweet(interaction) {
  await interaction.deferReply()

  const handle = interaction.options.get('handle')?.value.split(' ').shift().replace('@', '')
  const user = (await fetchTwitterUsers({usernames: [handle]}))?.[0]

  if (!user) {
    return interaction.editReply({
      content: `Sorry, i was unable to find "@${handle}" on Twitter :(`,
      ephemeral: true
    })
  }

  const tweets = await fetchTwitterUserTweets(user.id)
  tweets.sort((a, b) => b.created_at.localeCompare(a.created_at))

  if (1 > tweets.length) {
    return interaction.editReply({
      content: `${user.name} does not appear to have any public tweets\nhttps://twitter.com/${user.username}`,
      ephemeral: true
    }) 
  }

  interaction.editReply({
    content: `Latest tweet from ${user.name}\nhttps://twitter.com/${user.username}/status/${tweets[0].id}`
  })
}