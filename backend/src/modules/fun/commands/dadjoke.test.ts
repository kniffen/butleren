import fetch, { type Response } from 'node-fetch';
import { CommandInteraction } from 'discord.js';
import { dadjokeCommand } from './dadjoke';

describe('dadjokeCommand', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  test('It should not be locked', () => {
    expect(dadjokeCommand.isLocked).toBe(false);
  });

  test('it should have a slash command builder', () => {
    expect(dadjokeCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'dadjoke',
      description: 'Posts a random dad joke'
    }));
  });

  describe('execute', () => {
    test('it should reply with a dad joke', async () => {
      fetchMock.mockResolvedValueOnce(response);
      const editReply = jest.fn();
      const commandInteraction = { deferReply: jest.fn(), editReply } as unknown as CommandInteraction;
      await dadjokeCommand.execute(commandInteraction);
      expect(editReply).toHaveBeenCalledWith({ content: 'Dad joke' });
    });

    test('it should reply with an error message', async () => {
      fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);
      const editReply = jest.fn();
      const commandInteraction = { deferReply: jest.fn(), editReply } as unknown as CommandInteraction;
      await dadjokeCommand.execute(commandInteraction);
      expect(editReply).toHaveBeenCalledWith('Sorry, I was unable to fetch a dad joke for you.');
    });
  });
});

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue({ joke: 'Dad joke' }),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;