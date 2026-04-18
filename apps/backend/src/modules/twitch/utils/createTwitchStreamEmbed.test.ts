import type { TwitchStream } from '../requests/getTwitchStreams';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { createTwitchStreamEmbed } from './createTwitchStreamEmbed';

describe('createTwitchStreamEmbed()', () => {
  test('It should create an embed for a live stream', () => {
    const embed = createTwitchStreamEmbed(twitchUser, twitchStream);

    expect(embed.toJSON()).toEqual({
      color:       9520895,
      thumbnail:   { url: 'https://example.com/profile.jpg' },
      url:         'https://twitch.tv/foo',
      title:       'Foo is streaming on Twitch',
      description: '**Stream title**',
      image:       { url: 'https://example.com/thumbnail-400x225.jpg' },
      fields:      [
        { name: 'Category', value: 'Game name' },
        { name: 'Viewers', value: '123' },
        { name: 'Started', value: '<t:1704110400:R>' }
      ],
    });
  });

  test('It should create an embed for an offline channel', () => {
    const embed = createTwitchStreamEmbed(twitchUser, undefined);

    expect(embed.toJSON()).toEqual({
      color:       9520895,
      thumbnail:   { url: 'https://example.com/profile.jpg' },
      url:         'https://twitch.tv/foo',
      title:       'Foo is currently offline',
      description: '**This is a description**',
      image:       { url: 'https://example.com/offline-400x225.jpg' },
    });
  });
});

const twitchUser = {
  profile_image_url: 'https://example.com/profile.jpg',
  login:             'foo',
  display_name:      'Foo',
  description:       'This is a description',
  offline_image_url: 'https://example.com/offline-{width}x{height}.jpg',
} as TwitchUser;

const twitchStream = {
  title:         'Stream title',
  thumbnail_url: 'https://example.com/thumbnail-{width}x{height}.jpg',
  started_at:    '2024-01-01T12:00:00Z',
  game_name:     'Game name',
  viewer_count:  123,
} as TwitchStream;