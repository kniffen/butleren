import type { Request, Response } from 'express';
import type { SpotifyShowDBEntry } from '../../../types';
import type { SpotifyAPIShow } from '../requests/getSpotifyShows';
import { getSpotifyShowsHandler } from './getSpotifyShowsHandler';
import * as getDBEntries from '../../../database/utils/getDBEntries';
import * as getSpotifyShows from '../requests/getSpotifyShows';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn((id) => ({ id })),
    },
  }
}));

describe('Spotify: getSpotifyShowsHandler()', () => {
  const getDBEntriesSpy    = jest.spyOn(getDBEntries, 'getDBEntries');
  const getSpotifyShowsSpy = jest.spyOn(getSpotifyShows, 'getSpotifyShows');

  beforeAll(() => {
    getDBEntriesSpy.mockResolvedValue(spotifyShowDBEntries);
    getSpotifyShowsSpy.mockResolvedValue(spotifyShows);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get Spotify show entries for the guild in the database', async () => {
    await getSpotifyShowsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        name:               'Show name',
        showId:             '1234',
        notificationConfig: { showId: '1234', notificationChannelId: 'channel-id-1', notificationRoleId: 'role-id-1' }
      },
      {
        name:               '',
        showId:             '4567',
        notificationConfig: { showId: '4567', notificationChannelId: 'channel-id-2' }
      }
    ]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should handle there being no entries in the database', async () => {
    getDBEntriesSpy.mockResolvedValueOnce([]);

    await getSpotifyShowsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    getDBEntriesSpy.mockRejectedValueOnce(error);

    await getSpotifyShowsHandler(req, res, nextSpy);

    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const req = { params: { guildId: 'guild-id-1' } } as unknown as Request;
const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();

const spotifyShowDBEntries = [
  { guildId: 'guild-id-1', showId: '1234', notificationChannelId: 'channel-id-1', notificationRoleId: 'role-id-1' },
  { guildId: 'guild-id-1', showId: '4567', notificationChannelId: 'channel-id-2' }
] as unknown as SpotifyShowDBEntry[];

const spotifyShows = [
  {
    id:   '1234',
    name: 'Show name',
  }
] as unknown as SpotifyAPIShow[];