import { fetchSpotifyShows } from './fetchSpotifyShows';
import { fetchSpotifyToken } from './fetchSpotifyToken';

jest.mock(
  './fetchSpotifyToken',
  () => ({ __esModule: true, fetchSpotifyToken: jest.fn() })
);

describe('moduled.spotify.utils.fetchSpotifyShows()', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const fetchSpotifyTokenMock = fetchSpotifyToken as jest.MockedFunction<typeof fetchSpotifyToken>;

  beforeAll(function () {
    fetchSpotifyTokenMock.mockResolvedValue('spotifyToken');
    fetchMock.mockResolvedValue({
      json: async () => ({ shows: ['foo', 'bar'] } as unknown as { shows: SpotifyShow[]; })
    } as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should return an array of shows', async function () {
    const results = await fetchSpotifyShows(['show001', 'show002']);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows?ids=show001,show002&market=US',
      {
        headers: {
          Authorization: 'Bearer spotifyToken',
          'Content-Type': 'application/json'
        }
      }
    );

    expect(results).toEqual(['foo', 'bar']);
  });

  it('Should use arguments in the URI', async function () {
    await fetchSpotifyShows(['show001', 'show002'], 'market001');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows?ids=show001,show002&market=market001',
      expect.anything()
    );
  });

  it('Should handle there being no shows', async function () {
    fetchMock.mockResolvedValue({
      json: async () => ([])
    } as Response);

    const results = await fetchSpotifyShows(['show001', 'show002']);

    expect(results).toEqual([]);
  });

  it('Should handle the token being invalid', async function () {
    fetchMock.mockResolvedValue({ status: 401 } as Response);

    const results = await fetchSpotifyShows(['show001', 'show002']);

    expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything());
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything());

    expect(results).toEqual([]);
  });

  it('Should handle the request failing', async function () {
    fetchMock.mockRejectedValue('Error message');

    const results = await fetchSpotifyShows(['show001', 'show002']);

    expect(console.error).toHaveBeenCalledWith('Error message');
    expect(results).toEqual([]);
  });
});
