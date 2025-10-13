import { Guild } from 'discord.js';
import { addGuildToDatabase, defaultGuildSettings } from './addGuildToDatabase';
import * as getGuildSettings from '../discord/database/getGuildSettings';
import * as setGuildSettings from '../discord/database/setGuildSettings';
import * as getDBEntries from '../database/utils/getDBEntries';
import *  as insertOrReplaceDBEntry from '../database/utils/insertOrReplaceDBEntry';

describe('addGuildToDatabase', () => {
  const getGuildSettingsSpy       = jest.spyOn(getGuildSettings,       'getGuildSettings').mockResolvedValue(null);
  const setGuildSettingsSpy       = jest.spyOn(setGuildSettings,       'setGuildSettings').mockResolvedValue();
  const getDBEntriesSpy           = jest.spyOn(getDBEntries,           'getDBEntries').mockResolvedValue([]);
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should set guild settings', async () => {
    await addGuildToDatabase(guild);

    expect(setGuildSettingsSpy).toHaveBeenCalledTimes(1);
    expect(setGuildSettingsSpy).toHaveBeenCalledWith(guild, defaultGuildSettings);
  });

  test('It should set module and command settings for the guild', async () => {
    await addGuildToDatabase(guild);

    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(18);

    // Modules
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'core',     guildId: guild.id, isEnabled: 1 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'fun',      guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'kick',     guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'users',    guildId: guild.id, isEnabled: 1 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'logs',     guildId: guild.id, isEnabled: 1 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'commands', guildId: guild.id, isEnabled: 1 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'weather',  guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'twitch',   guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'spotify',  guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', { slug: 'youtube',  guildId: guild.id, isEnabled: 0 });

    // Commands
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'dadjoke',    guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'flip',       guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'xkcd',       guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'kickstream', guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'weather',    guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'forecast',   guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'pollen',     guildId: guild.id, isEnabled: 0 });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', { slug: 'twitch',     guildId: guild.id, isEnabled: 0 });
  });

  test('It should not overwrite existing guild settings', async () => {
    getGuildSettingsSpy.mockResolvedValueOnce({
      nickname: null,
      color:    '#000000',
    });

    await addGuildToDatabase(guild);

    expect(setGuildSettingsSpy).not.toHaveBeenCalled();
  });

  test('It should not overwrite existing module settings', async () => {
    getDBEntriesSpy.mockResolvedValue([{
      guildId:   guild.id,
      slug:      'core',
      isEnabled: 1,
    }]);

    await addGuildToDatabase(guild);

    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });
});

const guild = { id: '1234' } as Guild;
