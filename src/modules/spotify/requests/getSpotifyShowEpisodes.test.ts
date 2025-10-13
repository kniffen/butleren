import fetch, { Response } from 'node-fetch';
import * as getSpotifyAccessToken from './getSpotifyAccessToken';
import { getSpotifyShowEpisodes } from './getSpotifyShowEpisodes';

describe('getSpotifyShowEpisodes', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getSpotifyAccessTokenSpy = jest.spyOn(getSpotifyAccessToken, 'getSpotifyAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getSpotifyAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request spotify show episodes via a show id', async () => {
    const actual = await getSpotifyShowEpisodes('1234');

    expect(getSpotifyAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows/1234/episodes?market=US', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toEqual(['episode-1', 'episode-2']);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Spotify'),
    } as unknown as Response);

    await expect(getSpotifyShowEpisodes('1234')).rejects.toThrow('Failed to fetch Spotify show episodes');
  });
});

const spotifyShowEpisodesResponseBody = {
  items: [null, 'episode-1', 'episode-2'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(spotifyShowEpisodesResponseBody),
} as unknown as Response;
