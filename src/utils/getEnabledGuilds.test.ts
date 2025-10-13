import { getEnabledGuilds } from './getEnabledGuilds';
import { Guild } from 'discord.js';
import * as getDBEntries from '../database/utils/getDBEntries';

describe('getEnabledGuilds()', () => {
  jest
    .spyOn(getDBEntries, 'getDBEntries')
    .mockResolvedValue([
      { guildId: '1234', slug: 'foo', isEnabled: 1 },
      { guildId: '5678', slug: 'foo', isEnabled: 0 },
    ]);

  test('It should resolve a collection of guilds with a specified module enabled', async () => {
    const fooGuilds = await getEnabledGuilds('foo', guilds);
    expect(fooGuilds.size).toBe(1);
    expect(fooGuilds.get('1234')).toEqual(guilds[0]);
  });
});

const guilds = [
  { id: '1234' },
  { id: '5678' }
] as Guild[];