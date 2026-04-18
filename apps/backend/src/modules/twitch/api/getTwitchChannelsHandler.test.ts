import type { Request, Response } from 'express';
import type { TwitchChannelDBEntry } from '../../../types';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { getTwitchChannelsHandler } from './getTwitchChannelsHandler';
import * as getDBEntries from '../../../database/utils/getDBEntries';
import * as getTwitchUsers from '../requests/getTwitchUsers';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn((id) => ({ id })),
    },
  }
}));

describe('Twitch: getTwitchChannelsHandler()', () => {
  const getDBEntriesSpy   = jest.spyOn(getDBEntries, 'getDBEntries');
  const getTwitchUsersSpy = jest.spyOn(getTwitchUsers, 'getTwitchUsers');


  beforeAll(() => {
    getDBEntriesSpy.mockResolvedValue(twitchChannelDBEntries);
    getTwitchUsersSpy.mockResolvedValue(twitchUsers);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get Twitch channel entries for the guild in the database', async () => {
    await getTwitchChannelsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        url:                'https://twitch.tv/channel-login',
        name:               'Channel Display Name',
        id:                 1234,
        notificationConfig: { id: 1234, notificationChannelId: 'channel-id-1', notificationRoleId: 'role-id-1' }
      },
      {
        url:                '',
        name:               '',
        id:                 4567,
        notificationConfig: { id: 4567, notificationChannelId: 'channel-id-2' }
      }
    ]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should handle there being no entries in the database', async () => {
    getDBEntriesSpy.mockResolvedValueOnce([]);

    await getTwitchChannelsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    getDBEntriesSpy.mockRejectedValueOnce(error);

    await getTwitchChannelsHandler(req, res, nextSpy);

    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const req = { params: { guildId: 'guild-id-1' } } as unknown as Request;
const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();

const twitchChannelDBEntries = [
  { guildId: 'guild-id-1', id: 1234, notificationChannelId: 'channel-id-1', notificationRoleId: 'role-id-1' },
  { guildId: 'guild-id-1', id: 4567, notificationChannelId: 'channel-id-2' }
] as unknown as TwitchChannelDBEntry[];

const twitchUsers = [
  {
    id:           1234,
    login:        'channel-login',
    display_name: 'Channel Display Name',
  }
] as unknown as TwitchUser[];