import type { OpenWeatherForecastData } from './getOpenWeatherForecastData';
import type { WeatherLocation } from './getWeatherLocation';
import { createWeatherForecastEmbed } from './createWeatherForecastEmbed';

describe('createWeatherForecastEmbed()', () => {
  test('It should create a weather embed', () => {
    const embed = createWeatherForecastEmbed(guildSettings, openWeatherForecastData, location);

    expect(embed.toJSON()).toEqual({
      author: {
        name: 'Weather forecast for foobar',
      },
      color:  16711680,
      fields: [
        {
          name:   'October 26th, 1985',
          value:  '☀️ clear sky\n🌡️ High 5°C | 41°F\n🌡️ Low 1°C | 34°F\n💨 5.1m/s | 11.4mph',
          inline: true
        },
        {
          name:   'October 27th, 1985',
          value:  '⛅️ few clouds\n🌡️ High 6°C | 43°F\n🌡️ Low 0°C | 32°F\n💨 4.1m/s | 9.2mph',
          inline: true
        }
      ],
      footer: {
        text: 'Weather forecast provided by OpenWeather'
      }
    });
  });
});

const guildSettings = {
  nickname: null,
  color:    '#FF0000'
};

const openWeatherForecastData = {
  list: [
    {
      dt_txt:  '1985-10-26 06:00:00',
      main:    { temp_min: 2, temp_max: 5 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind:    { speed: 3.6 }
    },
    {
      dt_txt:  '1985-10-26 07:00:00',
      main:    { temp_min: 1, temp_max: 4 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind:    { speed: 5.1 }
    },
    {
      dt_txt:  '1985-10-27 06:00:00',
      main:    { temp_min: 0, temp_max: 6 },
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      wind:    { speed: 4.1 }
    }
  ]
} as unknown as OpenWeatherForecastData;

const location = {
  name: 'foobar',
} as WeatherLocation;