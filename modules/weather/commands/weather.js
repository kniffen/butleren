import DiscordJS from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

import database from '../../../database/index.js'

export const isLocked = false

export const data =
  new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get a weather report for a location')
    .addStringOption(option => option.setName('location').setDescription('Location name or zip code'))
    .addUserOption(option => option.setName('user').setDescription('A user'));

const windDirections = [
  'North',
  'Northeast',
  'East',
  'Southeast',
  'South',
  'Southwest',
  'West',
  'Northwest'
]

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  try {
    const db = await database
    const settings = await db.get('SELECT color FROM guilds WHERE id = ?', [interaction.guild.id])
    const user = interaction.options.get('user')?.user || interaction.user
    let query = interaction.options.get('location')?.value

    const location =
      !query 
        ? (await db.get('SELECT location FROM users WHERE id = ?', [user.id]))?.location
        : null

    if (!query && !location) {
      interaction.reply({
        content: 'Missing location',
        ephemeral: true
      })
      return
    }

    const zip = parseInt(query || location) || null
    const uri = 
      zip ? `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zip)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`
          : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query || location)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`

    const data = await fetch(uri).then(res => res.json())
    const embed = new DiscordJS.MessageEmbed()

    embed.setColor(settings.color)
    embed.setAuthor({
      name: `Weather report for ${location ? user.username : `${data.name} (${data.sys.country})`}`,
      iconURL: `http://openweathermap.org/img/wn/${data.weather?.[0].icon}.png`
    })

    const date = moment.utc((data.dt + data.timezone) * 1000)
    embed.addField(date.format('LLL'), `${data.weather?.[0].main} (${data.weather?.[0].description})`)

    embed.addField(
      '💨 Wind',
      `${data.wind.speed.toFixed(1)}m/s\n` + 
      `${(data.wind.speed * 2.23694).toFixed(1)}mph\n` +
      `${windDirections[Math.floor(data.wind.deg % 360 / (360 / windDirections.length))]}`,
    true)

    const precips = [
      {type: 'rain', time: '1h', amount: data.rain?.['1h']},
      {type: 'rain', time: '3h', amount: data.rain?.['3h']},
      {type: 'snow', time: '1h', amount: data.rain?.['1h']},
      {type: 'snow', time: '3h', amount: data.rain?.['3h']},
    ]

    const precip = precips.find(precip => precip.amount)

    embed.addField(
      `${'snow' === precip?.type ? '🌨️ Snow' : '🌧️ Rain'} (${precip?.time || '3h'})`,
      `${precip?.amount || '0.00'}mm\n${precip ? (precip.amount * 0.0393701).toFixed(2) : '0.00'}inch`,
      true
    )

    embed.addField(
      '🌡️ Temp | Feels like',
      `${Math.round(data.main.temp)}°C | ${Math.round(data.main.feels_like)}°C\n` +
      `${Math.round(data.main.temp * 1.8 + 32)}°F | ${Math.round(data.main.feels_like * 1.8 + 32)}°F`,
      true
    )


    embed.addField(
      '🌅 Sunrise',
      moment.utc((data.sys.sunrise + data.timezone) * 1000).format('LT'),
      true
    )
    
    embed.addField(
      '🌇 Sunset',
      moment.utc((data.sys.sunset + data.timezone) * 1000).format('LT'),
      true
    )
    
    embed.addField('💦 Humidity', `${data.main.humidity}%`, true)

    embed.setFooter({text: "Weather report provided by OpenWeather"})
    
    interaction.reply({
      embeds: [embed]
    })
      
  } catch(err) {
    console.error(err)
    interaction.reply({
      content: 'Sorry, I was unable to fetch a weather report for you',
      ephemeral: true
    })
  }
}