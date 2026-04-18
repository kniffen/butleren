import fetch, { Response } from 'node-fetch';
import { getYouTubeSearch } from './getYouTubeSearch';

describe('YouTube: getYouTubeSearch()', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get search results from the YouTube API', async () => {
    const actual = await getYouTubeSearch('search query');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=search+query&type=channel&key=GOOGLE_API_KEY', {
        method:  'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

    expect(actual).toBe(youTubeSearchResponseBody.items);
  });

  test('It should throw if the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok:         false,
      status:     401,
      statusText: 'Unauthorized',
      text:       jest.fn().mockResolvedValue('Error message from YouTube'),
    } as unknown as Response);

    await expect(getYouTubeSearch('search query')).rejects.toThrow('Failed to fetch YouTube search');
  });
});

const youTubeSearchResponseBody = {
  items: ['item-A', 'item-B'],
};

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(youTubeSearchResponseBody),
} as unknown as Response;
