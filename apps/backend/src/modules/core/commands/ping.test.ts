import type { ChatInputCommandInteraction } from 'discord.js';
import { pingCommand } from './ping';

describe('ping command', () => {
  test('it should be locked', () => {
    expect(pingCommand.isLocked).toBe(true);
  });

  test('it should have a slash command builder', () => {
    expect(pingCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'ping',
      description: 'Latency check'
    }));
  });

  describe('execute', () => {
    test('it should reply with "Pong!"', async () => {
      const reply = jest.fn();
      const commandInteraction = { reply } as unknown as ChatInputCommandInteraction;
      await pingCommand.execute(commandInteraction);
      expect(reply).toHaveBeenCalledWith('Pong!');
    });
  });
});