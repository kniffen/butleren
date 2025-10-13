import fetch, { Response } from 'node-fetch';
import * as getSpotifyAccessToken from './getSpotifyAccessToken';
import { getSpotifyShows } from './getSpotifyShows';

describe('getSpotifyShows', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getSpotifyAccessTokenSpy = jest.spyOn(getSpotifyAccessToken, 'getSpotifyAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getSpotifyAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request spotify shows by their ids', async () => {
    const actual = await getSpotifyShows(['id1', 'id2']);

    expect(getSpotifyAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows?ids=id1%2Cid2&market=US', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toBe(spotifyShowsResponseBody.shows);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Spotify'),
    } as unknown as Response);

    await expect(getSpotifyShows(['id1', 'id2'])).rejects.toThrow('Failed to fetch Spotify shows');
  });
});

const spotifyShowsResponseBody = {
  shows: ['show-A', 'show-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(spotifyShowsResponseBody),
} as unknown as Response;
