import { enableCommand } from './enableCommand';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import { BotCommand } from '../../../types';
import { Collection, Guild } from 'discord.js';

jest.mock('../../modules', () => ({
  modules: new Map([
    ['foobar', { slug: 'foobar', isLocked: false }],
    ['locked', { slug: 'locked', isLocked: true }],
  ]),
}));

describe('enableCommand()', () => {
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should enable a command on discord and in the database', async () => {
    await enableCommand(command, guild);

    expect(createCommandSpy).toHaveBeenCalledWith(command.slashCommandBuilder);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledTimes(2);
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', {
      slug:      'foobar',
      guildId:   guild.id,
      isEnabled: 1
    });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', {
      slug:      command.slashCommandBuilder.name,
      guildId:   guild.id,
      isEnabled: 1
    });
  });

  test('It should do nothing if the command is locked', async () => {
    await enableCommand({ ...command, isLocked: true }, guild);

    expect(createCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
  });

  test('It should not enable the parent module if it is locked', async () => {
    await enableCommand({ ...command, parentSlug: 'locked' }, guild);

    expect(createCommandSpy).toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalled();
  });

  test('It should handle the command already being enabled', async () => {
    const slashCommandBuilder = { name: 'bar' };
    await enableCommand({ ...command, slashCommandBuilder } as BotCommand, guild);

    expect(createCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalled();
  });
});

const command = {
  isLocked:            false,
  slashCommandBuilder: { name: 'foo'  },
  parentSlug:          'foobar'
} as BotCommand;

const applicationCommands = new Collection([
  ['1', { name: 'bar' }],
]);
const createCommandSpy = jest.fn();

const guild = {
  commands: {
    fetch:  async (): Promise<unknown> => applicationCommands,
    create: createCommandSpy,
  }
} as unknown as Guild;

