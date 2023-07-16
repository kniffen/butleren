import { TwitchSchedule } from '../types';
import fetchTwitchSchedule from './fetchTwitchSchedule';
import fetchTwitchToken    from './fetchTwitchToken';

jest.mock(
  './fetchTwitchToken',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitch.utils.fetchTwitchSchedule()', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();
  const fetchTwitchTokenMock = fetchTwitchToken as jest.MockedFunction<typeof fetchTwitchToken>;

  beforeAll(function () {
    fetchTwitchTokenMock.mockResolvedValue('twitchToken');
    fetchMock.mockResolvedValue({
      json: async () => ({ data: { segments: ['foo', 'bar'] } })
    } as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should return an array of scheduled streams', async function () {
    const schedule = await fetchTwitchSchedule({ id: 'twitchChannel001' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/schedule?broadcaster_id=twitchChannel001',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    );

    expect(schedule).toEqual(['foo', 'bar']);
  });

  it('Should handle there being no scheduled streams', async function () {
    const results: TwitchSchedule['data']['segments'][] = [];

    fetchMock.mockResolvedValue({ json: async () => ({ data: { segments: [] } }) } as  Response);
    results.push(await fetchTwitchSchedule({ id: 'twitchChannel001' }));

    fetchMock.mockResolvedValue({ json: async () => ({ data: {} }) } as  Response);
    results.push(await fetchTwitchSchedule({ id: 'twitchChannel001' }));

    fetchMock.mockResolvedValue({ json: async () => ({}) } as  Response);
    results.push(await fetchTwitchSchedule({ id: 'twitchChannel001' }));

    expect(results).toEqual([[], [], []]);
  });

  it('Should handle the token being expired', async function () {
    fetchMock.mockResolvedValue({ status: 401 } as  Response);

    const schedule = await fetchTwitchSchedule({ id: 'twitchChannel001' });

    expect(fetchTwitchTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(schedule).toEqual([]);
  });

  it('Should handle the request failing', async function () {
    fetchMock.mockRejectedValue('Error message');

    const schedule = await fetchTwitchSchedule({ id: 'twitchChannel001' });

    expect(console.error).toHaveBeenCalledWith('Error message');
    expect(schedule).toEqual([]);
  });

});