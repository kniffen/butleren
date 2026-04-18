import type { Guild } from 'discord.js';
import * as logger from '../../modules/logs/logger';
import { onGuildCreate } from './onGuildCreate';
import * as updateGuildCommands from '../utils/updateGuildCommands';
import * as addGuildToDatabase from '../../utils/addGuildToDatabase';

jest.mock('../../modules/modules', () => ({}));

describe('Discord: onGuildCreate', () => {
  const updateGuildCommandsSpy = jest.spyOn(updateGuildCommands, 'updateGuildCommands').mockImplementation();
  const addGuildToDatabaseSpy = jest.spyOn(addGuildToDatabase, 'addGuildToDatabase').mockImplementation();

  afterAll(() => {
    updateGuildCommandsSpy.mockRestore();
    addGuildToDatabaseSpy.mockRestore();
  });

  test('It should update guild commands', async () => {
    await onGuildCreate(guild);
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Connected to new guild guild "foobar"');
    expect(updateGuildCommandsSpy).toHaveBeenCalledWith(guild);
    expect(addGuildToDatabaseSpy).toHaveBeenCalledWith(guild);
  });

  test('It should catch errors and log them', async () => {
    const error = new Error('Test error');
    updateGuildCommandsSpy.mockRejectedValueOnce(error);

    await onGuildCreate(guild);
    expect(logger.logError).toHaveBeenCalledWith('Discord', 'Error during onGuildCreate event', error);
  });
});

const guild = { name: 'foobar' } as Guild;
