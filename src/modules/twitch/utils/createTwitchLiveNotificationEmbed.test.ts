import type { TwitchStream } from '../requests/getTwitchStreams';
import { createTwitchLiveNotificationEmbed } from './createTwitchLiveNotificationEmbed';

describe('createTwitchLiveNotificationEmbed()', () => {
  test('It should create an embed for a live stream', () => {
    const embed = createTwitchLiveNotificationEmbed(date, twitchStream);

    expect(embed.toJSON()).toEqual({
      title:       'Foo is streaming on Twitch',
      url:         'https://twitch.tv/foo',
      color:       9520895,
      description: '**Stream title**',
      image:       { url: 'https://example.com/thumbnail-400x225.jpg?t=1704110400000' },
      fields:      [
        { name: 'Category', value: 'Game name' },
      ],
      timestamp: '2024-01-01T12:00:00.000Z'
    });
  });
});

const date = new Date('2024-01-01T12:00:00Z');
const twitchStream = {
  title:         'Stream title',
  thumbnail_url: 'https://example.com/thumbnail-{width}x{height}.jpg',
  started_at:    '2024-01-01T12:00:00Z',
  game_name:     'Game name',
  viewer_count:  123,
  user_login:    'foo',
  user_name:     'Foo',
} as TwitchStream;