import fetchYouTubeActivities from './fetchYouTubeActivities';

describe('modules.youtube.utils.fetchYouTubeActivities()', function() {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();

  beforeAll(function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchMock.mockResolvedValue({
      json: async () => ({items: ['foo', 'bar']})
    });
  });

  beforeEach(function() {
    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  it('Should respond with an array of activities', async function() {
    const activities = await fetchYouTubeActivities({channelId: 'foobar'});

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=10&key=google_api_key',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    expect(activities).toEqual(['foo', 'bar']);
  });

  it('Should generate an API URI', async function() {
    const activities = await fetchYouTubeActivities({channelId: 'foobar', limit: 99});

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=99&key=google_api_key',
      expect.anything()
    );
    expect(activities).toEqual(['foo', 'bar']);
  });

  it('Should handle there being no activities', async function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchMock.mockResolvedValue({
      json: async () => ({items: []})
    });

    const activities001 = await fetchYouTubeActivities({channelId: 'foobar'});

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchMock.mockResolvedValue({
      json: async () => ({})
    });

    const activities002 = await fetchYouTubeActivities({channelId: 'foobar'});

    expect(console.error).not.toHaveBeenCalled();
    expect(activities001).toEqual([]);
    expect(activities002).toEqual([]);
  });

  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error');

    const results = await fetchYouTubeActivities({channelId: 'foobar'});

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(results).toEqual([]);
  });
});
