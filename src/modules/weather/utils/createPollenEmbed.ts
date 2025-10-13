import { EmbedBuilder } from 'discord.js';
import { formatDate } from 'date-fns';
import { hexToRGB } from '../../logs/colors';
import type { GooglePollenData, GooglePollenPlant } from './getGooglePollenData';
import type { WeatherLocation } from './getWeatherLocation';
import type { GuildSettings } from '../../../types';

export const createPollenEmbed = function(guildSettings: GuildSettings, data: GooglePollenData, location: WeatherLocation): EmbedBuilder {
  const info = data.dailyInfo.at(0);
  const embed = new EmbedBuilder();

  embed.setColor(hexToRGB(guildSettings.color));
  embed.setAuthor({ name: `Pollen report for ${location.name}` });
  embed.setFooter({ text: 'Pollen report provided by Google' });

  if (!info) {
    embed.setDescription('No pollen data available for this location.');
    return embed;
  }


  embed.addFields({
    name:  'Date',
    value: formatDate(new Date(`${info.date.year}-${info.date.month}-${info.date.day}`), 'PPP'),
  });

  const { pollenTypeInfo, plantInfo } = info;

  const pollenTypeFields = pollenTypeInfo.reduce<{name: string, value: string}[]>((fields, pollenType) => {
    if (pollenType.indexInfo) {
      fields.push({
        name:  pollenType.displayName,
        value: pollenType.indexInfo.indexDescription
      });
    }
    return fields;
  }, []);

  const plantFields = plantInfo.reduce<{name: string, value: string, inline: boolean}[]>((fields, plant) => {
    if (plant.indexInfo) {
      const level = levels[plant.indexInfo.value];
      fields.push({
        name:   `${plantEmojis[plant.code]} ${plant.displayName}`,
        value:  `${level.emoji} ${level.text}`,
        inline: true
      });
    }

    return fields;
  }, []);

  if (0 === pollenTypeFields.length && 0 === plantFields.length) {
    embed.setDescription('No pollen data available for this location.');
    return embed;
  }

  // Add blank fields to ensure proper alignment
  while (0 !== plantFields.length % 3) {
    plantFields.push({ name: '\u200B', value: '\u200B', inline: true });
  }

  embed.addFields(pollenTypeFields);
  embed.addFields(plantFields);

  return embed;
};

const levels = [
  { text: 'None',      emoji: '⠀⠀' },
  { text: 'Very low',  emoji: '⠀⠀' },
  { text: 'Low',       emoji: '⠀⠀' },
  { text: 'Moderate',  emoji: '⠀⠀' },
  { text: 'High',      emoji: '⠀⠀' },
  { text: 'Very high', emoji: '⚠️' },
];

const plantEmojis: Record<GooglePollenPlant, string> = {
  PLANT_UNSPECIFIED: '🌿',
  ALDER:             '🍂',
  ASH:               '🍃',
  BIRCH:             '🌿',
  COTTONWOOD:        '🌳',
  ELM:               '🌳',
  MAPLE:             '🍁',
  OLIVE:             '🫒',
  JUNIPER:           '🌲',
  OAK:               '🌳',
  PINE:              '🌲',
  CYPRESS_PINE:      '🌲',
  HAZEL:             '🌰',
  GRAMINALES:        '🌾',
  RAGWEED:           '🌿',
  MUGWORT:           '🌿',
};