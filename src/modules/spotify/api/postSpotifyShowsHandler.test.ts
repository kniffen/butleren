import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import type { SpotifyNotificationConfig } from '../../../types';
import type { SpotifyAPIShow } from '../requests/getSpotifyShows';
import { postSpotifyShowsHandler } from './postSpotifyShowsHandler';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import * as getSpotifyShows from '../requests/getSpotifyShows';
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

describe('postSpotifyShowsHandler', () => {
  const guildsFetchSpy            = jest.spyOn(discordClient.guilds,   'fetch');
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockImplementation();
  const getSpotifyShowsSpy        = jest.spyOn(getSpotifyShows,        'getSpotifyShows'       ).mockImplementation();
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
    getSpotifyShowsSpy.mockResolvedValueOnce(['foo'] as unknown as SpotifyAPIShow[]);

    await postSpotifyShowsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(1);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('spotifyShows', {
      guildId:               'guild-id-1',
      showId:                'show-1',
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
    await postSpotifyShowsHandler({ ...req, body: { showId: '1234' } } as Request, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request body' });
  });

  test('It should return 400 if the Spotify show is not found', async () => {
    getSpotifyShowsSpy.mockResolvedValueOnce([]);

    await postSpotifyShowsHandler(req, res, nextSpy);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Spotify show with id "show-1" not found' });
  });

  test('It should not insert if the discord channel is invalid', async () => {
    getSpotifyShowsSpy.mockResolvedValueOnce(['foo'] as unknown as SpotifyAPIShow[]);
    validateDiscordChannelSpy.mockResolvedValueOnce(false);

    await postSpotifyShowsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should not insert if the discord role is invalid', async () => {
    getSpotifyShowsSpy.mockResolvedValueOnce(['foo'] as unknown as SpotifyAPIShow[]);
    validateDiscordRoleSpy.mockResolvedValueOnce(false);

    await postSpotifyShowsHandler(req, res, nextSpy);
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    guildsFetchSpy.mockRejectedValueOnce(error);

    await postSpotifyShowsHandler(req, res, nextSpy);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  id: 'guild-id-1',
} as unknown as Guild;

const requestBody: SpotifyNotificationConfig = {
  showId:                'show-1',
  notificationChannelId: 'channel-id-1',
  notificationRoleId:    'role-id-1'
};

const req = { params: { guildId: 'guild-id-1' }, body: requestBody } as unknown as Request;
const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();