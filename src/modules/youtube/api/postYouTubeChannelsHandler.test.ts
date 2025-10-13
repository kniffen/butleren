import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import type { YouTubeNotificationConfig } from '../../../types';
import { discordClient } from '../../../discord/client';
import * as getYouTubeChannels from '../requests/getYouTubeChannels';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import * as validateDiscordChannel from '../../../utils/validateDiscordChannel';
import * as validateDiscordRole from '../../../utils/validateDiscordRole';
import { postYouTubeChannelsHandler } from './postYouTubeChannelsHandler';
import { YouTubeAPIChannel } from '../requests/getYouTubeChannels';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('YouTube: postYouTubeChannelsHandler()', () => {
  const guildsFetchSpy = jest.spyOn(discordClient.guilds, 'fetch');
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockImplementation();
  const getYouTubeChannelsSpy = jest.spyOn(getYouTubeChannels, 'getYouTubeChannels').mockImplementation();
  const validateDiscordChannelSpy = jest.spyOn(validateDiscordChannel, 'validateDiscordChannel').mockResolvedValue(true);
  const validateDiscordRoleSpy = jest.spyOn(validateDiscordRole, 'validateDiscordRole').mockResolvedValue(true);

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    guildsFetchSpy.mockResolvedValue(guild);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should insert an entry into the database', async () => {
    getYouTubeChannelsSpy.mockResolvedValueOnce(['foo'] as unknown as YouTubeAPIChannel[]);

    await postYouTubeChannelsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(1);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('youTubeChannels', {
      guildId:                'guild-id-1',
      channelId:              'yt-channel-1',
      includeLiveStreams:     1,
      notificationChannelId:  'channel-id-1',
      notificationRoleId:     'role-id-1',
      liveNotificationRoleId: 'role-id-2',
    });

    expect(validateDiscordChannelSpy).toHaveBeenCalledWith('channel-id-1', guild, res);
    expect(validateDiscordRoleSpy).toHaveBeenCalledWith('role-id-1', guild, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(201);
  });

  test('It should return 400 if the request body is invalid', async () => {
    await postYouTubeChannelsHandler({ ...req, body: { channelId: 1234 } } as Request, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request body' });
  });

  test('It should not insert if the discord channel is invalid', async () => {
    validateDiscordChannelSpy.mockResolvedValueOnce(false);

    await postYouTubeChannelsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should not insert if the discord role is invalid', async () => {
    validateDiscordRoleSpy.mockResolvedValueOnce(false);

    await postYouTubeChannelsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    guildsFetchSpy.mockRejectedValueOnce(error);

    await postYouTubeChannelsHandler(req, res, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  id: 'guild-id-1',
} as unknown as Guild;

const requestBody: YouTubeNotificationConfig = {
  channelId:              'yt-channel-1',
  includeLiveStreams:     true,
  notificationChannelId:  'channel-id-1',
  notificationRoleId:     'role-id-1',
  liveNotificationRoleId: 'role-id-2',
};

const req = { params: { guildId: 'guild-id-1' }, body: requestBody } as unknown as Request;
const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();