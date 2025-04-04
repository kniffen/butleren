import DiscordJS from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import database from '../../../database/index.js'
import { getLocation } from '../utils/getLocation.js'
import { logger } from '../../../logger/logger.js';
import { getGeoLocation } from '../utils/getGeoLocation.js'

const API_URL = 'https://pollen.googleapis.com/v1/forecast:lookup';

export const isLocked = false

export const data =
  new SlashCommandBuilder()
    .setName('pollen')
    .setDescription('Get a pollen report for a location')
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

    const geoLocation = await getGeoLocation(location)
    if (!geoLocation) {
      interaction.editReply({
        content: 'Missing location',
        ephemeral: true
      });
      return;
    }

    const db       = await database;
    const settings = await db.get('SELECT color FROM guilds WHERE id = ?', [interaction.guild.id]);
    const user     = interaction.options.get('user')?.user || interaction.user;
    const member   = interaction.guild.members.cache.get(user.id);

    const url = new URL(API_URL);
    url.searchParams.set('key', process.env.GOOGLE_API_KEY);
    url.searchParams.set('location.latitude', geoLocation.lat);
    url.searchParams.set('location.longitude', geoLocation.lon);
    url.searchParams.set('days', '1');

    logger.info('Google Pollen API request', {url: url.toString()})
    const res = await fetch(url);
    const data = await res.json();
    logger.debug('Google Pollen API response body', {data});

    const dayInfo = data.dailyInfo[0];
    const pollenTypeInfo = dayInfo.pollenTypeInfo;
    const plantInfo = dayInfo.plantInfo.filter(plant => plant.indexInfo?.value !== undefined)
    const date = moment.utc(new Date(dayInfo.date.year, dayInfo.date.month - 1, dayInfo.date.day));

    const embed = new DiscordJS.EmbedBuilder()
    embed.setColor(settings.color)

    const userDisplayName = member ? member.displayName : user.username;
    embed.setAuthor({
      name: `Pollen report for ${isUserLocation ? userDisplayName : `${geoLocation.name}`} | ${date.format('LL')}`,
    })

    const typeInfoEmbeds = pollenTypeInfo?.filter(info => !!info.healthRecommendations?.length).map(info => ({
      name: info.displayName,
      value: info.indexInfo.indexDescription,
    })) || [];

    const embedFields = plantInfo.map(item => {
      const level = levels[item.indexInfo.value];
      return {
        name: `${plantEmojis[item.code]} ${item.displayName}`,
        value: `${level.emoji} ${level.text}`,
        inline: true
      };
    })

    // Add blank fields to ensure proper alignment
    while (0 !== embedFields.length % 3) {
      embedFields.push({ name: '\u200B', value: '\u200B', inline: true });
    }


    embed.addFields([
      ...typeInfoEmbeds,
      ...embedFields
    ]);
    embed.setFooter({text: 'Pollen report provided by Google'})

    interaction.editReply({
      embeds: [embed]
    })

  } catch (err) {
    logger.error('Google Pollen API error', {err});
    console.error(err);
    interaction.editReply({
      content: 'Sorry, I was unable to retrieve the pollen report for you',
      ephemeral: true
    });
  }
}

const levels = [
  { text: 'None',      emoji: '⠀⠀' },
  { text: 'Very low',  emoji: '⠀⠀' },
  { text: 'Low',       emoji: '⠀⠀' },
  { text: 'Moderate',  emoji: '⠀⠀' },
  { text: 'High',      emoji: '⠀⠀' },
  { text: 'Very high', emoji: '⚠️' },
];

const plantEmojis = {
  HAZEL:      '🌰',
  COTTONWOOD: '🌳',
  BIRCH:      '🌿',
  OLIVE:      '🫒',
  ALDER:      '🍂',
  MAPLE:      '🍁',
  ELM:        '🌳',
  ASH:        '🍃',
  PINE:       '🌲',
  OAK:        '🌳',
  JUNIPER:    '🌲',
  GRAMINALES: '🌾',
  RAGWEED:    '🌿',
};