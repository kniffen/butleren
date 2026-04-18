import fetch, { Response } from 'node-fetch';
import { getTwitchAccessToken } from './getTwitchAccessToken';

describe('getTwitchAccessToken()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request a twitch access token', async () => {
    fetchMock.mockResolvedValueOnce(response);
    const actual = await getTwitchAccessToken();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://id.twitch.tv/oauth2/token?client_id=TWITCH_CLIENT_ID&client_secret=TWITCH_CLIENT_SECRET&grant_type=client_credentials&scope=user%3Aread%3Aemail',
      expect.objectContaining({ 'method': 'POST' })
    );

    expect(actual).toBe(twitchTokenResponseBody.access_token);
  });

  test('It should use a cached token if not expired', async () => {
    const actual = await getTwitchAccessToken();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(actual).toBe(twitchTokenResponseBody.access_token);
  });

  test('It should request a new token if the cached token is expired', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce(response);

    const actual = await getTwitchAccessToken();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(actual).toBe(twitchTokenResponseBody.access_token);

    nowSpy.mockRestore();
  });

  test('It should throw if the request fails', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

    await expect(getTwitchAccessToken()).rejects.toThrow('Failed to get Twitch token');

    nowSpy.mockRestore();
  });
});

const twitchTokenResponseBody = {
  access_token: 'access-token',
  expires_in:   3600,
  token_type:   '',
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(twitchTokenResponseBody),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;