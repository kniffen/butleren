import fetch, { Response } from 'node-fetch';
import * as getTwitchAccessToken from './getTwitchAccessToken';
import { getTwitchSearch } from './getTwitchSearch';

describe('Twitch: getTwitchSearch()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getTwitchAccessTokenSpy = jest.spyOn(getTwitchAccessToken, 'getTwitchAccessToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getTwitchAccessTokenSpy.mockResolvedValue('access-token');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request twitch search result via a query', async () => {
    const actual = await getTwitchSearch('foobar');

    expect(getTwitchAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/search/channels?query=foobar', {
        method:  'GET',
        headers: {
          'Client-Id':     'TWITCH_CLIENT_ID',
          'Authorization': 'Bearer access-token',
        },
      });
    expect(actual).toBe(twitchSearchResponseBody.data);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from Twitch'),
    } as unknown as Response);

    await expect(getTwitchSearch('foobar')).rejects.toThrow('Failed to fetch Twitch search results');
  });
});

const twitchSearchResponseBody = {
  data: ['channel-A', 'channel-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(twitchSearchResponseBody),
} as unknown as Response;
