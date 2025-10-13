import fetch, { Response } from 'node-fetch';
import { getKickToken } from './getKickToken';

describe('getKickToken()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request a kick token', async () => {
    fetchMock.mockResolvedValueOnce(response);
    const actual = await getKickToken();

    expect(fetchMock).toHaveBeenCalledWith('https://id.kick.com/oauth/token', expect.objectContaining({
      'method':  'POST',
      'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }
    }));

    expect(actual).toBe(kickTokenResponseBody);
  });

  test('It should use a cached token if not expired', async () => {
    const actual = await getKickToken();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(actual).toBe(kickTokenResponseBody);
  });

  test('It should request a new token if the cached token is expired', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce(response);

    const actual = await getKickToken();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(actual).toBe(kickTokenResponseBody);

    nowSpy.mockRestore();
  });

  test('It should return null if the request fails', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() + 3600 * 1000 + 1);
    fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

    const actual = await getKickToken();
    expect(actual).toBeNull();

    nowSpy.mockRestore();
  });
});

const kickTokenResponseBody = {
  access_token:  'access-token',
  token_type:    'bearer',
  refresh_token: 'refresh-token',
  expires_in:    '3600',
  scope:         '',
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(kickTokenResponseBody),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;