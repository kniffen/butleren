import fetch, { Response } from 'node-fetch';
import * as getTwitchAccessToken from './getTwitchAccessToken';
import { getTwitchStreams } from './getTwitchStreams';

describe('getTwitchStreams', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getTwitchAccessTokenSpy = jest.spyOn(getTwitchAccessToken, 'getTwitchAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getTwitchAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request twitch channels by their ids', async () => {
    const actual = await getTwitchStreams(['channel1', 'channel2']);

    expect(getTwitchAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/streams?user_id=channel1&user_id=channel2', {
        method:  'GET',
        headers: {
          'Client-Id':     'TWITCH_CLIENT_ID',
          'Authorization': 'Bearer access-token',
        },
      });
    expect(actual).toBe(twitchStreamsResponseBody.data);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Twitch'),
    } as unknown as Response);

    await expect(getTwitchStreams(['channel1', 'channel2'])).rejects.toThrow('Failed to fetch Twitch streams');
  });
});

const twitchStreamsResponseBody = {
  data: ['channel-A', 'channel-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(twitchStreamsResponseBody),
} as unknown as Response;
