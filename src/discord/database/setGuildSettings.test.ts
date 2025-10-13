import { Guild } from 'discord.js';
import { database } from '../../database/database';
import type { GuildSettings } from '../../types';
import * as getGuildSettings from './getGuildSettings';
import { setGuildSettings } from './setGuildSettings';

describe('setGuildSettings()', () => {
  const getGuildSettingsSpy = jest.spyOn(getGuildSettings, 'getGuildSettings');

  beforeEach(async () => {
    const db = await database;
    await db.run(
      'INSERT OR REPLACE INTO guilds (id, color, nickname) VALUES (?,?,?)',
      '123',
      guildSettings.color,
      guildSettings.nickname
    );
  });

  test('It should insert new guild settings', async () => {
    const guild    = { id: '456' } as Guild;
    const settings = { } as GuildSettings;
    getGuildSettingsSpy.mockResolvedValue(null);

    await setGuildSettings(guild, settings);

    const db  = await database;
    const row = await db.get('SELECT * FROM guilds WHERE id = ?', guild.id);
    expect(row).toEqual({ id: '456', color: null, nickname: null });
  });

  test('It should update existing guild settings', async () => {
    const guild    = { id: '123' } as Guild;
    const settings = { nickname: null, color: '#111111' } satisfies GuildSettings;
    getGuildSettingsSpy.mockResolvedValue(guildSettings);

    await setGuildSettings(guild, settings);

    const db  = await database;
    const row = await db.get('SELECT * FROM guilds WHERE id = ?', guild.id);
    expect(row).toEqual({ id: '123', ...settings, nickname: null });
  });
});

const guildSettings: GuildSettings = {
  nickname: 'Foobar',
  color:    '#000000',
};