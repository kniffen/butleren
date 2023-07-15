import fetch from 'node-fetch';

import fetchTwitterToken from './fetchTwitterToken';

interface FetchTwitterUsersOptions {
  ids: string[];
  usernames: string[];
}

export default async function fetchTwitterUsers(
  { ids = [], usernames = [] }: FetchTwitterUsersOptions,
  isTokenExpired = false
): Promise<TwitterUsers['data']> {
  try {
    const uri = 0 < ids.length
      ? `https://api.twitter.com/2/users/?ids=${ids.join(',')}&user.fields=profile_image_url`
      : `https://api.twitter.com/2/users/by?usernames=${usernames.join(',')}&user.fields=profile_image_url`;

    const init = {
      headers: {
        Authorization: `Bearer ${await fetchTwitterToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchTwitterUsers({ ids, usernames }, true);

    const data = await res.json() as TwitterUsers;

    return data.data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}