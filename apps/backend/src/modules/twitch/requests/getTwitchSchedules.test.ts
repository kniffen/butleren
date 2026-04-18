import fetch, { Response } from 'node-fetch';
import * as getTwitchAccessToken from './getTwitchAccessToken';
import { getTwitchSchedule } from './getTwitchSchedule';

describe('getTwitchSchedule', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getTwitchAccessTokenSpy = jest.spyOn(getTwitchAccessToken, 'getTwitchAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getTwitchAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request a twitch schedule for an id', async () => {
    const actual = await getTwitchSchedule('1234');

    expect(getTwitchAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/schedule?broadcaster_id=1234', {
        method:  'GET',
        headers: {
          'Client-Id':     'TWITCH_CLIENT_ID',
          'Authorization': 'Bearer access-token',
        },
      });
    expect(actual).toBe(twitchScheduleResponseBody.data);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Twitch'),
    } as unknown as Response);

    await expect(getTwitchSchedule('1234')).rejects.toThrow('Failed to fetch Twitch schedule');
  });

  test('It should return null if the response is 404', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     404,
      statusText: 'Not Found',
      text:       jest.fn().mockResolvedValue('Error message from Twitch'),
    } as unknown as Response);

    const actual = await getTwitchSchedule('1234');
    expect(actual).toBeNull();
  });
});

const twitchScheduleResponseBody = {
  data: ['channel-A', 'channel-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(twitchScheduleResponseBody),
} as unknown as Response;
