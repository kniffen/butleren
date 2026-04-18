import type { Request, Response } from 'express';
import type { YouTubeChannelDBEntry } from '../../../types';
import type { YouTubeAPIChannel } from '../requests/getYouTubeChannels';
import { getYouTubeChannelsHandler } from './getYouTubeChannelsHandler';
import * as getDBEntries from '../../../database/utils/getDBEntries';
import * as getYouTubeChannels from '../requests/getYouTubeChannels';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn((id) => ({ id })),
    },
  }
}));

describe('YouTube: getYouTubeChannelsHandler()', () => {
  const getDBEntriesSpy       = jest.spyOn(getDBEntries, 'getDBEntries');
  const getYouTubeChannelsSpy = jest.spyOn(getYouTubeChannels, 'getYouTubeChannels');

  beforeAll(() => {
    getDBEntriesSpy.mockResolvedValue(youTubeChannelDBEntries);
    getYouTubeChannelsSpy.mockResolvedValue(youTubeChannels);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get YouTube channel entries for the guild in the database', async () => {
    await getYouTubeChannelsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        name:               'Channel Name',
        channelId:          '1234',
        notificationConfig: {
          channelId:              '1234',
          notificationChannelId:  'channel-id-1',
          notificationRoleId:     'role-id-1',
          liveNotificationRoleId: 'role-id-2',
          includeLiveStreams:     true
        }
      },
      {
        name:               '',
        channelId:          '4567',
        notificationConfig: {
          channelId:              '4567',
          notificationChannelId:  'channel-id-2',
          notificationRoleId:     null,
          liveNotificationRoleId: null,
          includeLiveStreams:     false
        }
      }
    ]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should handle there being no entries in the database', async () => {
    getDBEntriesSpy.mockResolvedValueOnce([]);

    await getYouTubeChannelsHandler(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    getDBEntriesSpy.mockRejectedValueOnce(error);

    await getYouTubeChannelsHandler(req, res, nextSpy);

    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const req = { params: { guildId: 'guild-id-1' } } as unknown as Request;
const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();

const youTubeChannelDBEntries: YouTubeChannelDBEntry[] = [
  {
    guildId:                'guild-id-1',
    channelId:              '1234',
    notificationChannelId:  'channel-id-1',
    notificationRoleId:     'role-id-1' ,
    liveNotificationRoleId: 'role-id-2' ,
    includeLiveStreams:     1
  },
  {
    guildId:                'guild-id-1',
    channelId:              '4567',
    notificationChannelId:  'channel-id-2',
    notificationRoleId:     null ,
    liveNotificationRoleId: null ,
    includeLiveStreams:     0
  }
];

const youTubeChannels = [
  {
    id:      '1234',
    snippet: {
      title: 'Channel Name'
    }
  }
] as unknown as YouTubeAPIChannel[];