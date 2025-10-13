import { ChatInputCommandInteraction } from 'discord.js';
import { getGeoLocation } from '../../../utils/getGeoLocation';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { UserDBEntry } from '../../../types';
import { USERS_TABLE_NAME } from '../../users/constants';

export interface WeatherLocation {
  lat: number;
  lon: number;
  name: string;
}

export const getWeatherLocation = async function(commandInteraction: ChatInputCommandInteraction): Promise<WeatherLocation | null> {
  const location = commandInteraction.options.get('location')?.value;
  if (location) {
    const geoLocation = await getGeoLocation({ name: location.toString() });
    if (!geoLocation) {
      await commandInteraction.reply({
        content:   'Sorry, I was unable to find that location. Please try again with a different location.',
        ephemeral: true
      });
      return null;
    }
    return { lat: geoLocation.lat, lon: geoLocation.lon, name: `${geoLocation.name} (${geoLocation.country})` };
  }

  const zip = commandInteraction.options.get('zip')?.value;
  if (zip) {
    const geoLocation = await getGeoLocation({ zip: zip.toString() });
    if (!geoLocation) {
      await commandInteraction.reply({
        content:   'Sorry, I was unable to find a location with that ZIP code. Please try again with a different ZIP code.',
        ephemeral: true
      });
      return null;
    }
    return { lat: geoLocation.lat, lon: geoLocation.lon, name: `${geoLocation.name} (${geoLocation.country})` };
  }

  const user = commandInteraction.options.get('user')?.user || commandInteraction.user;
  const userDBEntry = await getDBEntry<UserDBEntry>(USERS_TABLE_NAME,{ id: user.id });
  if (!userDBEntry?.lat || !userDBEntry?.lon) {
    await commandInteraction.reply({
      content:   'The specified user has not set a location. They can set their location using `/location set`.',
      ephemeral: true
    });
    return null;
  }

  return { lat: userDBEntry.lat, lon: userDBEntry.lon, name: user.displayName };
};