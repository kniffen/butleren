import { Guild } from "discord.js";
import { addGuildToDatabase, defaultGuildSettings, defaultModuleSettings } from "./addGuildToDatabase";
import * as getGuildSettings from './getGuildSettings';
import * as setGuildSettings from './setGuildSettings';
import * as getModuleSettings from './getModuleSettings';
import * as setModuleSettings from './setModuleSettings';

describe('addGuildToDatabase', () => {
  const getGuildSettingsSpy  = jest.spyOn(getGuildSettings, 'getGuildSettings').mockResolvedValue(null);
  const setGuildSettingsSpy  = jest.spyOn(setGuildSettings, 'setGuildSettings').mockResolvedValue();
  const getModuleSettingsSpy = jest.spyOn(getModuleSettings, 'getModuleSettings').mockResolvedValue(null);
  const setModuleSettingsSpy = jest.spyOn(setModuleSettings, 'setModuleSettings').mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should set guild settings', async () => {
    await addGuildToDatabase(guild);

    expect(setGuildSettingsSpy).toHaveBeenCalledTimes(1);
    expect(setGuildSettingsSpy).toHaveBeenCalledWith(guild, defaultGuildSettings);
  });

  test('It should set module settings for the guild', async () => {
    await addGuildToDatabase(guild);

    expect(setModuleSettingsSpy).toHaveBeenCalledTimes(2);
    expect(setModuleSettingsSpy).toHaveBeenCalledWith('system', guild, defaultModuleSettings);
    expect(setModuleSettingsSpy).toHaveBeenCalledWith('fun',    guild, defaultModuleSettings);
  });

  test('It should not overwrite existing guild settings', async () => {
    getGuildSettingsSpy.mockResolvedValueOnce({
      color:    '#000000',
      timezone: 'UTC',
    });

    await addGuildToDatabase(guild);

    expect(setGuildSettingsSpy).not.toHaveBeenCalled();
  });

  test('It should not overwrite existing module settings', async () => {
    getModuleSettingsSpy.mockResolvedValue({
      isEnabled: true,
    });

    await addGuildToDatabase(guild);

    expect(setModuleSettingsSpy).not.toHaveBeenCalled();
  });
});

const guild = {
  id: '1234'
} as Guild