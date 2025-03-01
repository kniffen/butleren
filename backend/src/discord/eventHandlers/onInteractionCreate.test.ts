import { type Interaction, InteractionType } from "discord.js";
import * as logger from "../../logger/logger";
import { pingCommand } from "../../modules/system/commands/ping";
import { onInteractionCreate } from "./onInteractionCreate";

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
    await onInteractionCreate({ ...interaction, commandName: 'unknown' } as Interaction);
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

const interaction = {
  type: InteractionType.ApplicationCommand,
  commandName: 'ping'
} as Interaction;