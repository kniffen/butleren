import { ChatInputCommandInteraction } from 'discord.js';
import * as logger from '../../modules/logs/logger';
import { pingCommand } from '../../modules/core/commands/ping';
import { onInteractionCreate } from './onInteractionCreate';

jest.mock('../../modules/modules', () => ({
  commands: new Map([
    [pingCommand.slashCommandBuilder.name, pingCommand]
  ])
}));

describe('Discord: onInteractionCreate', () => {
  const commandExecuteSpy = jest.spyOn(pingCommand, 'execute').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    commandExecuteSpy.mockRestore();
  });

  test('It should execute commands', async () => {
    await onInteractionCreate(interaction);
    expect(commandExecuteSpy).toHaveBeenCalledWith(interaction);
  });

  test('It should handle a command not existing', async () => {
    const invalidCommendInteraction = Object.create(ChatInputCommandInteraction.prototype);
    Object.assign(invalidCommendInteraction, interaction, { commandName: 'unknown' });

    await onInteractionCreate(invalidCommendInteraction);
    expect(logger.logWarn).toHaveBeenCalledWith('Discord', 'Command "unknown" not found');
    expect(commandExecuteSpy).not.toHaveBeenCalled();
  });

  test('It should catch errors and log them', async () => {
    const error = new Error('Test error');
    commandExecuteSpy.mockRejectedValueOnce(error);

    await onInteractionCreate(interaction);
    expect(logger.logError).toHaveBeenCalledWith('Discord', 'Error during onInteractionCreate event', error);
  });
});

const interaction = Object.create(ChatInputCommandInteraction.prototype);
Object.assign(interaction, {
  commandName: 'ping',
  reply:       jest.fn(),
  editReply:   jest.fn(),
  followUp:    jest.fn(),
  deferReply:  jest.fn()
});