import fetch, { Response } from 'node-fetch';

import fetchTwitchUsers from './fetchTwitchUsers';
import fetchTwitchToken from './fetchTwitchToken';

jest.mock(
  './fetchTwitchToken',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitch.utils.fetchTwitchUsers()', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
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

  it('Should fetch users via ids', async function () {
    const streams = await fetchTwitchUsers({ ids: ['user001', 'user002'], usernames: [] });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/users?id=user001&id=user002',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    );
    expect(streams).toEqual(['foo', 'bar']);
  });

  it('Should fetch users via usernames', async function () {
    const streams = await fetchTwitchUsers({ ids: [], usernames: ['username001', 'username002'] });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/users?login=username001&login=username002',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    );
    expect(streams).toEqual(['foo', 'bar']);
  });

  it('Should handle there being no users', async function () {
    const results = [];

    fetchMock.mockResolvedValue({ json: async () => ({ data: [] }) } as Response);
    results.push(await fetchTwitchUsers({ ids: ['user001', 'user002'], usernames: [] }));

    fetchMock.mockResolvedValue({ json: async () => ({}) } as Response);
    results.push(await fetchTwitchUsers({ ids: ['user001', 'user002'], usernames: [] }));

    expect(results).toEqual([[], []]);
  });

  it('Should handle the token being expired', async function () {
    fetchMock.mockResolvedValue({ status: 401 } as Response);

    const streams = await fetchTwitchUsers({ ids: ['user001', 'user002'], usernames: [] });

    expect(fetchTwitchTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(streams).toEqual([]);
  });

  it('Should handle the request failing', async function () {
    fetchMock.mockRejectedValue('Error message');

    const streams = await fetchTwitchUsers({ ids: ['user001', 'user002'], usernames: [] });

    expect(console.error).toHaveBeenCalledWith('Error message');
    expect(streams).toEqual([]);
  });

});