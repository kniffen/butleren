import type { OpenWeatherData } from './getOpenWeatherData';
import type { WeatherLocation } from './getWeatherLocation';
import { createWeatherEmbed } from './createWeatherEmbed';

describe('createWeatherEmbed()', () => {
  test('It should create a weather embed', () => {
    const embed = createWeatherEmbed(guildSettings, openWeatherData, location);

    expect(embed.toJSON()).toEqual({
      author: {
        icon_url: 'http://openweathermap.org/img/wn/icon-url.png',
        name:     'Weather report for foobar',
      },
      color:  16711680,
      fields: [
        { name: 'Friday, April 4th, 17788 at 10:00 AM', value: 'Main (Description)' },
        { name: '💨 Wind',                              value: '8.0m/s\n17.9mph\nNorth',  inline: true },
        { name: '🌧️ Rain (1h)',                         value: '99mm\n3.90"',          inline: true },
        { name: '🌡️ Temp | Feels like',                 value: '1°C | 2°C\n34°F | 36°F', inline: true },
        { name: '🌅 Sunrise',                           value: '10:00 AM',               inline: true },
        { name: '🌇 Sunset',                            value: '2:00 AM',                inline: true },
        { name: '💦 Humidity',                          value: '6%',                     inline: true }
      ],
      footer: {
        text: 'Weather report provided by OpenWeather'
      }
    });
  });
});

const guildSettings = {
  nickname: null,
  color:    '#FF0000'
};

const openWeatherData = {
  weather: [
    { icon: 'icon-url', main: 'Main', description: 'Description' }
  ],
  main: {
    temp:       1,
    feels_like: 2,
    temp_min:   3,
    temp_max:   4,
    pressure:   5,
    humidity:   6,
  },
  visibility: 7,
  wind:       {
    speed: 8,
    deg:   9,
  },
  clouds: {
    all: 10
  },
  dt:  (new Date('1985-10-26T12:00:00Z')).valueOf(),
  sys: {
    type:    0,
    id:      0,
    country: '',
    sunrise: (new Date('1985-10-26T06:00:00Z')).valueOf(),
    sunset:  (new Date('1985-10-26T22:00:00Z')).valueOf()
  },
  rain: {
    '1h': 99,
  },
  timezone: 36_000,
  id:       0,
  name:     '',
  cod:      0
} as unknown as OpenWeatherData;

const location = {
  name: 'foobar',
} as WeatherLocation;