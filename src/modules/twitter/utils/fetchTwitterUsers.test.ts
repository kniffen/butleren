import fetchTwitterUsers from './fetchTwitterUsers';
import fetchTwitterToken from './fetchTwitterToken';

jest.mock(
  './fetchTwitterToken',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitter.utils.fetchTwitterUsers()', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const fetchTwitterTokenMock = fetchTwitterToken as jest.MockedFunction<typeof fetchTwitterToken>;

  beforeAll(function () {
    fetchTwitterTokenMock.mockResolvedValue('twitterToken');

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

  it('Should fetch users via IDs', async function () {
    const users = await fetchTwitterUsers({ ids: ['user001', 'user002'], usernames: [] });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/2/users/?ids=user001,user002&user.fields=profile_image_url',
      {
        headers: {
          Authorization: 'Bearer twitterToken'
        }
      }
    );

    expect(users).toEqual(['foo', 'bar']);
  });

  it('Should fetch users via usernames', async function () {
    const users = await fetchTwitterUsers({ ids: [], usernames: ['username001', 'username002'] });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/2/users/by?usernames=username001,username002&user.fields=profile_image_url',
      {
        headers: {
          Authorization: 'Bearer twitterToken'
        }
      }
    );

    expect(users).toEqual(['foo', 'bar']);
  });

  it('Should handle there being no results', async function () {
    fetchMock.mockResolvedValue({ json: async () => ({ data: [] }) } as Response);
    const result001 = await fetchTwitterUsers({ ids: [], usernames: [] });

    fetchMock.mockResolvedValue({ json: async () => ({}) } as Response);
    const result002 = await fetchTwitterUsers({ ids: [], usernames: [] });

    expect(result001).toEqual([]);
    expect(result002).toEqual([]);
  });

  it('Should handle the token being expired', async function () {
    fetchMock.mockResolvedValue({ status: 401 } as Response);

    const results = await fetchTwitterUsers({ids: [], usernames: []});

    expect(fetchTwitterTokenMock).toHaveBeenCalledTimes(2);
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(1, false);
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(2, true);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(results).toEqual([]);
  });

  it('Should handle the request failing', async function () {
    fetchMock.mockRejectedValue('Error message');

    const results = await fetchTwitterUsers({ids: [], usernames: []});

    expect(console.error).toHaveBeenCalledWith('Error message');
    expect(results).toEqual([]);
  });
});