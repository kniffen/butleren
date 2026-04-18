import fetch, { Response } from 'node-fetch';
import { getYouTubeActivities } from './getYouTubeActivities';

describe('YouTube: getYouTubeActivities()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get activities from the YouTube API', async () => {
    const actual = await getYouTubeActivities('foobar');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=20&key=GOOGLE_API_KEY', {
        method:  'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

    expect(actual).toBe(youTubeChannelsResponseBody.items);
  });

  test('It should get activities with a custom maxResults from the YouTube API', async () => {
    await getYouTubeActivities('foobar', 10);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=10&key=GOOGLE_API_KEY',
      expect.anything()
    );
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from YouTube'),
    } as unknown as Response);

    await expect(getYouTubeActivities('foobar')).rejects.toThrow('Failed to fetch YouTube activities');
  });
});

const youTubeChannelsResponseBody = {
  items: ['item-A', 'item-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(youTubeChannelsResponseBody),
} as unknown as Response;
