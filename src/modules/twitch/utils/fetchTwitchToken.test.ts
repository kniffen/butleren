import fetchTwitchToken from './fetchTwitchToken';

describe('modules.twitch.utils.fetchTwitchToken()', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();
  let access_token = 'twitchToken';

  beforeAll(function () {
    fetchMock.mockResolvedValue({
      json: () => ({ access_token })
    } as unknown as Response);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should return a new token', async function () {
    const token = await fetchTwitchToken();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://id.twitch.tv/oauth2/token?client_id=twitch_client_id&client_secret=twitch_client_secret&grant_type=client_credentials&scope=user:read:email',
      {
        method: 'POST',
      }
    );
    expect(token).toEqual('twitchToken');
  });

  it('Should return a stored token', async function () {
    const token = await fetchTwitchToken();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(token).toEqual('twitchToken');
  });

  it('Should replace an expired token', async function () {
    access_token = 'anotherTwitchToken';

    const token = await fetchTwitchToken(true);

    expect(fetchMock).toHaveBeenCalled();
    expect(token).toEqual('anotherTwitchToken');
  });
});