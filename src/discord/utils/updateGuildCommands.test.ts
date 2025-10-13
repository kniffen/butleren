import { Collection, type Guild } from 'discord.js';
import * as logger from '../../modules/logs/logger';
import { updateGuildCommands } from './updateGuildCommands';
import * as getDBEntry from '../../database/utils/getDBEntry';
import { CommandDBEntry } from '../../types';

jest.mock('../../modules/modules', () => ({
  commands: new Map([
    ['command1', { slashCommandBuilder: { name: 'command1' }, isLocked: false }], // new
    ['command2', { slashCommandBuilder: { name: 'command2' }, isLocked: false }], // update
    ['command4', { slashCommandBuilder: { name: 'command4' }, isLocked: false }], // deactivated
    ['command5', { slashCommandBuilder: { name: 'command5' }, isLocked: true }],  // locked, will be ignored
  ])
}));

describe('Discord: updateGuildCommands()', () => {
  jest.spyOn(getDBEntry, 'getDBEntry').mockImplementation(async (tableName: string, conditions: Record<string, string | number>) => {
    const isEnabled = 'command4' === conditions['slug'] ? 0 : 1;
    return { isEnabled } as unknown as CommandDBEntry;
  });

  beforeAll(async () => {
    await updateGuildCommands(guild);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should add commands to a guild', () => {
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Adding command "command1" to guild "foobar"');
    expect(guild.commands.create).toHaveBeenCalledTimes(1);
    expect(guild.commands.create).toHaveBeenCalledWith({ name: 'command1' });
  });

  test('It should update commands in a guild', () => {
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Updating command "command2" in guild "foobar"');
    expect(guild.commands.edit).toHaveBeenCalledTimes(1);
    expect(guild.commands.edit).toHaveBeenNthCalledWith(1, { name: 'command2' }, { name: 'command2' });
  });

  test('It should remove deprecated commands from a guild', () => {
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Removing command "command3" from guild "foobar"');
    expect(guild.commands.delete).toHaveBeenCalledTimes(2);
    expect(guild.commands.delete).toHaveBeenCalledWith({ name: 'command3' });
  });

  test('It should remove deactivated commands from a guild', () => {
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Removing command "command4" from guild "foobar" (deactivated)');
    expect(guild.commands.delete).toHaveBeenCalledTimes(2);
    expect(guild.commands.delete).toHaveBeenCalledWith({ name: 'command4' });
  });
});

const guildCommands = new Collection([
  ['222222', { name: 'command2' }], // update
  ['333333', { name: 'command3' }], // remove
  ['444444', { name: 'command4' }], // remove (deactivated)
]);

const guild = {
  name:     'foobar',
  commands: {
    fetch:  async () => guildCommands,
    create: jest.fn(),
    edit:   jest.fn(),
    delete: jest.fn()
  }
} as unknown as Guild;