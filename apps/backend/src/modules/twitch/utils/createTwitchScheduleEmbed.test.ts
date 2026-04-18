import type { TwitchSchedule } from '../requests/getTwitchSchedule';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { createTwitchScheduleEmbed } from './createTwitchScheduleEmbed';

describe('createTwitchScheduleEmbed()', () => {
  test('It should create an embed for a live stream', () => {
    const embed = createTwitchScheduleEmbed(twitchUser, twitchSchedule, 2);

    expect(embed.toJSON()).toEqual({
      color:     9520895,
      title:     'Stream schedule for Foo',
      url:       'https://twitch.tv/foo/schedule',
      thumbnail: { url: 'https://example.com/profile.jpg' },
      footer:    { text: 'Times are in your local timezone' },
      fields:    [
        { name: '<t:1704110400>', value: 'Stream title 1 Game name 1' },
        { name: '<t:1704196800>', value: 'Stream title 2 Game name 2' },
      ],
    });
  });

  test('It should handle there being no segments', () => {
    const embed = createTwitchScheduleEmbed(twitchUser, { segments: [] } as unknown as TwitchSchedule);

    expect(embed.toJSON()).toEqual({
      color:       9520895,
      title:       'Stream schedule for Foo',
      url:         'https://twitch.tv/foo/schedule',
      thumbnail:   { url: 'https://example.com/profile.jpg' },
      footer:      { text: 'Times are in your local timezone' },
      description: 'Foo has no upcoming streams scheduled.',
    });
  });

  test('It should handle there being no schedule', () => {
    const embed = createTwitchScheduleEmbed(twitchUser, null);

    expect(embed.toJSON()).toEqual({
      color:       9520895,
      title:       'Stream schedule for Foo',
      url:         'https://twitch.tv/foo/schedule',
      thumbnail:   { url: 'https://example.com/profile.jpg' },
      footer:      { text: 'Times are in your local timezone' },
      description: 'Foo has no upcoming streams scheduled.',
    });
  });
});

const twitchUser = {
  profile_image_url: 'https://example.com/profile.jpg',
  login:             'foo',
  display_name:      'Foo',
} as TwitchUser;

const twitchSchedule = {
  segments: [
    { start_time: '2024-01-01T12:00:00Z', title: 'Stream title 1', category: { name: 'Game name 1' } },
    { start_time: '2024-01-02T12:00:00Z', title: 'Stream title 2', category: { name: 'Game name 2' } },
    { start_time: '2024-01-03T12:00:00Z', title: 'Stream title 3', category: { name: 'Game name 3' } },
  ]
} as TwitchSchedule;