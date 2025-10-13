import { ChatInputCommandInteraction } from 'discord.js';
import { flipCommand } from './flip';

describe('flipCommand', () => {
  test('It should not be locked', () => {
    expect(flipCommand.isLocked).toBe(false);
  });

  test('It should have a slash command builder', () => {
    expect(flipCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'flip',
      description: 'Flips things!',
    }));
  });

  describe('execute', () => {
    test('it should flip an item', () => {
      const reply = jest.fn();
      const commandInteraction = {
        reply,
        options: {
          get: jest.fn().mockReturnValue({ value: 'item' }),
        },
      } as unknown as ChatInputCommandInteraction;

      flipCommand.execute(commandInteraction);
      expect(reply).toHaveBeenCalledWith({ content: '(╯°□°）╯︵ ɯǝʇᴉ' });
    });
  });
});