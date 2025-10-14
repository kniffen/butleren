import { Collection, Guild } from 'discord.js';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPIChannel } from '../requests/getKickChannels';
import type { KickAPILiveStream } from '../requests/getKickLiveStreams';
import * as getEnabledGuilds from '../../../utils/getEnabledGuilds';
import * as getDBEntries  from '../../../database/utils/getDBEntries';
import * as getKickChannels from '../requests/getKickChannels';
import * as getKickLiveStreams from '../requests/getKickLiveStreams';
import * as kickLiveNotifications from './kickLiveNotifications';
import { onKickInterval } from './onKickInterval';

describe('Kick: onKickInterval()', () => {
  const getEnabledGuildsMock      = jest.spyOn( getEnabledGuilds,      'getEnabledGuilds'      ).mockImplementation();
  const getDBEntriesMock          = jest.spyOn( getDBEntries,          'getDBEntries'          ).mockImplementation();
  const getKickChannelsMock       = jest.spyOn( getKickChannels,       'getKickChannels'       ).mockImplementation();
  const getKickLiveStreamsMock    = jest.spyOn( getKickLiveStreams,    'getKickLiveStreams'    ).mockImplementation();
  const kickLiveNotificationsMock = jest.spyOn( kickLiveNotifications, 'kickLiveNotifications' ).mockImplementation();

  beforeAll(() => {
    getEnabledGuildsMock.mockResolvedValue(enabledGuilds);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('It fetch kick channels for enabled guilds and send live notifications', async () => {
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[0], kickChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[2]]);

    const channel1 = { broadcaster_user_id: 123, stream: { is_live: true,  start_time: '1985-10-26T11:59:00Z' } } as KickAPIChannel;
    const channel2 = { broadcaster_user_id: 456, stream: { is_live: true,  start_time: '1985-10-26T11:59:00Z' } } as KickAPIChannel;
    const streams  =  ['stream-1', 'stream-2'] as unknown as KickAPILiveStream[];

    getKickChannelsMock.mockResolvedValueOnce([channel1, channel2]);
    getKickLiveStreamsMock.mockResolvedValueOnce(streams);

    const date = new Date('1985-10-26T12:00:00Z');
    await onKickInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('kick', guilds);
    expect(getKickChannelsMock).toHaveBeenCalledWith({ broadcasterUserIds: [8150, 8151] });
    expect(getKickLiveStreamsMock).toHaveBeenCalledWith([123, 456]);
    expect(kickLiveNotificationsMock).toHaveBeenCalledWith(
      kickChannelDBEntries,
      ['stream-1', 'stream-2'],
      enabledGuilds
    );
  });

  test('It should only run on the 5 minute mark', async () => {
    const date = new Date('1985-10-26T12:01:00Z');
    await onKickInterval(date, guilds);
    expect(getEnabledGuildsMock).not.toHaveBeenCalled();
    expect(getKickChannelsMock).not.toHaveBeenCalled();
    expect(kickLiveNotificationsMock).not.toHaveBeenCalled();
  });

  test('it should not request channels if there are no channel entries for enabled guilds', async () => {
    getEnabledGuildsMock.mockResolvedValueOnce(new Collection([
      ['9999', { id: '9999', name: 'Guild three' }]
    ]) as Collection<string, Guild>);

    const date = new Date('1985-10-26T12:00:00Z');
    await onKickInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('kick', guilds);
    expect(getKickChannelsMock).not.toHaveBeenCalled();
    expect(kickLiveNotificationsMock).not.toHaveBeenCalled();
  });

  test('It should ignore channels that are offline or have been live for more than 5 minutes', async () => {
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[0], kickChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[2]]);

    const channel1 = { broadcaster_user_id: 123, stream: { is_live: true,  start_time: '1985-10-26T11:50:00Z' } } as KickAPIChannel;
    const channel2 = { broadcaster_user_id: 456, stream: { is_live: false, start_time: '1985-10-26T11:59:00Z' } } as KickAPIChannel;

    getKickChannelsMock.mockResolvedValueOnce([channel1, channel2]);

    const date = new Date('1985-10-26T12:00:00Z');
    await onKickInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('kick', guilds);
    expect(getKickChannelsMock).toHaveBeenCalledWith({ broadcasterUserIds: [8150, 8151] });
    expect(getKickLiveStreamsMock).not.toHaveBeenCalled();
    expect(kickLiveNotificationsMock).not.toHaveBeenCalled();
  });

  test('It should so nothing if there are no live streams', async () => {
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[0], kickChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[2]]);

    const channel1 = { broadcaster_user_id: 123, stream: { is_live: true, start_time: '1985-10-26T11:59:00Z' } } as KickAPIChannel;
    const channel2 = { broadcaster_user_id: 456, stream: { is_live: true, start_time: '1985-10-26T11:59:00Z' } } as KickAPIChannel;

    getKickChannelsMock.mockResolvedValueOnce([channel1, channel2]);
    getKickLiveStreamsMock.mockResolvedValueOnce([]);

    const date = new Date('1985-10-26T12:00:00Z');
    await onKickInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('kick', guilds);
    expect(getKickChannelsMock).toHaveBeenCalledWith({ broadcasterUserIds: [8150, 8151] });
    expect(getKickLiveStreamsMock).toHaveBeenCalledWith([123, 456]);
    expect(kickLiveNotificationsMock).not.toHaveBeenCalled();
  });
});

const kickChannelDBEntries: KickChannelDBEntry[] = [
  { guildId: '1234', broadcasterUserId: 8150, notificationChannelId: 'c-1111', notificationRoleId: 'e-1111' },
  { guildId: '1234', broadcasterUserId: 8151, notificationChannelId: 'c-1111', notificationRoleId: null    },
  { guildId: '5678', broadcasterUserId: 8150, notificationChannelId: 'c-2222', notificationRoleId: 'e-2222' }
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