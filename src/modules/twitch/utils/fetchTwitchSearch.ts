import fetch, { RequestInit } from 'node-fetch';

import fetchTwitchToken from './fetchTwitchToken';

interface SearchOptions {
  query: string;
  type?: 'categories' | 'channels';
}

export default async function fetchTwitchSearch(
  { query, type = 'channels' }: SearchOptions,
  isTokenExpired = false
): Promise<TwitchSearchCategoryResult['data'] | TwitchSearchChannelResult['data']> {
  try {
    const uri = `https://api.twitch.tv/helix/search/${type}/?query=${encodeURIComponent(query)}`;
    const init: RequestInit = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired) {
      return fetchTwitchSearch({ query, type }, true);
    }

    const data = await res.json() as TwitchSearchCategoryResult | TwitchSearchChannelResult;

    return data.data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}