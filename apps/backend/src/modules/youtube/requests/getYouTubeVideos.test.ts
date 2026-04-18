import fetch, { Response } from 'node-fetch';
import { getYouTubeVideos } from './getYouTubeVideos';

describe('YouTube: getYouTubeVideos()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get videos from the YouTube API', async () => {
    const actual = await getYouTubeVideos(['foo', 'bar']);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=liveStreamingDetails&id=foo&id=bar&key=GOOGLE_API_KEY', {
        method:  'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

    expect(actual).toBe(youTubeVideosResponseBody.items);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from YouTube'),
    } as unknown as Response);

    await expect(getYouTubeVideos(['foo'])).rejects.toThrow('Failed to fetch YouTube videos');
  });
});

const youTubeVideosResponseBody = {
  items: ['item-A', 'item-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(youTubeVideosResponseBody),
} as unknown as Response;
