import fetchTwitchToken from './fetchTwitchToken';

interface FetchTwitchUsersOptions {
  ids: string[];
  usernames: string[];
}

export default async function fetchTwitchUsers(
  { ids = [], usernames = [] }: FetchTwitchUsersOptions,
  isTokenExpired = false
): Promise<TwitchUsers['data']> {
  try {
    if (1 > ids.length && 1 > usernames.length) return [];

    const uri =
      0 < ids.length
        ? `https://api.twitch.tv/helix/users?id=${ids.join('&id=')}`
        : `https://api.twitch.tv/helix/users?login=${usernames.join('&login=')}`;

    const init: RequestInit = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchUsers({ ids, usernames }, true);

    const data = await res.json() as TwitchUsers;

    return data.data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}