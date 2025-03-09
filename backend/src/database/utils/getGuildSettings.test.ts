import type { Guild } from 'discord.js';
import { getGuildSettings } from './getGuildSettings';
import { database } from '../database';
import type { GuildSettings } from '../../types';

describe('getGuildSettings()', () => {
  beforeEach(async () => {
    const db = await database;
    await db.run(
      'INSERT OR REPLACE INTO guilds (guildId, settings) VALUES (?,?)',
      '123',
      JSON.stringify(guildSettings),
    );
  });

  test('It should get the settings for a guild', async () => {
    const guild    = { id: '123' } as Guild;
    const settings = await getGuildSettings(guild);
    expect(settings).toEqual(guildSettings);
  });

  test('It should return null if the guild settings do not exist', async () => {
    const guild    = { id: '456' } as Guild;
    const settings = await getGuildSettings(guild);
    expect(settings).toBeNull();
  });
});

const guildSettings: GuildSettings = {
  nickname: 'Foobar',
  timezone: 'UTC',
  color:    '#000000',
};