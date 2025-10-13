import fetch, { Response } from 'node-fetch';
import { getYouTubeChannels } from './getYouTubeChannels';

describe('YouTube: getYouTubeChannels()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get channels from the YouTube API', async () => {
    const actual = await getYouTubeChannels(['channel-id-1', 'channel-id-2']);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=channel-id-1&id=channel-id-2&key=GOOGLE_API_KEY', {
        method:  'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

    expect(actual).toBe(youTubeChannelsResponseBody.items);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from YouTube'),
    } as unknown as Response);

    await expect(getYouTubeChannels(['channel-id-1', 'channel-id-2'])).rejects.toThrow('Failed to fetch YouTube channels');
  });
});

const youTubeChannelsResponseBody = {
  items: ['item-A', 'item-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(youTubeChannelsResponseBody),
} as unknown as Response;
