import { AttachmentBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { getGeoLocation, OpenWeatherGeoLocation } from '../../../../../utils/getGeoLocation';
import {  getMapBuffer } from '../../../../../utils/getMapBuffer';
import { insertOrReplaceDBEntry } from '../../../../../database/utils/insertOrReplaceDBEntry';
import { UserDBEntry } from '../../../../../types';
import { USERS_TABLE_NAME } from '../../../constants';

export const locationSetCommand = async function(commandInteraction: ChatInputCommandInteraction): Promise<void> {
  await commandInteraction.deferReply({ ephemeral: true });

  const userId = commandInteraction.user.id;
  const name = commandInteraction.options.get('name')?.value;
  const zip = commandInteraction.options.get('zip')?.value;

  let geoLocation: OpenWeatherGeoLocation | undefined;
  if ('string' === typeof name) {
    geoLocation = await getGeoLocation({ name });
  } else  if ('string' === typeof zip) {
    geoLocation = await getGeoLocation({ zip });
  }

  if (!geoLocation) {
    await commandInteraction.editReply('Invalid location, please try again');
    return;
  }

  const mapBuffer = await getMapBuffer(geoLocation.lat, geoLocation.lon);
  const attachment = new AttachmentBuilder(mapBuffer, { name: 'map.png' });
  await insertOrReplaceDBEntry<UserDBEntry>(USERS_TABLE_NAME, { id: userId, lat: geoLocation.lat, lon: geoLocation.lon });

  await commandInteraction.editReply({
    content: `Your location is now set to ${geoLocation.name} (${geoLocation.country})`,
    files:   [attachment]
  });
};
