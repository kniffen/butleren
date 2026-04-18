import type { GooglePollenData } from './getGooglePollenData';
import type { WeatherLocation } from './getWeatherLocation';
import { createPollenEmbed } from './createPollenEmbed';

describe('createPollenEmbed()', () => {
  test('It should create a weather embed', () => {
    const embed = createPollenEmbed(guildSettings, googlePollenData, location);

    expect(embed.toJSON()).toEqual({
      ...expectedEmbed,
      fields: [
        { name: 'Date',       value: 'October 26th, 1985' },
        { name: 'Grass',      value: 'foo' },
        { name: '🌿 Ragweed', value: '⚠️ Very high', inline: true },
        { name: '\u200B',     value: '\u200B',        inline: true },
        { name: '\u200B',     value: '\u200B',        inline: true },
      ],
    });
  });

  test('It should create a weather embed with no data', () => {
    const data = { regionCode: 'US', dailyInfo: [] } as GooglePollenData;
    const embed = createPollenEmbed(guildSettings, data, location);

    expect(embed.toJSON()).toEqual({
      ...expectedEmbed,
      description: 'No pollen data available for this location.',
    });
  });

  test('It should create a weather embed with no index data', () => {
    const data = {
      regionCode: 'US',
      dailyInfo:  [{
        ...googlePollenData.dailyInfo.at(0),
        pollenTypeInfo: [{ code: 'TREE', displayName: 'Tree' }],
        plantInfo:      [{ code: 'OAK', displayName: 'Oak' }]
      }]
    } as GooglePollenData;
    const embed = createPollenEmbed(guildSettings, data, location);

    expect(embed.toJSON()).toEqual({
      ...expectedEmbed,
      description: 'No pollen data available for this location.',
      fields:      [{ name: 'Date', value: 'October 26th, 1985' }],
    });
  });
});

const guildSettings = {
  nickname: null,
  color:    '#FF0000'
};

const googlePollenData = {
  dailyInfo: [{
    date:           { year: 1985, month: 10, day: 26 },
    pollenTypeInfo: [
      {
        code:        'TREE',
        displayName: 'Tree'
      },
      {
        code:        'GRASS',
        displayName: 'Grass',
        indexInfo:   { indexDescription: 'foo' }      },
    ],
    plantInfo: [
      {
        code:        'OAK',
        displayName: 'Oak',
      },
      {
        code:        'RAGWEED',
        displayName: 'Ragweed',
        indexInfo:   { value: 5 }
      }
    ],
  }]
} as unknown as GooglePollenData;

const location = {
  name: 'foobar',
} as WeatherLocation;

const expectedEmbed = {
  author: {
    name: 'Pollen report for foobar',
  },
  color:  16711680,
  footer: {
    text: 'Pollen report provided by Google'
  }
};