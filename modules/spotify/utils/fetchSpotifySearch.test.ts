import fetch, { Response } from 'node-fetch';

import { fetchSpotifySearch } from './fetchSpotifySearch';
import { fetchSpotifyToken } from './fetchSpotifyToken';

jest.mock(
  './fetchSpotifyToken',
  () => ({ __esModule: true, fetchSpotifyToken: jest.fn() })
);

describe('moduled.spotify.utils.fetchSpotifySearch()', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const fetchSpotifyTokenMock = fetchSpotifyToken as jest.MockedFunction<typeof fetchSpotifyToken>;
  const results = { shows: { items: ['foo', 'bar'] } } as unknown as SpotifySearchResult;

  beforeAll(function () {
    fetchSpotifyTokenMock.mockResolvedValue('spotifyToken');
    fetchMock.mockResolvedValue({
      json: async () => results
    } as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should return the search results', async function () {
    const results = await fetchSpotifySearch('foo', 'bar');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?q=foo&type=bar&market=US&limit=5',
      {
        headers: {
          Authorization: 'Bearer spotifyToken',
          'Content-Type': 'application/json'
        }
      }
    );

    expect(results).toEqual(results);
  });

  it('Should use arguments in the URI', async function () {
    await fetchSpotifySearch('foo', 'show', 'market001', 999);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?q=foo&type=show&market=market001&limit=999',
      expect.anything()
    );
  });

  it('Should handle the token being invalid', async function () {
    fetchMock.mockResolvedValueOnce({ status: 401, ok: false } as Response);

    const results = await fetchSpotifySearch('foo', 'bar');

    expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/search?q=foo&type=bar&market=US&limit=5', expect.anything());
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/search?q=foo&type=bar&market=US&limit=5', expect.anything());

    expect(results).toEqual(results);
  });
});
