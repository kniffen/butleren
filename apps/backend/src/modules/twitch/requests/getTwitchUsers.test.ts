import fetch, { Response } from 'node-fetch';
import * as getTwitchAccessToken from './getTwitchAccessToken';
import { getTwitchUsers } from './getTwitchUsers';

describe('getTwitchUsers', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getTwitchAccessTokenSpy = jest.spyOn(getTwitchAccessToken, 'getTwitchAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getTwitchAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request twitch users by their ids', async () => {
    const actual = await getTwitchUsers({ ids: ['id1', 'id2'] });

    expect(getTwitchAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/users?id=id1&id=id2', {
        method:  'GET',
        headers: {
          'Client-Id':     'TWITCH_CLIENT_ID',
          'Authorization': 'Bearer access-token',
        },
      });
    expect(actual).toBe(twitchUsersResponseBody.data);
  });

  test('It should request twitch users by their login', async () => {
    const actual = await getTwitchUsers({ logins: ['login1', 'login2'] });

    expect(getTwitchAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/users?login=login1&login=login2', {
        method:  'GET',
        headers: {
          'Client-Id':     'TWITCH_CLIENT_ID',
          'Authorization': 'Bearer access-token',
        },
      });
    expect(actual).toBe(twitchUsersResponseBody.data);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Twitch'),
    } as unknown as Response);

    await expect(getTwitchUsers({ ids: ['id1', 'id2'] })).rejects.toThrow('Failed to fetch Twitch users');
  });
});

const twitchUsersResponseBody = {
  data: ['user-A', 'user-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(twitchUsersResponseBody),
} as unknown as Response;
