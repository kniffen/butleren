import fetch, { Response } from 'node-fetch';
import * as getKickToken from './getKickToken';
import type { KickTokenResponseBody } from './getKickToken';
import { getKickLiveStreams, type KickAPILiveStreamsResponseBody } from './getKickLiveStreams';

describe('getKickLiveStreams', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getKickTokenSpy = jest.spyOn(getKickToken, 'getKickToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getKickTokenSpy.mockResolvedValue(kickTokenResponseBody);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request kick live streams by broadcaster user ids', async () => {
    const actual = await getKickLiveStreams([123, 456]);

    expect(getKickTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.kick.com/public/v1/livestreams?broadcaster_user_id=123&broadcaster_user_id=456', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toBe(kickLiveStreamsResponseBody.data);
  });


  test('It should return null if the token request fails', async () => {
    getKickTokenSpy.mockResolvedValueOnce(null);
    const actual = await getKickLiveStreams([123, 456]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(actual).toBeNull();
  });

  test('It should return null if the request fails', async () => {
    fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

    const actual = await getKickLiveStreams([123, 456]);
    expect(actual).toBeNull();
  });
});

const kickTokenResponseBody = {
  access_token: 'access-token',
} as KickTokenResponseBody;

const kickLiveStreamsResponseBody = {
  data:    ['stream-1', 'stream-2'],
  message: 'OK',
} as unknown as KickAPILiveStreamsResponseBody;

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(kickLiveStreamsResponseBody),
} as unknown as Response;