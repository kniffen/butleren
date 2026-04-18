import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPIChannel } from '../requests/getKickChannels';
import { discordClient } from '../../../discord/client';
import { postKickChannelsHandler } from './postKickChannelsHandler';
import * as getKickChannels from '../requests/getKickChannels';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import * as validateDiscordChannel from '../../../utils/validateDiscordChannel';
import * as validateDiscordRole from '../../../utils/validateDiscordRole';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn((id) => ({ id })),
    },
  }
}));

describe('Kick: postKickChannelsHandler()', () => {
  const guildsFetchSpy            = jest.spyOn(discordClient.guilds,   'fetch');
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();
  const getKickChannelsSpy        = jest.spyOn(getKickChannels,        'getKickChannels'       ).mockImplementation();
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

  test('It should insert channels into the database', async () => {
    getKickChannelsSpy.mockResolvedValueOnce(['foo'] as unknown as KickAPIChannel[]);

    await postKickChannelsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(1);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('kickChannels', {
      guildId:               'guild-id-1',
      broadcasterUserId:     1234,
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
    await postKickChannelsHandler({ ...req, body: { ...requestBody, broadcasterUserId: '9999' } } as unknown as Request, res, nextSpy);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should not insert if the discord channel is invalid', async () => {
    getKickChannelsSpy.mockResolvedValueOnce(['foo'] as unknown as KickAPIChannel[]);
    validateDiscordChannelSpy.mockResolvedValueOnce(false);

    await postKickChannelsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should not insert if the discord role is invalid', async () => {
    getKickChannelsSpy.mockResolvedValueOnce(['foo'] as unknown as KickAPIChannel[]);
    validateDiscordRoleSpy.mockResolvedValueOnce(false);

    await postKickChannelsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    guildsFetchSpy.mockRejectedValueOnce(error);

    await postKickChannelsHandler(req, res, nextSpy);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  id: 'guild-id-1',
} as unknown as Guild;

const requestBody: KickChannelDBEntry = {
  guildId:               'guild-id-1',
  broadcasterUserId:     1234,
  notificationChannelId: 'channel-id-1',
  notificationRoleId:    'role-id-1'
};

const req = { params: { guildId: 'guild-id-1' }, body: requestBody } as unknown as Request;
const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();
