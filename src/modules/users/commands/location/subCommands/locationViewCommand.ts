import { AttachmentBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { logDebug  } from '../../../../logs/logger';
import { getGeoLocation } from '../../../../../utils/getGeoLocation';
import {  getMapBuffer } from '../../../../../utils/getMapBuffer';
import { getDBEntry } from '../../../../../database/utils/getDBEntry';
import { USERS_TABLE_NAME } from '../../../constants';
import { UserDBEntry } from '../../../../../types';

export const locationViewCommand = async function(commandInteraction: ChatInputCommandInteraction): Promise<void> {
  await commandInteraction.deferReply({ ephemeral: true });

  const userId = commandInteraction.user.id;
  const user = await getDBEntry<UserDBEntry>(USERS_TABLE_NAME, { id: userId });
  logDebug('Users', 'Viewing user location', { userId, user });

  if (!user?.lat || !user?.lon) {
    await commandInteraction.editReply('You currently do not have a location set');
    return;
  }

  const geoLocation = await getGeoLocation({ lat: user.lat, lon: user.lon });
  if (!geoLocation) {
    await commandInteraction.editReply(`Your location is set to ${user.lat},${user.lon}`);
    return;
  }

  const mapBuffer = await getMapBuffer(user.lat, user.lon);
  const attachment = new AttachmentBuilder(mapBuffer, { name: 'map.png' });
  await commandInteraction.editReply({
    content: `Your location is set to ${geoLocation?.name} (${geoLocation?.country})`,
    files:   [attachment]
  });
};
