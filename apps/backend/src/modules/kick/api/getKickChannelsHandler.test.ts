import { getKickChannelsHandler } from './getKickChannelsHandler';
import type { Request, Response } from 'express';
import * as getDBEntries from '../../../database/utils/getDBEntries';
import * as getKickChannels from '../requests/getKickChannels';
import { KickAPIChannel } from '../requests/getKickChannels';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn((id) => ({ id })),
    },
  }
}));

describe('Kick: getKickChannelsHandler()', () => {
  const getDBEntriesSpy    = jest.spyOn(getDBEntries, 'getDBEntries');
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  const req = { params: { guildId: 'guild-id-1' } } as unknown as Request;
  const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeAll(() => {
    getDBEntriesSpy.mockResolvedValue(kickChannelDBEntries);
    getKickChannelsSpy.mockResolvedValue(kickChannels);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get channels from the database', async () => {
    await getKickChannelsHandler(req, res, nextSpy);

    expect(res.json).toHaveBeenCalledWith([
      {
        url:                'https://kick.com/channel-slug-1',
        name:               'channel-slug-1',
        broadcasterUserId:  1234,
        notificationConfig: {
          broadcasterUserId:     1234,
          notificationChannelId: 'channel-id-1',
          notificationRoleId:    'role-id-1'
        }
      },
      {
        url:                '',
        name:               '',
        broadcasterUserId:  4567,
        notificationConfig: {
          broadcasterUserId:     4567,
          notificationChannelId: 'channel-id-2'
        }
      }
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async ()=>{
    const error = new Error('Test error');
    getDBEntriesSpy.mockRejectedValueOnce(error);

    await getKickChannelsHandler(req, res, nextSpy);

    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const kickChannelDBEntries = [
  { guildId: 'guild-id-1', broadcasterUserId: 1234, notificationChannelId: 'channel-id-1', notificationRoleId: 'role-id-1' },
  { guildId: 'guild-id-1', broadcasterUserId: 4567, notificationChannelId: 'channel-id-2' }
];

const kickChannels = [
  {
    broadcaster_user_id: 1234,
    slug:                'channel-slug-1',
  }
] as KickAPIChannel[];
