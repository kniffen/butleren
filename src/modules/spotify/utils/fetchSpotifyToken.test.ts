import { fetchSpotifyToken } from './fetchSpotifyToken';
import { SpotifyTokenResponse } from '../types';

describe('moduled.spotify.utils.fetchSpotifyToken()', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();
  let access_token = 'spotifyToken';

  beforeAll(function () {
    fetchMock.mockResolvedValue({
      json: async (): Promise<SpotifyTokenResponse> => ({
        access_token,
        token_type: 'Bearer',
        expires_in: 3600
      })
    } as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should return a new token', async function () {
    const token = await fetchSpotifyToken();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    expect(token).toEqual('spotifyToken');
  });

  it('Should return a stored token', async function () {
    const token = await fetchSpotifyToken();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(token).toEqual('spotifyToken');
  });

  it('Should replace an expired token', async function () {
    access_token = 'anotherSpotifyToken';

    const token = await fetchSpotifyToken(true);

    expect(fetchMock).toHaveBeenCalled();
    expect(token).toEqual('anotherSpotifyToken');
  });
});