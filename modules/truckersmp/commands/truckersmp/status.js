import fetch from 'node-fetch'
import DiscordJS from 'discord.js'

export default async function gametime(interaction) {
  try {

    const [ gameTime, servers ] = await Promise.all([
      fetch('https://api.truckersmp.com/v2/game_time').then(res => res.json()),
      fetch('https://api.truckersmp.com/v2/servers').then(res => res.json()),
    ])

    const embed = new DiscordJS.MessageEmbed()
    const dd = d => d < 10 ? `0${d}` : d
    const hh = dd(Math.floor(gameTime.game_time / 60 % 24))
    const mm = dd(Math.round(gameTime.game_time % 60))

    embed.setColor('#B92025') // TruckersMP red
    embed.setTitle('TruckersMP server status')

    for (const server of servers.response) {
      embed.addField(
        `${server.online ? '🟢' : '🔴'} ${server.name}`, 
        `Players: ${server.players.toLocaleString()}/${server.maxplayers.toLocaleString()}`,
        true
      )
    }

    embed.setFooter({text: `Current in-game time: ${hh}:${mm}`})

    interaction.reply({embeds: [embed]})
    
  } catch(err) {
    console.error(err)

    interaction.reply({
      content: 'Sorry, I was unable fetch the current status of TruckersMP for you :(',
      ephemeral: true
    })
  }
}