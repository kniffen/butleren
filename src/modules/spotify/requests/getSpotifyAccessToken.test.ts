import fetch, { Response } from 'node-fetch';
import { getSpotifyAccessToken } from './getSpotifyAccessToken';

describe('getSpotifyAccessToken()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request a spotify access token', async () => {
    fetchMock.mockResolvedValueOnce(response);
    const actual = await getSpotifyAccessToken();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://accounts.spotify.com/api/token',
      {
        method:  'POST',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type':  'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
      }
    );

    expect(actual).toBe(spotifyTokenResponseBody.access_token);
  });

  test('It should use a cached token if not expired', async () => {
    const actual = await getSpotifyAccessToken();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(actual).toBe(spotifyTokenResponseBody.access_token);
  });

  test('It should request a new token if the cached token is expired', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce(response);

    const actual = await getSpotifyAccessToken();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(actual).toBe(spotifyTokenResponseBody.access_token);

    nowSpy.mockRestore();
  });

  test('It should throw if the request fails', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

    await expect(getSpotifyAccessToken()).rejects.toThrow('Failed to get Spotify token');

    nowSpy.mockRestore();
  });
});

const spotifyTokenResponseBody = {
  access_token: 'access-token',
  expires_in:   3600,
  token_type:   '',
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(spotifyTokenResponseBody),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;