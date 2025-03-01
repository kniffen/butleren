import { Collection, type Guild } from "discord.js";
import * as logger from '../../logger/logger';
import { updateGuildCommands } from "./updateGuildCommands";

jest.mock('../../modules/modules', () => ({
  commands: new Map([
    ['command1', { slashCommandBuilder: { name: 'command1' } }],
    ['command2', { slashCommandBuilder: { name: 'command2' } }],
  ])
}));

describe('Discord: updateGuildCommands()', () => {
  beforeAll(async () => {
    await updateGuildCommands(guild);
  })

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
    expect(guild.commands.edit).toHaveBeenCalledWith({ name: 'command2' }, { name: 'command2' });
  });

  test('It should remove deprecated commands from a guild', () => {
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Removing command "command3" from guild "foobar"');
    expect(guild.commands.delete).toHaveBeenCalledTimes(1);
    expect(guild.commands.delete).toHaveBeenCalledWith({ name: 'command3' });
  });
});

const applicationCommands = new Collection([
  ['111111', { name: 'command2' }],
  ['222222', { name: 'command3' }]
]);

const guild = {
  name: 'foobar',
  commands: {
    fetch: async () => applicationCommands,
    create: jest.fn(),
    edit: jest.fn(),
    delete: jest.fn()
  }
} as unknown as Guild;