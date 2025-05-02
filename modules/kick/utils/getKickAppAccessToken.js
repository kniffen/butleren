import fetch from 'node-fetch';
import { logger } from '../../../logger/logger.js';

let appAccessToken = null;
let expiresTimestamp = 0;

export const getKickAppAccessToken = async function() {
  try {
    if (appAccessToken && expiresTimestamp > Date.now()) {
      return appAccessToken
    }

    const { KICK_CLIENT_ID, KICK_CLIENT_SECRET } = process.env
    const url = 'https://id.kick.com/oauth/token'
    const params = new URLSearchParams({
      client_id: KICK_CLIENT_ID,
      client_secret: KICK_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })

    logger.info('Kick API: /oauth/token request', {url});
    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    logger.info('Kick API: /oauth/token response', {status: response.status});
    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data = await response.json()
    logger.debug('Kick API: /oauth/token response body', {data});

    appAccessToken = data.access_token
    expiresTimestamp = Date.now() + (data.expires_in * 1000);

    return appAccessToken

  } catch (err) {
    logger.error('Kick API: /oauth/token', err);
    console.error('Error fetching access token:', err);
    return null;
  }
}