import type { Guild } from 'discord.js';
import { getGuildAccentColor } from './getGuildAccentColor';
import * as getGuildSettings from '../discord/database/getGuildSettings';

describe('getGuildAccentColor()', () => {
  const getGuildSettingsSpy = jest.spyOn(getGuildSettings, 'getGuildSettings').mockResolvedValue({ nickname: null, color: '#FF0000' });

  test('It should get the accent color for a guild', async () => {
    const color = await getGuildAccentColor(guild);
    expect(getGuildSettingsSpy).toHaveBeenCalledWith(guild);
    expect(color).toBe('#FF0000');
  });

  test('It should return the default accent color if no guild is provided or there are no guild settings', async () => {
    expect(await getGuildAccentColor(null)).toBe('#19D8B4');

    getGuildSettingsSpy.mockResolvedValueOnce(null);
    expect(await getGuildAccentColor(guild)).toBe('#19D8B4');
  });
});

const guild = { id: '12345' } as Guild;