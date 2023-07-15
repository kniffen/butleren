import fetchTwitchToken from './fetchTwitchToken';
import { TwitchSchedule } from '../types';

export default async function fetchTwitchSchedule({ id }: {id: string}, isTokenExpired = false): Promise<TwitchSchedule['data']['segments']> {
  try {
    const uri = `https://api.twitch.tv/helix/schedule?broadcaster_id=${id}`;
    const init: RequestInit = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchSchedule({ id }, true);

    const data = await res.json() as TwitchSchedule;

    return data.data?.segments || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}