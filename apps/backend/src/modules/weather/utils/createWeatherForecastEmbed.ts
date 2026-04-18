import { Collection, EmbedBuilder } from 'discord.js';
import { formatDate } from 'date-fns';
import { hexToRGB } from '../../logs/colors';
import type { OpenWeatherForecast, OpenWeatherForecastData } from './getOpenWeatherForecastData';
import type { WeatherLocation } from './getWeatherLocation';
import type { GuildSettings } from '../../../types';
import { logDebug } from '../../logs/logger';
import { formatTemp } from '../../../utils/formatTemp';
import { formatWindSpeed } from '../../../utils/formatWindSpeed';

export const createWeatherForecastEmbed = function(guildSettings: GuildSettings, data: OpenWeatherForecastData, location: WeatherLocation): EmbedBuilder {
  const { list } = data;
  const embed = new EmbedBuilder();

  const groupedForecasts = list.reduce<Collection<string, OpenWeatherForecast[]>>((groups, forecast) => {
    const date = forecast.dt_txt.split(' ')[0];
    const dateForecasts: OpenWeatherForecast[] = groups.get(date) || [];
    dateForecasts.push(forecast);
    groups.set(date, dateForecasts);
    return groups;
  }, new Collection());

  embed.setColor(hexToRGB(guildSettings.color));
  embed.setAuthor({ name: `Weather forecast for ${location.name}` });

  logDebug('Weather', `Processing ${groupedForecasts.size} days of forecasts`, { groupedForecasts: [...groupedForecasts.entries()] });

  groupedForecasts.forEach((forecasts, dateStr) => {
    const minTemp      = Math.min(...forecasts.map(f => f.main.temp_min));
    const maxTemp      = Math.max(...forecasts.map(f => f.main.temp_max));
    const maxWindSpeed = Math.max(...forecasts.map(f => f.wind.speed));

    const weather = forecasts.reduce<[OpenWeatherForecast['weather'][number], number][]>((acc, forecast) => {
      const [forecastedWeather] = forecast.weather;
      const existing = acc.find(w => w[0].id === forecastedWeather.id);
      if (existing) {
        existing[1]++;
      } else {
        acc.push([forecastedWeather, 1]);
      }

      return acc;
    }, []).sort((a, b) => b[1] - a[1])[0]?.[0];

    const date = new Date(dateStr);
    embed.addFields({
      name:  formatDate(date, 'PPP'),
      value: [
        `${icons[weather.icon] || '❔'} ${weather.description}`,
        `🌡️ High ${formatTemp(maxTemp).join(' | ')}`,
        `🌡️ Low ${formatTemp(minTemp).join(' | ')}`,
        `💨 ${formatWindSpeed(maxWindSpeed).join(' | ')}`,
      ].join('\n'),
      inline: true
    });

  });

  embed.setFooter({ text: 'Weather forecast provided by OpenWeather' });

  return embed;
};

const icons: Record<string, string> = {
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
};