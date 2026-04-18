import fetch, { Response } from 'node-fetch';
import * as getKickToken from './getKickToken';
import { KickTokenResponseBody } from './getKickToken';
import { getKickChannels, KickChannelsResponseBody } from './getKickChannels';

describe('getKickChannels', () => {
  const fetchMock = (fetch as jest.MockedFunction<typeof fetch>);
  const getKickTokenSpy = jest.spyOn(getKickToken, 'getKickToken');

  beforeAll(() => {
    fetchMock.mockResolvedValue(response);
    getKickTokenSpy.mockResolvedValue(kickTokenResponseBody);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should request kick channels by their slugs', async () => {
    const actual = await getKickChannels({ slugs: ['channel1', 'channel2'] });

    expect(getKickTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.kick.com/public/v1/channels?slug=channel1&slug=channel2', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toBe(kickChannelsResponseBody.data);
  });

  test('It should request kick channels by their broadcaster user ids', async () => {
    const actual = await getKickChannels({ broadcasterUserIds: [123, 456] });

    expect(getKickTokenSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.kick.com/public/v1/channels?broadcaster_user_id=123&broadcaster_user_id=456', {
        method:  'GET',
        headers: {
          'Authorization': 'Bearer access-token',
          'Content-Type':  'application/json',
        },
      });
    expect(actual).toBe(kickChannelsResponseBody.data);
  });

  test('It should return null if the token request fails', async () => {
    getKickTokenSpy.mockResolvedValueOnce(null);
    const actual = await getKickChannels({ slugs: ['channel1', 'channel2'] });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(actual).toBeNull();
  });

  test('It should return null if the channels request fails', async () => {
    fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

    const actual = await getKickChannels({ slugs: ['channel1', 'channel2'] });
    expect(actual).toBeNull();
  });
});

const kickTokenResponseBody = {
  access_token: 'access-token',
} as KickTokenResponseBody;

const kickChannelsResponseBody = {
  data:    ['kick-channel-1', 'kick-channel-2'],
  message: 'OK',
} as unknown as KickChannelsResponseBody;

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue(kickChannelsResponseBody),
} as unknown as Response;