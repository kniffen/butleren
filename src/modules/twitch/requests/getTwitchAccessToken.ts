import fetch from 'node-fetch';
import { TWITCH_API_SCOPES, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '../constants';
import { logError, logInfo } from '../../logs/logger';

interface TwitchTokenResponseBody {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let twitchAccessToken: string | null = null;
let expiry = 0;

export const getTwitchAccessToken = async function(): Promise<string> {
  if (null !== twitchAccessToken && Date.now() < expiry) {
    return twitchAccessToken;
  }

  const url = new URL('https://id.twitch.tv/oauth2/token');
  url.searchParams.append('client_id',     TWITCH_CLIENT_ID);
  url.searchParams.append('client_secret', TWITCH_CLIENT_SECRET);
  url.searchParams.append('grant_type',    'client_credentials');
  url.searchParams.append('scope',         TWITCH_API_SCOPES.join(' '));

  logInfo('Twitch', 'Token request', { url: url.toString() });
  const response = await fetch(url.toString(), { method: 'POST' });
  logInfo('Twitch', 'Token response', { status: response.status });

  if (!response.ok) {
    const text = await response.text();
    logError('Twitch', 'Failed to get access token', { text });
    throw new Error('Failed to get Twitch token');
  }

  const responseBody = await response.json() as TwitchTokenResponseBody;
  twitchAccessToken = responseBody.access_token;
  expiry = Date.now() + (responseBody.expires_in * 1000) - (60_000); // Refresh 1 minute before expiry
  logInfo('Twitch', 'Obtained new access token', { expiresIn: responseBody.expires_in, expiry });

  return twitchAccessToken;
};