import { EmbedBuilder } from 'discord.js';
import { format } from 'date-fns';
import { hexToRGB } from '../../logs/colors';
import type { OpenWeatherData } from './getOpenWeatherData';
import type { WeatherLocation } from './getWeatherLocation';
import type { GuildSettings } from '../../../types';
import { formatPrecip } from '../../../utils/formatPrecip';
import { formatWindSpeed } from '../../../utils/formatWindSpeed';
import { formatTemp } from '../../../utils/formatTemp';

export const createWeatherEmbed = function(guildSettings: GuildSettings, data: OpenWeatherData, location: WeatherLocation): EmbedBuilder {
  const { main, weather, rain, snow, dt, timezone, wind, sys } = data;
  const embed = new EmbedBuilder();

  const precip        = formatPrecip({ rain, snow });
  const offset        = (new Date()).getTimezoneOffset() * 60 + timezone;
  const localDateTime = new Date((dt          + offset) * 1000);
  const localSunrise  = new Date((sys.sunrise + offset) * 1000);
  const localSunset   = new Date((sys.sunset  + offset) * 1000);

  embed.setColor(hexToRGB(guildSettings.color));
  embed.setAuthor({
    name:    `Weather report for ${location.name}`,
    iconURL: `http://openweathermap.org/img/wn/${weather?.[0].icon}.png`
  });

  embed.addFields(
    {
      name:  format(localDateTime, 'PPPPp'),
      value: `${weather?.[0].main} (${weather?.[0].description})`
    },
    {
      name:  '💨 Wind',
      value: formatWindSpeed(data.wind.speed).join('\n') +
             `\n${windDirections[Math.floor(wind.deg % 360 / (360 / windDirections.length))]}`,
      inline: true
    },
    {
      name:   precip.name,
      value:  precip.amount.join('\n'),
      inline: true
    },
    {
      name:  '🌡️ Temp | Feels like',
      value: (
        ([tempC, tempF, feelsLikeC, feelsLikeF]: [string, string, string, string]): string => `${tempC} | ${feelsLikeC}\n${tempF} | ${feelsLikeF}`)
      ([...formatTemp(main.temp), ...formatTemp(main.feels_like)]
      ),
      inline: true
    },
    {
      name:   '🌅 Sunrise',
      value:  format(localSunrise, 'p'),
      inline: true
    },
    {
      name:   '🌇 Sunset',
      value:  format(localSunset, 'p'),
      inline: true
    },
    {
      name:   '💦 Humidity',
      value:  `${main.humidity}%`,
      inline: true
    }
  );

  embed.setFooter({ text: 'Weather report provided by OpenWeather' });

  return embed;
};

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

