import fetch, { Response } from 'node-fetch';
import * as getSpotifyAccessToken from './getSpotifyAccessToken';
import { getSpotifySearch } from './getSpotifySearch';

describe('Spotify: getSpotifySearch()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getSpotifyAccessTokenSpy = jest.spyOn(getSpotifyAccessToken, 'getSpotifyAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getSpotifyAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request spotify search result via a query', async () => {
    const actual = await getSpotifySearch('foobar');

    expect(getSpotifyAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?offset=0&limit=5&query=foobar&type=show', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toBe(spotifySearchResponseBody.shows.items);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Spotify'),
    } as unknown as Response);

    await expect(getSpotifySearch('foobar')).rejects.toThrow('Failed to fetch Spotify search results');
  });
});

const spotifySearchResponseBody = {
  shows: {
    items: ['show-A', 'show-B']
  },
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(spotifySearchResponseBody),
} as unknown as Response;
