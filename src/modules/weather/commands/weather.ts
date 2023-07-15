import DiscordJS, { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import moment from 'moment-timezone';

import database from '../../../database';

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
];

export async function execute(interaction: CommandInteraction) {
  try {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const db = await database;
    const settings = await db.get('SELECT color FROM guilds WHERE id = ?', [interaction.guild.id]);
    const user = interaction.options.get('user')?.user || interaction.user;
    const query = interaction.options.get('location')?.value;

    const location =
      !query
        ? (await db.get('SELECT location FROM users WHERE id = ?', [user.id]))?.location
        : null;

    if (!query && !location) {
      interaction.editReply({
        content: 'Missing location',
      });
      return;
    }

    const zip = parseInt(query || location) || null;
    const uri = zip
      ? `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zip)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query || location)}&units=metric&APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}`;

    const data = await fetch(uri).then(res => res.json());
    const embed = new DiscordJS.EmbedBuilder();

    const date = moment.utc((data.dt + data.timezone) * 1000);
    const isAprilFools = '1Apr' === date.format('DMMM');

    const precips = [
      {type: 'rain', time: '1h', amount: data.rain?.['1h']},
      {type: 'rain', time: '3h', amount: data.rain?.['3h']},
      {type: 'snow', time: '1h', amount: data.snow?.['1h']},
      {type: 'snow', time: '3h', amount: data.snow?.['3h']},
    ];

    const precip = precips.find(precip => precip.amount);

    embed.setColor(settings.color);
    embed.setAuthor({
      name: `Weather report for ${location ? user.username : `${data.name} (${data.sys.country})`}`,
      iconURL:
        isAprilFools
          ? 'http://openweathermap.org/img/wn/02d.png'
          : `http://openweathermap.org/img/wn/${data.weather?.[0].icon}.png`
    });

    if (isAprilFools) {
      const midRad = 200;
      const maxRad = 2000;
      const radiation = Math.random() * (maxRad - midRad) + midRad;

      embed.addFields(
        {
          name:  date.add(1000, 'year').format('LLL'),
          value: 'Hot and cloudy'
        },
        {
          name:   '🌬️ Zephyr',
          value:  `${(data.wind.speed * 1000).toFixed(1)} sec/km\n` +
                  `${(data.wind.speed * 39370.1).toFixed(1)} thou/sec\n` +
                  `${windDirections[Math.floor(data.wind.deg % 360 / (360 / windDirections.length))]}`,
          inline: true
        },
        {
          name:   '☔ Acid deposition',
          value:  `${precip?.amount * 1000000 || '0.00'} µm\n${precip ? (precip.amount * 39.3701).toFixed(2) : '0.00'} thou`,
          inline: true
        },
        {
          name:   '☢️ Radiation',
          value: `${radiation.toFixed()} nSv/h\n${(radiation * 10_000).toFixed().toLocaleString()} mR/h`,
          inline: true
        },
        {
          name: '🌆 Natural light',
          value:  moment.utc((data.sys.sunrise + data.timezone) * 1000).format('HH:mm:ss'),
          inline: true
        },
        {
          name:   '💡 Illumination',
          value: moment.utc((data.sys.sunset + data.timezone) * 1000).format('HH:mm:ss'),
          inline: true
        },
        {
          name:   '🫧 Carbon dioxide',
          value:  `${data.main.humidity}%`,
          inline: true
        }
      );

      embed.setFooter({text: 'Weather report provided by the Union Aerospace Corporation'});

    } else {
      embed.addFields(
        {
          name:  date.format('LLL'),
          value: `${data.weather?.[0].main} (${data.weather?.[0].description})`
        },
        {
          name:   '💨 Wind',
          value:  `${data.wind.speed.toFixed(1)}m/s\n` +
                  `${(data.wind.speed * 2.23694).toFixed(1)}mph\n` +
                  `${windDirections[Math.floor(data.wind.deg % 360 / (360 / windDirections.length))]}`,
          inline: true
        },
        {
          name:   `${'snow' === precip?.type ? '🌨️ Snow' : '🌧️ Rain'} (${precip?.time || '3h'})`,
          value:  `${precip?.amount || '0.00'}mm\n${precip ? (precip.amount * 0.0393701).toFixed(2) : '0.00'}inch`,
          inline: true
        },
        {
          name:   '🌡️ Temp | Feels like',
          value:  `${Math.round(data.main.temp)}°C | ${Math.round(data.main.feels_like)}°C\n` +
                  `${Math.round(data.main.temp * 1.8 + 32)}°F | ${Math.round(data.main.feels_like * 1.8 + 32)}°F`,
          inline: true
        },
        {
          name:   '🌅 Sunrise',
          value:  moment.utc((data.sys.sunrise + data.timezone) * 1000).format('LT'),
          inline: true
        },
        {
          name: '🌇 Sunset',
          value: moment.utc((data.sys.sunset + data.timezone) * 1000).format('LT'),
          inline: true
        },
        {
          name:   '💦 Humidity',
          value:  `${data.main.humidity}%`,
          inline: true
        }
      );

      embed.setFooter({text: 'Weather report provided by OpenWeather'});
    }

    interaction.editReply({
      embeds: [embed]
    });

  } catch(err) {
    console.error(err);
    interaction.editReply({
      content: 'Sorry, I was unable to fetch a weather report for you',
    });
  }
}

export const weatherCommand: BotCommand = {
  isLocked: true,
  data,
  execute
};
