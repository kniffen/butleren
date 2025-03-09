import { Guild } from 'discord.js';
import { database } from '../database';
import type { GuildSettings } from '../../types';
import * as getGuildSettings from './getGuildSettings';
import { setGuildSettings } from './setGuildSettings';

describe('setGuildSettings()', () => {
  const getGuildSettingsSpy = jest.spyOn(getGuildSettings, 'getGuildSettings');

  beforeEach(async () => {
    const db = await database;
    await db.run(
      'INSERT OR REPLACE INTO guilds (guildId, settings) VALUES (?,?)',
      '123',
      JSON.stringify(guildSettings),
    );
  });

  test('It should insert new guild settings', async () => {
    const guild    = { id: '456' } as Guild;
    const settings = { timezone: 'UTC' } as GuildSettings;
    getGuildSettingsSpy.mockResolvedValue(null);

    await setGuildSettings(guild, settings);

    const db  = await database;
    const row = await db.get('SELECT settings FROM guilds WHERE guildId = ?', guild.id);
    expect(JSON.parse(row.settings)).toEqual(settings);
  });

  test('It should update existing guild settings', async () => {
    const guild    = { id: '123' } as Guild;
    const settings = { timezone: 'PST', color: '#111111' } satisfies GuildSettings;
    getGuildSettingsSpy.mockResolvedValue(guildSettings);

    await setGuildSettings(guild, settings);

    const db  = await database;
    const row = await db.get('SELECT settings FROM guilds WHERE guildId = ?', guild.id);
    expect(JSON.parse(row.settings)).toEqual(settings);
  });
});

const guildSettings: GuildSettings = {
  nickname: 'Foobar',
  timezone: 'UTC',
  color:    '#000000',
};