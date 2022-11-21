import DiscordJS from 'discord.js'
import moment from 'moment-timezone'

import fetchTwitchUsers from '../../utils/fetchTwitchUsers.js'
import fetchTwitchStreams from '../../utils/fetchTwitchStreams.js'

export default async function stream(interaction) {
  try {
    await interaction.deferReply()

    const username = interaction.options.get('channel')?.value.split(' ').shift()
    const [ user ] = await fetchTwitchUsers({usernames: [username.toLowerCase()]}) 
    
    if (!user) return interaction.editReply({
      content: `Sorry, i was unable to find "${username}" on twitch :(`,
      ephemeral: true
    })
    
    const [ stream ] = await fetchTwitchStreams({ids: [user.id]})
    const embed = new DiscordJS.EmbedBuilder()

    embed.setColor('#9146FF') // Twitch purple
    embed.setThumbnail(user.profile_image_url)

    if (stream) {
      embed.setTitle(`${user.display_name} is streaming on Twitch`)
      embed.setURL(`https://twitch.tv/${user.login}`)
      embed.setDescription(`**${stream.title}**`)
      embed.setImage(stream.thumbnail_url.replace('{width}', 400).replace('{height}', 225))
      embed.addFields(
        {name: 'Category', value: stream.game_name},
        {name: 'Viewers',  value: stream.viewer_count.toLocaleString()},
        {name: 'Started',  value: `<t:${moment(stream.started_at).format('X')}:R>`}
      )
    
    } else {
      embed.setTitle(`${user.display_name} is offline`)
      embed.setURL(`https://twitch.tv/${user.login}`)
      embed.setDescription(`**${user.description}**`)
      embed.setImage(user.offline_image_url.replace('{width}', 400).replace('{height}', 225))
    }

    interaction.editReply({embeds: [embed]})
    
  } catch(err) {
    console.error(err)
  }
}