import DiscordJS from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import database from '../../../database/index.js'
import { getLocation } from '../utils/getLocation.js'
import { logger } from '../../../logger/logger.js';

const BASE_URL = 'http://api.openweathermap.org';
const PATH     = '/data/2.5/forecast';

export const isLocked = false

export const data =
  new SlashCommandBuilder()
    .setName('forecast')
    .setDescription('Get a weather forecast for a location')
    .addStringOption(option => option.setName('location').setDescription('Location name or zip code'))
    .addUserOption(option => option.setName('user').setDescription('A user'));

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const { location, isUserLocation } = await getLocation(interaction);
    if (!location) {
      interaction.editReply({
        content: 'Missing location',
        ephemeral: true
      });
      return;
    }

    const zip = parseInt(location) || null;
    const url = new URL(`${BASE_URL}${PATH}`);
    if (zip) {
      url.searchParams.set('zip', zip);
    } else {
      url.searchParams.set('q', location);
    }
    url.searchParams.set('units', 'metric');
    url.searchParams.set('appid', process.env.OPEN_WEATHER_MAP_API_KEY);

    logger.info(`Open Weather API: ${PATH} request`, {url: url.toString()})
    const data = await fetch(url).then(res => res.json());
    logger.debug(`Open Weather API: ${PATH} response body`, {data});

    const db       = await database;
    const settings = await db.get('SELECT color FROM guilds WHERE id = ?', [interaction.guild.id]);
    const user     = interaction.options.get('user')?.user || interaction.user;
    const member   = interaction.guild.members.cache.get(user.id);

    const embed = new DiscordJS.EmbedBuilder();
    embed.setColor(settings.color);
    embed.setAuthor({
      name: `Weather forecast for ${isUserLocation ? member.displayName : `${data.city.name} (${data.city.country})`}`,
    });

    const forecasts = data.list.reduce((forecastsMap, forecast) => {
      const [key, time] = forecast.dt_txt.split(' ');

      if (forecastsMap.has(key)) {
        const existing = forecastsMap.get(key);
        existing.minTemp = Math.min(forecast.main.temp_min, existing.minTemp);
        existing.maxTemp = Math.max(forecast.main.temp_max, existing.maxTemp);

        if ('12:00:00' === time) {
          existing.weather = forecast.weather[0].description;
          existing.icon    = icons[forecast.weather[0].icon] || '❔';
          existing.temp    = forecast.main.temp;
          existing.dt      = forecast.dt;
        }

        return forecastsMap;
      }

      forecastsMap.set(key, {
        weather: forecast.weather[0].description,
        icon:    icons[forecast.weather[0].icon] || '❔',
        dt:      forecast.dt,
        temp:    forecast.main.temp,
        minTemp: forecast.main.temp_min,
        maxTemp: forecast.main.temp_max,
      });

      return forecastsMap;
    }, new Map())

    embed.addFields([...forecasts.values()].map(forecast => ({
      name: moment.unix(forecast.dt).format('LL'),
      value: [
        `${forecast.icon} ${forecast.weather}`,
        `🌡️ High ${Math.round(forecast.maxTemp)}°C | ${Math.round(forecast.maxTemp * 1.8 + 32)}°F`,
        `🌡️ Low ${Math.round(forecast.minTemp)}°C | ${Math.round(forecast.minTemp * 1.8 + 32)}°F`
      ].join('\n'),
      inline: true
    })));

    embed.setFooter({text: 'Weather forecast provided by OpenWeather'});

    interaction.editReply({embeds: [embed]});

  } catch (err) {
    logger.error(`Open Weather API: ${PATH} error`, {err});
    console.error(err);
    interaction.editReply({
      content: 'Sorry, I was unable to retrieve the weather forecast for you',
      ephemeral: true
    });
  }
}

const icons = {
  '01d': '☀️',
  '02d': '⛅️',
  '03d': '☁️',
  '04d': '☁️',
  '09d': '\uD83C\uDF27',
  '10d': '\uD83C\uDF26',
  '11d': '⛈',
  '13d': '❄️',
  '50d': '\uD83C\uDF2B',
  '01n': '\uD83C\uDF11',
  '02n': '\uD83C\uDF11 ☁',
  '03n': '☁️',
  '04n': '☁☁',
  '09n': '\uD83C\uDF27',
  '10n': '☔️',
  '11n': '⛈',
  '13n': '❄️',
  '50n': '\uD83C\uDF2B'
}