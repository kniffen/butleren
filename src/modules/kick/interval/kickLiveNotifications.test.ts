import { Collection, EmbedBuilder, type Guild } from 'discord.js';
import { kickLiveNotifications } from './kickLiveNotifications';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPIChannel } from '../requests/getKickChannels';
import * as sendDiscordMessage from '../../../discord/utils/sendDiscordMessage';
import { KICK_GREEN } from '../constants';

describe('Kick: kickLiveNotifications()', () => {
  const sendDiscordMessageSpy = jest.spyOn(sendDiscordMessage, 'sendDiscordMessage').mockImplementation();
  let expectedEmbed: EmbedBuilder;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(date);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    expectedEmbed = new EmbedBuilder();
    expectedEmbed.setTitle('foobar is streaming on Kick');
    expectedEmbed.setURL('https://kick.com/foobar');
    expectedEmbed.setColor(KICK_GREEN);
    expectedEmbed.setDescription('**My awesome stream**');
    expectedEmbed.setImage(`https://example.com/thumbnail.jpg?t=${date.valueOf()}`);
    expectedEmbed.addFields([
      { name: 'Category', value: 'Just chillin\'' },
      { name: 'Started',  value: '<t:499137420:R>' }
    ]);
    expectedEmbed.setTimestamp(new Date('1985-10-26T01:17:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('It should send notifications for live channels', async () => {
    await kickLiveNotifications(date, channelEntries, [kickChannel], guilds);

    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(1);
    expect(sendDiscordMessageSpy).toHaveBeenCalledWith(
      'c-22222',
      guild,
      { content: 'foobar is live on Kick!', embeds: [expectedEmbed] }
    );
  });

  test('It should include role mention if configured', async () => {
    channelEntries[0].notificationRoleId = 'r-33333';

    await kickLiveNotifications(date, channelEntries, [kickChannel], guilds);
    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(1);
    expect(sendDiscordMessageSpy).toHaveBeenCalledWith(
      'c-22222',
      guild,
      { content: '<@&r-33333> foobar is live on Kick!', embeds: [expectedEmbed] }
    );
  });

  test('It should ignore channels that have been live for more than 5 minutes', async () => {
    const oldDate = new Date('1985-10-26T01:30:00Z');
    await kickLiveNotifications(oldDate, channelEntries, [kickChannel], guilds);
    expect(sendDiscordMessageSpy).not.toHaveBeenCalled();
  });

  test('It should ignore offline channels', async () => {
    const offlineChannel = { ...kickChannel, stream: { ...kickChannel.stream, is_live: false } };
    await kickLiveNotifications(date, channelEntries, [offlineChannel], guilds);
    expect(sendDiscordMessageSpy).not.toHaveBeenCalled();
  });
});

const date = new Date('1985-10-26T01:20:00Z');

const channelEntries: KickChannelDBEntry[] = [
  {
    guildId:               'g-11111',
    notificationChannelId: 'c-22222',
    notificationRoleId:    null,
    broadcasterUserId:     55555
  },
  {
    guildId:               'g-11111',
    notificationChannelId: 'c-22222',
    notificationRoleId:    null,
    broadcasterUserId:     66666
  }
];

const kickChannel = {
  broadcaster_user_id: 55555,
  slug:                'foobar',
  stream_title:        'My awesome stream',
  category:            { name: 'Just chillin\'' },
  stream:              {
    is_live:    true,
    start_time: '1985-10-26T01:17:00Z',
    thumbnail:  'https://example.com/thumbnail.jpg'
  }
} as KickAPIChannel;

const guild = { name: 'Guild one' } as Guild;
const guilds = new Collection<string, Guild>([
  ['g-11111', guild],
]);