import { Collection, type Guild } from 'discord.js';
import type { YouTubeChannelDBEntry } from '../../../types';
import * as getEnabledGuilds from '../../../utils/getEnabledGuilds';
import * as getDBEntries from '../../../database/utils/getDBEntries';
import * as getYouTubeActivities from '../requests/getYouTubeActivities';
import * as getYouTubeVideos from '../requests/getYouTubeVideos';
import * as youTubeVideoNotifications from './youTubeVideoNotifications';
import * as youTubeLiveNotifications from './youTubeLiveNotifications';
import { onYouTubeInterval } from './onYouTubeInterval';
import { YouTubeAPIActivity } from '../requests/getYouTubeActivities';
import { YouTubeAPIVideo } from '../requests/getYouTubeVideos';

describe('YouTube: onYouTubeInterval()', () => {
  const getEnabledGuildsMock          = jest.spyOn(getEnabledGuilds,          'getEnabledGuilds'         ).mockImplementation();
  const getDBEntriesMock              = jest.spyOn(getDBEntries,              'getDBEntries'             ).mockImplementation();
  const getYouTubeActivitiesMock      = jest.spyOn(getYouTubeActivities,      'getYouTubeActivities'     ).mockImplementation();
  const getYouTubeVideosMock          = jest.spyOn(getYouTubeVideos,          'getYouTubeVideos'         ).mockImplementation();
  const youTubeVideoNotificationsMock = jest.spyOn(youTubeVideoNotifications, 'youTubeVideoNotifications').mockImplementation();
  const youTubeLiveNotificationsMock  = jest.spyOn(youTubeLiveNotifications,  'youTubeLiveNotifications' ).mockImplementation();

  beforeAll(() => {
    getEnabledGuildsMock.mockResolvedValue(enabledGuilds);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('It should post notifications for new videos and live streams', async () => {
    getDBEntriesMock.mockResolvedValueOnce([youtubeChannelDBEntries[0], youtubeChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([youtubeChannelDBEntries[2]]);
    getYouTubeActivitiesMock.mockResolvedValueOnce([activity1, activity2]);
    getYouTubeActivitiesMock.mockResolvedValueOnce([activity3]);
    getYouTubeVideosMock.mockResolvedValueOnce([video1, video2, video3]);

    await onYouTubeInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('youtube', guilds);

    expect(getDBEntriesMock).toHaveBeenCalledTimes(2);
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(1, 'youTubeChannels', { guildId: '1234' });
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(2, 'youTubeChannels', { guildId: '5678' });

    expect(getYouTubeActivitiesMock).toHaveBeenCalledTimes(2);
    expect(getYouTubeActivitiesMock).toHaveBeenNthCalledWith(1, 'channel-1');
    expect(getYouTubeActivitiesMock).toHaveBeenNthCalledWith(2, 'channel-2');

    expect(getYouTubeVideosMock).toHaveBeenCalledWith(['video-1', 'video-3']);
    expect(youTubeVideoNotificationsMock).toHaveBeenCalledWith(youtubeChannelDBEntries, [video1, video2, video3], enabledGuilds);
    expect(youTubeLiveNotificationsMock).toHaveBeenCalledWith(youtubeChannelDBEntries, [video1, video2, video3], enabledGuilds);
  });

  test('It should only run every hour at the hour mark', async () => {
    await Promise.all([
      onYouTubeInterval(new Date('1985-10-26T12:00:00Z'), guilds), // Run
      onYouTubeInterval(new Date('1985-10-26T12:01:00Z'), guilds), // Ignore
      onYouTubeInterval(new Date('1985-10-26T12:59:00Z'), guilds), // Ignore
      onYouTubeInterval(new Date('1985-10-26T00:00:00Z'), guilds), // Run
      onYouTubeInterval(new Date('1985-10-26T00:30:00Z'), guilds), // Ignore
      onYouTubeInterval(new Date('1985-10-26T23:00:00Z'), guilds), // Run
    ]);

    expect(getEnabledGuildsMock).toHaveBeenCalledTimes(3);
  });

  test('It do nothing if there are no channel entries', async () => {
    getDBEntriesMock.mockResolvedValueOnce([]);
    getDBEntriesMock.mockResolvedValueOnce([]);

    await onYouTubeInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('youtube', guilds);
    expect(getYouTubeActivitiesMock).not.toHaveBeenCalled();
    expect(getYouTubeVideosMock).not.toHaveBeenCalled();
    expect(youTubeVideoNotificationsMock).not.toHaveBeenCalled();
    expect(youTubeLiveNotificationsMock).not.toHaveBeenCalled();
  });

  test('It should not get videos or notification if there are no new uploads', async () => {
    getDBEntriesMock.mockResolvedValueOnce([youtubeChannelDBEntries[0], youtubeChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([youtubeChannelDBEntries[2]]);
    getYouTubeActivitiesMock.mockResolvedValueOnce([]);
    getYouTubeActivitiesMock.mockResolvedValueOnce([]);

    await onYouTubeInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('youtube', guilds);
    expect(getDBEntriesMock).toHaveBeenCalledTimes(2);
    expect(getYouTubeActivitiesMock).toHaveBeenCalledTimes(2);
    expect(getYouTubeVideosMock).not.toHaveBeenCalled();
    expect(youTubeVideoNotificationsMock).not.toHaveBeenCalled();
    expect(youTubeLiveNotificationsMock).not.toHaveBeenCalled();
  });
});


const date = new Date('1985-10-26T12:00:00Z');

const youtubeChannelDBEntries: YouTubeChannelDBEntry[] = [
  { guildId: '1234', channelId: 'channel-1', includeLiveStreams: 1, notificationChannelId: 'c-1111', notificationRoleId: 'e-1111', liveNotificationRoleId: 'l-1111' },
  { guildId: '1234', channelId: 'channel-2', includeLiveStreams: 1, notificationChannelId: 'c-1111', notificationRoleId: null    , liveNotificationRoleId: null },
  { guildId: '5678', channelId: 'channel-1', includeLiveStreams: 1, notificationChannelId: 'c-2222', notificationRoleId: 'e-2222', liveNotificationRoleId: 'l-2222' },
];

const activity1 = { snippet: { publishedAt: '1985-10-26T11:30:00Z', type: 'upload' }, contentDetails: { upload: { videoId: 'video-1' } } } as YouTubeAPIActivity;
const activity2 = { snippet: { publishedAt: '1985-10-26T09:00:00Z', type: 'upload' }, contentDetails: { upload: { videoId: 'video-2' } } } as YouTubeAPIActivity;
const activity3 = { snippet: { publishedAt: '1985-10-26T11:45:00Z', type: 'upload' }, contentDetails: { upload: { videoId: 'video-3' } } } as YouTubeAPIActivity;

const video1 = { snippet: { channelId: 'channel-1', channelTitle: 'Channel One', liveBroadcastContent: 'none' }, id: 'video-1' } as YouTubeAPIVideo;
const video2 = { snippet: { channelId: 'channel-1', channelTitle: 'Channel Two', liveBroadcastContent: 'live' }, id: 'video-2' } as YouTubeAPIVideo;
const video3 = { snippet: { channelId: 'channel-2', channelTitle: 'Channel One', liveBroadcastContent: 'none' }, id: 'video-3' } as YouTubeAPIVideo;

const guild1 = { id: '1234', name: 'Guild one' } as unknown as Guild;
const guild2 = { id: '5678', name: 'Guild two' } as unknown as Guild;
const guild3 = { id: '9999', name: 'Guild three' } as unknown as Guild;


const guilds = [guild1, guild2, guild3];

const enabledGuilds = new Collection<string, Guild>([
  ['1234', guild1],
  ['5678', guild2]
]);
