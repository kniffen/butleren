import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import type { TwitchNotificationConfig } from '../../../types';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { postTwitchChannelsHandler } from './postTwitchChannelsHandler';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import * as getTwitchUsers from '../requests/getTwitchUsers';
import { discordClient } from '../../../discord/client';
import * as validateDiscordChannel from '../../../utils/validateDiscordChannel';
import * as validateDiscordRole from '../../../utils/validateDiscordRole';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('postTwitchChannelsHandler', () => {
  const guildsFetchSpy            = jest.spyOn(discordClient.guilds,   'fetch');
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockImplementation();
  const getTwitchUsersSpy         = jest.spyOn(getTwitchUsers,         'getTwitchUsers'        ).mockImplementation();
  const validateDiscordChannelSpy = jest.spyOn(validateDiscordChannel, 'validateDiscordChannel').mockResolvedValue(true);
  const validateDiscordRoleSpy    = jest.spyOn(validateDiscordRole,    'validateDiscordRole'   ).mockResolvedValue(true);

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    guildsFetchSpy.mockResolvedValue(guild);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should insert an entry into the database', async () => {
    getTwitchUsersSpy.mockResolvedValueOnce(['foo'] as unknown as TwitchUser[]);

    await postTwitchChannelsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(1);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('twitchChannels',{
      guildId:               'guild-id-1',
      id:                    'channel-1',
      notificationChannelId: 'channel-id-1',
      notificationRoleId:    'role-id-1'
    });

    expect(validateDiscordChannelSpy).toHaveBeenCalledWith('channel-id-1', guild, res);
    expect(validateDiscordRoleSpy).toHaveBeenCalledWith('role-id-1', guild, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(201);
  });

  test('It should return 400 if the request body is invalid', async () => {
    await postTwitchChannelsHandler({ ...req, body: { id: '1234' } } as Request, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request body' });
  });

  test('It should not insert if the discord channel is invalid', async () => {
    getTwitchUsersSpy.mockResolvedValueOnce(['foo'] as unknown as TwitchUser[]);
    validateDiscordChannelSpy.mockResolvedValueOnce(false);

    await postTwitchChannelsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should not insert if the discord role is invalid', async () => {
    getTwitchUsersSpy.mockResolvedValueOnce(['foo'] as unknown as TwitchUser[]);
    validateDiscordRoleSpy.mockResolvedValueOnce(false);

    await postTwitchChannelsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    guildsFetchSpy.mockRejectedValueOnce(error);

    await postTwitchChannelsHandler(req, res, nextSpy);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  id: 'guild-id-1',
} as unknown as Guild;

const requestBody: TwitchNotificationConfig = {
  id:                    'channel-1',
  notificationChannelId: 'channel-id-1',
  notificationRoleId:    'role-id-1'
};

const req = { params: { guildId: 'guild-id-1' }, body: requestBody } as unknown as Request;
const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();