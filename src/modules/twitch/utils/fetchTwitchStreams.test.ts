import { TwitchStreams } from '../types';
import fetchTwitchStreams from './fetchTwitchStreams';
import fetchTwitchToken from './fetchTwitchToken';

jest.mock(
  './fetchTwitchToken',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitch.utils.fetchTwitchStreams()', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();
  const fetchTwitchTokenMock = fetchTwitchToken as jest.MockedFunction<typeof fetchTwitchToken>;

  beforeAll(function () {
    fetchTwitchTokenMock.mockResolvedValue('twitchToken');
    fetchMock.mockResolvedValue({
      json: async () => ({ data: ['foo', 'bar'] })
    } as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should fetch streams via user ids', async function () {
    const streams = await fetchTwitchStreams({ ids: ['channel001', 'channel002'], usernames: [] });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/streams?user_id=channel001&user_id=channel002',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    );
    expect(streams).toEqual(['foo', 'bar']);
  });

  it('Should fetch streams via usernames', async function () {
    const streams = await fetchTwitchStreams({ ids: [], usernames: ['user001', 'user002'] });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/streams?user_login=user001&user_login=user002',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    );
    expect(streams).toEqual(['foo', 'bar']);
  });

  it('Should handle there being no streams', async function () {
    const results: TwitchStreams['data'][] = [];

    fetchMock.mockResolvedValue({ json: async () => ({ data: [] }) } as Response);
    results.push(await fetchTwitchStreams({ ids: ['channel001', 'channel002'], usernames: [] }));

    fetchMock.mockResolvedValue({ json: async () => ({}) } as Response);
    results.push(await fetchTwitchStreams({ ids: ['channel001', 'channel002'], usernames: [] }));

    expect(results).toEqual([[], []]);
  });

  it('Should handle the token being expired', async function () {
    fetchMock.mockResolvedValue({ status: 401 } as Response);

    const streams = await fetchTwitchStreams({ ids: ['channel001', 'channel002'], usernames: [] });

    expect(fetchTwitchTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(streams).toEqual([]);
  });

  it('Should handle the request failing', async function () {
    fetchMock.mockRejectedValue('Error message');

    const streams = await fetchTwitchStreams({ ids: ['channel001', 'channel002'], usernames: [] });

    expect(console.error).toHaveBeenCalledWith('Error message');
    expect(streams).toEqual([]);
  });

});