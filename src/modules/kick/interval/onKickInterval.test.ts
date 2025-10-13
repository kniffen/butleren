import { Collection, Guild } from 'discord.js';
import { onKickInterval } from './onKickInterval';
import * as getEnabledGuilds from '../../../utils/getEnabledGuilds';
import * as getKickChannels from '../requests/getKickChannels';
import * as kickLiveNotifications from './kickLiveNotifications';
import * as getDBEntries  from '../../../database/utils/getDBEntries';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPIChannel } from '../requests/getKickChannels';

describe('Kick: onKickInterval()', () => {
  const getEnabledGuildsMock      = jest.spyOn(getEnabledGuilds, 'getEnabledGuilds').mockImplementation();
  const getDBEntriesMock          = jest.spyOn(getDBEntries, 'getDBEntries').mockImplementation();
  const getKickChannelsMock       = jest.spyOn(getKickChannels, 'getKickChannels').mockImplementation();
  const kickLiveNotificationsMock = jest.spyOn(kickLiveNotifications, 'kickLiveNotifications').mockImplementation();

  beforeAll(() => {
    getEnabledGuildsMock.mockResolvedValue(enabledGuilds);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('It fetch kick channels for enabled guilds and send live notifications', async () => {
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[0], kickChannelDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([kickChannelDBEntries[2]]);

    getKickChannelsMock.mockResolvedValueOnce(['channel-1', 'channel-2'] as unknown as KickAPIChannel[]);

    const date = new Date('1985-10-26T12:00:00Z');
    await onKickInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('kick', guilds);
    expect(getKickChannelsMock).toHaveBeenCalledWith({ broadcasterUserIds: [8150, 8151] });
    expect(kickLiveNotificationsMock).toHaveBeenCalledWith(
      date,
      kickChannelDBEntries,
      ['channel-1', 'channel-2'],
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