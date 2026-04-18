import fetch, { type Response } from 'node-fetch';
import { ChatInputCommandInteraction } from 'discord.js';
import { dadjokeCommand } from './dadjoke';

describe('dadjokeCommand', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

      await dadjokeCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(editReply).toHaveBeenCalledWith({ content: 'Dad joke' });
      expect(deleteReply).not.toHaveBeenCalled();
      expect(followUp).not.toHaveBeenCalled();
    });

    test('it should reply with an error message', async () => {
      fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);

      await dadjokeCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
      expect(deleteReply).toHaveBeenCalled();
      expect(followUp).toHaveBeenCalledWith({ content: 'Sorry, I was unable to fetch a dad joke for you.', ephemeral: true });
    });
  });
});

const deferReply = jest.fn();
const editReply = jest.fn();
const deleteReply = jest.fn();
const followUp = jest.fn();
const commandInteraction = { deferReply, editReply, deleteReply, followUp } as unknown as ChatInputCommandInteraction;

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue({ joke: 'Dad joke' }),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;