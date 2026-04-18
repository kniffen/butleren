import { Collection, Guild } from 'discord.js';
import type { BotCommand } from '../../../types';
import* as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import { disableCommand } from './disableCommand';

jest.mock('../../modules', () => ({
  modules: new Map([
    ['foobar', { slug: 'foobar', isLocked: false }],
    ['locked', { slug: 'locked', isLocked: true }],
  ]),
}));

describe('disableCommand()', () => {
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should remove a command from discord and disable it in the database', async () => {
    await disableCommand(command, guild);

    expect(deleteCommandSpy).toHaveBeenCalledWith({ name: 'foo' });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', {
      slug:      command.slashCommandBuilder.name,
      guildId:   guild.id,
      isEnabled: false
    });
  });

  test('It should do nothing if the command is locked', async () => {
    await disableCommand({ ...command, isLocked: true }, guild);

    expect(deleteCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should handle the command already being disabled', async () => {
    const slashCommandBuilder = { name: 'bar' };
    await disableCommand({ ...command, slashCommandBuilder } as BotCommand, guild);

    expect(deleteCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', {
      slug:      'bar',
      guildId:   guild.id,
      isEnabled: false
    });
  });
});

const command = {
  isLocked:            false,
  slashCommandBuilder: { name: 'foo'  },
  parentSlug:          'foobar'
} as BotCommand;

const applicationCommands = new Collection([
  ['1', { name: 'foo' }],
]);
const deleteCommandSpy = jest.fn();

const guild = {
  commands: {
    fetch:  async (): Promise<unknown> => applicationCommands,
    delete: deleteCommandSpy,
  }
} as unknown as Guild;
