import fetchMock from 'node-fetch';
import * as getKickAppAccessToken from './getKickAppAccessToken';
import { getKickChannels } from './getKickChannels';

describe('module.kick.utils.getKickChannels()', () => {
  jest.spyOn(getKickAppAccessToken, 'getKickAppAccessToken').mockResolvedValue('kickToken');

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should get kick channels based on broadcaster user ids', async () => {
    const mockBroadcasterUserIds = ['123', '456'];
    const mockResponse = {
      data: [
        { broadcaster_user_id: '123', slug: 'channel1' },
        { broadcaster_user_id: '456', slug: 'channel2' },
      ],
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const channels = await getKickChannels({ broadcasterUserIds: mockBroadcasterUserIds });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.kick.com/public/v1/channels?broadcaster_user_id=123&broadcaster_user_id=456',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer kickToken',
          'Content-Type': 'application/json',
        }
      }
    );
    expect(channels).toEqual(mockResponse.data);
  });

  it('Should get kick channels based on slugs', async () => {
    const mockSlugs = ['channel1', 'channel2'];
    const mockResponse = {
      data: [
        { broadcaster_user_id: '123', slug: 'channel1' },
        { broadcaster_user_id: '456', slug: 'channel2' },
      ],
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const channels = await getKickChannels({ slugs: mockSlugs });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.kick.com/public/v1/channels?slug=channel1&slug=channel2',
      expect.anything()
    );
    expect(channels).toEqual(mockResponse.data);
  });

  it('Should handle broadcaster user ids or slugs not being provided', async () => {
    const channels = await getKickChannels({});
    expect(channels).toEqual([]);
  });

  it('Should handle errors when fetching channels from the API', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    const channels = await getKickChannels({ slugs: ['channel1'] });
    expect(channels).toEqual([]);
  });
});