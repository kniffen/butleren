import DiscordJS from 'discord.js'
import moment from 'moment-timezone'

import fetchTwitchUsers from '../../utils/fetchTwitchUsers.js'
import fetchTwitchSchedule from '../../utils/fetchTwitchSchedule.js'

export default async function schedule(interaction) {
  try {
    const username = interaction.options.get('channel')?.value.split(' ').shift()
    const [ user ] = await fetchTwitchUsers({usernames: [username.toLowerCase()]}) 
    
    if (!user) return interaction.reply({
      content: `Sorry, i was unable to find "${username}" on twitch :(`,
      ephemeral: true
    })
    
    const schedule = await fetchTwitchSchedule({id: user.id})
    const embed = new DiscordJS.EmbedBuilder()

    if (1 > schedule.length) return interaction.reply({
      content: `${user.display_name} does not appear to have a schedule configured`,
      ephemeral: true
    })

    embed.setTitle(`Stream schedule for ${user.display_name}`)
    embed.setURL(`https://twitch.tv/${user.login}/schedule`)
    embed.setColor('#9146FF') // Twitch purple
    embed.setThumbnail(user.profile_image_url)
    embed.setFooter({text: 'Times are in your local timezone'})

    const fields = []
    for (let i = 0; i < 3 && i < schedule.length; i++) {
      fields.push({
        name: `<t:${moment(schedule[i].start_time).format('X')}>`,
        value: `${schedule[i].title || 'Untitled'}${schedule[i].category ? ' ('+schedule[i].category.name+')' : ''}`,
      })
    }
    embed.addFields(...fields)

    interaction.reply({embeds: [embed]})
    
  } catch(err) {
    console.error(err)
    interaction.reply({
      content: 'Something went horribly wrong',
      ephemeral: true
    })
  }


}