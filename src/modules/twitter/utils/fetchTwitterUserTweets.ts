import fetchTwitterToken from './fetchTwitterToken';
import { TwitterTweets } from '../types';

export default async function fetchTwitterUserTweets(
  id: string,
  isTokenExpired = false
): Promise<TwitterTweets['data']> {
  try {
    const uri = `https://api.twitter.com/2/users/${id}/tweets?tweet.fields=created_at,author_id,in_reply_to_user_id,referenced_tweets,attachments,entities&exclude=retweets,replies`;
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchTwitterToken(isTokenExpired)}`
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchTwitterUserTweets(id, true);

    const data = await res.json();

    return data?.data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}
