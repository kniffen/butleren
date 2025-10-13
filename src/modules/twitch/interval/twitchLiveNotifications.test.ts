import { Collection, type EmbedBuilder, type Guild } from 'discord.js';
import type { TwitchStream } from '../requests/getTwitchStreams';
import type { TwitchChannelDBEntry } from '../../../types';
import * as createTwitchLiveNotificationEmbed from '../utils/createTwitchLiveNotificationEmbed';
import * as sendDiscordMessage from '../../../discord/utils/sendDiscordMessage';
import { twitchLiveNotifications } from './twitchLiveNotifications';

describe('Twitch: twitchLiveNotifications', () => {
  const createTwitchLiveNotificationEmbedMock = jest.spyOn(createTwitchLiveNotificationEmbed, 'createTwitchLiveNotificationEmbed').mockReturnValue('embed' as unknown as EmbedBuilder);
  const sendDiscordMessageSpy = jest.spyOn(sendDiscordMessage, 'sendDiscordMessage').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should notify about live streams to linked channels', async () => {
    twitchLiveNotifications(date, channelEntries, twitchStreams, guilds);

    expect(createTwitchLiveNotificationEmbedMock).toHaveBeenCalledTimes(2);
    expect(createTwitchLiveNotificationEmbedMock).toHaveBeenNthCalledWith(1, new Date('1985-10-26T11:57:00Z'), twitchStreams[0]);
    expect(createTwitchLiveNotificationEmbedMock).toHaveBeenNthCalledWith(2, new Date('1985-10-26T11:57:00Z'), twitchStreams[1]);

    await Promise.resolve();
    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(3);
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(1, 'channel-1234', guild1, { content: '<@&role-1234> Streamer one is live on Twitch!', embeds: ['embed'] });
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(2, 'channel-5678', guild2, { content: '<@&role-5678> Streamer one is live on Twitch!', embeds: ['embed'] });
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(3, 'channel-1234', guild1, { content: 'Streamer two is live on Twitch!', embeds: ['embed'] });
  });

  test('It should ignore streams that have been live for more than 5 minutes', async () => {
    const oldDate = new Date('1985-10-26T12:10:00Z');
    twitchLiveNotifications(oldDate, channelEntries, twitchStreams, guilds);

    expect(createTwitchLiveNotificationEmbedMock).not.toHaveBeenCalled();

    await Promise.resolve();
    expect(sendDiscordMessageSpy).not.toHaveBeenCalled();
  });
});

const date = new Date('1985-10-26T12:00:00Z');

const channelEntries = [
  { guildId: '1234', id: 'twitch-channel-1', notificationChannelId: 'channel-1234', notificationRoleId: 'role-1234' },
  { guildId: '1234', id: 'twitch-channel-2', notificationChannelId: 'channel-1234', notificationRoleId: null },
  { guildId: '1234', id: 'twitch-channel-3', notificationChannelId: 'channel-1234', notificationRoleId: 'role-1234' },
  { guildId: '5678', id: 'twitch-channel-1', notificationChannelId: 'channel-5678', notificationRoleId: 'role-5678' }
] as unknown as TwitchChannelDBEntry[];

const twitchStreams = [
  { user_id: 'twitch-channel-1', user_login: 'streamer-1', user_name: 'Streamer one', started_at: '1985-10-26T11:57:00Z' },
  { user_id: 'twitch-channel-2', user_login: 'streamer-2', user_name: 'Streamer two', started_at: '1985-10-26T11:57:00Z' },
] as TwitchStream[];

const guild1 = { name: 'Guild one' } as Guild;
const guild2 = { name: 'Guild two' } as Guild;
const guilds = new Collection<string, Guild>([
  ['1234', guild1],
  ['5678', guild2]
]);