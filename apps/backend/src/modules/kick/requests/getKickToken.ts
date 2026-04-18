import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../../modules/logs/logger';
import { KICK_CLIENT_ID, KICK_CLIENT_SECRET, KICK_API_URLS } from '../constants';

export interface KickTokenResponseBody {
  access_token:  string;
  token_type:    string;
  refresh_token: string;
  expires_in:    string;
  scope:         string;
}

let kickTokenResponseBody: KickTokenResponseBody | null = null;
let expiresTimestamp = 0;

export const getKickToken = async (): Promise<KickTokenResponseBody | null> => {
  try {
    if (kickTokenResponseBody && expiresTimestamp > Date.now()) {
      return kickTokenResponseBody;
    }

    const params = new URLSearchParams({
      client_id:     KICK_CLIENT_ID,
      client_secret: KICK_CLIENT_SECRET,
      grant_type:    'client_credentials',
    });

    const url = KICK_API_URLS.TOKEN;
    logInfo('Kick', 'Token request', { url });
    const response = await fetch(url, {
      method:  'POST',
      body:    params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logInfo('Kick', 'Token response', { status: response.status });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get access token: ${text}`);
    }

    const data = await response.json() as KickTokenResponseBody;
    logDebug('Kick', 'Token response body', { data });

    kickTokenResponseBody = data;
    expiresTimestamp      = Date.now() + (Number(data.expires_in) * 1000);

    return kickTokenResponseBody;

  } catch (err) {
    logError('Kick', 'Token', err);
    return null;
  }
};