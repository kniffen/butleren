import { Collection, type Guild } from 'discord.js';
import type { YouTubeAPIVideo } from '../requests/getYouTubeVideos';
import type { YouTubeChannelDBEntry  } from '../../../types';
import { youTubeVideoNotifications } from './youTubeVideoNotifications';
import * as logger from '../../logs/logger';
import * as sendDiscordMessage from '../../../discord/utils/sendDiscordMessage';

describe('YouTube: youTubeVideoNotifications', () => {
  const logErrorSpy = jest.spyOn(logger, 'logError').mockImplementation();
  const sendDiscordMessageSpy = jest.spyOn(sendDiscordMessage, 'sendDiscordMessage').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should notify about new video s', async () => {
    await youTubeVideoNotifications(channelEntries, youTubeVideos, guilds);

    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(3);
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      1,
      'channel-1234',
      guild1,
      { content: '<@&role-1234> Channel One posted a new YouTube video!\nhttps://www.youtube.com/watch?v=video-1' }
    );
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      2,
      'channel-5678',
      guild2,
      { content: 'Channel One posted a new YouTube video!\nhttps://www.youtube.com/watch?v=video-1' }
    );
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      3,
      'channel-1234',
      guild1,
      { content: 'Channel One posted a new YouTube video!\nhttps://www.youtube.com/watch?v=video-3' }
    );
    expect(logErrorSpy).not.toHaveBeenCalled();

  });
});

const channelEntries = [
  { guildId: '1234', channelId: 'channel-1', includeVideoStreams: true,  notificationChannelId: 'channel-1234', notificationRoleId: 'role-1234' },
  { guildId: '1234', channelId: 'channel-2', includeVideoStreams: false, notificationChannelId: 'channel-1234', notificationRoleId: null },
  { guildId: '5678', channelId: 'channel-1', includeVideoStreams: true,  notificationChannelId: 'channel-5678', notificationRoleId: null }
] as unknown as YouTubeChannelDBEntry[];

const youTubeVideos = [
  { snippet: { channelId: 'channel-1', channelTitle: 'Channel One', liveBroadcastContent: 'none' }, id: 'video-1' },
  { snippet: { channelId: 'channel-1', channelTitle: 'Channel Two', liveBroadcastContent: 'live' }, id: 'video-2' },
  { snippet: { channelId: 'channel-2', channelTitle: 'Channel One', liveBroadcastContent: 'none' }, id: 'video-3' }
] as YouTubeAPIVideo[];

const guild1 = { name: 'Guild one' } as Guild;
const guild2 = { name: 'Guild two' } as Guild;
const guilds = new Collection<string, Guild>([
  ['1234', guild1],
  ['5678', guild2]
]);