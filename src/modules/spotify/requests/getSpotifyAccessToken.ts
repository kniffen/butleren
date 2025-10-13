import fetch from 'node-fetch';
import { logError, logInfo } from '../../logs/logger';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../constants';

interface SpotifyAPITokenResponseBody {
   access_token: string;
   token_type: string;
   expires_in: number;
}

let spotifyAccessToken: string | null = null;
let expiry = 0;

export const getSpotifyAccessToken = async function(): Promise<string> {
  if (null !== spotifyAccessToken && Date.now() < expiry) {
    return spotifyAccessToken;
  }

  const url = 'https://accounts.spotify.com/api/token';

  logInfo('Spotify', 'Token request', { url });
  const response = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  logInfo('Spotify', 'Token response', { status: response.status });

  if (!response.ok) {
    const text = await response.text();
    logError('Spotify', 'Failed to get access token', { text });
    throw new Error('Failed to get Spotify token');
  }

  const responseBody = await response.json() as SpotifyAPITokenResponseBody;
  spotifyAccessToken = responseBody.access_token;
  expiry = Date.now() + (responseBody.expires_in * 1000) - (60_000); // Refresh 1 minute before expiry
  logInfo('Spotify', 'Obtained new access token', { expiresIn: responseBody.expires_in, expiry });

  return spotifyAccessToken;
};