import { Collection, EmbedBuilder, type Guild } from 'discord.js';
import { kickLiveNotifications } from './kickLiveNotifications';
import type { KickChannelDBEntry } from '../../../types';
import type { KickAPILiveStream } from '../requests/getKickLiveStreams';
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

  test('It should send notifications for live streams', async () => {
    await kickLiveNotifications(channelEntries, [liveStream], guilds);

    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(1);
    expect(sendDiscordMessageSpy).toHaveBeenCalledWith(
      'c-22222',
      guild,
      { content: 'foobar is live on Kick!', embeds: [expectedEmbed] }
    );
  });

  test('It should include role mention if configured', async () => {
    channelEntries[0].notificationRoleId = 'r-33333';

    await kickLiveNotifications(channelEntries, [liveStream], guilds);
    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(1);
    expect(sendDiscordMessageSpy).toHaveBeenCalledWith(
      'c-22222',
      guild,
      { content: '<@&r-33333> foobar is live on Kick!', embeds: [expectedEmbed] }
    );
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

const liveStream = {
  broadcaster_user_id: 55555,
  slug:                'foobar',
  stream_title:        'My awesome stream',
  category:            { name: 'Just chillin\'' },
  started_at:          '1985-10-26T01:17:00Z',
  thumbnail:           'https://example.com/thumbnail.jpg'
} as KickAPILiveStream;

const guild = { name: 'Guild one' } as Guild;
const guilds = new Collection<string, Guild>([
  ['g-11111', guild],
]);