import fetchMock from 'node-fetch';
import { getKickAppAccessToken } from './getKickAppAccessToken';

describe('module.kick.utils.getKickAppAccessToken()', () => {
  beforeAll(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        access_token: 'kickToken',
        expires_in: -1,
      }),
    });
  });

  beforeEach(function() {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should return null if the fetch fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    const kickAppAccessToken = await getKickAppAccessToken();
    expect(kickAppAccessToken).toBeNull();
  });

  it('should fetch an access token', async () => {
    const kickAppAccessToken = await getKickAppAccessToken();
    const params = new URLSearchParams({
      client_id: process.env.KICK_CLIENT_ID,
      client_secret: process.env.KICK_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://id.kick.com/oauth/token',
      {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    expect(kickAppAccessToken).toEqual('kickToken');
  });

  it('It should fetch a new token if the cached one is expired', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        access_token: 'anotherKickToken',
        expires_in: 1,
      }),
    });

    const kickAppAccessToken = await getKickAppAccessToken();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(kickAppAccessToken).toEqual('anotherKickToken');
  });

  it('It should return a cached token if it is still valid', async () => {
    const kickAppAccessToken = await getKickAppAccessToken();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(kickAppAccessToken).toEqual('anotherKickToken');
  });
});