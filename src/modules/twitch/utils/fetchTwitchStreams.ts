import fetch, { RequestInit } from 'node-fetch';

import fetchTwitchToken from './fetchTwitchToken';

interface fetchTwitchStreamsOptions {
  ids: string[];
  usernames: string[];
}

export default async function fetchTwitchStreams(
  { ids = [], usernames = [] }: fetchTwitchStreamsOptions,
  isTokenExpired = false
): Promise<TwitchStreams['data']> {
  try {
    if (1 > ids.length && 1 > usernames.length) return [];

    const uri =
      0 < ids.length
        ? `https://api.twitch.tv/helix/streams?user_id=${ids.join('&user_id=')}`
        : `https://api.twitch.tv/helix/streams?user_login=${usernames.join('&user_login=')}`;

    const init: RequestInit = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchStreams({ ids, usernames }, true);

    const data = await res.json() as TwitchStreams;

    return data.data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}