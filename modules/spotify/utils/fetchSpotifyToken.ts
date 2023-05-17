import fetch from 'node-fetch';

let token: string | null = null;

export const fetchSpotifyToken = async (isTokenExpired = false) => {
  if (null !== token && !isTokenExpired) return token;

  const uri = 'https://accounts.spotify.com/api/token';
  const init = {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const res = await fetch(uri, init);
  const data = await res.json() as SpotifyTokenResponse;

  token = data.access_token;

  return token;
};