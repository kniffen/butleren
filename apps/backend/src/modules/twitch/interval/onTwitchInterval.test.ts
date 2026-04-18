import { Collection, type Guild } from 'discord.js';
import * as getEnabledGuilds  from '../../../utils/getEnabledGuilds';
import * as getDBEntries  from '../../../database/utils/getDBEntries';
import * as getTwitchStreams  from '../requests/getTwitchStreams';
import * as twitchLiveNotifications  from './twitchLiveNotifications';
import { TwitchStream } from '../requests/getTwitchStreams';
import { onTwitchInterval } from './onTwitchInterval';
import { TwitchChannelDBEntry } from '../../../types';

describe('Twitch: onInterval', () => {
  const getEnabledGuildsMock        = jest.spyOn(getEnabledGuilds,        'getEnabledGuilds'       ).mockImplementation();
  const getDBEntriesMock            = jest.spyOn(getDBEntries,            'getDBEntries'           ).mockImplementation();
  const getTwitchStreamsMock        = jest.spyOn(getTwitchStreams,        'getTwitchStreams'       ).mockImplementation();
  const twitchLiveNotificationsMock = jest.spyOn(twitchLiveNotifications, 'twitchLiveNotifications').mockImplementation();

  beforeAll(() => {
    getEnabledGuildsMock.mockResolvedValue(enabledGuilds);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('It should trigger notifications for live streams', async () => {
    getDBEntriesMock.mockResolvedValueOnce([twitchChannelDBEntries[0], twitchChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([twitchChannelDBEntries[2]]);

    getTwitchStreamsMock.mockResolvedValueOnce(['stream-1', 'stream-2'] as unknown as TwitchStream[]);

    await onTwitchInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('twitch', guilds);
    expect(getDBEntriesMock).toHaveBeenCalledTimes(2);
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(1, 'twitchChannels', { guildId: '1234' });
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(2, 'twitchChannels', { guildId: '5678' });
    expect(getTwitchStreamsMock).toHaveBeenCalledWith(['channel-1', 'channel-2']);
    expect(twitchLiveNotificationsMock).toHaveBeenCalledWith(date, twitchChannelDBEntries, ['stream-1', 'stream-2'], enabledGuilds);
  });

  test('It should not run if not on the 5 minute mark', async () => {
    await onTwitchInterval(new Date('1985-10-26T12:00:00Z'), guilds); // Run
    await onTwitchInterval(new Date('1985-10-26T12:01:00Z'), guilds); // Ignore
    await onTwitchInterval(new Date('1985-10-26T12:04:00Z'), guilds); // Ignore
    await onTwitchInterval(new Date('1985-10-26T12:05:00Z'), guilds); // Run
    await onTwitchInterval(new Date('1985-10-26T12:06:00Z'), guilds); // Ignore
    await onTwitchInterval(new Date('1985-10-26T12:10:00Z'), guilds); // Run

    expect(getEnabledGuildsMock).toHaveBeenCalledTimes(3);
  });

  test('It should not request streams if there are no channel entries for enabled guilds', async () => {
    getDBEntriesMock.mockResolvedValueOnce([]);
    getDBEntriesMock.mockResolvedValueOnce([]);

    await onTwitchInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('twitch', guilds);
    expect(getTwitchStreamsMock).not.toHaveBeenCalled();
    expect(twitchLiveNotificationsMock).not.toHaveBeenCalled();
  });
});

const date = new Date('1985-10-26T12:00:00Z');

const twitchChannelDBEntries: TwitchChannelDBEntry[] = [
  { guildId: '1234', id: 'channel-1', notificationChannelId: 'c-1111', notificationRoleId: 'e-1111' },
  { guildId: '1234', id: 'channel-2', notificationChannelId: 'c-1111', notificationRoleId: null    },
  { guildId: '5678', id: 'channel-1', notificationChannelId: 'c-2222', notificationRoleId: 'e-2222' }
];

const enabledGuilds = new Collection([
  ['1234', { id: '1234', name: 'Guild one' }],
  ['5678', { id: '5678', name: 'Guild two' }]
]) as Collection<string, Guild>;

const guilds = [
  ['1234', { id: '1234', name: 'Guild one' }],
  ['5678', { id: '5678', name: 'Guild two' }],
  ['9999', { id: '9999', name: 'Guild three' }]
] as unknown as Guild[];